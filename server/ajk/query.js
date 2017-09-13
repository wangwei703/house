const fetch = require('./fetch');
const jsdom = require("jsdom");
const { window } = new jsdom.JSDOM(`<!DOCTYPE html>`);
var $ = require('jquery')(window);

class Query {
    constructor(house) {
        this.house = house;
    }
    getHouseKey(str) {
        let matchs = str.match(/\/view\/([^\/]+)\?/);
        if (matchs && matchs.length === 2) {
            return matchs[1];
        }
    }
    async fetchPricetrend() {
        let url = `https://${this.house.city}.anjuke.com/v3/ajax/prop/pricetrend/?commid=${this.house.id}`
        return fetch(url).then(data => {
            return JSON.parse(data);
        });
    }
    async fetchHouseList(page) {
        let url = this.house.url(page);
        return fetch(url).then(html => {
            let $html = $(html),
                $list = $html.find("#houselist-mod-new li.list-item").toArray();
            if ($list.length === 0) return Promise.reject();
            let list = [];
            $list.forEach(item => {
                let $item = $(item),
                    $details = $item.find(".house-details"),
                    $price = $item.find(".pro-price");
                let link = $details.find(".house-title>a"),
                    title = link.attr("title"),
                    _href = link.attr("href"),
                    href = link[0].origin + link[0].pathname,
                    key = this.getHouseKey(_href),
                    $detailsItem = $details.find(".details-item"),
                    address = $details.find(".comm-address").attr("title"),
                    details = {
                        home: $detailsItem.find("span:eq(0)").html(),
                        floor: $detailsItem.find("span:eq(2)").html(),
                        buildyear: parseFloat($detailsItem.find("span:eq(3)").html())
                    },
                    area = parseFloat($detailsItem.find("span:eq(1)").html()),
                    totalprice = parseFloat($price.find(".price-det strong").html()),
                    unitprice = parseFloat($price.find(".unit-price").html());
                let obj = {
                    title,
                    key,
                    _href,
                    href,
                    details,
                    area,
                    totalprice,
                    unitprice
                }
                address && address.includes(this.house.filters[0]) && list.push(obj);
            });
            return list;
        });
    }
    async fetchHouseDetails(house) {
        let url = house._href;
        delete house._href;
        return fetch(url).then(html => {
            let $body = $(html),
                $img = $body.find("#room_pic_wrap .img_wrap img"),
                encode = $body.find(".house-encode").html();
            if (encode) {
                let matchs = encode.match(/[0-9][0-9]*/g);
                if (matchs && matchs.length === 4) {
                    let now = new Date(),
                        y = parseInt(matchs[1], 10),
                        m = parseInt(matchs[2], 10) - 1,
                        d = parseInt(matchs[3], 10),
                        fbDate = new Date(y, m, d),
                        ts = now.getTime() - fbDate.getTime();
                    if (ts / 1000 / 3600 / 24 <= 1) {
                        house.date = `${y}-${m + 1}-${d}`;
                        house.imgs = $img.toArray().map(img => $(img).data("src"));
                        return true;
                    }
                }
            }
            return false;
        })
    }
    async start() {
        let list = [];
        console.log(`\t查找房源列表：`);
        try {
            for (let i = 1; i < 3; i++) {
                console.log(`\t第 ${i} 页`);
                let data = await this.fetchHouseList(i === 1 ? null : i);
                list.push(...data);
            }
        } catch (e) {
            console.log("complete!", e);
        }
        console.log(`\t查找房源详情：`);
        for (let i = 0; i < list.length; i++) {
            console.log(`\t${i + 1}/${list.length}`)
            let b = await this.fetchHouseDetails(list[i]);
            if (!b) {
                break;
            }
        }
        list = list.filter(item => {
            return item.date;
        });
        console.log(`\t统计价格走势：`);
        let trend = await this.fetchPricetrend();
        delete trend.status;
        return [list, trend];
    }
};

module.exports = Query;
