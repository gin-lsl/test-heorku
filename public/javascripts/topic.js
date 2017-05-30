$(function ($) {

    var replyToReplyId
    var $writeReply = $('#write-reply')
    var $replyTopicId = $('#replyTopicIdField')

    $('#btn-commit-comment').on('click', function (event) {
        var $self = $(this)
        if ($('#checkIsLogin').length > 0) {
            // 用户已登录
            var writeReplyContent = $writeReply.val().trim();
            if (writeReplyContent == '') {
                // $(this).data('content', writeReplyContent.data)
                // return $writeReply.focus()
            }
            $('#replyToReplyIdField').val(replyToReplyId)
            var replyTopicForm = $('#replyTopic')
            // replyTopicForm.submit()
            $.post('/reply/post', {
                tid: $replyTopicId.val(),
                content: writeReplyContent,
                reply_to_reply_id: replyToReplyId
            }, function (postReplyResponse) {
                if (postReplyResponse.success) {
                    window.location.reload();
                } else {
                    $self.data('content', postReplyResponse.data).popover('show')
                    setTimeout(function () {
                        $self.data('content', null).popover('hide')
                    }, 2000);
                }
            })
        } else {
            // 用户未登录
            $('#loginModal').modal('toggle')
        }
    })

    $('#submit-topic').click(function () {
        var $postTopicForm = $('#postTopic')
        var $titleField = $postTopicForm.find('#titleField')
        var $contentField = $postTopicForm.find('#contentField')
    })

    $('.comment-up').click(function (evt) {
        evt.preventDefault()
        var $self = $(this)
        if ($('#checkIsLogin').length < 1) {
            return $('#loginModal').modal('toggle')
        }
        // var type = $self.find('.has-up').length
        var type = $self.hasClass('has-up') ? 1 : 0
        var data_reply_id = $(this).parents('section.comments-item').data('id')
        $.get('/reply/up', {
            reply_id: data_reply_id,
            type: type
        }, function (upRes) {
            if (upRes.success) {
                if (type == 0) {
                    $self.addClass('has-up')
                    $self.attr('title', '取消')
                    $self.find('.up-count').text(function (index, text) {
                        return +text + 1
                    })
                } else {
                    $self.removeClass('has-up')
                    $self.attr('title', '点赞')
                    $self.find('.up-count').text(function (index, text) {
                        return +text - 1
                    })
                }
            }
        })
    })

    var $topicAuthorInfo = $('#topic-author-info')

    // var $topicAuthorId = $('#topic-user-id1')
    // var topicAuthorId = JSON.parse($topicAuthorId.data('topic-user-id'))
    // // var
    // // 获取作者信息
    // if ($topicAuthorId.length > 0) {
    //     $.get('/user/only-find/' + topicAuthorId, function (findUserResponse) {
    //         if (findUserResponse.success) {
    //             var _authorInfo = findUserResponse.data
    //             var _temp = '<button id="btn-follow-author" class="btn btn-primary pull-right">关注作者</button ><div><a href="/user/'
    //                 + _authorInfo.id
    //                 + '"><img class="topic-author-avatar" src="'
    //                 + _authorInfo.avatar
    //                 + '"></a><a class="topic-author-name" href="/user/'
    //                 + _authorInfo.id
    //                 + '"><strong>'
    //                 + _authorInfo.name
    //                 + '</strong></a><p class="m-0">经验值:'
    //                 + _authorInfo.lv
    //                 + '</p></div>'

    //             $topicAuthorInfo.html(_temp)

    $('#btn-follow-author').click(function () {
        var $btnSelf = $(this)
        var hasFollow = $btnSelf.data('has-follow')
        if ($('#checkIsLogin').length < 1) {
            $('#loginModal').modal('toggle')
            return $('span.some-hint').text('大侠您是谁啊..不登录人家真的认不出来了啦o(*////▽////*)q')
        }
        var sendObj = hasFollow ? null : { wannaFollow: true }
        if ($topicAuthorInfo.length > 0) {
            $.get('/user/follow/' + JSON.parse($topicAuthorInfo.data('topic-user-id')), sendObj, function (followAuthorResponse) {
                if (followAuthorResponse.success) {
                    if (hasFollow) {
                        // 执行的是取消关注的操作
                        $btnSelf.removeClass('btn-default').addClass('btn-info').data('has-follow', Boolean(false)).text('关注作者')
                    } else {
                        // 执行的是关注的操作
                        $btnSelf.removeClass('btn-info').addClass('btn-default').data('has-follow', Boolean(true)).text('取消关注')
                    }
                } else {
                    // 关注失败, 根据 type 属性说明失败原因
                    switch (followAuthorResponse.type) {
                        case 0:
                            // 没有登录
                            $('#loginModal').modal('show')
                            $('span.some-hint').text(followAuthorResponse.data)
                            break
                        case 1:
                        // 不能关注自己
                        // break
                        case 2:
                        // 内部错误
                        // break
                        case 3:
                        // 没有找到要关注的用户的信息, id错误
                        // break
                        case 4:
                            // 已经关注过TA了
                            console.log(followAuthorResponse)
                            alert(followAuthorResponse.data)
                            break
                        default:
                            // 未知错误
                            alert('鬼知道发生了什么, 程序员今天没鸡腿了! /(ㄒoㄒ)/~~')
                            break
                    }
                }
            })
        }
    })
    //         }
    //     })
    // }

    $('.comment-reply-btn').click(function () {
        var $forSection = $(this).parents('section')
        var replyInfo = $forSection.data('reply-info')
        var username = $forSection.find('.comment-top a').text()
        replyToReplyId = replyInfo._id
        // .reply-to-user
        $('#reply-to-user-name').text(username)
        $('.reply-to-user-ready').addClass('reply-to-user')
    })

    $('#reply-to-user-close').click(function () {
        $(this).parents('.reply-to-user-ready').removeClass('reply-to-user')
        replyToReplyId = null
    })

    // 标识回复给别人的回复
    var $replyTos = $('.reply-to')
    var $replies_sectionList = $('section')
    var replyList = []
    $replies_sectionList.each(function (_index, _ele) {
        replyList.push($(_ele).data('reply-info'))
    })
    $replyTos.each(function (_index, _ele) {
        var reply_to_id = JSON.parse($(_ele).data('reply-to-id'))
        var foundReplyIndex = replyList.findIndex(function (ele) {
            return ele._id == reply_to_id
        })
        if (foundReplyIndex >= 0) {
            var _username = $($replies_sectionList[foundReplyIndex]).find('.comment-top a').text()
            var $_ele = $(_ele)
            var popDiv = '<div class="pop-reply-info"><p>@' + _username + ' 说：</p><p>' + replyList[foundReplyIndex].content + '</p></div>'
            $_ele.html('<div class="show-pop"><span>回复给：</span><a class="reply-name-pop-comment-content" href="/user/'
                + replyList[foundReplyIndex].userId
                + '">@'
                + $_ele.text()
                + _username
                + '</a>' + popDiv + '<span class="hint-lightgrey" role="button"> 点击显示对话内容</span></div>')
        }
    })

    // $('.show-pop')
    //     .mouseover(function (evt) {
    //         // 控制显示回复信息的div位置，此div为fixed定位
    //         $(this).find('.pop-reply-info').addClass('pop').offset({ top: evt.pageY, left: evt.pageX + 5 })
    //     })
    //     .mouseout(function () {
    //         $(this).find('.pop-reply-info').removeClass('pop')
    //     })

    $('.hint-lightgrey').click(function () {
        $(this).prev('.pop-reply-info').toggleClass('pop')
    })


    var $fileField = $('#fileField')
    var $previewCoverCanvas = $('#preview-cover-canvas')

    $fileField.change(function (evt) {
        var reader = new FileReader()
        var $previewCover = $('#preview-cover')
        reader.onload = function (_e) {
            $('.text-click-choose-img').css('display', 'none')
            $previewCover.attr('src', _e.target.result)
            // $previewCover.css('background-image', 'url(' + _e.target.result + ')')
            // var ctx = $previewCoverCanvas[0].getContext('2d')
            // ctx.drawImage(evt.target.files[0], 0, 0)

        }
        reader.readAsDataURL(evt.target.files[0])
    })

    // 点击弹出文件选择框    
    $('.open-select-file').click(function () {
        $fileField.click()
    })

    // 标签字段    
    var $tagsField = $('#tagsField')
    // 标签列表
    var $previewTags = $('.preview-tags')
    // 最大标签数
    var tagCount = 5
    // 标签内容，防止添加重复标签
    var tagList = []

    // 添加 tag
    function addTag() {
        var _tagsFieldVal = $tagsField.val().trim()
        var _tagListLength = tagList.length >>> 0
        // if (tagCount <= 0 || _tagsFieldVal == '') {
        //     return
        // }
        if (_tagsFieldVal == '' || _tagListLength >= 5) {
            return
        }
        if (tagList.find(function (_ele) {
            return _ele === _tagsFieldVal
        })) {
            $tagsField.val('')
            return
        }
        tagList.push(_tagsFieldVal)
        $previewTags.append('<span class="preview-tag"><span class="preview-tag-text">' + _tagsFieldVal + '</span><span class="preview-tag-close" role="button">&times;</span><input type="hidden" name="tag" value="' + _tagsFieldVal + '"></span>')
        // tagCount--
        // if (tagCount == 0) {
        //     $tagsField.attr('disabled', true)
        // }
        if (tagList.length >= 5) {
            $tagsField.attr('disabled', true)
        }
        $tagsField.attr('placeholder', '还能添加' + (tagCount - tagList.length >>> 0) + '个标签').val('')
    }

    // 防止表单字段回车提交表单
    $('.form-control').keydown(function (_evt) {
        if (_evt.which === 13) {
            return false
        }
    })

    // 回车添加 tag, 调用 addTag() 方法
    $tagsField.keyup(function (_evt) {
        _evt.preventDefault()
        if (_evt.which === 13) {
            addTag()
        }
    })
    // 点击输入框组右侧按钮添加tag
    $('.add-tag').click(function () {
        addTag()
    })

    /*< ul class="ul" >
            <ul>
                <button class="btn">添加一个li</button>*/

    // $('.btn').click(function () {
    //     $ul.append('<li>我是li</li>')
    // })

    // var $ul = $('.ul')
    // $ul.on('click', 'li', function () {
    //     console.log('点击li')
    // })

    // 删除此条tag，不会被提交，并且从所有标签列表中删除此标签
    $('.preview-tags').on('click', '.preview-tag-close', function (_evt) {
        _evt.preventDefault()
        var $self = $(this)
        var _previewTagText = $self.prev('.preview-tag-text').text()
        var foundIndex = tagList.findIndex(function (_ele) {
            return _ele == _previewTagText
        })
        tagList.splice(foundIndex, 1)
        $self.parents('.preview-tag').remove()
        // tagCount++
        $tagsField.attr('disabled', false).attr('placeholder', '还能添加' + (tagCount - tagList.length >>> 0) + '个标签')
    })

    // 收藏
    $collectTopic = $('#collect-topic')
    $collectTopic.click(function () {
        console.log('点击收藏')
        var hasCollect = $(this).data('has-collect')
        console.log('是否已经收藏此帖子: ' + hasCollect)
        $.get('/topic/collect/' + JSON.parse($topicAuthorInfo.data('topic-user-id')), function (updateCollectRes) {
            console.log('收藏topic返回数据: %O', updateCollectRes)
        })
    })

})
