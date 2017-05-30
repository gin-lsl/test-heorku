const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

var UserSchema = new mongoose.Schema({
    // 邮箱
    email: String,
    // 昵称，默认是邮箱地址
    name: String,
    // 密码（已加密）
    password: String,
    // 性别
    gender: String,
    // 等级
    lv: Number,
    // 言论
    say: String,
    // 头像，默认根据邮箱生成
    avatar: String,
    // 注册时间
    logonDateTime: Date,
    // 上次登录时间
    lastLoginDateTime: Date,
    // 访问次数
    visit: Number,
    // 最近访问
    recentVisits: [ObjectId],
    // 加密的salt指
    salt: String,
    // 关注他的
    follows: [ObjectId],
    // 他关注的
    hisFollows: [ObjectId],
    // 收藏的帖子
    collections: [ObjectId]
})

// UserSchema.statics.findOneByEmailAndPassword = (email, password, callback) => {
//     findOne({ email: email, password: password }, callback)
// }

var UserModel = mongoose.model('User', UserSchema)

UserModel.findOneByEmailAndPassword = (email, password, callback) => UserModel.findOne({ email: email, password: password }, callback)

UserModel.findOneByEmail = (email, callback) => UserModel.findOne({ email: email }, callback)

/**
 * 添加一个用户
 *
 * @param {String} email
 * @param {String} password
 * @return {Promise<any>}
 */
UserModel.createNewUserPromise = (email, password) => UserModel.create({ email: email, password: password })

module.exports = UserModel
