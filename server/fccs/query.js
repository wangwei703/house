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
    async fetchPricetrend() {
        let url = `http://second.jx.fccs.com/sale/priceTrendChart.do?floorId=${this.house.id}`
        return fetch(url).then(data => {
            return JSON.parse(data);
        }).then(json => {
            let community = [];
            let serie = json[0].series.find(s => s.name = "住宅");
            if (serie) {
                let data = serie.data;
                json[2].xAxis.forEach((x, i) => {
                    let m = x.match(/[0-9][0-9]*/g);
                    if (m.length === 2) {
                        let k = `20${m[0]}${parseInt(m[1], 10) < 10 ? ("0" + m[1]) : m[1]}`,
                            v = data[i];
                        community.push({
                            [k]: v
                        });
                    }
                });
            }
            return {
                community,
                area: [],
                comm_midchange: 0,
                area_midchange: 0
            };
        });
    }
    async fetchHouseList(page) {
        let url = this.house.url(page);
        return fetch(url).then(html => {
            let $html = $(html),
                $list = $html.find(".fy_list>ul>li.item.salelist").toArray();
            if ($list.length === 0) return Promise.reject("列表空");
            let list = [];
            try {
                $list.forEach(item => {
                    let $item = $(item),
                        $details = $item.find(".info0"),
                        $price = $item.find(".info1");
                    let link = $details.find(".t a"),
                        href = link.attr("href"),
                        key = this.getHouseKey(href),
                        title = link.text(),
                        $detailsItem = $details.find(".s label"),
                        detailsItem = $detailsItem.text().split('|'),
                        address = $details.find(".lp label:eq(1)").text(),

                        area = parseFloat($price.find(".p1 .fl").html()),
                        totalprice = parseFloat($price.find(".p1 .f24").html()),
                        unitprice = Math.round(totalprice * 1e4 / area),
                        date = this.getDate($details.find(".s1 .pt5 .w_c_5").text());
                    let obj = {
                        key,
                        title,
                        area,
                        totalprice,
                        unitprice,
                        date
                    }
                    address && address.includes(this.house.filters[0]) && list.push(obj);
                });
            } catch (e) {
                console.log(e);
                return Promise.reject(e);
            }
            if (list.length === 0) return Promise.reject("近期无记录");
            return list;
        });
    }
    getHouseKey(str) {
        let matchs = str.match(/\/sale\/([^\/]+)\./);
        if (matchs && matchs.length === 2) {
            return matchs[1];
        }
    }
    getDate(dateStr) {
        let now = new Date(),
            year = now.getFullYear();
        dateStr = `${year}-${dateStr}`;

        if (dateStr.length > 10) {
            dateStr = dateStr.substr(0, 10);
            let fbDate = new Date(dateStr),
                ts = now.getTime() - fbDate.getTime();
            if (ts / 1000 / 3600 / 24 <= 2) {
                return dateStr;
            }
        }
        return;
    }
    async start() {
        let list = [];
        console.group(this.house.name);
        console.group("查找近期发布房源：");
        for (let i = 1; i < 300; i++) {
            try {
                console.log(`${getTime()}\t第 ${i} 页`);
                let data = await this.fetchHouseList(i === 1 ? null : i);
                list.push(...data);
            } catch (e) {
                if (e.code === 'ETIMEDOUT') {
                    i--;
                    console.log("timeout try again!");
                } else if (e.code === 'ECONNRESET') {
                    i--;
                    console.log("ECONNRESET try again!");
                } else {
                    console.log("complete!", e);
                    break;
                }
            }
        }

        list = list.filter(item => {
            return item.date;
        });
        console.groupEnd();
        console.group(`统计价格走势：`);
        let trend;
        while (true) {
            try {
                trend = await this.fetchPricetrend();
                break;
            } catch (e) {
                if (e.code === 'ETIMEDOUT' || e.code === 'ECONNRESET') {
                    console.log("timeout try again!");
                }
            };
        }
        console.groupEnd();
        console.groupEnd();
        return [list, trend];
    }
};

module.exports = Query;