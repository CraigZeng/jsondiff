const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['webpack-dev-server/client?http://localhost:9000/', 'webpack/hot/dev-server', './src/index'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jsondiff.js',
        publicPath: '/assets/',
        library: 'JSONDiff',
        libraryTarget: 'umd'
    },
    devServer: {
        port: 9000
    },
    resolve: {
        extensions: [".js", ".less"]
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: 'index.html',
            template: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    context: __dirname,
    devtool: "source-map"
};