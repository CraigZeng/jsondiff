module.exports = {
    entry: ['webpack-dev-server/client?http://localhost:9000/', 'webpack/hot/dev-server', './src/index'],
    devServer: {
        port: 9000
    }
}