function calcQuantity(houseList, comm, date, source) {
    let data = [];
    comm.forEach(cm => {
        date.forEach(d => {
            Object.keys(source).forEach(sk => {
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

    return {
        source: source,
        date,
        data
    };
}

module.exports = calcQuantity;