const ReplyModel = require('../../models').ReplyModel
const debug = require('debug')('my-app:proxy:ins:reply')


/**
 * 根据用户查找Reply
 *
 * @param {String} userId
 * @param {function(Error, *)} callback
 */
module.exports.findAllByUserId = (userId, callback) => { ReplyModel.find({ userId: userId }, callback) }


/**
 * 根据用户id查找Reply, 返回Promise
 *
 * @param {String} userId
 * @return {Promise<*>}
 */
module.exports.findAllByUserIdPromise = userId => ReplyModel.find({ userId: userId }).then()
