// vue.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const Timestamp = new Date().getTime();

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
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `css/[name].${Timestamp}.css`,
                chunkFilename: `css/[name].${Timestamp}.css`
            })
        ],
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】 解决缓存问题
            filename: `js/[name].${Timestamp}.js`,
            chunkFilename: `js/[name].${Timestamp}.js`
        },
    },
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `
              @import "~@/styles/varibles.scss";
              @import "~@/styles/mixin.scss";`
            },
            postcss: {
                plugins: [
                    require('postcss-px2rem')({// 移动端适配
                        remUnit: 37.5,
                        remPrecision: 2
                    })
                ]
            }
        }
    }
};
