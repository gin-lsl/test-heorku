const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const ReplySchema = mongoose.Schema({
    // 回复内容
    content: String,
    // 回复时间
    postDateTime: Date,
    // 回复给某个topic的id
    topicId: ObjectId,
    // 用户id
    userId: ObjectId,
    // 回复给某个Reply的id
    replyToReplyId: ObjectId,
    // 点赞的用户的id
    ups: [ObjectId],
    // 反对数量
    downs: [ObjectId],
    // 所在楼层
    floor: Number,
})

const ReplyModel = mongoose.model('reply', ReplySchema)

/**
 * 获取某个topic的回复列表
 */
ReplyModel.findRepliesByTopicId = (topicId, callback) => ReplyModel.find({ topicId: topicId }, callback)

module.exports = ReplyModel
