const { UserModel } = require('../../models')
const { UserProxy, TopicProxy, ReplyProxy } = require('../../proxy')
const regex_tools = require('../../utils').regex_tools
const gravatar = require('gravatar')
const fs = require('fs')
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
        UserProxy.createNewUserPromise(email, password).then(_dataCreateUserWhenLogon => {
            let __user = {
                id: _dataCreateUserWhenLogon._id,
                lv: _dataCreateUserWhenLogon.lv,
                say: _dataCreateUserWhenLogon.say,
                name: _dataCreateUserWhenLogon.name,
                email: _dataCreateUserWhenLogon.email,
                gender: _dataCreateUserWhenLogon.gender,
                avatar: _dataCreateUserWhenLogon.avatar,
                follows: _dataCreateUserWhenLogon.follows,
                hisFollows: _dataCreateUserWhenLogon.hisFollows,
                collections: _dataCreateUserWhenLogon.collections,
                recentVisits: _dataCreateUserWhenLogon.recentVisits,
                logonDateTime: _dataCreateUserWhenLogon.logonDateTime,
                lastLoginDateTime: _dataCreateUserWhenLogon.lastLoginDateTime,
            }
            req.session.user = __user
            debug('注册返回数据: %O', __user)
            resJson(res, __user, true)
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
                    lv: user.lv,
                    say: user.say,
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    avatar: user.avatar,
                    collections: user.collections
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
 *
 * 需要根据情况更新此用户被访问的次数
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findByIdAndUpdateVisitInfomation = (req, res) => {
    debug('获取某个用户信息')
    let currentUser = req.session.user
    let id = req.params.id
    UserModel.findById(id)
        .then(findUserRes => {
            debug('查找到用户信息: %O', findUserRes)
            // 判断是否有用户登录
            if (currentUser) {
                if (currentUser.id !== id) {
                    debug('查找的用户不是当前登录用户')
                    return UserModel.findByIdAndUpdate(id, { $addToSet: { recentVisits: currentUser.id }, $inc: { visit: 1 } })
                }
            } else {
                return UserModel.findByIdAndUpdate(id, { $inc: { visit: 1 } })
            }
            return findUserRes
        })
        .then(someDataRes => {
            debug('进入第二个then回调 回调数据: %O', someDataRes)
            // return res.render('user/user', {
            //     // userInfo: 
            // })
            return res.render('user/user', {
                userInfo: someDataRes,
                currentUser: req.session.user
            })
        })
        .catch(error => {
            debug('获取用户信息，捕获到错误发生: %O', error)
            return res.render('user/user', {
                userInfo: null,
                currentUser: req.session.user
            })
        })
    // UserModel.findById(id, (err, _user) => {
    //     debug('--error: %O', err)
    //     debug('---_user: %O', _user)
    //     if (_user) {
    //         _user.id = _user._id
    //         delete _user._id
    //     }
    //     res.render('user/user', {
    //         error: err,
    //         title: err ? 'Error' : _user.name,
    //         userInfo: _user,
    //         currentUser: req.session.user
    //     })
    // })
}


/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findAllTopics = (req, res) => {
    let userId = req.params.id
    TopicProxy.finAllByUserId(userId, (err, findTopicsRes) => {
        return res.json({
            success: !err,
            data: err ? '查询用户发布的帖子信息出错' : findTopicsRes
        })
    })
}


/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findAllReplies = (req, res) => {
    let userId = req.params.id
    ReplyProxy.findAllByUserId(userId, (err, findRepliesRes) => {
        return res.json({
            success: !err,
            data: err ? '查询用户所有回复信息出错' : findRepliesRes
        })
    })
}


/**
 * 查找用户信息, 但是不更新被访问的次数
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findOneByIdAndNothingToDo = (req, res) => {
    UserProxy.findUserByIdAndReturnSafeFields(req.params.id, (err, findUserInfoRes) => {
        return res.json({
            success: !err,
            data: err
                ? '查询用户信息失败'
                : findUserInfoRes
        })
    })
}


/**
 * 关注某人, 需要登录
 *
 * 如果关注失败, 返回的json会有 type 字段
 *
 * 0 => 没有登录
 *
 * 1 => 不能关注/取消关注自己
 *
 * 2 => 内部/未知错误
 *
 * 3 => 没有找到相关的用户, id错误
 *
 * 4 => 不能重复关注/取消
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.followUser = (req, res) => {
    let _currentUser = req.session.user
    // 想要关注的那个人的id
    let _followUserId = req.params.id
    let wannaFollow = req.query.wannaFollow
    debug('参数: %O, %O', req.params, req.query)
    debug('wannaFollow: ' + Boolean(wannaFollow))
    // 检查是否登录
    if (!_currentUser) {
        return res.json({
            success: false,
            type: 0,
            data: '大侠您是谁啊..不登录人家真的认不出来了啦o(*////▽////*)q'
        })
    }
    // 检查是否想要对自己进行相关操作
    if (_currentUser.id == _followUserId) {
        return res.json({
            success: false,
            type: 1,
            data: '不要对自己本人执行这个操作了啦！'
        })
    }
    // 查找想要关注的人的信息
    UserModel.findById(_followUserId, (err, findUserRes) => {
        debug('查找需要关注的用户结果 err: %O, %O', err, findUserRes)
        if (err || !findUserRes) {
            return res.json({
                success: false,
                type: err ? 2 : 3,
                data: err ? '查询发生错误, 请稍后重试' : '没有找到此用户信息'
            })
        } else {
            // 这里的等号是 两个等号, 因为 follows 里面的类型是 mongodb 的 ObjectId 类型的
            if (findUserRes.follows.find(ele => ele == _currentUser.id)) {
                debug('在关注对方的用户列表中找到自己')
                // 如果想要关注，则提示已经关注过；
                // 如果想取消关注，则继续下一步
                if (wannaFollow) {
                    debug('已经关注，直接退出')
                    return res.json({
                        success: false,
                        type: 4,
                        data: '已经关注过了呢！'
                    })
                }
                debug('没有关注对方，进行关注的操作')
                UserModel.findByIdAndUpdate(_followUserId, { $pull: { follows: _currentUser.id } }, (err, update_PULL_followsRes) => {
                    if (err) {
                        return res.json({
                            success: false,
                            type: 2,
                            data: '未知错误，请稍后重试'
                        })
                    }
                    UserModel.findByIdAndUpdate(_currentUser.id, { $pull: { hisFollows: _followUserId } }, (err, update_PULL_hisFollowsRes) => {
                        return res.json({
                            success: !err,
                            type: err ? 2 : NaN,
                            data: err ? '未知错误，请稍后重试' : '好吧，已经取消关注TA了。'
                        })
                    })
                })
            } else {
                debug('没有在关注对方的列表中找到自己')
                // 没有在关注对方的列表中找到自己
                // 如果是想要关注对方，则执行；
                // 如果是响应对对方进行取关操作，则失败
                if (wannaFollow) {
                    debug('进行关注操作')
                    // 更新 "我关注的" 用户列表
                    UserModel.findByIdAndUpdate(_followUserId, { $push: { follows: _currentUser.id } }, (err, updateFollowsRes) => {
                        if (err) {
                            return res.json({
                                success: false,
                                type: 2,
                                data: '操作失败，请稍后重试'
                            })
                        }
                        // 更新 "关注我的" 用户列表
                        UserModel.findByIdAndUpdate(_currentUser.id, { $push: { hisFollows: _followUserId } }, (err, updateHisFollowsRes) => {
                            return res.json({
                                success: !err,
                                type: err ? 2 : NaN,
                                data: err
                                    ? '操作失败, 请稍后重试！'
                                    : wannaFollow
                                        ? '好了，不在关注TA了。。'
                                        : 'OK！已经关注了TA了,嘿嘿嘿(●ˇ∀ˇ●)'
                            })
                        })
                    })
                } else {
                    debug('本来就没有关注对方')
                    return res.json({
                        success: false,
                        type: 4,
                        data: '你本来就没有关注TA了啦'
                    })
                }
            }
        }
    })
}


