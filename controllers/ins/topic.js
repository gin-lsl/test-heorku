const { TopicModel, UserModel, ReplyModel } = require('../../models');
const async = require('async');

const getShortDateTime = require('../../utils').tool_methods.getShortDateTime;
var debug = require('debug')('my-app:controllers:ins:topic');


/**
 * 显示 新增 topic 页面
 * @param {Request} req,
 * @param {Response} res
 */
module.exports.showPost = (req, res) => {
    if (!req.session.user) {
        return res.status(302).redirect('/user/login');
    }
    return render(null, 'topic/post', { currentUser: req.session.user }, res);
}


/**
 * 所有帖子
 */
module.exports.list = (req, res) => {
    TopicModel.find((err, topics) => {
        async.each(topics, (_topic, next) => {
            _topic.shortContent = _topic.content.slice(0, 5);
            _topic.shortPostDateTime = getShortDateTime(_topic.postDateTime);
            UserModel.findById(_topic.userId, (err, _user) => {
                _topic.user = _user;
                next(err, _user);
            });
        }, err => {
            render(err, 'topic/topics-list', {
                topics: topics,
                title: '全部帖子',
                currentUser: req.session.user
            }, res);
        });
    });
}

/**
 * 某个帖子的详情
 */
module.exports.findById = (req, res) => {
    async.waterfall([
        // topic
        next => TopicModel.findById(req.params.tid, next),
        // 更新访问量
        (topic, next) => TopicModel.findByIdAndUpdate(topic._id, { $inc: { visit: 1 } }, (err, resUpdate) => next(null, topic)),
        // 查询回复
        (topic, next) => ReplyModel.findRepliesByTopicId(topic._id, (err, _resReplies) => {
            topic.shortPostDateTime = getShortDateTime(topic.postDateTime);
            _resReplies.map(ele => ele.shortPostDateTime = getShortDateTime(ele.postDateTime));
            topic.replies = _resReplies;
            next(err, topic);
        }),
        // 每条回复的用户信息
        (topic, next) => {
            debug('获取到的所有回复信息: %O', topic.replies);
            async.each(topic.replies, (_reply, nextEach) => {
                debug('查找 id 为 %s 的用户信息.', _reply.userId);
                UserModel.findById(_reply.userId, (err2, _resUser) => {
                    debug('查找到用户: %O', _resUser);
                    _reply.user = _resUser;
                    nextEach();
                });
            }, err3 => next(err3, topic));
        },
    ], (err, topic) => {
        debug('所以请求以及完成, 是否发生错误: %O', err);
        debug('所以请求以及完成, 查看结果: %O', topic);
        return render(err, 'topic/topic', {
            topic: topic,
            replies: topic.replies,
            currentUser: req.session.user,
        }, res);
    });
}

/**
 * 渲染页面
 *
 * @param {Error} err - 错误对象 必须, 如果没有错误请传入 null
 * @param {String} path - 路径 必须
 * @param {any} obj - 对象 必须, 如果没有传入 null
 * @param {Response} res 响应对象 必须, 否则没有上下文, 触发异常
 */
function render(err, path, obj, res) {
    debug('渲染处理器 err: %o,path: %s.', err, path);
    if (!res) {
        debug('没有res对象');
        throw new Error('发生错误! 响应对象为null!');
    }
    if (err) {
        debug('处理错误: %O', err);
        res.render('error', { error: err, title: '发生错误' });
    } else {
        debug('正常渲染 path: %s, obj: %O', path, obj);
        if (path) {
            res.render(path, obj);
        } else {
            res.status(404).render('error', { error: '找不到页面', title: '404 Not Found' });
        }
    }
}