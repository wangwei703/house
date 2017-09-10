const fs = require('fs');
const path = require("path");
function writeData(list) {
    var d = new Date().toLocaleDateString().replace(/\//g, '-');
    var txt = JSON.stringify(list)
    fs.writeFile(path.resolve(__dirname, `./data/${d}.json`), txt, function (err) {
        if (err)
            console.log("\tfail " + err);
        else {
            console.log("\t写入文件ok");
            console.log("\t统计");
            readData();
            console.log("\t统计ok");
        }
    });
}
function readData() {
    let url = path.resolve(__dirname, `./data/`);
    let files = fs.readdirSync(url);
    files = files.sort((f1, f2) => {
        return f1 > f2 ? 1 : (f1 < f2 ? -1 : 0);
    });
    let list = [];
    files.forEach(f => {
        let txt = fs.readFileSync(path.resolve(url, f), 'utf-8'),
            date = f.replace(".json", ""),
            json = JSON.parse(txt);
        let data = Object.keys(json).map(k => {
            let data = json[k];
            let house = data.list.map(h => {
                return {
                    "a": h.area,
                    "t": h.totalprice,
                    "u": h.unitprice,
                    "d": h.date,
                }
            });
            let now = new Date(),
                year = now.getFullYear(),
                mon = now.getMonth() + 1,
                ym = `${year}${mon < 10 ? ('0' + mon) : mon}`;
            let community = 0, area = 0;
            if (data.trend.community) {
                community = parseInt(Object.entries(data.trend.community.pop())[0][1], 10);
            }
            if (data.trend.area) {
                area = parseInt(Object.entries(data.trend.area.pop())[0][1], 10);
            }
            let trend = {
                c:community,
                a:area,
                cm: data.trend.comm_midchange,
                am: data.trend.area_midchange
            }
            return {
                name: data.name,
                key: k,
                house,
                trend
            };
        });
        list.push({
            date,
            data
        });
    });
    var txt = JSON.stringify(list); // "module.exports=" + JSON.stringify( points );
    fs.writeFile(path.resolve(__dirname, `../../web/libs/data/ajk.json`), txt, function (err) {
        if (err)
            console.log("\tfail " + err);
        else
            console.log("\t写入文件ok");
    });
}
module.exports =writeData;