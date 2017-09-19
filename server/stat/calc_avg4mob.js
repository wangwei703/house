const dateComm = require("./date");
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
                per = getPercent(yesterdayAvg, todayAvg);
            dayData.push({
                s: sk,
                c: cm[0],
                a: todayAvg,
                p: per,
                today
            });
            let mon = dateComm.mon(),
                lastMon = dateComm.lastMon(),
                monAvg,
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
            monData.push({
                s: sk,
                c: cm[0],
                a: monAvg,
                p: monPre
            });
        });
    });
    return {
        today: dayData,
        thismonth: monData
    };
}
function calcAvg(houseList, comm, date, source) {
    let data = [];
    comm.forEach(cm => {
        date.forEach(d => {
            Object.keys(source).forEach(sk => {
                let hList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === d
                });
                let len = hList.length;
                if (len > 0) {
                    let avg = getAvg(hList);
                    data.push({
                        s: sk,
                        c: cm[0],
                        d,
                        a: avg,
                        t: len
                    });
                }
            });
        });
    });
    return data;
}

function calcMon(trend) {
    let mons = dateComm.getMonths();
    let everymon=trend.map(t=>{
        let s=t.src,
            c=t.k,
            data=t.t;
        let arr=mons.map(mon=>{
            return data[mon];
        });
        return {
            s,c,t:arr
        }
    });
    return { mons, everymon }
}
function calcAvg4Mob(houseList, comm, date, source, trend) {
    let { today, thismonth } = calcHome(houseList, comm, source, trend),
        { mons, everymon } = calcMon( trend),
        everyday = calcAvg(houseList, comm, date, source);
    return {
        date,
        mons,
        source,
        today,
        thismonth,
        everyday,
        everymon
    };
}
module.exports = calcAvg4Mob;