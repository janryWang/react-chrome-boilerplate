const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rucksack = require('rucksack-css')
const Path = require('path')
const _ = require('lodash')
const pkg = require('../package.json')
const utils = require('./utils')




module.exports = {

    resolve: {
        //extensions: ['.js', '.jsx'],
        alias: utils.generateAlias('src')
    },


    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            }, {
                test: /\.htm$/,
                loaders: ['string-loader']
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' })
            }, {
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)/,
                loaders: ['url?limit=100000,img?minimize']
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    'babel-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            postcss: function () {
                return [
                    rucksack({
                        autoprefixer: true
                    })
                ]
            }
        })
    ]

};