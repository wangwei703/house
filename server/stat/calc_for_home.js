const dateComm = require("./date");
function calcHome(houseList, comm, source,trend) {
    let today = dateComm.today(),
        yesterday = dateComm.yesterday(),
        dayData = [],
        monData = [];
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
                p: monPre,
                mon
            });
        });
    });

    // houseList.filter
    return {
        source: source,
        day: dayData,
        mon: monData
    };
}

module.exports = calcHome;