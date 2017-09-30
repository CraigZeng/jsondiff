const merge = require('webpack-merge');

const configBase = require('./webpack.base');
const configDev = require('./webpack.dev');
const configOnline = require('./webpack.online');

let config;

if (process.env.NODE_ENV === 'production') {
    config = merge(configBase, configOnline);
} else {
    config = merge(configBase, configDev);
}

module.exports = exports = config;
