$(function ($) {
    var $nav_li = $('.nav.navbar-nav li')
    var pathname = window.location.pathname;
    if (pathname == '/topic/list') {
        $nav_li[0].classList.add('active');
    } else if (pathname.startsWith('/topic/')) {
        console.log('某个帖子');
    } else if (pathname == '/login') {
        $nav_li[1].classList.add('active');
    } else {
        console.log('没有匹配');
    }
})