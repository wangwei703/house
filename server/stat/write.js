const fs = require("fs");
const path = require("path");
function write(name, list, mobile = false) {
    var txt = JSON.stringify(list);
    var src;
    if (mobile) {
        src = path.resolve(__dirname, `../../../housemob/web/app/db/${name}.json`);
    } else {
        src = path.resolve(__dirname, `../../web/libs/data/${name}.json`);
    }
    fs.writeFile(src, txt, function (err) {
        if (err)
            console.log("\tfail " + err);
        else {
            console.log("\t写入文件ok");
        }
    });
}
module.exports = write;