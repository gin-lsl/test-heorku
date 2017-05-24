const express = require('express')
const router = express.Router()
const userController = require('../../controllers').userController
const fileUpload = require('../../middlewaves').FileUpload
const checkUserLogin = require('../../middlewaves').checkUserLogin

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.post('/logon', userController.logon)

router.post('/update-avatar', checkUserLogin, fileUpload.single('newavatar'), userController.findByIdAndUpdateAvatar)

router.get('/replies/:id', userController.findAllReplies)

router.get('/topics/:id', userController.findAllTopics)

router.get('/only-find/:id', userController.findOneByIdAndNothingToDo)

/* 关注或者取消关注 */
router.get('/follow/:id', userController.followUser)

/* GET users listing. */
router.get('/:id', userController.findByIdAndUpdateVisitInfomation)

module.exports = router
