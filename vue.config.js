// vue.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // 开启生产环境SourceMap，设为false打包时不生成.map文件
    productionSourceMap: false,
    // 关闭ESLint，如果你需要使用ESLint，把lintOnSave设为true即可
    devServer: {
        overlay: {
            warning: false,
            errors: false
        }
    },
    lintOnSave: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
    },
    configureWebpack: {
        externals: {
            'AMap': 'AMap' // 高德地图配置
        }
    },
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `
              @import "~@/styles/varibles.scss";
              @import "~@/styles/mixin.scss";`
            }
        }
    }
};
