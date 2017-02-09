const webpack = require('webpack')
const base = require('./webpack.config.base')
const pkg = require('../package.json')

const config = Object.assign(base,{

    module:{
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            }, {
                test: /\.htm$/,
                loaders: ['string-loader']
            }, {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ]
            },{
                test: /\.less$/,
                loaders:[
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                EXTENSION_ID:JSON.stringify(pkg.extensionId)
            } 
        }),
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

})

module.exports = config