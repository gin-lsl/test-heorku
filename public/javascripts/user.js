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

    $('.profile-heading-avatar').click(function () {
        var $avatarSelf = $(this)
        var $updateAvatarFiled = $('#updateAvatarField')
        $updateAvatarFiled.change(function (_evt) {
            var reader = new FileReader()
            reader.onload = function (_evtLoad) {
                // console.log(_evtLoad.target.result)
                $avatarSelf.attr('src', _evtLoad.target.result)
                // $(document.body).append('<form id="form_jfewo432fjew" class="hidden" method= "post" enctype= "multipart/form-data" ><input type="file" name="newavatar" value="' + $updateAvatarFiled.val() + '"></form >')
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
        }).click()
    })

    // 修改用户的 say 属性    
    var $profileDesc = $('.profile-desc')
    var $profileDescEdit = $profileDesc.next()
    var $btnCommitUpdateSay = $('#btn-commit-update-say')
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

    // $('#dragDiv').on('dragover', function (_evt) {
    //     _evt.preventDefault()
    //     console.log('dragover')
    // }).on('dragenter', function (_evt) {
    //     _evt.preventDefault()
    //     console.log('dragenter')
    // }).on('drop', function (_evt) {
    //     _evt.preventDefault()
    //     console.log('drop')
    //     console.log(_evt)
    //     console.log(_evt.getData())
    // })
    var $dragDiv = $('#dragDiv')
    var d = $dragDiv[0]
    d.addEventListener('dragover', function (_e) {
        _e.preventDefault()
    })
    d.addEventListener('dragenter', function (_e) {
        _e.preventDefault()
    })
    d.addEventListener('drop', function (_e) {
        _e.preventDefault()
        // console.log(_e.dataTransfer.getData('image/*'))
        // _e.dataTransfer.files[0]
        console.log(_e.dataTransfer.files)
        // $dragDiv.append('<img src="' + _e.dataTransfer.files[0] + '" width="200" height="200">')
        var data = new FormData()
        data.append('newavatar', _e.dataTransfer.files[0])
        // $.post('/user/update/avatar', data, function (_res) {
        //     console.log(_res)
        // })
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function (response) {
            if (xhr.status == 200 && xhr.readyState == 4) {
                console.log('呵呵')
            }
        }
        xhr.open('post', '/user/update/avatar', true)
        xhr.send(data)
    })

})
