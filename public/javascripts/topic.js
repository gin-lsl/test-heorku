$(function ($) {
    $('#btn-commit-comment').on('click', function (event) {
        if ($('#checkIsLogin').length) {
            // 用户已登录
            console.log('用户已登录')
            var replyTopicForm = $('#replyTopic')
            replyTopicForm.submit()
            console.log(replyTopicForm)
        } else {
            // 用户未登录
            console.log('用户未登录')
            $('#loginModal').modal('toggle')
        }
    })

    $('#submit-topic').click(function () {
        console.log('呵呵')
        var $postTopicForm = $('#postTopic')
        var $titleField = $postTopicForm.find('#titleField')
        var $contentField = $postTopicForm.find('#contentField')
        console.log($titleField.val())
        console.log($contentField.val())
    })

    $('.comment-up-text').click(function () {
        var $self = $(this)
        var data_reply_id = $(this).parents('section.comments-item').data('id')
        $.get('/reply/up', {
            reply_id: data_reply_id,
        }, function (upRes) {
            if (upRes.success) {
                $self.addClass('has-up')
            }
        })
    })

})
