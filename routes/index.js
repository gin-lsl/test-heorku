var express = require('express')
var router = express.Router()

const common = require('./ins/common')
const topic = require('./ins/topic')
const user = require('./ins/user')
const reply = require('./ins/reply')
const category = require('./ins/category')

var debug = require('debug')('my-app:routes:index')

/**
 * 路由
 */
router.use('/topic', topic)

router.use('/user', user)

router.use('/reply', reply)

router.use('/category', category)

router.use(common)

module.exports = router
