const community = require('./community');
const Query = require("./query");
const {write,writeHistory} = require("./files");
const {showTable}=require("../comm");
const merge = require("./merge");
async function start() {
    var houseObj = {}, trend = {};
     console.group("抓取各小区房源信息");
    for (let i = 0; i < community.length; i++) {
        let item = community[i];
        let q = new Query(item);
        let list = await q.start();
        houseObj[item.code] = {
            name: item.name,
            list
        }
    }
    console.groupEnd();

    console.group("写入当日数据文件");
    writeHistory(houseObj);
    console.groupEnd();
    console.group("开始合并房源列表");
    let list = merge(houseObj);
    write(list,"list");
    console.groupEnd();
    console.group(`手动复制下面地址查看月度趋势：`);
    let xx=community.map(item => {
        return [`${item.name}:`,`https://${item.city}.anjuke.com/v3/ajax/prop/pricetrend/?commid=${item.id}`];
    })
    showTable(xx);
    console.groupEnd();
    console.log("end");
}
start();


