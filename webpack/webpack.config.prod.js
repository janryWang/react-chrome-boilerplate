const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const utils = require('./utils')
const Path = require('path')
const pkg = require('../package.json')

utils.compileTpls('templates/**/*','crx',{
    $pkg:pkg
})


module.exports = merge.smart(baseConfig,{

    entry:{
        content:utils.src('./entry/content.js'),
        background:utils.src('./entry/background.js'),
        popup:utils.src('./entry/popup.js')
    },

    output: {
        path: Path.resolve(__dirname,'../', './crx'),
        filename: '[name].bundle.js'
    },


    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
            }
        }),
        new ExtractTextPlugin('[name].style.css'),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false
            }
        })
    ]
})