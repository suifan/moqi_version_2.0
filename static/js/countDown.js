/**
 * 倒计时
 *
 */

define(['jquery'],function($){

    function countDown(date) {
        var target = new Date(date);
        setInterval(function(){
            var now = new Date();
            var time = target.getTime()-now.getTime();
            var day = Math.floor(time/(24*3600000));
            var leave = time%(24*3600000);
            var hour = Math.floor(leave/3600000);
            var leave2= leave%3600000;
            var minute = Math.floor(leave2/60000);
            var leave3 = leave2%60000;
            var second = Math.floor(leave3/1000);
            $("#countDownDiv .day").text(day);
            $("#countDownDiv .hour").text(hour);
            $("#countDownDiv .minute").text(minute)
            $("#countDownDiv .second").text(second)

        },1000)

    }
return {
    'countDown':countDown
}


});