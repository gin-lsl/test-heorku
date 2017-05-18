const { UserModel } = require('../../models')
const { UserProxy } = require('../../proxy')
const regex_tools = require('../../utils').regex_tools
const debug = require('debug')('my-app:controllers:ins:user')

/**
 * 返回JSON格式数据
 *
 * @param {Response} res 响应对象
 * @param {any} data 数据
 * @param {Boolean?} success 是否成功, 默认是 false
 */
function resJson(res, data, success = false) {
    return res.json({
        success: success,
        data: data,
    })
}


/**
 * 处理注册请求
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.logon = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let password_repeat = req.body.password_repeat
    if (!email) {
        return resJson(res, { type: 1, msg: '邮箱不能为空' })
    }
    if (!password) {
        return resJson(res, { type: 2, msg: '密码不能为空' })
    }
    if (!password_repeat) {
        return resJson(res, { type: 3, msg: '请重复输入密码' })
    }
    if (!regex_tools.validEmail(email)) {
        return resJson(res, { type: 1, msg: '邮箱格式不正确' })
    }
    if (password.length < 6) {
        return resJson(res, { type: 2, msg: '密码长度不能小于6位' })
    }
    if (regex_tools.pureNumber(password)) {
        return resJson(res, { type: 2, msg: '密码不能为纯数字' })
    }
    if (password !== password_repeat) {
        return resJson(res, { type: 3, msg: '两次输入的密码不一样' })
    }

    UserProxy.findOneByEmail(email, (err, _user) => {
        if (err) {
            return resJson(res, { type: 0, msg: '发生未知错误, 请稍后重试' })
        }
        if (_user) {
            return resJson(res, { type: 1, msg: '此邮箱已被注册' })
        }
        UserProxy.createNewUserPromise(email, password).then(data => {
            // req.session.user = 
            debug('注册返回数据: %O', data)
            resJson(res, '注册成功', true)
        }).catch(uErr => resJson(res, '未知错误, 请稍后重试'))
        // return resJson(res, '注册成功', true)
    })
}


/** 登录 */
module.exports.login = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let isXhr = req.xhr
    UserProxy.findOneByEmailAndPassword(email
        , password
        , (err, user) => {
            debug('查询user结果: ')
            debug('---%O', err)
            debug('---%O', user)
            if (err) {
                if (isXhr) {
                    return res.json({
                        success: false,
                        error: err.message,
                    })
                }
                res.redirect('back')
            } else if (user) {
                // 更新必须执行回调
                UserModel.findByIdAndUpdate(user._id, { $set: { lastLoginDateTime: new Date() } }, (err2, updateRet) => { })
                
                let __user = {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    gender: user.gender,
                    lv: user.lv,
                    say: user.say,
                    avatar: user.avatar,
                }
                req.session.user = __user
                if (isXhr) {
                    return res.json({
                        success: true,
                        data: __user,
                    })
                }
                res.redirect('/')
            } else {
                if (isXhr) {
                    return res.json({
                        success: false,
                        error: '发生错误, 请稍后重试',
                    })
                }
                res.redirect('back')
            }
        })
}


/**
 * 退出登录
 */
module.exports.logout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
}


/**
 * 根据id查找
 */
module.exports.findById = (req, res) => {
    debug('获取某个用户信息')
    let id = req.params.id
    UserModel.findById(id, (err, _user) => {
        debug('--error: %O', err)
        debug('---_user: %O', _user)
        if (_user) {
            _user.id = _user._id
            delete _user._id
        }
        res.render('user/user', {
            error: err,
            title: err ? 'Error' : _user.name,
            userInfo: _user,
            currentUser: req.session.user
        })
    })
}
