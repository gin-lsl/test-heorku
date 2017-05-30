const { TopicModel, UserModel, ReplyModel, CategoryModel } = require('../../models')
const { UserProxy } = require('../../proxy')
const async = require('async')

const getShortDateTime = require('../../utils').tool_methods.getShortDateTime
var debug = require('debug')('my-app:controllers:ins:topic')


/**
 * 显示 新增 topic 页面
 * @param {Request} req
 * @param {Response} res
 */
module.exports.showPost = (req, res) => {
    if (!req.session.user) {
        return res.status(302).redirect('/user/login')
    }
    CategoryModel.find((err, findAllCategoryRes) => {
        debug('返回的categories: %O', findAllCategoryRes)
        return render(null, 'topic/post', {
            currentUser: req.session.user,
            categories: err ? null : findAllCategoryRes
        }, res)
    })
}


/**
 * 保存topic
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.save = (req, res) => {
    if (!req.session.user) {
        return res.json({
            success: false,
            type: 0,
            data: '没有登录'
        })
    }
    let _body = req.body
    let _title = _body.title
    let _content = _body.content
    let _category = _body.category
    let _tags = _body.tags
    let _userId = req.session.user.id
    debug('图片名称: %S', req.coverImageName)

    debug('请求体: %O', _body)
    TopicModel.create({
        title: _title,
        content: _content,
        category: _category,
        postDateTime: new Date(),
        tags: _tags,
        userId: _userId,
        cover: req.coverImageName,
    }, (err, _createTopicRes) => {
        debug('插入topic文档结果')
        debug('Err: %O', err)
        debug('_createTopicRes: %O', _createTopicRes)
        if (err) {
            return res.redirect('back')
        }
        if (!_createTopicRes) {
            return res.redirect('/')
        }
        if (_createTopicRes._id) {
            return res.redirect('/topic/' + _createTopicRes._id)
        }
        return res.redirect('/')
    })
}


/**
 * 所有帖子
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.list = (req, res) => {
    // 分类id
    let _categoryId = req.query.categoryId
    // 页码
    let _page = req.query.page || 1
    // 每页显示数量
    let _pageCount = req.query.pageCount || 10
    debug('categoryId: %O, page: %s', _categoryId, _page)
    let _findCondition = _categoryId === undefined ? {} : { category: _categoryId }
    let options = {
        skip: (_page - 1) * _pageCount,
        limit: _pageCount
    }
    TopicModel.find(_findCondition, null, options, (err, topics) => {
        async.each(topics, (_topic, next) => {
            _topic.shortContent = _topic.content.slice(0, 5)
            _topic.shortPostDateTime = getShortDateTime(_topic.postDateTime)
            UserModel.findById(_topic.userId, (err, _user) => {
                _topic.user = _user
                next(err, _user)
            })
        }, err => {
            if (req.xhr) {
                return res.json({
                    success: !err,
                    data: {
                        topics: topics,
                        currentUser: req.session.user
                    }
                })
            }
            render(err, 'topic/topics-list', {
                topics: topics,
                title: '全部帖子',
                currentUser: req.session.user
            }, res)
        })
    })
}


/**
 * 获取全部或某个分类的帖子的个数
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.count = (req, res) => {
    let _categoryId = req.query.categoryId
    let _findCondition = _categoryId === undefined ? {} : { category: _categoryId }
    TopicModel.count(_findCondition, (err, _countRes) => {
        res.json({ success: !err, data: _countRes })
    })
}


/**
 * 某个帖子的详情
 */
module.exports.findById = (req, res) => {
    async.waterfall([
        // topic
        next => TopicModel.findById(req.params.tid, next),
        // topic 的作者
        (topic, next) => UserProxy.findUserByIdAndReturnSafeFields(topic.userId, (err, findAuthorRes) => {
            topic.author = findAuthorRes
            next(null, topic)
        }),
        // 更新访问量
        (topic, next) => TopicModel.findByIdAndUpdate(topic._id, { $inc: { visit: 1 } }, (err, resUpdate) => next(null, topic)),
        // 查询回复
        (topic, next) => ReplyModel.findRepliesByTopicId(topic._id, (err, _resReplies) => {
            topic.shortPostDateTime = getShortDateTime(topic.postDateTime)
            _resReplies.map(ele => ele.shortPostDateTime = getShortDateTime(ele.postDateTime))
            topic.replies = _resReplies
            next(err, topic)
        }),
        // 每条回复的用户信息
        (topic, next) => {
            debug('获取到的所有回复信息: %O', topic.replies)
            async.each(topic.replies, (_reply, nextEach) => {
                debug('查找 id 为 %s 的用户信息.', _reply.userId)
                UserModel.findById(_reply.userId, (err2, _resUser) => {
                    debug('查找到用户: %O', _resUser)
                    _reply.user = _resUser
                    nextEach()
                })
            }, err3 => next(err3, topic))
        },
    ], (err, topic) => {
        debug('所以请求以及完成, 是否发生错误: %O', err)
        debug('所以请求以及完成, 查看结果: %O', topic)
        if (err || topic === undefined) {
            return render('没有找到结果，请检查路径是否正确', '', null, res)
        }
        return render(err, 'topic/topic', {
            topic: topic,
            replies: topic.replies,
            currentUser: req.session.user,
        }, res)
    })
}


