$(function ($) {
    var $profileBodyTopicsOrReplies = $('.profile-body-topics-or-replies')
    var $recentInfo = $profileBodyTopicsOrReplies.find('.recent-info')
    var topicsHTML = ''
    var repliesHTML = ''
    // .profile-body-topics-or-replies
    let userid = $('#user-id').data('user-id')
    $.get('/user/replies/' + userid, function (repliesResponse) {
        if (repliesResponse.success) {
            var replies = repliesResponse.data
            var _temp = ''
            replies.forEach(function (_reply) {
                _temp += '<a href="/topic/' + _reply.topicId + '" class="list-group-item">' + _reply.content + '</a>'
            })
            repliesHTML = '<div class="list-group">' + _temp + '</div>'
            $recentInfo.html(repliesHTML)
        }
    })
    $.get('/user/topics/' + userid, function (topicsResponse) {
        if (topicsResponse.success) {
            var topics = topicsResponse.data;
            var _temp = ''
            topics.forEach(function (_topic) {
                _temp += '<a href="/topic/' + _topic._id + '" class="list-group-item">' + _topic.title + '</a>'
            })
            topicsHTML = '<div class="list-group">' + _temp + '</div>'
        }
    })

    var $btnShowTopics = $('#btn-show-topics')
    var $btnShowReplies = $('#btn-show-replies')

    $btnShowTopics.click(function () {
        $recentInfo.html(topicsHTML)
        $btnShowReplies.removeClass('active')
        $(this).addClass('active')
    })

    $btnShowReplies.click(function () {
        $recentInfo.html(repliesHTML)
        $btnShowTopics.removeClass('active')
        $(this).addClass('active')
    })

    // $('#recent-visit').find('a').each(function () {
    //     var $self = $(this);
    //     var _userId = $self.data('user-id')
    //     $self.attr('href', '/user/' + $self.data('user-id'))
    //     $.get('/user/only-find/' + _userId, function (userInfoReponse) {
    //         if (userInfoReponse.success) {
    //             console.log('请求用户数据成功了')
    //             $self.append('<img class="avatar-32" src="' + userInfoReponse.data.avatar + '">')
    //         } else {
    //             console.log('请求用户数据失败了')
    //         }
    //     })
    // })
    var $recentVisit = $('#recent-visit')
    var recentUserIdList = $recentVisit.data('recent-user-id-list')
    var $recentVisitList = $('#recent-visit-list')

    // 查询的是曾经访问过此用户的人的信息
    recentUserIdList.forEach(function (_ele_user_id) {
        $.get('/user/only-find/' + _ele_user_id, function (_userInfoResponse) {
            if (_userInfoResponse.success) {
                $recentVisitList.append('<a href="/user/' + _userInfoResponse.data.id + '"><img class="avatar-32 m-5" src="' + _userInfoResponse.data.avatar + '" title="' + _userInfoResponse.data.name + '"></a>')
            }
        })
    })

    var $updateAvatarFiled = $('#updateAvatarField')
    var $profileHeadingAvatar = $('.profile-heading-avatar')
    $('.profile-heading-avatar-warp')
        .on('dragenter dragover', function (_evtProfileHeadingAvatarWarpDragenterAndDragover) {
            _evtProfileHeadingAvatarWarpDragenterAndDragover.preventDefault()
        })
        .on('drop', function (_evtProfileHeadingAvatarWarpDrop) {
            _evtProfileHeadingAvatarWarpDrop.preventDefault()
            var formData = new FormData()
            var xhr = new XMLHttpRequest()
            // TODO: 这里直接使用的是原生的 XMLHttpRequest 对象
            // 如果可以的话，为了统一可以尝试改为JQuery库的方式
            formData.append('newavatar', _evtProfileHeadingAvatarWarpDrop.originalEvent.dataTransfer.files[0])
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var responseJSON = JSON.parse(xhr.response)
                    if (responseJSON && responseJSON.success) {
                        // 更新头像地址
                        $profileHeadingAvatar.attr('src', responseJSON.data)
                    }
                }
            }
            xhr.open('POST', '/user/update/avatar', true)
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.send(formData)
        })
        .click(function (_evtProfileHeadingAvatarWarpClick) {
            // _evtProfileHeadingAvatarWarpClick.preventDefault()
            var $avatarSelf = $(this)
            console.log('here')
            $updateAvatarFiled
                .change(function (_evt) {
                    var reader = new FileReader()
                    reader.onload = function (_evtLoad) {
                        // console.log(_evtLoad.target.result)
                        $avatarSelf.attr('src', _evtLoad.target.result)
                        // $(document.body).append('<form id="form_jfewo432fjew" class="hidden"
                        // method = "post" enctype= "multipart/form-data" > <input type="file"
                        // name = "newavatar" value= "' + $updateAvatarFiled.val() + '" ></form > ')
                        // $.post('/topic/test', { newavatar: _evt.target.result }, function (updateAvatarRes) {
                        // })
                        var $formJOSIDJFE = $('#form_jfewo432fjew')
                        var $updateAvatarForm = document.getElementById('updateAvatarForm')
                        var formDate = new FormData($formJOSIDJFE)
                        $updateAvatarForm.submit()
                        // $.ajax({
                        //     type: 'POST',
                        //     url: '/topic/test',
                        //     data: formDate,
                        //     contentType: false,
                        //     processData: false
                        // })
                        //     .then(function () {
                        //         console.log('done')
                        //     }, function () {
                        //         console.log('error')
                        //     })
                        // $.post('/topic/test', formDate, function (updateAvatarRes) {
                        //     console.log(updateAvatarRes)
                        // })

                    }
                    reader.readAsDataURL(_evt.target.files[0])
                })
                .click(function (_evtUpdateAvatarFieldClick) {
                    // 组织事件冒泡，否则会抛出栈溢出异常
                    _evtUpdateAvatarFieldClick.stopPropagation()
                })
                .click()
        })

    // 修改用户的 say 属性    
    var $profileDesc = $('.profile-desc')
    var $profileDescEdit = $profileDesc.next()
    var $btnCommitUpdateSay = $('#btn-commit-update-say')
    var $btnCancelUpdateSay = $('#btn-cancel-update-say')
    $('.profile-heading-desc-heading-title-edit').click(function () {
        console.log('点击编辑言论')
        $profileDesc.toggleClass('hidden')
        $profileDescEdit.toggleClass('hidden')
        $btnCommitUpdateSay.one('click', function () {
            $.post('/user/update/say', {
                say: $('#sayField').val()
            }, function (updateSayResponse) {
                if (updateSayResponse && updateSayResponse.success) {
                    console.log(updateSayResponse)
                    $profileDesc.text(updateSayResponse.data)
                }
                $profileDesc.toggleClass('hidden')
                $profileDescEdit.toggleClass('hidden')
            })
        })
    })
    $btnCancelUpdateSay.click(function () {
        $profileDesc.removeClass('hidden')
        $profileDescEdit.addClass('hidden')
    })

    // 重置头像为默认头像    
    $('#reset-to-default-avatar').click(function (_evtResetAvatarClick) {
        _evtResetAvatarClick.stopPropagation()
        $.get('/user/update/avatar/reset', function (updateAvatarResetRes) {
            if (updateAvatarResetRes && updateAvatarResetRes.success) {
                // 更新成功
                $profileHeadingAvatar.attr('src', updateAvatarResetRes.data)
            }
        })
    })
})
