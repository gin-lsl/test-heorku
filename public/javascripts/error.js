$(function ($) {
    var $timeLonger = $('.time-longer')
    var $cancel = $('#cancel')
    var timeLongerValue = 5
    var stop = false

    $timeLonger.text(timeLongerValue)

    $cancel.click(function () {
        stop = true
    })

    function timeChange() {
        if (stop) {
            return
        }
        setTimeout(function() {
            timeLongerValue--
            $timeLonger.text(timeLongerValue)
            if (timeLongerValue > 1) {
                timeChange()
            } else {
                location.href = '/'
            }
        }, 1000);
    }

    timeChange()
})
