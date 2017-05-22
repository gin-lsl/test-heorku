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
                _temp += '<a href="/reply/' + _reply._id + '" class="list-group-item">' + _reply.content + '</a>'
            })
            console.log(_temp)
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
            console.log(topicsHTML)
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
                console.log('请求来访用户信息成功')
                $recentVisitList.append('<a href="/user/' + _userInfoResponse.data.id + '"><img class="avatar-32 m-5" src="' + _userInfoResponse.data.avatar + '" title="' + _userInfoResponse.data.name + '"></a>')
            } else {
                console.log('请求来访用户信息失败')
            }
        })
    })
    console.log(recentUserIdList)

})
