const fs = require('fs');
const path = require("path");
function padLeft(n) {
    if (n < 10) {
        return "0" + n;
    }
    return "" + n;
}
function getName() {
    let n = new Date();
    let y = n.getFullYear(),
        M = padLeft(n.getMonth() + 1),
        d = padLeft(n.getDate()),
        h = padLeft(n.getHours()),
        m = padLeft(n.getMinutes()),
        s = padLeft(n.getSeconds());
    return `${y}${M}${d}${h}${m}${s}`;
}
function write(list, name) {
    var txt = JSON.stringify(list)
    let err=fs.writeFileSync(path.resolve(__dirname, `./data/${name}.json`), txt);
    if (err)
        console.log("fail " + err);
    else {
        console.log("写入文件ok");
    }
}
function writeHistory(list) {
    var d = getName();
    var txt = JSON.stringify(list);
    let err = fs.writeFileSync(path.resolve(__dirname, `./data/history/${d}.json`), txt);
    if (err)
        console.log("fail " + err);
    else {
        console.log("写入文件ok");
    }
}
module.exports = {
    write,
    writeHistory
};