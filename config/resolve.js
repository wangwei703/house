const path = require("path");
module.exports = {
    modules: [
        path.join(__dirname, "../node_modules"),
        path.join(__dirname, "../web")//绝对路径
    ],
    extensions: [".web.js", ".js", ".jsx", ".json"]
};