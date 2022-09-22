var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var webpack = require('webpack')

module.exports = {
    //...

    plugins: [
        new BundleAnalyzerPlugin({
            // analyzerMode: 'static',
            // reportFilename: 'BundleReport.html',
            // logLevel: 'info'
            analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
            generateStatsFile: true, // 是否生成stats.json文件
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}