const fs = require('fs');
const path = require("path");
const SOURCE = {
    ajk: "安居客",
    fccs: "房产超市"
}
const priceLimit = {
    "jntyc": [10000, 15000],
    "zgtjgjc-hcy": [14000, 19000],
    "hrhy": [10000, 16000],
    "jy-dfds": [12000, 18000]
}
let commMap = new Map();
let dateSet = new Set();
let HouseList = [];
let Trend = [];

function write(name, list) {
    var txt = JSON.stringify(list); // "module.exports=" + JSON.stringify( points );
    fs.writeFile(path.resolve(__dirname, `../web/libs/data/${name}.json`), txt, function(err) {
        if (err)
            console.log("\tfail " + err);
        else {
            console.log("\t写入文件ok");
        }
    });
}

function read(src) {
    let url = path.resolve(__dirname, `./${src}/data/`);
    let files = fs.readdirSync(url);
    files = files.sort((f1, f2) => {
        return f1 > f2 ? 1 : (f1 < f2 ? -1 : 0);
    });
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
                    year = date.getFullYear(),
                    mon = date.getMonth() + 1,
                    day = date.getDate(),
                    fullMon = mon > 9 ? mon : (`0${mon}`),
                    fullDay = day > 9 ? day : (`0${day}`),
                    dateStr = `${year}-${fullMon}-${fullDay}`;
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
//过滤重复统计的房源信息
function filterHouseList() {
    var list = [],
        s = new Set();
    //剔除价格异常的房源
    HouseList = HouseList.filter(h => h.u >= priceLimit[h.k][0] && h.u <= priceLimit[h.k][1]);
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

function list(houseList) {
    let statArr = [],
        commArr = Array.from(commMap);
    commArr.forEach(cm => {
        let cmName = cm[1],
            cmKey = cm[0],
            source = [];
        Object.keys(SOURCE).forEach(sk => {
            let hList = houseList.filter(h => {
                return h.src === sk && h.k === cmKey
            });
            let house = hList.map(h => [
                h.a,
                h.t,
                h.u,
                h.d,
            ]);
            source.push({
                from: sk,
                text: SOURCE[sk],
                house
            });
        });
        statArr.push({
            name: cmName,
            key: cmKey,
            source
        })
    });

    write("list", {
        source: SOURCE,
        //comm: commArr,
        date: Array.from(dateSet),
        data: statArr
    });
}

function avgprice(houseList) {
    let commArr = Array.from(commMap),
        dateArr = Array.from(dateSet),
        data = [];
    commArr.forEach(cm => {
        dateArr.forEach(d => {
            Object.keys(SOURCE).forEach(sk => {
                let avg = 0,
                    hList = houseList.filter(h => {
                        return h.src === sk && h.k === cm[0] && h.d === d
                    });
                if (hList.length > 0) {
                    let sum = hList.reduce((a, b) => a + b.u, 0);
                    avg = Math.floor(sum / hList.length);
                    data.push({
                        s: sk,
                        c: cm[0],
                        d,
                        a: avg
                    });
                }
            });
        });
    });
    // houseList.filter
    write("avg", {
        source: SOURCE,
        //comm: commArr,
        date: Array.from(dateSet),
        data
    });
}

function avgpricemon(data) {
    write("avgmon", {
        source: SOURCE,
        data
    });
}

function quantity(houseList) {
    let commArr = Array.from(commMap),
        dateArr = Array.from(dateSet),
        data = [];
    commArr.forEach(cm => {
        dateArr.forEach(d => {
            Object.keys(SOURCE).forEach(sk => {
                let avg = 0,
                    hList = houseList.filter(h => {
                        return h.src === sk && h.k === cm[0] && h.d === d
                    });
                if (hList.length > 0) {
                    data.push({
                        s: sk,
                        c: cm[0],
                        d,
                        q: hList.length
                    });
                }
            });
        });
    });
    // houseList.filter
    write("quantity", {
        source: SOURCE,
        //comm: commArr,
        date: Array.from(dateSet),
        data
    });
}

function home(houseList, trend) {
    let commArr = Array.from(commMap),
        dateArr = Array.from(dateSet),
        today = dateArr.pop(),
        yesterday = dateArr.pop(),
        dayData = [],
        monData = [];
    let getAvg = arr => {
        let avg = 0,
            len = arr.length;
        if (len > 0) {
            let sum = arr.reduce((a, b) => a + b.u, 0);
            avg = Math.floor(sum / len);
        }
        return avg
    };
    let getPercent = (n1, n2) => {
        let p;
        if (n1 > 0) {
            p = (n2 - n1) / n1;
        }
        return p;
    }
    let getMonthStr = date => {
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        return m;
    }
    commArr.forEach(cm => {
        Object.keys(SOURCE).forEach(sk => {
            let todayList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === today
                }),
                yesterdayList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === yesterday
                });
            let todayAvg = getAvg(todayList);
            if (todayAvg > 0) {
                let yesterdayAvg = getAvg(yesterdayList),
                    per = getPercent(yesterdayAvg, todayAvg);
                dayData.push({
                    s: sk,
                    c: cm[0],
                    a: todayAvg,
                    p: per
                });
            }
            let now = new Date(),
                mon = `${now.getFullYear()}${getMonthStr(now)}`;
            now.setMonth(now.getMonth() - 1);
            let lastMon = `${now.getFullYear()}${getMonthStr(now)}`;
            tData = trend.find(t => {
                return t.src === sk && t.k === cm[0]
            });
            if (tData) {
                let _trend = tData["t"];
                if (_trend) {
                    let monAvg = _trend[mon] || 0;
                    if (monAvg) {
                        let lastMonAvg = _trend[lastMon] || 0,
                            per = getPercent(lastMonAvg, monAvg);
                        monData.push({
                            s: sk,
                            c: cm[0],
                            a: monAvg,
                            p: per
                        });
                    }

                }
            }
        });
    });

    // houseList.filter
    write("home", {
        source: SOURCE,
        day: dayData,
        mon: monData
    });
}

function stat() {
    Object.keys(SOURCE).forEach(read);
    houseList = filterHouseList(); //过滤房源，
    list(houseList);
    home(houseList, Trend);
    avgprice(houseList);
    avgpricemon(Trend);
    quantity(houseList);
}
stat();