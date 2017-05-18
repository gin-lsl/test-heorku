const ReplyModel = require('../../models').ReplyModel;
const debug = require('debug')('my-app:controllers:ins:reply');

module.exports.save = (req, res) => {
    // 取出session中的user对象
    let _currentUser = req.session.user;
    if (!_currentUser) {
        // 没有登录
        return res.redirect('back');
    }
    let topicId = req.body.tid;
    let content = req.body.content;
    let userId = _currentUser.id;
    let replyToUserId = req.body.toUid;
    if (!(topicId && content)) {
        return res.redirect('back');
    }
    ReplyModel.create({
        content: content,
        postDateTime: new Date(),
        topicId: topicId,
        userId: userId,
        replyToUserId: replyToUserId,
    }, (err, replyRes) => {
        return res.redirect('back');
    });
}


/**
 * 点赞
 * @param {Request} req
 * @param {Reponse} res
 */
module.exports.up = (req, res) => {
    debug('点赞 session: %O', req.session);
    let currentUser = req.session.user;
    if (currentUser) {
        let replyId = req.query.reply_id;
        ReplyModel.findById(replyId)
            .then(findReplyRes => {
                if (findReplyRes.ups.find(ele => ele !== currentUser.id)) {
                    // throw new Error('已经点过赞了');
                    return Promise.reject('已经点过赞了');
                }
                return ReplyModel.findById(replyId).update({ $push: { ups: currentUser.id } });
            })
            .then(updateUpsRes => {
                return res.json({
                    success: true,
                });
            })
            .catch(updateUpsError => {
                debug('发生错误: %O', updateUpsError);
                return res.json({
                    success: false,
                });
            });
    }
}