/**
 * 收藏topic
 * @param {Request} req
 * @param {Response} res
 */
module.exports.collect = (req, res) => {
    debug('打印当前用户: %O', req.session.user)
    debug('进入处理器 收藏帖子')
    UserProxy.collectOrCancel(req.session.user.id, req.params.tid, true, (err, collectRes) => {
        debug('数据处理结束，返回结果 Err: %O, collectRes: %O', err, collectRes)
        // 需要更新当前已登录用户的信息
        UserProxy.findUserByIdAndReturnSafeFields(req.session.user.id, (updateCurrentUserInfoErr, updateCurrentUserRes) => {
            debug('更新当前用户信息 updateCurrentUserInfoErr: %O, updateCurrentUserRes: %O', updateCurrentUserInfoErr, updateCurrentUserRes)
            if (updateCurrentUserInfoErr) {
                // return res.json({
                //     success: !err,
                //     data: collectRes
                // })
                return res.json({
                    success: true,
                    data: collectRes,
                    message: '收藏成功，但是由于未知问题，数据没有更新，请尝试重新登录'
                })
            } else {
                req.session.user = updateCurrentUserRes
                return res.json({
                    success: true,
                    data: collectRes
                })
            }
        })
    })
}


/**
 * 取消收藏
 * @param {Request} req
 * @param {Response} res
 */
module.exports.cancelCollect = (req, res) => {
    debug('进入处理器 取消收藏')
    UserProxy.collectOrCancel(req.session.user.id, req.params.tid, false, (err, cancelRes) => {
        debug('数据处理结束，返回结果 Err: %O, cancelRes: %O', err, cancelRes)
        UserProxy.findUserByIdAndReturnSafeFields(req.session.user.id, (updateCurrentUserInfoErr, updateCurrentUserRes) => {
            if (updateCurrentUserInfoErr) {
                return res.json({
                    success: true,
                    data: cancelRes,
                    message: '取消收藏成功，但是由于未知原因，数据没有更新，请尝试重新登录'
                })
            } else {
                req.session.user = updateCurrentUserRes
                return res.json({
                    success: true,
                    data: cancelRes
                })
            }
        })
        // return res.json({
        //     success: !err,
        //     data: cancelRes
        // })
    })
}


/**
 * 更新当前已登录用户的信息
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.updateCurrentUserInfo = (req, res) => {
    _updateCurrentUserInfo(req, (err) => {
        if (err) {
            // if (err.type == 0) {
            // 虽然知道了这些，但是现在也并没有什么用呢。。
            // } else if (err.type == 1) {
            // }
            return res.json({
                success: false,
                data: '发生错误'
            })
        } else {
            return res.json({
                success: true,
                data: '更新成功'
            })
        }
    })
}


/**
 * 更新当前已登录用户信息
 *
 * 回调参数为 Error对象，表示失败。含有 type 属性：
 *
 * 0 => 没有登录
 *
 * 1 => 更新失败
 *
 * @param {Request} req 
 * @param {function(Error)} callback 只有一个 Error 对象，表示更新当前登录用户信息失败
 */
function _updateCurrentUserInfo(req, callback) {
    if (!req.session.user) {
        return callback(new Error('没有登录').type = 0)
    }
    UserProxy.findUserByIdAndReturnSafeFields(req.session.user.id, (findUserByIdErr, findUserByIdRes) => {
        if (findUserByIdErr) {
            return callback(new Error('更新用户数据失败').type = 1)
        }
        req.session.user = findUserByIdRes
        return callback(null)
    })
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
    debug('渲染处理器 err: %o,path: %s.', err, path)
    if (!res) {
        debug('没有res对象')
        throw new Error('发生错误! 响应对象为null!')
    }
    if (err) {
        debug('处理错误: %O', err)
        res.render('error', { error: err, title: '发生错误' })
    } else {
        debug('正常渲染 path: %s, obj: %O', path, obj)
        if (path) {
            res.render(path, obj)
        } else {
            res.status(404).render('error', { error: '找不到页面', title: '404 Not Found' })
        }
    }
}
