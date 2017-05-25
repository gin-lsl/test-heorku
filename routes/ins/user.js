const express = require('express')
const router = express.Router()
const userController = require('../../controllers').userController
const fileUpload = require('../../middlewaves').FileUpload
const checkUserLogin = require('../../middlewaves').checkUserLogin

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.post('/logon', userController.logon)

// 所有 /update/* 操作都需要验证是否登录
router.use('/update', checkUserLogin)

router.get('/update/avatar/reset', userController.findByIdAndResetAvatarToDefault)

router.post('/update/avatar', fileUpload.single('newavatar'), userController.findByIdAndUpdateAvatar)

router.post('/update/name', userController.findByIdAndUpdateName)

router.post('/update/say', userController.findIdAndUpdateSay)

router.get('/replies/:id', userController.findAllReplies)

router.get('/topics/:id', userController.findAllTopics)

router.get('/only-find/:id', userController.findOneByIdAndNothingToDo)

/* 关注或者取消关注 */
router.get('/follow/:id', userController.followUser)

/* GET users listing. */
router.get('/:id', userController.findByIdAndUpdateVisitInfomation)

module.exports = router
