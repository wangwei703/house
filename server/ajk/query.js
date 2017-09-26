const fetch = require('./fetch');
const jsdom = require("jsdom");
const { window } = new jsdom.JSDOM(`<!DOCTYPE html>`);
var $ = require('jquery')(window);

function getTime() {
    let now = new Date();
    return now.toLocaleTimeString();
}
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

                    area = parseFloat($detailsItem.find("span:eq(1)").html()),
                    totalprice = parseFloat($price.find(".price-det strong").html()),
                    unitprice = parseFloat($price.find(".unit-price").html());
                let obj = {
                    title,
                    key,
                    _href,
                    href,
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
                    if (ts / 1000 / 3600 / 24 <= 2) {
                        house.date = `${y}-${m + 1}-${d}`;
                        return true;
                    }
                }
            }
            return false;
        })
    }
    async start() {
        let list = [];
        console.group(this.house.name);
        console.group("查找近期发布房源：");
        try {
            for (let i = 1; i < 5; i++) {
                console.log(`${getTime()}\t第 ${i} 页`);
                let data = await this.fetchHouseList(i === 1 ? null : i);
                list.push(...data);
            }
        } catch (e) {
            console.log("complete!", e);
        }
        console.groupEnd();
        console.group(`查询各房源的发布时间：`);
        for (let i = 0; i < list.length; i++) {
            console.log(`${getTime()}\t${i + 1}/${list.length}`)
            let b = await this.fetchHouseDetails(list[i]);
            if (!b) {
                break;
            }
        }
        console.groupEnd();
        list = list.filter(item => {
            return item.date;
        });
        console.groupEnd();
        return list;
    }
};

module.exports = Query;