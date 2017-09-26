const fs = require('fs');
const path = require("path");

let HouseList = [];

let url = path.resolve(__dirname, `./data/history`),
    files = fs.readdirSync(url);
files.forEach(f => {
    let txt = fs.readFileSync(path.resolve(url, f), 'utf-8'),
        date = f.replace(".json", ""),
        json = JSON.parse(txt);
    Object.keys(json).map(k => {
        let data = json[k],
            name = data.name;
        let house = data.list.map(h => {
            return {
                "id": h.key ? `${h.key}-${h.date}` : null,
                k,
                name,
                "a": h.area,
                "t": h.totalprice,
                "u": h.unitprice,
                "d": h.date
            }
        });
        HouseList = HouseList.concat(house);
    });
});
//过滤重复 房源
//过滤规则，房源编码相同&&发布日期相同
let newHouseList = [],
    houseSet = new Set();
HouseList.forEach(house => {
    if (house.id) {
        if (!houseSet.has(house.id)) {
            newHouseList.push(house);
            houseSet.add(house.id);
        }
    } else {
        newHouseList.push(house);
    }
});
console.log(`过滤前：${HouseList.length}，过滤后：${newHouseList.length}`);
let txt = JSON.stringify(newHouseList);
fs.writeFile(path.resolve(__dirname, `./data/list.json`), txt, function (err) {
    if (err)
        console.log("\tfail " + err);
    else {
        console.log("\t写入文件ok");
    }
});

