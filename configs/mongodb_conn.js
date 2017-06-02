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

    // 使用 Promise
    mongoose.Promise = global.Promise

    // 根据不同的环境变量链接 mongodb
    switch (process.env.env) {
        case 'development':
            debug('开发模式')
            mongoose.connect(mongoConfig.development.connectionString)
            // 设置 mongoose 打印执行的语句
            // mongoose.set('debug', true)
            break
        case 'production':
            debug('产品模式')
            mongoose.connect(mongoConfig.production.connectionString, opts)
            break
        default:
            debug('没有环境变量')
            throw new Error('未知执行环境, 请重新设置`env`环境变量!')
    }
}
