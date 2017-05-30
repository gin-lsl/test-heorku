const router = require('express').Router()
const categoryController = require('../../controllers').categoryController
const debug = require('debug')('my-app:routes:ins:category')

router.get('/all', categoryController.findAllCategory)

module.exports = router
