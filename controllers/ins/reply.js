const { ReplyModel, TopicModel } = require('../../models')
const debug = require('debug')('my-app:controllers:ins:reply')


/**
 * 添加一条回复到指定topic
 *
 * 如果回复失败，返回的数据有 type 字段
 *
 * 0 => 没有登录
 *
 * 1 => 参数不完整
 *
 * 2 => 未知错误
 *
 * 3 => 所请求的主题不存在
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.saveAjax = (req, res) => {
    debug('进入添加回复')
    // 取出session中的user对象
    let _currentUser = req.session.user
    if (!_currentUser) {
        // 没有登录
        return res.json({
            success: false,
            type: 0,
            data: '没有登录'
        })
    }
    let _body = req.body
    let userId = _currentUser.id                    // 当前登录用户
    let topicId = _body.tid                          // 回复的topic，必须
    let content = _body.content                      // 回复的内容，必须
    let replyToReplyId = _body.reply_to_reply_id     // 回复给某个回复，可选
    if (!(topicId && content)) {
        return res.json({
            success: false,
            type: 1,
            data: '参数不完整'
        })
    }
    debug('添加回复： %O', req.body)
    TopicModel.findById(topicId, (err, findTopicRes) => {
        if (err || !findTopicRes) {
            return res.json({
                success: false,
                type: err ? 2:3,
                data: err ? '发生未知错误' : '所请求的主题不存在!'
            })
        } else {
            ReplyModel.create({
                content: content,
                postDateTime: new Date(),
                topicId: topicId,
                userId: userId,
                replyToReplyId: replyToReplyId,
            }, (err, replyRes) => {
                debug('添加回复返回的数据: %O', replyRes)
                return res.json({
                    success: !err,
                    type: err ? 2 : NaN,
                    data: err ? '发生未知错误' : replyRes
                })
            })
        }
    })
}


/**
 * 点赞
 * @param {Request} req
 * @param {Reponse} res
 */
module.exports.up = (req, res) => {
    debug('点赞 session: %O', req.session)
    let currentUser = req.session.user
    if (currentUser) {
        let replyId = req.query.reply_id
        let type = req.query.type
        debug('type: %s', type)
        ReplyModel.findById(replyId)
            .then(findReplyRes => {
                if (type == 0) {
                    debug('执行了, 表示type的值为 0')
                    if (findReplyRes.ups.find(ele => ele !== currentUser.id)) {
                        return Promise.reject('已经点过赞了')
                    }
                    return ReplyModel.findById(replyId).update({ $push: { ups: currentUser.id } })
                } else {
                    debug('执行了, 表示type的值为 1')
                    return ReplyModel.findById(replyId).update({ $pull: { ups: currentUser.id } })
                }
            })
            .then(updateUpsRes => {
                debug('更新操作结果: %O', updateUpsRes)
                return res.json({
                    success: true,
                })
            })
            .catch(updateUpsError => {
                debug('发生错误: %O', updateUpsError)
                return res.json({
                    success: false,
                    data: updateUpsError
                })
            })
    } else {
        return res.json({
            success: false,
            data: '没有登录'
        })
    }
}
