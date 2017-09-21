const dateComm = require("./date");
const ml = require("ml-regression");
let getAvg = arr => {
    let avg,
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
        p = Math.round(p * 10000) / 100;
    }
    return p;
}
let getMonthStr = date => {
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    return m;
}

function calcHome(houseList, comm, source, trend) {
    let today = dateComm.today(),
        yesterday = dateComm.yesterday(),
        dayData = [],
        mon = dateComm.mon(),
        lastMon = dateComm.lastMon(),
        monData = [];
    comm.forEach(cm => {
        Object.keys(source).forEach(sk => {
            let todayList = houseList.filter(h => {
                return h.src === sk && h.k === cm[0] && h.d === today
            }),
                yesterdayList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === yesterday
                });
            let todayAvg = getAvg(todayList);
            let yesterdayAvg = getAvg(yesterdayList),
                per = getPercent(yesterdayAvg, todayAvg),
                obj = {
                    s: sk,
                    c: cm[0]
                };
            if (typeof todayAvg === "number") {
                obj.a = todayAvg;
                if (typeof per === "number")
                    obj.p = per;
                dayData.push(obj);
            }
            let monAvg,
                monPre,
                tData = trend.find(t => {
                    return t.src === sk && t.k === cm[0]
                });
            if (tData) {
                let _trend = tData["t"];
                if (_trend) {
                    monAvg = parseInt(_trend[mon] || 0, 10),
                        lastMonAvg = 0;
                    if (monAvg) {
                        lastMonAvg = _trend[lastMon] || 0,
                            monPre = getPercent(lastMonAvg, monAvg);
                    }
                }
            }
            let obj2 = {
                s: sk,
                c: cm[0]
            }
            if (typeof monAvg === "number") {
                obj2.a = monAvg;
                if (typeof monPre === "number")
                    obj2.p = monPre;
                monData.push(obj2);
            }
        });
    });
    let result = { today: {}, thismonth: {} };
    if (dayData.length > 0) {
        result.today = {
            date: today,
            data: dayData
        };
    }
    if (monData.length > 0) {
        result.thismonth = {
            mon,
            data: monData
        };
    }
    return result;
}

function calcAvg(houseList, comm, date, source) {
    let data = [];
    comm.forEach(cm => {
        Object.keys(source).forEach(sk => {
            let avgList = [],
                quaList = [];
            date.forEach((d, dIndex) => {
                let hList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === d
                });
                let len = hList.length;
                if (len > 0) {
                    let avg = getAvg(hList);
                    avgList[dIndex] = avg;
                    quaList[dIndex] = len;
                }
            });
            data.push({
                s: sk,
                c: cm[0],
                a: avgList,
                q: quaList
            });
        });
    });
    return data;
}

function calcMon(trend) {
    let mons = dateComm.getMonths();
    let everymon = trend.map(t => {
        let s = t.src,
            c = t.k,
            data = t.t;
        let arr = mons.map(mon => {
            return data[mon];
        });
        return {
            s,
            c,
            t: arr
        }
    });
    return { mons, everymon }
}

function groupTrend(houseList, comm, date, source) {
    let statArr = [];
    comm.forEach(cm => {
        let cmName = cm[1],
            cmKey = cm[0],
            data = [];
        Object.keys(source).forEach(sk => {
            let avgList = [], quaList = [];
            date.forEach((d, dIndex) => {
                let hList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === d
                });
                let len = hList.length;
                quaList.push(len);
                //if (len > 0) {
                let avg = getAvg(hList);
                avgList.push(avg);
                // }
            });

            let X = [],
                Y = [],
                tList=avgList.filter(i=>typeof i==="number"&&i>0);
            tList.forEach((a, i) => {
                X.push(i + 1);
                Y.push(a);
            });
            let regressionModel = new ml.SLR(X, Y);
            data.push({
                s: sk,
                a: avgList,
                t: quaList,
                slr: regressionModel.coefficients
            });
        });
        statArr.push({
            c: cmKey,
            data
        })
    });
    return statArr;
}

function calcAvg4Mob(houseList, comm, date, source, trend) {
    let { today, thismonth } = calcHome(houseList, comm, source, trend), { mons, everymon } = calcMon(trend),
        everyday = calcAvg(houseList, comm, date, source),
        trendbyDay = groupTrend(houseList, comm, date, source);

    let sourceArr = Object.entries(source).map(s => ({ k: s[0], n: s[1] }));
    return {
        date,
        mons,
        source: sourceArr,
        today,
        thismonth,
        // everyday,
        everymon,
        trend: trendbyDay
    };
}
module.exports = calcAvg4Mob;