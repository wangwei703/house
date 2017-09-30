const fs = require('fs');
const path = require("path");
const dateComm = require("./date");
const SOURCE = { "ajk": "安居客", "fccs": "房产超市" };
const PRICELIMIT = {
    "zgtjgjc-hcy": [14000, 18000],
    "jntyc": [10000, 15000],
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
            id: h.id,
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
    let allHouseList = [],
        houseList = [],
        s = new Set();

    //剔除重复房源,id&&date
    HouseList.forEach(h => {
        let id = h.id;
        if (id) {
            if (!s.has(id)) {
                allHouseList.push(h);
                s.add(id);
            }
        } else {
            allHouseList.push(h);
        }
    });
    //剔除价格异常的房源
    houseList = allHouseList.filter(h => h.u >= PRICELIMIT[h.k][0] && h.u <= PRICELIMIT[h.k][1]);
    return { allHouseList, houseList };
}
function formatAllHouseList(list, comm, date, source) {
    let sourceArr = Object.entries(source);//[ [ 'ajk', '安居客' ], [ 'fccs', '房产超市' ] ]
    let commList = [];
    comm.forEach(c => {
        let dateList = [];
        date.forEach(d => {
            let sourceList = [];
            sourceArr.forEach(s => {
                //console.log(s[0],d,c)
                let l = list.filter(h => h.src === s[0] && h.d === d && h.k === c[0]).map(h => (
                    [
                        h.u,
                        h.a
                    ]
                ));
                sourceList.push({
                    k: s[0],
                    n: s[1],
                    l
                });
            });
            dateList.push({
                d,
                l: sourceList
            });
        });
        commList.push({
            k: c[0],
            n: c[1],
            l: dateList
        });
    });

    return commList;
}
function readHouseList() {
    Object.keys(SOURCE).forEach(src => {
        readList(src);
        readTrend(src);
    });
    let { allHouseList, houseList } = filterHouseList(),
        commArr = Array.from(commMap),
        dateArr = Array.from(dateSet);
    allHouseList = formatAllHouseList(allHouseList, commArr, dateArr, SOURCE);
    return {
        allHouseList, houseList, commArr, dateArr, source: SOURCE, trend: Array.from(Trend).map(m => m[1])
    }
}
module.exports = readHouseList;