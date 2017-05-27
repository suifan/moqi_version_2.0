/**
 * Created by Administrator on 2017/5/17.
 */
require.config({
    baseUrl: "",
    paths: {
        "jquery": "../lib/jquery-2.2.1.min",
        "migrate": "../lib/jquery-migrate-1.2.1",
        "jbox": "../lib/jquery-jbox/2.3/jquery.jBox-2.3.min",
        "template": "../lib/template",
        "chart": "../js/leftChart",
        "charts": "../js/charts"
    },
    shim:{
        'jbox':{
            deps:['jquery']
        },
        'migrate':{
            deps:['jquery']
        }
    }
});

require(['jquery','migrate','template','chart','charts','jbox'], function ($,migrate,template,chart,charts,jBox) {
    // some code here
    //底部轮播图
    function slide(id) {
        var outerBox = $("#" + id);
        var innerBoxArr = outerBox.children().children();
        var leng = innerBoxArr.length;
        outerBox.children().animate({left: 0}, "fast")
        if (leng < 3)return;
        var i = 1;
        var setLeft = function (arr) {
            var perWidth = innerBoxArr[0].offsetWidth;
            var distance;
            if (i >= leng - 1) {
                i = 0;
                outerBox.children().animate({left: "0px"}, "fast");
            }
            ;
            distance = "-" + perWidth * i + "px";
            outerBox.children().animate({left: distance}, "slow");
            i++;
        }
        window.timeOut = setInterval(setLeft.bind(null, innerBoxArr), 3800);
    }

    $(function () {
        /*       $(".bottom-header ul").on("click","li", function(){
         var activeBool = $(this).hasClass("click-active");
         if(!activeBool){
         $(this).addClass("click-active");
         $(this).siblings("li").removeClass("click-active")
         }
         });
         $("#tab").on("click","div", function(){
         var activeBool = $(this).hasClass("active");
         if(!activeBool){
         $(this).addClass("active");
         $(this).siblings("div").removeClass("active")
         }
         if($(this).hasClass("homepage")){//点击首页按钮
         $("#leftTabs").addClass("hide");
         $("#leftOperation").removeClass("hide");
         }else if($(this).hasClass("poverty")){//点击贫困家庭按钮
         $("#leftTabs").removeClass("hide");
         $("#leftOperation").addClass("hide");
         }
         });
         //左侧 人/户 切换点击事件
         $(".switch-head").on("click","span", function(){
         var activeBool = $(this).hasClass("span-active");
         if(!activeBool){
         $(this).addClass("span-active");
         $(this).siblings("span").removeClass("span-active")
         var text = $(this).text();
         var obj = $(".section-body table thead tr").children();
         if(text == "户"){
         obj.eq(1).text("目标户数");
         obj.eq(2).text("完成户数");
         }else{
         obj.eq(1).text("目标人数");
         obj.eq(2).text("完成人数");
         }
         }

         });
         $(".bottom-head").on("click",function(){
         var $this = $(this).siblings(".bottom-content");
         $this.slideToggle(function(){
         var showBool = $this.is(":visible");
         if(!showBool){
         clearTimeout(timeOut);
         }else{
         slide("slideBox");
         chart.barChart("doctorSign");
         }
         });


         })

         //charts.charts();
         $(".progressBarBar").css({"width":"40%"});//测试进度条动画
         //added by zrq  暂时这么判断
         var bool =$("#poorFamily").length;
         if(bool){
         chart.pieChart("poorFamily","#8ed02b","#1b9aea");
         chart.pieChart("poorPeople","#8ed02b","#1b9aea");
         chart.pieChart("poorRate","#8ed02b","#1b9aea");
         }
         var height = $("header").height();
         var clientHeight = $(window).height();
         var margin = +$("#rightSide").css("margin-top").slice(0,-2);
         var sideHeight= clientHeight-height-margin;
         $("#rightSide,#leftSide").height(sideHeight-2);
         })
         */

        //弹窗部分代码
        $(".per-info").on("click", function () {
            $.jBox('', {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2});
            // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
            //设置弹窗top值
            var box = document.getElementById("jbox");
            var title = document.getElementsByClassName("jbox-title")[0];
            box.style.top = "2.6vw";
            title.style.textAlign ="left";
            var html = template('personalTemp',{});
            document.getElementsByClassName('jbox-content')[0].innerHTML = html;
        })
        //脱贫情况
        $(".tuopin").on("click", function () {
            $.jBox('', {title: "脱贫情况", buttons: {}, border: 0, opacity: 0.2});
            var title = document.getElementsByClassName("jbox-title")[0];
            title.style.width ="96%";
            var html = template('tuopinTemp',{});
            document.getElementsByClassName('jbox-content')[0].innerHTML = html;
            chart.poorChart("poorChart");
            /*var box=document.getElementById("jbox");
             box.style.top = "3vw";*/
        })
        //建档情况
        $(".docCreate").on("click", function () {
            $.jBox('', {title: "建档情况", buttons: {}, border: 0, opacity: 0.2});
            //改变title宽度
            var title = document.getElementsByClassName("jbox-title")[0];
            title.style.width ="96%";
            var html = template('docCreateTemp',{});
            document.getElementsByClassName('jbox-content')[0].innerHTML = html;
            // chart.poorChart("poorChart");
            /*var box=document.getElementById("jbox");
             box.style.top = "3vw";*/
        })
    })
})