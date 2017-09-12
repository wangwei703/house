const fs = require('fs');
const path = require("path");
const dateComm = require("./date");
const SOURCE = { "ajk": "安居客", "fccs": "房产超市" };
const PRICELIMIT = {
    "zgtjgjc-hcy": [14000, 19000],
    "jntyc": [10000, 15000],
    "hrhy": [10000, 16000],
    "jy-dfds": [12000, 18000]
}
let HouseList = [];
let commMap = new Map();
let dateSet = new Set();
let Trend = [];
function getFiles(url) {
    return fs.readdirSync(url);
}
function readHouseData(src) {
    let url = path.resolve(__dirname, `../${src}/data/`),
        files = getFiles(url);
    files.forEach((f, fIndex) => {
        let txt = fs.readFileSync(path.resolve(url, f), 'utf-8'),
            date = f.replace(".json", ""),
            json = JSON.parse(txt);
        Object.keys(json).map(k => {
            let data = json[k],
                name = data.name;
            commMap.set(k, name);
            let house = data.list.map(h => {
                let date = new Date(h.date),
                    dateStr = dateComm.formatYMD(date);
                dateSet.add(dateStr);
                return {
                    src,
                    k,
                    name,
                    "hk": h.key ? `${src}-${h.key}` : null,
                    "a": h.area,
                    "t": h.totalprice,
                    "u": h.unitprice,
                    "d": dateStr
                }
            });
            HouseList = HouseList.concat(house);
        });
        if (fIndex === files.length - 1) {
            Object.keys(json).map(k => {
                let arr = json[k].trend.community;
                let t = {};
                arr.forEach(obj => {
                    Object.entries(obj).forEach(ct => {
                        t[ct[0]] = ct[1];
                    })
                })
                Trend.push({
                    src,
                    k,
                    t
                })
            });
        }
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
    Object.keys(SOURCE).forEach(readHouseData);
    let houseList = filterHouseList(),
        commArr = Array.from(commMap),
        dateArr = Array.from(dateSet);
    return {
        houseList, commArr, dateArr, source: SOURCE, trend: Trend
    }
}
module.exports = readHouseList;