/**
 * 分页
 * 暂时为假分页
 * @param data : 传到模板里的数据
 * @param tempId : 模板ID
 * @param place : html需要替换的内容的容器
 */


define(['jquery','template'],function($,template){


    var page = function(data,tempId,place){
        var _data={};
        var length =Math.ceil( data.length/10);
        var pageList = [];
        pageList.push("<li><</li>");
        for(var i=0;i<length;i++){
            pageList.push("<li>"+(i+1)+"</li>");
        }
        pageList.push("<li>></li>");
        $(".page").append(pageList.join(""));
        $(".page li:eq(1)").addClass("curPage");
        _data.data= Array.prototype.slice.call(data,0,10);
        var html = template(tempId, _data);
        $(place).html(html)
        $(".page").on("click","li",function(){
            var page =Math.ceil(data.length/10);
            var val = $(this).text();
            var curVal;
            var cur = $(".page").find(".curPage");
            curVal = cur.text();
            if(val=="<"){
                if(curVal==1){
                    return;
                }else{
                    cur.prev().addClass("curPage").siblings().removeClass("curPage");
                    _data.data= Array.prototype.slice.call(data,(curVal-2)*10,(curVal-1)*10);

                }
            }else if(val==">"){
                if(curVal==page){
                    return;
                }else{
                    cur.next().addClass("curPage").siblings().removeClass("curPage");
                    _data.data= Array.prototype.slice.call(data,curVal*10,(+curVal+1)*10);
                }

            }else{
                var page = $(this).text();
                $(this).addClass("curPage").siblings().removeClass("curPage");
                _data.data= Array.prototype.slice.call(data,(page-1)*10,page*10);
            }
            var html = template(tempId, _data);
            $(place).html(html)

        })
    }

    return {
        'page':page
    }


})