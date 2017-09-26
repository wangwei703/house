const fs = require("fs");
const community = require('./community');
const Query = require("./query");
const { writeHistory, write } = require("./files");
const merge = require("./merge");
async function start() {
    var houseObj = {}, Trend = {};
    console.group("抓取各小区房源信息");
    for (let i = 0; i < community.length; i++) {
        let item = community[i];
        let q = new Query(item);
        let [list, trend] = await q.start();
        houseObj[item.code] = {
            name: item.name,
            list
        }
        Trend[item.code] = trend;
    }
    console.groupEnd();

    console.log("写入当日数据文件");
    writeHistory(houseObj);

    console.group("开始合并房源列表");
    let list = merge(houseObj);
    write(list, "list");
    console.groupEnd();
    console.group("保存月度趋势数据");
    write(Trend, "trend");
    console.groupEnd();
    console.log("End");
}
start();


