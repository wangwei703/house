const fs = require('fs');
const path = require("path");
const dateComm = require("./date");
const SOURCE = { "ajk": "安居客", "fccs": "房产超市" };
const PRICELIMIT = {
    "zgtjgjc-hcy": [12000, 22000],
    "jntyc": [10000, 17000],
    "hrhy": [10000, 20000],
    "jy-dfds": [10000, 20000]
}
let HouseList = [];
let commMap = new Map();
let dateSet = new Set();
let Trend = new Map();
function getFiles(url) {
    return fs.readdirSync(url);
}
function readList(src) {
    let url = path.resolve(__dirname, `../${src}/data/list.json`);
    let txt = fs.readFileSync(url, 'utf-8'),
        list = JSON.parse(txt);
    list.forEach(h => {
        commMap.set(h.k, h.name);
        let date = new Date(h.d),
            dateStr = dateComm.formatYMD(date);
        dateSet.add(dateStr);
        HouseList.push({
            src,
            k: h.k,
            name: h.name,
            a: h.a,
            t: h.t,
            u: h.u,
            d: dateStr
        });
    });
}
function readTrend(src) {
    let url = path.resolve(__dirname, `../${src}/data/trend.json`);
    let txt = fs.readFileSync(url, 'utf-8'),
        json = JSON.parse(txt);
    Object.keys(json).map(k => {
        let arr = json[k].community;
        let t = {};
        arr.forEach(obj => {
            Object.entries(obj).forEach(ct => {
                t[ct[0]] = ct[1];
            })
        });
        Trend.set(`${src}-${k}`, {
            src,
            k,
            t
        });
    });
}

function filterHouseList() {
    let list = [],
        s = new Set();
    //剔除价格异常的房源
    HouseList = HouseList.filter(h => h.u >= PRICELIMIT[h.k][0] && h.u <= PRICELIMIT[h.k][1]);
    //剔除重复抓取的房源
    HouseList.forEach(h => {
        if (h.hk) {
            let kk = `${h.d}-${h.hk}`;
            if (!s.has(kk)) {
                list.push(h);
                s.add(kk);
            }
        } else {
            list.push(h);
        }
    });
    return list;
}
function readHouseList() {
    Object.keys(SOURCE).forEach(src => {
        readList(src);
        readTrend(src);
    });
    let houseList = filterHouseList(),
        commArr = Array.from(commMap),
        dateArr = Array.from(dateSet);
    return {
        houseList, commArr, dateArr, source: SOURCE, trend: Array.from(Trend).map(m => m[1])
    }
}
module.exports = readHouseList;