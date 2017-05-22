const router = require('express').Router()
const replyController = require('../../controllers').replyController

router.post('/post', replyController.saveAjax)

router.get('/up', replyController.up)

module.exports = router
