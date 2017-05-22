const TopicModel = require('../../models').TopicModel
const debug = require('debug')('my-app:proxy:ins:topoic')


/**
 * 查找用户的topic
 *
 * @param {String} userId - 用户id
 * @param {function(Error, *)} callback
 */
module.exports.finAllByUserId = (userId, callback) => { TopicModel.find({ userId: userId }, callback) }


/**
 * 查找用户的topic, 返回Promise
 *
 * @param {String} userId
 * @return {Promise<*>}
 */
module.exports.finAllByUserIdPromise = userId => TopicModel.find({ userId: userId }).then()
