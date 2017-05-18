var mongoose = require('mongoose')
var mongoConfig = require('./mongodb_config').mongoConnConfig
var debug = require('debug')('my-app:configs:mongodb_conn')

/**
 * 连接 Mongo
 */
module.exports = function () {
    var opts = {
        server: {
            socketOptions: {
                keepAlice: 1
            }
        }
    }

    // 根据不同的环境变量链接 mongodb    
    switch (process.env.env) {
        case 'development':
            debug('开发模式')
            mongoose.connect(mongoConfig.development.connectionString)
            break
        case 'production':
            debug('产品模式')
            mongoose.connect(mongoConfig.production.connectionString, opts)
            break
        default:
            debug('没有环境变量')
            throw new Error('不知道的执行环境, 请重新设置环境变量!')
    }
};