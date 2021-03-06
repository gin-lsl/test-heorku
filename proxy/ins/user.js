const UserModel = require('../../models').UserModel
const gravatar = require('gravatar')
const crypto = require('crypto')
const HASH_SECRET = require('../../configs/credentials').hashSecret
const getRandomString = require('../../utils').tool_methods.getRandomString
const debug = require('debug')('my-app:proxy:ins:user')

/**
 * 根据邮箱和密码查询用户
 *
 * @param {String} email
 * @param {String} password
 * @param {function(Error, any)} callback
 */
module.exports.findOneByEmailAndPassword = (email, password, callback) => {
    debug('根据 email 和 password 查询')
    UserModel.findOne({
        email: email
    }, (err, _user) => {
        debug('Err: %O', err)
        debug('user: %O', _user)
        if (err) {
            debug('发生错误: %O', err)
            return callback(new Error('发生错误'))
        }
        if (!_user) {
            debug('账号不存在: %O', err)
            return callback(new Error('账号不存在'))
        }

        if (crypto.createHash('sha1').update(_user.salt).update(password).digest('hex') === _user.password) {
            debug('成功登录')
            return callback(null, _user)
        } else {
            debug('密码错误')
            return callback(new Error('密码错误'))
        }
    })
}

/**
 * 通过 email 查询某个user
 *
 * @param {String} email
 * @param {function(Error, *)} callback
 */
module.exports.findOneByEmail = (email, callback) => UserModel.findOne({ email: email }, callback)


/**
 * 创建一个新的 user
 * 返回 Promise
 *
 * @param {String} email
 * @param {String} password
 * @return {Promise}
 */
module.exports.createNewUserPromise = (email, password) => {
    debug('进入proxy的创建方法')
    let salt = getRandomString()
    salt = crypto.createHash('sha1').update(HASH_SECRET).update(getRandomString()).digest('hex')
    password = crypto.createHash('sha1').update(salt).update(password).digest('hex')
    let now = new Date()
    return new Promise((resolve, reject) => {
        UserModel.create({
            email: email,
            password: password,
            name: email,
            avatar: gravatar.url(email),
            logonDateTime: now,
            lastLoginDateTime: now,
            salt: salt,
            lv: 1,
            follows: [],
            hisFollows: [],
            recentVisits: [],
        })
            .then(createSuccess => {
                debug('成功： %O', createSuccess)
                return resolve(createSuccess)
            }, createFalid => {
                debug('失败： %O', createFalid)
                return reject(createFalid)
            })
    })
}


/**
 * 根据id查询用户信息, 并且只返回安全的字段
 * @param {String} userId
 * @param {function(Error, *)} callback
 */
module.exports.findUserByIdAndReturnSafeFields = (userId, callback) => {
    UserModel.findById(userId, (err, findUserInfoRes) => {
        if (err) {
            return callback(err);
        }
        if (!findUserInfoRes) {
            return callback(new Error('没有结果'))
        }
        return callback(null, {
            id: findUserInfoRes._id,
            email: findUserInfoRes.email,
            name: findUserInfoRes.name,
            gender: findUserInfoRes.gender,
            lv: findUserInfoRes.lv,
            say: findUserInfoRes.say,
            avatar: findUserInfoRes.avatar,
            logonDateTime: findUserInfoRes.logonDateTime,
            visit: findUserInfoRes.visit,
            recentVisits: findUserInfoRes.recentVisits,
            follows: findUserInfoRes.follows,
            hisFollows: findUserInfoRes.hisFollows,
            collections: findUserInfoRes.collections
        })
    })
}


/**
 * 收藏topic或者取消收藏
 * @param {string} userId
 * @param {string} topicId
 * @param {boolean} isCollect
 * @param {function(Error, *)} callback
 */
module.exports.collectOrCancel = (userId, topicId, isCollect, callback) => {
    debug('收藏或取消收藏: ' + isCollect)
    let _userQuery = UserModel.findById(userId)
    if (isCollect) {
        debug('执行收藏操作')
        _userQuery.update({
            $push: {
                collections: topicId
            }
        }).exec(callback)
    } else {
        debug('执行取消收藏操作')
        _userQuery.where({
            collections: topicId
        }).update({
            $pull: {
                collections: topicId
            }
        }).exec(callback)
    }
}
