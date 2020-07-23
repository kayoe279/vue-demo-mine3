/* 全局配置文件 */
var config = {
    // 运行环境
    env: process.env.NODE_ENV,
    // debug模式
    debug: process.env.NODE_ENV === 'development' || false,
}

config.host = config.debug ? "http://27.154.228.202:6661/" : ""

export default config