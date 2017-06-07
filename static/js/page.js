/**
 * 分页
 * 暂时为假分页
 * @param data : 传到模板里的数据
 * @param tempId : 模板ID
 * @param place : html需要替换的内容的容器
 * @param num : 每页显示的条数
 */


define(['jquery','template'],function($,template){
    var page = function(data,tempId,place,num){
        var _data={};
        if(!data)return;
        var length =Math.ceil(data.length/num);
        if(length<=1){
            _data.data= data
            var html = template(tempId, _data);
            $(place).html(html);
            return;
        }
        var pageList = [];
        pageList.push("<li><</li>");
        for(var i=0;i<length;i++){
            pageList.push("<li>"+(i+1)+"</li>");
        }
        pageList.push("<li>></li>");
        $(".page").append(pageList.join("")).find("li:eq(1)").addClass("curPage");
        _data.data= Array.prototype.slice.call(data,0,num);
        var html = template(tempId, _data);
        $(place).html(html);
        $(".page").on("click","li",function(){
            var pageNum =Math.ceil(data.length/num);
            var val = $(this).text();
            var curVal;
            var cur = $(".page").find(".curPage");
            curVal = cur.text();
            if(val=="<"){
                if(curVal==1){
                    return;
                }else{
                    cur.prev().addClass("curPage").siblings().removeClass("curPage");
                    _data.data= Array.prototype.slice.call(data,(curVal-2)*num,(curVal-1)*num);

                }
            }else if(val==">"){
                if(curVal==pageNum){
                    return;
                }else{
                    cur.next().addClass("curPage").siblings().removeClass("curPage");
                    _data.data= Array.prototype.slice.call(data,curVal*num,(+curVal+1)*num);
                }

            }else{
                $(this).addClass("curPage").siblings().removeClass("curPage");
                _data.data= Array.prototype.slice.call(data,(val-1)*num,val*num);
            }
            var html = template(tempId, _data);
            $(place).html(html)

        })
    }

    return {
        'page':page
    }


})