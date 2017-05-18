var express = require('express')
var router = express.Router()
var userController = require('../../controllers').userController

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.post('/logon', userController.logon)

/* GET users listing. */
router.get('/:id', userController.findById)

module.exports = router
