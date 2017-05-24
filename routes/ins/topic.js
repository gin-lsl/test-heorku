const router = require('express').Router()
const topic = require('../../controllers').topicController
const fileUpload = require('../../middlewaves').FileUpload

const debug = require('debug')('my-app:routes:ins:topic')

/**
 * 日志
 */
router.use((req, res, next) => {
    debug('进入路由 /topic')
    next()
})

router.post('/test', fileUpload.single('newavatar'), (req, res) =>{
    req.test = '呵呵'
    debug('/test 查看 %O', req.test)
    debug('FileName: %s', req.coverImageName)
    debug('请求体: %O', req.body)
    // return res.json({
    //     success: true
    // })
    return res.redirect('back')
})

router.get('/test1', (req, res) => {
    debug('/test1 查看 %O', req.test)
    return res.json({
        success: true
    })
})

router.get('/post', topic.showPost)

router.post('/post', checkUserLogin, fileUpload.single('file'), topic.save)

router.get('/list', topic.list)

router.get('/:tid', topic.findById)


/**
 * 检查用户是否登录
 *
 * @param {Request} req 
 * @param {Response} res
 * @param {function} next
 */
function checkUserLogin(req, res, next) {
    debug('检查用户是否登录')
    if (!req.session.user) {
        if (req.xhr) {
            return res.json({
                success: false,
                type: 0,
                data: '没有登录'
            })
        } else {
            return res.redirect('back')
        }
    }
    next()
}

module.exports = router
