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
    let salt = getRandomString()
    // let _ = crypto.createHash('sha1')
    salt = crypto.createHash('sha1').update(HASH_SECRET).update(getRandomString()).digest('hex')
    // crypto.createHash('sha1').update(HASH_SECRET).update(password)
    password = crypto.createHash('sha1').update(salt).update(password).digest('hex')
    let now = new Date()
    return UserModel.create({
        email: email,
        password: password,
        name: email,
        avatar: gravatar.url(email),
        logonDateTime: now,
        lastLoginDateTime: now,
        salt: salt,
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
            follows: findUserInfoRes.follows
        })
    })
}
