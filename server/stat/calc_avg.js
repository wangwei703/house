
function calcAvg(houseList, comm, date, source) {
    let data = [];
    comm.forEach(cm => {
        date.forEach(d => {
            Object.keys(source).forEach(sk => {
                let hList = houseList.filter(h => {
                    return h.src === sk && h.k === cm[0] && h.d === d
                });
                if (hList.length > 0) {
                    let avg = 0,
                        sum = 0,
                        us = hList.map(h => h.u),
                        m = new Map();
                    us.forEach(u => {
                        sum += u;
                        let _u = Math.round(u / 50);
                        let num = 1;
                        if (m.has(_u)) {
                            num = 1 + m.get(_u);
                        }
                        m.set(_u, num);
                    });
                    let u = Array.from(m).map(_m => {
                        if (_m[1] === 1) {
                            return _m[0];
                        } else {
                            return _m;
                        }
                    })
                    avg = Math.floor(sum / hList.length);
                    data.push({
                        s: sk,
                        c: cm[0],
                        d,
                        a: avg,
                        u
                    });
                }
            });
        });
    });
    // houseList.filter
    return  {
        source,
        date,
        data
    };
}

module.exports = calcAvg;