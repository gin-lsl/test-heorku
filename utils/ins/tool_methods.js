const debug = require('debug')('my-app:utils:tool_methods')

/*
 * 一些工具方法
 */

/**
 * 将 date 转换为 2017-05-10 10:20:33 的形式
 *
 * @param {Date} [date=new Date()] - 时间, 默认 当前时间
 */
module.exports.getShortDateTime = (date = new Date()) => {
    let ret = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    debug('转换时间日期字符串结果: %s', ret)
    return ret
}

/**
 * 生成随机字符串.
 *
 * @param {Number} [len=16] - 长度, 默认是 16
 * @return {String} 结果
 */
module.exports.getRandomString = (len = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const pos = chars.length
    let _ = ''
    for (var i = 0; i < len; i++) {
        _ += chars.charAt(Math.floor(Math.random() * pos))
    }
    return _
}
