/**
 * 分页
 * 暂时为假分页
 */


define(['jquery','template'],function($,template){
    var page = function(data,name,id,list,chart,chartId,chartData){
        var length = list.length;
        var page = Math.ceil(length/10);
        var pageList = "<ul class='page'><li><</li>";
        for(var i=0;i<page;i++){
            pageList+="<li>"+(i+1)+"</li>"
        }
        pageList+="<li>></li></ul>";
        $(".jbox-content").append(pageList);
        $("ul.page li:eq(1)").addClass("curPage")
        $(".page").on("click","li",function(){
            var page =Math.ceil(list.length/10);
            var val = $(this).text();
            var curVal;
            var cur = $(".page").find(".curPage");
                curVal = cur.text();
            if(val=="<"){
                if(curVal==1){
                    return;
                }else{
                    cur.prev().addClass("curPage").siblings().removeClass("curPage");
                    data[name]= Array.prototype.slice.call(list,(curVal-2)*10,(curVal-1)*10);

                }
            }else if(val==">"){
                if(curVal==page){
                    return;
                }else{
                    cur.next().addClass("curPage").siblings().removeClass("curPage");
                    data[name]= Array.prototype.slice.call(list,curVal*10+1,(+curVal+1)*10+1);
                }

            }else{
                var page = $(this).text();
                $(this).addClass("curPage").siblings().removeClass("curPage");
                data[name]= Array.prototype.slice.call(list,(page-1)*10,page*10);
            }
            var html = template(id, data);
            $(".jbox-content").find(".page").siblings().remove();
            $(".jbox-content").find(".page").before(html);
            if(chart){

            }
        })
    }

    return {
        'page':page
    }


})