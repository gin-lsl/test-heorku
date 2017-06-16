$(function ($) {

    // 添加对Array.prototype.find() 方法的支持    
    if (!Array.prototype.find) {
        /**
         * @param {function(any)} predicate
         */
        Array.prototype.find = function (predicate) {
            'use strict'
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined')
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function')
            }
            var list = Object(this)
            var length = list.length >>> 0
            var thisArg = arguments[1]
            var value

            for (var i = 0; i < length; i++) {
                value = list[i]
                if (predicate.call(thisArg, value, i, list)) {
                    return value
                }
            }
            return undefined
        }
    }

    // 添加对Array.prototype.findIndex() 方法的支持    
    if (!Array.prototype.findIndex) {
        /**
         * @param {function(any)} predicate
         */
        Array.prototype.findIndex = function (predicate) {
            'use strict'
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined')
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function')
            }
            var list = Object(this)
            var length = list.length >>> 0
            var thisArg = arguments[1]
            var value

            for (var i = 0; i < length; i++) {
                value = list[i]
                if (predicate.call(thisArg, value, i, list)) {
                    return i
                }
            }
            return -1
        }
    }

    $.getUrlParam = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&*)(&|$)')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) {
            return unescape(r[2])
        }
        return null
    }

    // 初始化变量    
    var $logonForm = $('#logon-form')
    var $logonError = $logonForm.find('#logonError')
    var $logonEmailField = $logonForm.find('#logonEmailField')
    var $logonEmailError = $logonForm.find('#logonEmailError')
    var $logonPasswordField = $logonForm.find('#logonPasswordField')
    var $logonPasswordError = $logonForm.find('#logonPasswordError')
    var $logonPasswordRepeatField = $logonForm.find('#logonPasswordRepeatField')
    var $logonPasswordRepeatError = $logonForm.find('#logonPasswordRepeatError')

    var $loginForm = $('#login-form')
    var $loginError = $loginForm.find('#loginError')
    var $loginEmailField = $loginForm.find('#loginEmailField')
    var $loginEmailError = $loginForm.find('#loginEmailError')
    var $loginPasswordField = $loginForm.find('#loginPasswordField')
    var $loginPasswordError = $loginForm.find('#loginPasswordError')

    var regexEmail = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/

    var regexPureNumber = /^[0-9]+$/


    // $.justToFreezeWidth = function (rootSvg) {
    //     var windowWidth = $(window).width()

    //     var viewBoxVal = rootSvg.getAttribute('viewBox')
    //     var viewBoxWidth = viewBoxVal.split(',')[2]
    //     var viewBoxHeight = viewBoxVal.split(',')[3]
    //     rootSvg.removeAttribute('width')
    //     rootSvg.removeAttribute('height')

    //     var setWidth = windowWidth
    //     var setHeight = (setWidth * viewBoxHeight) / viewBoxWidth
    //     rootSvg.setAttribute('width', setWidth)
    //     rootSvg.setAttribute('height', setHeight)
    // }

    /**
     * 当登录的时候调用, ajax方式的登录, 页面不重新加载, 所以使用这个方法更新页面内容
     *
     * @param {any} userInfo 
     */
    function hasUserLogin(userInfo) {
        $('#top-nav-bar').html(
            '<li><a href="/user/' + userInfo.id + '">' + userInfo.name + '</a></li>' +
            '<li><a href="/user/logout">注销</a></li>' +
            '<li><a href="/post">发布</a></li>'
        )
        $('#loginModal').modal('hide')
        // $(document.body).append($('<span id="checkIsLogin" hidden></span>'))
        window.location.reload()
    }

    /**
     * 当用户注销的时候, 用这个方法更新页面内容
     */
    function hasUserLogout() {
        $('#top-nav-bar').html(
            '<li><a>登录/注册</a></li>'
        )
        // $('#checkIsLogin').remove();
        window.location.reload()
    }


    /**
     * 将 注册 表单 的某些字段错误信息重置为空
     *
     * @param {Boolean} email 邮箱
     * @param {Boolean} password 密码
     * @param {Boolean} password_repeat 重复密码
     */
    function resetLogonErrorEmpty(email, password, password_repeat) {
        if (email === undefined && password === undefined && password_repeat === undefined) {
            $logonEmailError.text('')
            $logonPasswordError.text('')
            $logonPasswordRepeatError.text('')
            $logonError.text('')
        }
        if (email) {
            $logonEmailError.text('')
        }
        if (password) {
            $logonPasswordError.text('')
        }
        if (password_repeat) {
            $logonPasswordRepeatError.text('')
        }
    }

    function handleLogin() {
        $.post('/user/login', $('#login-form').serialize(), function (loginRet) {
            if (loginRet.success) {
                hasUserLogin(loginRet.data)
                $('.error').text('')
            } else {
                $('#loginError').text(loginRet.error)
            }
        })
    }

    // $(function ($) {
    /**
     * 打开登录面板
     */
    $('#go-log-in-on').click(function () {
        $('#loginModal').modal('toggle')
    })

    $('#btn-login').click(function () {
        handleLogin()
    })

    $('#btn-logon').click(function () {
        var _logonEmailValue = $logonEmailField.val()
        var _logonPasswordValue = $logonPasswordField.val()
        var _logonPasswordRepeatValue = $logonPasswordRepeatField.val()

        // 检查邮箱
        if (!_logonEmailValue || _logonEmailValue === '') {
            $logonEmailError.text('邮箱不能为空')
            return
        }
        if (!regexEmail.test(_logonEmailValue)) {
            $logonEmailError.text('邮箱格式不正确')
            return // 最快速结束方法, 下面一样
        }
        $logonEmailError.text('')

        // 检查密码
        if (!_logonPasswordValue || _logonPasswordValue === '') {
            $logonPasswordError.text('密码不能为空')
            return
        }
        if (_logonPasswordValue.length < 6) {
            $logonPasswordError.text('密码长度不能小于6位')
            return
        }
        if (regexPureNumber.test(_logonPasswordValue)) {
            $logonPasswordError.text('密码不能为纯数字')
            return
        }
        $logonPasswordError.text('')

        // 检查重复密码
        if (_logonPasswordValue !== _logonPasswordRepeatValue) {
            $logonPasswordRepeatError.text('两次输入的密码不一样')
            return
        }
        $logonPasswordRepeatError.text('')

        // 发送注册请求        
        $.post('/user/logon', {
            email: _logonEmailValue,
            password: _logonPasswordValue,
            password_repeat: _logonPasswordRepeatValue,
        }, function (logonResponse) {
            if (logonResponse.success) {
                // 注冊成功
                resetLogonErrorEmpty()
                // alert(logonResponse.data.msg)
                // window.location.reload()
                window.location.href = '/logon_result'
            } else {
                var _ = logonResponse.data
                switch (_.type) {
                    case 1:
                        $logonEmailError.text(_.msg)
                        break
                    case 2:
                        resetLogonErrorEmpty(true)
                        $logonPasswordError.text(_.msg)
                        break
                    case 3:
                        resetLogonErrorEmpty(true, true)
                        $logonPasswordRepeatError.text(_.msg)
                        break
                    default:
                        $logonError.text('发生未知错误!')
                        resetLogonErrorEmpty(true, true, true)
                        break
                }
            }
        })
    })

    // 加载图片，替换默认的图片
    $('.avatar').each(function () {
        var $self = $(this)
        var selfDataSrc = $self.data('src')
        if (selfDataSrc && selfDataSrc != '') {
            $self.attr('src', selfDataSrc)
        }
    })

    // 加载分类    
    var $showCategories = $('#show-categories')
    var $categoryList = $('#category-list')
    $showCategories.hover(function () {
        $categoryList.toggleClass('hidden')
    })
    $.get('/category/all', function (findCategoryAllRes) {
        if (findCategoryAllRes && findCategoryAllRes.success) {
            var _data = findCategoryAllRes.data
            var _tempHTML = ''
            if (Array.isArray(_data)) {
                $.each(_data, function (_index, _ele) {
                    _tempHTML += '<li data-id="' + _ele._id + '">' + _ele.name + '</li>'
                })
                $categoryList.append(_tempHTML)
                var _cid = window.localStorage.getItem('categoryId')
                var _categoryObj = _data.find(function (_ele) {
                    return _ele._id == _cid
                })
                _categoryObj = _categoryObj ? _categoryObj.name : '全部'
                $('.breadcrumb .active').text(_categoryObj)
            }
        }
    })
    $categoryList.on('click', 'li', function (_evtCategoryClick) {
        console.log('点击了分类')
        var _categoryId = $(this).data('id')
        console.log('categoryId: ' + _categoryId)
        localStorage.setItem('categoryId', _categoryId)
        if (_categoryId === undefined) {
            window.location.href = '/'
        } else {
            window.location.href = '/?categoryId=' + _categoryId
        }
    })

    // 分页    
    var _paginationLis = ''
    var $pagination = $('.pagination')
    var $prevA = $pagination.find('a.prev')
    var $nextA = $pagination.find('a.next')
    var _matchSearchs = window.location.search.match(/([a-zA-Z]+)=(\d+)/g)
    var searchObj = {}
    if (_matchSearchs != null) {
        for (var _i = 0; _i < _matchSearchs.length; _i++) {
            var _ele = _matchSearchs[_i].split('=')
            searchObj[_ele[0]] = _ele[1]
        }
    }
    var ___url = '?'
    if (searchObj.categoryId) {
        ___url += 'categoryId=' + searchObj.categoryId + '&page='
    } else {
        ___url += 'page='
    }
    $.get('/topic/count', searchObj.categoryId ? { categoryId: searchObj.categoryId } : null, function (_topicCountRes) {
        var _pageCount = Math.ceil((_topicCountRes.data || 0) / 10)
        var _currentPageValue = searchObj.page || 1
        if (_currentPageValue != null && (+_currentPageValue) > 1) {
            $prevA.attr('href', ___url + ((+_currentPageValue) - 1))
        }
        if (_currentPageValue != null && (+_currentPageValue) < _pageCount) {
            $nextA.attr('href', ___url + ((+_currentPageValue) + 1))
        }
        for (var _i = 0; _i < _pageCount; _i++) {
            _paginationLis += '<li class="' + ((_currentPageValue == _i + 1) ? 'active' : '') + '"><a href="' + ___url + (_i + 1) + '">' + (_i + 1) + '</a></li>'
        }
        $pagination.children('.prev').after(_paginationLis)
    })

    $.hasUserLogin = hasUserLogin
    $.hasUserLogout = hasUserLogout
    $.openLoginPane = function () {
        $('#loginModal').modal('toggle')
    }
})
