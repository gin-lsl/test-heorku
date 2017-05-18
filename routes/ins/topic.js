var router = require('express').Router()
var topic = require('../../controllers').topicController

var debug = require('debug')('my-app:routes:ins:topic')

/**
 * 日志
 */
router.use((req, res, next) => {
    debug('进入路由 /topic')
    next()
})

router.get('/post', topic.showPost)

router.get('/list', topic.list)

router.get('/:tid', topic.findById)

module.exports = router