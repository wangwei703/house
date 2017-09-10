let app = ['./entry'];
module.exports = (isProd) => {
    // if (!isProd) {
    //     app.unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:2233', 'webpack/hot/only-dev-server');
    // }
    return {
         app
    }
}