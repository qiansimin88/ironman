const PreloadWebpackPlugin = require('preload-webpack-plugin'); // 静态资源的预加载
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'); // js资源支持Async或defer
const webpack = require('webpack');
const path = require('path');

const config = require('./scaffold/config');

const { publicPath, isPro, ossConfig } = config;

module.exports = {
    publicPath: isPro ? publicPath + ossConfig.preFlag || '/' : '/', // bsseURl  基本路径头
    lintOnSave: 'error', // 保存编译失败通知
    productionSourceMap: true,
    crossorigin: 'anonymous', // 静态资源支持跨域 某些情况下有用
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        plugins: [
            // new webpack.optimize.ModuleConcatenationPlugin(), // 减少webpacK打包后的闭包函数数量 加快浏览器加载解析JS速度
            // new PreloadWebpackPlugin({
            //     rel: 'preload',
            //     as: 'script',
            //     include: 'allChunks'
            // }), // 预加载
            // new ScriptExtHtmlWebpackPlugin({
            //     defaultAttribute: 'defer'
            // })
        ]
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true // 开启 变量替换
            }
        },
        modules: false // 具体百度 css modules 的意义
    },
    pluginOptions: {
    // 全局引用
        'style-resources-loader': {
            preProcessor: 'less',
            // 全局引用CSS的地址
            patterns: [
                path.resolve(__dirname, './src/assets/global.less')
            ]
        }
    }
};
