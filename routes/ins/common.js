var express = require('express')
var router = express.Router()
var debug = require('debug')('my-app:routes:ins:common')
var userController = require('../../controllers').userController
var topicController = require('../../controllers').topicController

// router.get('/', (req, res) => {
//     // res.locals.session = req.session
//     debug('session: %O', req.session)
//     res.render('index', {
//         title: '首页',
//         currentUser: req.session.user
//     })
// })

router.get('/', topicController.list)

router.get('/login', (req, res) => {
    res.render('log/login')
})

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.get('/all_test', (req, res) => {
    debug('%O', res.locals)
    debug('req: %O', req.obj)
    res.render('all_test')
})

module.exports = router