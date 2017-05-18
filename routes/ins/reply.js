const router = require('express').Router();
const replyController = require('../../controllers').replyController;

router.post('/post', replyController.save);

router.get('/up', replyController.up);

module.exports = router;