const fs = require("fs");
const searchs = require('./searchs');
const Query = require("./query");
const  writeData = require("./files");
async function start() {
     var data = {};
    for (let i = 0; i < searchs.length; i++) {
        let item = searchs[i];
        console.info(item.name + "：");
        let q = new Query(item);
        let [list, trend] = await q.start();
        data[item.code] = {
            name: item.name,
            list,
            trend
        }
        console.log(item.name + "--end")
    }
    writeData(data);
    console.log("End");
}
start();


