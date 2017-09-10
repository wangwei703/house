module.exports = function (isProd, build) {
    return isProd ? {
        path: build,
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].chunk.js"
    } : {
            path: build,
            filename: "[name].js",
            chunkFilename: "[name].[id].chunk.js"
        };
};