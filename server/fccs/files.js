const fs = require('fs');
const path = require("path");
function padLeft(n){
    if(n<10){
        return "0"+n;
    }
    return ""+n;
}
function getName(){
    let n=new Date();
    let y=n.getFullYear(),
        M=padLeft(n.getMonth()+1),
        d=padLeft(n.getDate()),
        h=padLeft(n.getHours()),
        m=padLeft(n.getMinutes()),
        s=padLeft(n.getSeconds());
    return `${y}${M}${d}${h}${m}${s}`;
}
function writeData(list) {
    var d = getName();
    var txt = JSON.stringify(list); // "module.exports=" + JSON.stringify( points );
    fs.writeFile(path.resolve(__dirname, `./data/${d}.json`), txt, function (err) {
        if (err)
            console.log("\tfail " + err);
        else {
            console.log("\t写入文件ok");
        }
    });
}

module.exports =writeData;