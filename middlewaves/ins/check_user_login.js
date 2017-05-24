/**
 * 检查用户是否登录
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
module.exports.checkUserLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next()
    }
    if (req.xhr) {
        return res.json({
            success: false,
            type: 0,
            data: '用户没有登录'
        })
    }
    return next(new Error('用户没有有登录'))
}
