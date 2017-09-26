const fs = require('fs');
const path = require("path");
const { showTable } = require("../comm");
function getHistoryHouseList() {
    let fileName = path.resolve(__dirname, `./data/list.json`);
    let txt = fs.readFileSync(fileName, 'utf-8');
    try {
        return txt ? JSON.parse(txt) : [];
    } catch (e) {
        return [];
    }
}
module.exports = json => {
    let houseList = [],
        historyList = getHistoryHouseList();
    let houseSet = new Set(),
        map = new Map();
    historyList.forEach(house => {
        if (house.id) {
            if (!houseSet.has(house.id)) {
                houseList.push(house);
                houseSet.add(house.id);
            }
        } else {
            houseList.push(house);
        }
    });

    Object.keys(json).map(k => {
        let data = json[k],
            name = data.name;
        map.set(k, {
            name,
            count: 0
        });
        data.list.forEach(h => {
            let house = {
                "id": h.key ? `${h.key}-${h.date}` : null,
                k,
                name,
                "a": h.area,
                "t": h.totalprice,
                "u": h.unitprice,
                "d": h.date
            };
            if (house.id) {
                if (!houseSet.has(house.id)) {
                    houseList.push(house);
                    houseSet.add(house.id);
                    map.set(k, {
                        name,
                        count: map.get(k).count + 1
                    });

                }
            } else {
                houseList.push(house);
                let count = 1;
                map.set(k, {
                    name,
                    count: map.get(k).count + 1
                });
            }
        });
    });
    let newTotal = houseList.length - historyList.length;
    console.group(`共计新增房源：${newTotal}${newTotal > 0 ? ",其中：" : ""}`);
    let rows = [];
    for (let [k, v] of map) {
        rows.push([v.name, v.count])
    }
    showTable(rows);
    console.groupEnd();
    return houseList;
};
