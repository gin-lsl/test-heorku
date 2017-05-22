const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

var UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    gender: String,
    lv: Number,
    say: String,
    avatar: String,
    logonDateTime: Date,
    lastLoginDateTime: Date,
    visit: Number,
    recentVisits: [ObjectId],
    salt: String,
    follows: [ObjectId],
    hisFollows: [ObjectId],
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
