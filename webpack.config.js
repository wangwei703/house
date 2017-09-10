

const nodeEnv = process.env.NODE_ENV || 'development',
    isProd = nodeEnv === 'production',
    path = require("path");
let
    cleanPlugin = require("clean-webpack-plugin"),
    src = path.resolve(__dirname, "web"),
    build = path.resolve(__dirname, "build"),
    output = require("./config/output")(isProd, build),
    plugins = require("./config/plugins")(isProd, build),
    resolve = require("./config/resolve"),
    rules = require("./config/rules")(src),
    devServer = require("./config/devserver"),
    externals = require("./config/externals"),
    entry = require("./config/entry")(isProd);

if (isProd)
    plugins.unshift(new cleanPlugin(build));

let webpackConfig = {
    context: path.resolve(__dirname, './web'),
    entry,
    devServer,
    // externals,
    output,
    plugins,
    resolve,
    devtool: isProd ? 'source-map' : 'inline-source-map',
    module: rules
};

module.exports = webpackConfig;