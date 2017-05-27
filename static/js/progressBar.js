/**
 * 进度条
 * @param obj
 * @param percent
 */

define(['jquery'],function($){
    var generate = function(obj,percent) {
        setTimeout(function () {
                $(obj).find(".progressBarBar").css("width", percent)
        }, 200);
    };

    return{
        'generate':generate
    }

})
