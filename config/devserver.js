const path = require("path");
const errorOverlayMiddleware = require('react-error-overlay/middleware');
module.exports = {
    // contentBase: path.resolve(__dirname, "./"), // New
    // host: "localhost"
    // /////
    hot: true,
    compress: true,
    port: 2233,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname),
    //publicPath: '/',
    watchOptions: {
        ignored: /node_modules/,
    },
    stats: {
        modules: false,
        chunks: false
    },
    overlay: false,
    setup(app) {
        app.use(errorOverlayMiddleware());
    }
};