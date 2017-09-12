const fs = require("fs");
const path = require("path");
function write(name, list) {
    var txt = JSON.stringify(list); 
    fs.writeFile(path.resolve(__dirname, `../../web/libs/data/${name}.json`), txt, function (err) {
        if (err)
            console.log("\tfail " + err);
        else {
            console.log("\t写入文件ok");
        }
    });
}
module.exports=write;