/**
 * 重置用户头像到默认头像（gravatar生成的头像）
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findByIdAndResetAvatarToDefault = (req, res) => {
    debug('进入重置用户头像处理器')
    let _email = req.session.user.email
    _email = gravatar.url(_email)
    debug('生成的头像地址：%s', _email)
    UserModel.findByIdAndUpdate(req.session.user.id, {
        $set: {
            avatar: _email
        }
    }, (err, resetAvatarToDefault) => {
        return res.json({
            success: !err,
            data: err ? null : _email
        })
    })
}


/**
 * 修改用户头像
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findByIdAndUpdateAvatar = (req, res) => {
    UserModel.findByIdAndUpdate(req.session.user.id, {
        $set: {
            avatar: '/images/covers/' + req.coverImageName
        }
    }, (err, updateAvatarRes) => {
        debug('更新头像结果: Err: %O, updateAvatarRes: %O', err, updateAvatarRes)
        debug('是否是xhr请求: ' + req.xhr)
        fs.unlink('public' + updateAvatarRes.avatar, unlinkErr => {
            if (unlinkErr) {
                debug('删除文件出错 err: %O', unlinkErr)
            }
        })
        if (req.xhr) {
            debug('完成并且成功')
            return res.json({
                success: true,
                data: '/images/covers/' + req.coverImageName
            })
        }
        return res.redirect('back')
    })
}


/**
 * 修改用户 say
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findByIdAndUpdateSay = (req, res) => {
    UserModel.findByIdAndUpdate(req.session.user.id, {
        $set: {
            say: req.body.say
        }
    }, (err, updateSayRes) => {
        debug('修改say属性结果：%O', updateSayRes)
        if (req.xhr) {
            return res.json({
                success: !err,
                data: req.body.say
            })
        }
        return res.redirect('back')
    })
}


/**
 * 修改用户 name
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findByIdAndUpdateName = (req, res) => {
    UserModel.findByIdAndUpdate(req.session.user.id, {
        $set: {
            name: req.body.name,
        }
    }, (err, updateNameRes) => {
        if (req.xhr) {
            return res.json({
                success: !err,
                data: req.body.name
            })
        }
        return res.redirect('back')
    })
}
