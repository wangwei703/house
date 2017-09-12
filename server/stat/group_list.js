function groupList(houseList, comm, date, source) {
    let statArr = [];
    comm.forEach(cm => {
        let cmName = cm[1],
            cmKey = cm[0],
            data = [];
        Object.keys(source).forEach(sk => {
            let hList = houseList.filter(h => {
                return h.src === sk && h.k === cmKey
            });
            let house = hList.map(h => [
                h.a,
                h.t,
                h.u,
                h.d,
            ]);
            data.push({
                from: sk,
                text: source[sk],
                house
            });
        });
        statArr.push({
            name: cmName,
            key: cmKey,
            data
        })
    });

    return {
        source: source,
        date,
        data: statArr
    };
}

module.exports = groupList;