var debug = require('debug')('my-app:routes:ins:route_util')

/**
 * 渲染页面, 包含错误页面
 *
 * @param {Error} err
 * @param {String} path
 * @param {any} obj
 * @param {Response} res
 */
module.exports.render = (err, path, obj, res) => {
    debug('渲染处理器 err: %o,path: %s.', err, path)
    if (!res) {
        debug('没有res对象')
        throw new Error('发生错误! 响应对象为null!')
    }
    if (err) {
        debug('处理错误: %O', err)
        res.render('error', { error: err, title: '发生错误' })
    } else {
        debug('正常渲染 path: %s, obj: %O', path, obj)
        if (path && obj) {
            res.render(path, obj)
        } else {
            res.status(404).render('error', { error: '找不到页面', title: '404 Not Found' })
        }
    }
}