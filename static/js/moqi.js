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
        "charts": "../js/charts",
        "progressBar":"../js/progressBar",
        "countDown" : "../js/countDown",
        "page":"../js/page",
        "viewer" :"../lib/viewer"
    },
    shim:{
        'jbox':{
            deps:['jquery']
        },
        'migrate':{
            deps:['jquery']
        },
        'viewer':{
            deps:['jquery'],
            exports:"jQuery.fn.viewer"}

    }
});

require(['jquery','migrate','template','chart','charts','jbox','progressBar','countDown','viewer','page'], function ($,migrate,template,chart,charts,jbox,progressBar,countDown,viewer,jpage){
    //当前所选区域对应的全局变量
    var area = "moqi";
    //图片浏览插件option设置
    $.fn.viewer.setDefaults({navbar:false,title:false});
    //由于贫困家庭与首页共用签约，提取公共部分
    /**
     * 家医签约点击方法，暂时不做保存筛选条件的处理
     */
    function bottomBind() {
        $(".bottom-head").on("click",function(){
            $(".bottom-header ul li").removeClass("click-active").eq(0).addClass("click-active")
            var $this = $(this).siblings(".bottom-content");
            $this.slideToggle(function(){
                // api.getDoctorSign('illnessCasuses');
            });

        });
    }
    var sideResize = function(){
        var height = $("header").height();
        var clientHeight = $(window).height();
        var margin = +$("#rightSide").css("margin-top").slice(0,-2);
        var sideHeight= clientHeight-height-margin;
        $("#rightSide,#leftSide").height(sideHeight-2);
    }

    // 数据加载
    var api = {
        'getHomePage': function(){
            // $("#leftTabs").addClass("hide");
            //右侧--------------------start
            $.getJSON("../js/json/homePage/dutyHost.json",function(data){
                if(data) {
                    $('#rightSide').html(template('homepageRightSideTemp', data[area]));
                    //进度条生成
                    $("#performance").find(".progressBar").each(function(){
                        var percent = $(this).find(".progressRate").text();
                        progressBar.generate($(this),percent);
                    })
                }
                $(".command").viewer();
                $(".management").viewer();
            })

            //右侧--------------------end

            //左侧--------------------start
            //获取首页左侧数据
            $.ajaxSettings.async = false;
            var dataLeft={},targetChart={};
            $.getJSON("../js/json/homePage/basicInfoV2.json",function(res){
                dataLeft['basicInfo']=res.basic_info[area];
            });
            $.getJSON("../js/json/homePage/targetV2.json",function(res){
                targetChart=res.overcome_poverty_aim[area].aim;
            });
            $('#leftSide').html(template('homepageLeftSideTemp',dataLeft));
            var chartData={};
            chartData.color=["#1fa9f4","#0cb871"];
            chartData.yAxisData = [2017,2018,2019];
            var target = [],done = [];
            for(var i=0,length=targetChart.length;i<length;i++){
                done.push(targetChart[i].house_num);
                target.push(targetChart[i].person_num);
            }
            chartData.data=[{name:"完成数量",type:"bar",data:done, barMaxWidth:10},{name:"目标数量",type:"bar",data:target, barMaxWidth:10}]
            charts.xBarChart("targetChart",chartData)

            // $('#leftSide').html(template('homepageLeftSideTemp', data));

            //左侧--------------------end

            //底部--------------------start
            $('.bottom').html(template('povertyStatus', {}));
            // bottomBind();
            //家医签约按钮点击事件
            $(".bottom-head").on("click",function(){
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function(){
                    var showBool = $this.is(":visible");
                    if(!showBool&&window.timeOut){
                        clearTimeout(timeOut);
                    }else{
                        $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                        if($(".bottom-head").hasClass("active")){
                            $(".bottom-head").removeClass("active").find("img").attr("src","../images/up_arrow.png")
                        }else{
                            $(".bottom-head").addClass("active").find("img").attr("src","../images/down_arrow.png")
                        }
                        api.slide("slideBox_r","box-wrapper",1900);
                        api.getPovertyDistribution();
                    }
                });
            });
            //贫困状况切换标题
            $(".bottom-header ul").on("click","li", function(){
                var activeBool = $(this).hasClass("click-active");
                if(!activeBool){
                    $(this).addClass("click-active");
                    $(this).siblings("li").removeClass("click-active");
                    if($(this).hasClass("povertyDistribution")){
                        api.getPovertyDistribution();
                    }else {
                        api.getPovertyCauses();
                    }
                }
            });
            //底部--------------------end
        },
        'getPovertyDistribution':function(){
            chart.barChart("poverty_status",["尼尔基镇","红彦镇","宝山镇","西瓦尔图镇","塔温敖宝镇","腾克镇","巴彦鄂温克民族乡","阿拉尔镇","哈达阳镇","拉杜尔鄂温克民族乡","汉古尔河镇","奎勒河镇","库如奇乡","登特科办事处","额尔和办事处","坤密尔提办事处","卧罗河办事处"],[111,222,333,222,111,111,222,333,444,223,554,323,1234,343,234,778,334]);
        },
        'getPovertyCauses':function(){
            chart.barChart("poverty_status",["因病","因学","因灾","缺土地","缺水","缺技术","缺劳力","缺资金","交通条件落后","自身动力不足"],[111,222,333,222,111,111,222,333,444,223]);
        },
        'getFiveGroup': function(switchFlag){
            $("#leftTabs").addClass("hide");
            // $("#leftOperation").addClass("hide");
            // $("#sevenStepsTab").removeClass("hide");
            //右侧--------------------start
            $.getJSON("../js/json/fiveGroup/fivegroup_right.json",function(res){
                var data = res[area];
                $('#rightSide').html(template('sevenStepsRightSideTemp', data));

                charts.gauge("putOnRecordChart",{value:data.healthPoint,color:'#83ea43',dataValue:data.healthPoint*100});
                charts.gauge("diagnosisChart",{value:data.diagnosisPoint,color:'#fd8320',dataValue:data.diagnosisPoint*100});
                charts.labelPie("healthChart",{color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.healthDetail});
                charts.labelPie("laborChart",{color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.laborDetail});
                charts.gauge("signChart",{value:data.signPoint,color:'#3ad3e1',dataValue:data.signPoint*100});
                charts.gauge("overcomePovertyChart",{value:data.poorPoint,color:'#e14e35',dataValue:data.poorPoint*100});
            });


            //右侧--------------------end

            //左侧--------------------start
            api.getFiveLeft();
            //左侧--------------------end

            //底部--------------------start
            $.getJSON("../js/json/fiveGroup/helpDynamic.json",function(res){
                var data={};
                data.list = res.povertyNews["moqi"];
                $('.bottom').html(template('helpDynamicTemp', data));
            });
            //扶贫动态按钮点击事件
            $(".bottom-head").on("click",function(){
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function(){
                    var showBool = $this.is(":visible");
                    if(!showBool&&window.timeOut){
                        clearTimeout(timeOut);
                    }else{
                        api.slide("slideBox","box-wrapper");
                        // chart.barChart("doctorSign");
                    }
                });
            });
            //底部--------------------end
            //弹窗部分代码

            //建档情况
            $("#openDoc").on("click", function () {
                var $pop = api.openPopWindow("建档情况");
                $.getJSON("../js/json/fiveGroup/recordJbox.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=1;
                        $pop.find('.jbox-content').html(template('docCreateTemp',data));
                        var docData = {color:['#fde101', '#1ff4be', '#c4572e'],total:data.pieChart.rate,center:["50%","50%"],data:data.pieChart.dataList}
                        charts.pieChart('docChart',true,docData);
                    }
                });
            })
            //脱贫情况
            $("#openTuopin").on("click", function () {
                var $pop = api.openPopWindow("脱贫情况");
                $.getJSON("../js/json/fiveGroup/overcomePoverty.json",function(res){
                    if(res){
                        $pop.find('.jbox-content').html(template('tuopinTemp',{}));
                        var townNames=[],andPoor=[],complete=[];
                        res.forEach(function(item){
                            townNames.push(item.townName);
                            andPoor.push(item.andPoor);
                            complete.push(item.completionHouses);
                        })
                        var docData = {townNames:townNames,andPoor:andPoor,complete:complete}
                        chart.poorChart("poorChart",docData);
                    }
                });
            })
            //劳动力情况
            $("#laborCondition").on("click", function () {
                var $pop = api.openPopWindow("劳动力情况");
                $.getJSON("../js/json/fiveGroup/labor.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=1;
                        $pop.find('.jbox-content').html(template('laborTemp',data));
                        var docData = {color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.dataList}
                        charts.labelPie('laborWindowChart',docData)
                    }
                });
            })
            //诊断情况 与建档情况公用一个模板
            $("#diagnoseCondition").on("click", function () {
                var $pop = api.openPopWindow("诊断情况");
                $.getJSON("../js/json/fiveGroup/diagnose.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=3
                        $pop.find('.jbox-content').html(template('docCreateTemp',data));
                        var docData = {color:['#fde101', '#1ff4be', '#c4572e'],total:data.pieChart.rate,center:["50%","50%"],data:data.pieChart.dataList}
                        charts.pieChart('docChart',true,docData)
                    }
                });
            });
            //身体健康状况 与劳动力情况公用一个模板
            $("#healthCondition").on("click", function () {
                var $pop = api.openPopWindow("身体健康情况");
                $.getJSON("../js/json/fiveGroup/health.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=2
                        $pop.find('.jbox-content').html(template('laborTemp',data));
                        var docData = {color:["#f84c24","#fde101","#83d130","#0786ef"],data:data.dataList}
                        charts.labelPie('laborWindowChart',docData)
                    }
                });

            });
            //签约情况 与建档情况公用一个模板     --------------暂时这么写，后续提取公共部分--------------
            $("#signCondition").on("click", function () {
                var $pop = api.openPopWindow("签约情况");
                $.getJSON("../js/json/fiveGroup/sign.json",function(res){
                    if(res&&res[area]){
                        var data = res[area];
                        data.type=2
                        $pop.find('.jbox-content').html(template('docCreateTemp',data));
                        var docData = {color:['#fde101', '#1ff4be', '#c4572e'],total:data.pieChart.rate,center:["50%","50%"],data:data.pieChart.dataList}
                        charts.pieChart('docChart',true,docData)
                    }
                });
            });
            //个人中心
            /*$("#openPerinfo").on("click", function () {
                $.jBox('', {title: "李茜茜", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
                //设置弹窗top值
                var box = document.getElementById("jbox");
                var title = document.getElementsByClassName("jbox-title")[0];
                box.style.top = "2.6vw";
                title.style.textAlign ="left";
                var html = template('personalTemp',{});
                document.getElementsByClassName('jbox-content')[0].innerHTML = html;
            })*/
            //村贫困家庭表单
            $("#openPoorInfo").on("click", function () {
                $.jBox('', {title: "", buttons: {}, border: 0, opacity: 0.4});
                document.getElementsByTagName('body')[0].style.padding="0";
                // $.jBox("iframe:../html/perContent.html", {title: "李茜茜", buttons: {}, border: 0, opacity: 0.2})
                //设置弹窗top值
                var box = document.getElementById("jbox");
                var title = document.getElementsByClassName("jbox-title")[0];
                box.style.top = "2.6vw";
                title.style.textAlign ="left";
                var html = template('personalTemp',{});
                document.getElementsByClassName('jbox-content')[0].innerHTML = html;
            })
        },
        'getFiveLeft': function(switchFlag){
            $.getJSON("../js/json/fiveGroup/fivegroup_left.json",function(res){
                var data = res[area];
                data['huorren'] = switchFlag || 1;
                $('#leftSide').html(template('fiveLeftSideTemp', data));
                //进度条生成
                $(".section-body.second-sec").find(".progressBar").each(function () {
                    var value = $(this).next("div").children("span").text();
                    progressBar.generate(this,value);
                })
            });
            //绑定左侧 人/户 切换点击事件
            $(".switch-head").on("click","span", function(){
                var activeBool = $(this).hasClass("span-active");
                if(!activeBool){
                    // $(this).addClass("span-active");
                    // $(this).siblings("span").removeClass("span-active")
                    var text = $(this).text();
                    // var obj = $(".section-body table thead tr").children();
                    if(text == "户"){
                        api.getFiveLeft(1);
                    }else{
                        api.getFiveLeft(2);
                    }
                }

            });
        },
        'getPoorFamilyLeft': function(switchFlag){//贫困家庭左侧
            $.getJSON("../js/json/povertyFamily/poorFamily.json",function(data){
                data["huorren"] = switchFlag || 1;
                $('#leftSide').html(template('povertyLeftSideTemp', data));
            });
            //绑定左侧 人/户 切换点击事件
            $(".switch-head").on("click","span", function(){
                var activeBool = $(this).hasClass("span-active");
                if(!activeBool){
                    // $(this).addClass("span-active");
                    // $(this).siblings("span").removeClass("span-active")
                    var text = $(this).text();
                    // var obj = $(".section-body table thead tr").children();
                    if(text == "户"){
                        api.getPoorFamilyLeft(1);
                    }else{
                        api.getPoorFamilyLeft(2);
                    }
                }

            });
        },
        'getDisease': function(){
            $("#leftTabs").removeClass("hide");
            // $("#leftOperation").addClass("hide");
            // $("#sevenStepsTab").addClass("hide");
            $("#leftTabs").find("span.disease").addClass("active").siblings().removeClass("active")

            //右侧--------------------start
            //右侧--------------------start
            var data={
                disease:[
                    {name:"高血压",percent:"16%"},
                    {name:"脑血管病",percent:"8%"},
                    {name:"糖尿病",percent:"6%"},
                    {name:"冠心病",percent:"5%"},
                    {name:"脑梗",percent:"3%"},
                    {name:"布病",percent:"2%"},
                    {name:"类风湿性关节炎",percent:"2%"},
                    {name:"关节病",percent:"2%"},
                    {name:"胆囊炎",percent:"1%"},
                    {name:"心肌病",percent:"1%"},
                    {name:"肺结核",percent:"1%"},
                    {name:"腰间盘突出",percent:"1%"}
                ],

            };
            $('#rightSide').html(template('povertyRightSideTemp_disease', data));
            var diseaseStructure = {
                legend:["高血压","脑血管病","糖尿病","冠心病","脑梗","布病","类风湿性关节炎","关节病","胆囊炎","心肌病","肺结核","腰间盘突出","其他"],
                color:['#abfb06','#1ff4be','#c4572e','#387b14','#cb4345','#a96969','#40bfec','#c73983','#0786ef','#fde101'],
                data:[
                    {value:532, name:'高血压'},
                    {value:275, name:'脑血管病'},
                    {value:191, name:'糖尿病'},
                    {value:164, name:'冠心病'},
                    {value:117, name:'脑梗'},
                    {value:69, name:'布病'},
                    {value:63, name:'类风湿性关节炎'},
                    {value:57, name:'关节病'},
                    {value:46, name:'胆囊炎'},
                    {value:43,name:"心肌病"},
                    {value:43,name:"肺结核"},
                    {value:36,name:"腰间盘突出"},
                    {value:1720,name:"其他"}
                ],
                total:"3356"
            }
            charts.pieChart("diseaseStructureChart",true,diseaseStructure);
            var diseaseIncidence = {
                color:['#ff5232','#1996e6'],
                data:[{value:3356, name:'发生',
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: "{d}%",
                            textStyle: {
                                fontSize: '11',
                                fontWeight: 'lighter',
                                color: '#fff'
                            }
                        }
                    }
                },
                    {value:324444, name:'未发生'}],
                radius: ['50%', '70%'],
                center:["50%","50%"]
            };
            charts.pieChart("diseaseIncidenceChart",false,diseaseIncidence)
            //右侧--------------------end

            //左侧--------------------start
            api.getPoorFamilyLeft();
            /*$.getJSON("../js/json/povertyFamily/poorFamily.json",function(data){
                data["huorren"] = switchFlag || 1;
                $('#leftSide').html(template('povertyLeftSideTemp', data));
            });*/


            $(".progressLi").each(function(){
                var percent = $(this).find(".percent").text();
                progressBar.generate($(this),percent);
            })
            //左侧--------------------end

            //底部--------------------start
            $.getJSON("../js/json/fiveGroup/helpDynamic.json",function(res){
                var data={};
                data.list = res.povertyNews["moqi"];
                $('.bottom').html(template('helpDynamicTemp', data));
            });
            //家医签约按钮点击事件
            $(".bottom-head").on("click",function(){
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function(){
                    var showBool = $this.is(":visible");
                    if(!showBool&&window.timeOut){
                        clearTimeout(timeOut);
                    }else{
                        api.slide("slideBox","box-wrapper");
                        // chart.barChart("doctorSign");
                    }
                });
            });
            //底部--------------------end

        },//大病结构方法
        'getEducation':function(){
            $.getJSON("../js/json/povertyFamily/education.json",function(data){
                $('#rightSide').html(template('povertyRightSideTemp_education', data[area]));
                var eduData = {
                    legend:['学龄前儿童', '小学', '初中', '高中', '大专及以上', '文盲及半文盲'],
                    color:['#fde101', '#1ff4be', '#c4572e', '#387b14', '#cb4345', '#a96969', '#40bfec', '#c73983', '#0786ef'],
                    data:[
                        {value: data[area].numberOfPreschoolChildren, name: '学龄前儿童'},
                        {value: data[area].numberOfPrimarySchool, name: '小学'},
                        {value: data[area].numberOfJuniorMiddleSchool, name: '初中'},
                        {value: data[area].numberOfHighSchool, name: '高中'},
                        {value: data[area].numberOfCollegeDegreeOrAbove, name: '大专及以上'},
                        {value: data[area].numberOfIlliteracy, name: '文盲及半文盲'}
                    ]
                }
                charts.fullPieChart("educationStructureChart",eduData)
            });

        },
        'getSex':function(){
            $.getJSON("../js/json/povertyFamily/sex.json",function(data){
                if(data){
                    var sexData = data.povertyStructure[area];
                }
                sexData.numberOfMen = (parseInt(sexData.poorCount) - parseInt(sexData.numberOfWomen)) + "";
                $('#rightSide').html(template('povertyRightSideTemp_population',sexData));
                maleChartData={
                    color: ['#c2ff42', '#1996e6'],
                    data:[
                        {
                            value: (parseInt(sexData.poorCount) - sexData.numberOfWomen),
                            name: '男性',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    formatter: "{d}%",
                                    textStyle: {
                                        fontSize: '11',
                                        fontWeight: 'lighter',
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        {value: sexData.numberOfWomen, name: '女性'}

                    ],
                    center: ["50%", "50%"],
                    radius: ['50%', '70%']
                }
                charts.pieChart("maleChart",false,maleChartData)
                femaleChartData={
                    color: ['#fe5b3c', '#1996e6'],
                    data:[
                        {
                            value: sexData.numberOfWomen,
                            name: '女性',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    formatter: "{d}%",
                                    textStyle: {
                                        fontSize: '11',
                                        fontWeight: 'lighter',
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        {value: (parseInt(sexData.poorCount) - sexData.numberOfWomen), name: '男性'}

                    ],
                    center: ["50%", "50%"],
                    radius: ['50%', '70%']
                }
                charts.pieChart("femaleChart",false,femaleChartData)

            })
        },
        'getPoverty':function(type){
            $.getJSON("../js/json/povertyFamily/poorFamilyFrame.json",function(data){
                if(data&&data.povertyStructure) {
                    var poverty = data.povertyStructure;
                    poverty[area].type = type;
                    $('#rightSide').html(template('povertyRightSideTemp_poverty', poverty[area]));
                    charts.labelPie("povertyStructureChart",{
                        color:['#fde101', '#1ff4be', '#c4572e'],
                        data:[
                            {value:type==1?poverty[area].generalPovertyHouseholds:poverty[area].generalPovertyPopulation,name:"一般贫困户"},
                            {value:type==1?poverty[area].DBPovertyHouseholds:poverty[area].DBPovertyPopulation,name:"低保贫困户"},
                            {value:type==1?poverty[area].WBPovertyHouseholds:poverty[area].WBPovertyPopulation,name:"五保贫困户"}
                        ]
                    });
                }
            });
        },
        'getDoctorSign':function(type){
            $.getJSON("../js/json/homePage/doctorSign.json",function(data){
                if(data) {
                    var dataObj = data[type];
                    var townArr = [];
                    var dataArr = [];
                    for(p in dataObj) {
                        townArr.push(p);
                        dataArr.push(dataObj[p]);
                    }
                    chart.barChart("doctorSign",townArr,dataArr);
                }
            })
        },
        /**
         * 轮播图方法
         * @param id 容器id
         * @param wrapper 滚动元素父标签
         */
        'slide':function(id,wrapper,time){
            var timeGap = time || 2200;
            var outerBox = $("#"+id);
            var innerBoxArr = outerBox.children("."+wrapper).children();
            var leng = innerBoxArr.length;
            // outerBox.children().animate({left:0},"fast")
            if(leng<3)return;
            // var i=1;
            var leftFlag = 0;
            var perWidth = innerBoxArr[0].offsetWidth;
            var distance = perWidth/timeGap;
            var setLeft = function(arr){
                /*if(leftFlag > perWidth*(leng-1)) {
                 leftFlag = 0;
                 outerBox.children().animate({left: "0px"});
                 };*/
                leftFlag += distance;
                leftFlagPx = "-" + leftFlag + "px";
                outerBox.children().css({left: leftFlagPx});
                //如果第一个模块滚出视线，则将其移动到该列末尾
                if(leftFlag > perWidth){
                    var arr = Array.prototype.shift.call(innerBoxArr);
                    var first = outerBox.children().children().eq(0)
                    first.remove();
                    outerBox.children().append(first);
                    innerBoxArr.push(arr);
                    leftFlag = 0;
                }
            } 
            window.timeOut = setInterval(setLeft.bind(null, innerBoxArr), 10);
        },
        'openPopWindow': function(title){
            var $pop = $.jBox('', {title: title, buttons: {}, border: 0, opacity: 0.4});
            document.getElementsByTagName('body')[0].style.padding="0";
            var title = document.getElementsByClassName("jbox-title")[0];
            title.style.width ="96%";
            return $pop;
        }

    };
    $(function(){
        //左右两侧高度适应屏幕
        sideResize();
        window.onresize = function(){

            sideResize();
        }
        //加载倒计时
        countDown.countDown("2018/1/1");
        //刷新时触发首页点击事件
        api.getHomePage(area);
        //绑定右上角区域切换事件
        $("#areaSelectInHeader").on("change",function () {
            var town = $(this).val();
            area = town;
            mapApi.showMap(town);
            mapApi.getData();
        })
        //切换头部标签
        $("#tab").on("click","li", function(){

            //--- 暂时代码 完成后删除 作用：禁止点击 "五个一批"和「六个精准」 by- xld
                if (!$(this).attr('class')) {
                    return;
                }
            //---暂时代码
            var activeBool = $(this).hasClass("active");
            if(!activeBool){
                $(this).addClass("active");
                $(this).siblings("li").removeClass("active")
            }
            if($(this).hasClass("homepage")){//点击首页按钮
                api.getHomePage(area);

            }else if($(this).hasClass("production")){//产业扶贫

            }else if($(this).hasClass("goverment")){//党建促脱贫
            }else if($(this).hasClass("health")){//健康脱贫

            }else if($(this).hasClass("ecology")){//生态脱贫

            }else if($(this).hasClass("education")){//教育脱贫

            }else if($(this).hasClass("doudi")){//兜底脱贫

            }
        });
        //贫困家庭右侧栏tab切换
        $("#leftTabs").on("click","span",function(){
            if(!$(this).hasClass("active")){
                $("#rightSide").empty();
                $(this).addClass("active").siblings().removeClass("active");

            }else{
                return;
            }
            if($(this).hasClass("disease")){//大病结构
                api.getDisease();
            }else if($(this).hasClass("education")){//学历结构
                api.getEducation()
            }else if($(this).hasClass("sex")){//性别结构
                api.getSex()
            }else if($(this).hasClass("poverty")){//贫困结构
                api.getPoverty(2);
            }
        });

        $("#rightSide").on("click","#povertyStructure span",function(){
            if(!$(this).hasClass("active")&&$(this).text()=="人"){
                $(this).addClass("active").siblings().removeClass("active");
                api.getPoverty(2)
                //ajax
            }else if(!$(this).hasClass("active")&&$(this).text()=="户"){
                $(this).addClass("active").siblings().removeClass("active");
                $("#povertyTypeRank").find("thead th:eq(1)").text("户数")
                api.getPoverty(1)
            }
        });

    })



    //地图模块js ---------start----------

    var mapApi = {
            "oSvgBox": $("#svgBox"),
            "curr_svg": false, //当前显示地图对象
            "hoverLock": true, //hover事件开关；
            "curr_path_id": false, //当前选中path对象id;
            "Next_map_name": null,
            "scrollX": document.documentElement.scrollLeft || document.body.scrollLeft,
            "scrollY": document.documentElement.scrollTop || document.body.scrollTop,
            "dis_w": 90, //鼠标坐标偏移量
            "dis_h": 195, //
            "$cheangeMap": $("#changeMap"), //进入地图按钮
            "inColor":"#1d4b99",  //地图选中区域颜色
            "outColor":"#1b2769",  //地图可点击区域默认颜色 
            
            "init": function() {
                mapApi.getMap($("#moqi"));
                mapApi.goBack();
                //mapApi.poorRate();
            },

            // 返回莫旗大地图
            "goBack":function(){
                $('#map-goBack').on('click', function(event) {
                    event.preventDefault();
                    /* Act on the event */                  
                    area = "moqi";
                    mapApi.showMap("moqi");
                    mapApi.getData();
                    $(this).removeClass('show');
                });
            },
            //初始化 首页地图
            "getMap": function(oSvg) {//获取县地图

                    mapApi.curr_svg = oSvg;
                    if (mapApi.curr_svg) {
                        // console.log(mapType)
                        mapApi.oSvgBox.on("click", function(event) {
                            event.preventDefault();
                            //oSvg.find(".validMap").css("fill", mapApi.outColor);
                            $(".map-links").removeClass("show");
                            $(".map-tips").removeClass("show");
                            mapApi.hoverLock = true;
                            var mapType = mapApi.curr_svg.attr("id");
                            if(mapApi.curr_path_id&&mapType=="moqi"){
                                area = "moqi";
                                mapApi.getData();
                            }
                            mapApi.curr_path_id = false;

                            /* Act on the event */
                        });
                    }
                    //鼠标移入地图
                    oSvg.on("mouseover", ".validMap", function(event) {
                        if (mapApi.hoverLock) {

                            //oSvg.find(".validMap").css("fill", mapApi.outColor);
                            //this.style.fill = mapApi.inColor;

                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            //加载hover模板
                            var target = this.id;
                            $.getJSON("../js/json/map_hover.json",function(res){
                                
                                var data = res.povertyStructure[target];
                                $(".map-tips").html(template("mapHoverTemp", data)).addClass("show")
                                    .css({
                                        "left": x - mapApi.dis_w,
                                        "top": y - mapApi.dis_h,
                                    });
                            })
                            //console.log($(this).attr("id"));
                        }
                    });
                      //鼠标点击地图
                    oSvg.on("click", ".validMap", function(event) {
                        event.stopPropagation();
                        if (mapApi.curr_path_id) {
                            //如果有当前id 已选中某镇
                            if (mapApi.curr_path_id != this.id) {
                                //oSvg.find(".validMap").css("fill", mapApi.outColor);
                                mapApi.curr_path_id = false;
                                area = "moqi";
                                mapApi.getData();
                                $(".map-links").removeClass("show");
                                mapApi.hoverLock = true;
                                return false;
                            }
                        } else {
                            //如果没有当前id;未选中镇
                            mapApi.hoverLock = false;
                            //oSvg.find(".validMap").css("fill", mapApi.outColor);

                            //this.style.fill = mapApi.inColor;
                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            mapApi.curr_path_id = this.id;

                            // console.log(this.id);
                            $(".map-tips").removeClass("show");
                             var target = this.id;
                            $.getJSON("../js/json/map_hover.json", function(res){
                                //var target = event.target.id;
                                var data = res.povertyStructure[target];
                                $(".map-links").html(template("mapClickTemp",data)).css({
                                    "left": x - mapApi.dis_w,
                                    "top": y - mapApi.dis_h/1.5,
                                }).addClass("show");

                                //帮进入下一级地图
                                $("#changeMap").on('click', function(event){
                                    event.stopPropagation();
                                    event.preventDefault();
                                    mapApi.curr_svg.removeClass('show');
                                    $(".map-links").removeClass('show');
                                    var _id = '#' + mapApi.curr_path_id+'Svg';
                                    $(_id).addClass('show');
                                    mapApi.getSubMap($(_id));
                                    mapApi.hoverLock = true;
                                    mapApi.curr_path_id=false;
                                });
                            })

                        }
                        //改变当前选择区域
                        area = mapApi.curr_path_id;
                        // var txt = $("#tab div.active").text();
                        $("#areaSelectInHeader").val(area);
                        mapApi.getData();
                        //打开督导组成员弹窗
                        $(".links-list li").eq(1).unbind("click").on("click", function() {
                            $.getJSON("../js/json/superVisorGroup.json",function(res){
                                var data = res[area];
                                var membersTemp = template("members", data);
                                $.jBox(membersTemp, { title: "督导组成员", buttons: {}, border: 0, opacity: 0.4 });
                            })
                            document.getElementsByTagName("body")[0].style.padding = "0";
                            var title = document.getElementsByClassName("jbox-title")[0];
                            title.style.width = "96%";
                            $(".select-switch").on("change", "select", function() {
                                var selected = $(this).children("option:selected").val();
                                var membersTemp = template("members", { data: [{ "duty": "组长", "name": "李骄", "sex": "女", "nation": "汉族", "politic": "党员", "office": "北京", "contect": "13711111111", "remarks": "没有备注" }, { "duty": "副组长", "name": "李天骄", "sex": "女", "nation": "汉族", "politic": "党员", "office": "北京", "contect": "13711111111", "remarks": "没有备注" }] });
                                $("#jbox-content").find("table").remove().append(membersTemp);

                            });
                        });

                    });

                },//getMap
                //     /**
                //      * 地图和顶部tab结合查询数据
                //      * @param type 所选中的tab
                //      */
            "getData":function () {
                        var txt = $("#tab li.active").text();
                        switch (txt) {
                            case "首页":
                                api.getHomePage();
                                break;
                            case "五人小组":
                                api.getFiveGroup();
                                break;
                            case "贫困家庭":
                                api.getDisease();
                                break;
                        }
                    },
            //进入二级地图
            "getSubMap" :function(oSvg) {

                    $('#map-goBack').addClass('show');
                    mapApi.curr_svg = oSvg;
                    if (mapApi.curr_svg) {
                        //console.log(mapApi.curr_svg.attr("id"))
                        mapApi.oSvgBox.on("click", function(event) {
                            event.preventDefault();
                            //oSvg.find(".validMap").css("fill", mapApi.outColor);
                            $(".map-links").removeClass("show");
                            $(".map-tips").removeClass("show");
                            mapApi.hoverLock = true;
                            mapApi.curr_path_id = false;

                            /* Act on the event */
                        });
                    }

                    oSvg.on("mouseover", '.validMap', function(event) {

                        if (mapApi.hoverLock) {
                            //$(this).addClass('map-hover');
                            //oSvg.find('.validMap').css('fill', mapApi.outColor);
                            //this.style.fill = mapApi.inColor;
                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            // $(".map-tips").addClass('show');
                            // //console.log($(this).attr('id'));
                            // $(".map-tips").css({
                            //     "left": x - mapApi.dis_w,
                            //     "top": y - mapApi.dis_h
                            // });
                        }
                    });

                    oSvg.on('click', '.validMap', function(event) {
                        event.stopPropagation();
                        if (mapApi.curr_path_id&&mapApi.curr_path_id != this.id) {
                            //如果有当前id 已选中某镇
                            
                                //oSvg.find('.validMap').css('fill', mapApi.outColor);
                                mapApi.curr_path_id = false;
                                $(".map-tips").removeClass('show');
                                mapApi.hoverLock = true;
                                
                            
                        } else {
                            //如果没有当前id;未选中镇
                            mapApi.hoverLock = false;
                            //oSvg.find('.validMap').css('fill', mapApi.outColor);
                            //this.style.fill = mapApi.inColor;
                            var x = event.pageX || event.clientX + mapApi.scrollX;
                            var y = event.pageY || event.clientY + mapApi.scrollY;
                            mapApi.curr_path_id = this.id;

                            //村贫困家庭表单
                            // $.jBox('', { title: "", buttons: {}, border: 0, opacity: 0.4 });
                            // $.getJSON("../js/json/map_peopleList.json",function(res){
                                $.getJSON("../js/json/mapPeopleDetail.json",function(res){
                                    var data={};
                                    var _data = data.data = res[area][mapApi.curr_path_id];
                                    data.totalList = res[area].list;
                                    var membersTemp = template("villageTemp", data);
                                    var titleHtml = template("selectTown",data);
                                    var html = titleHtml +"<div>"+membersTemp+"</div>";
                                        html += "<ul class='page'></ul>";
                                    $.jBox(html, { title: "", buttons: {}, border: 0, opacity: 0.4 });
                                    // document.getElementsByClassName('jbox-content')[1].innerHTML = html;
                                    document.getElementsByTagName('body')[0].style.padding = "0";
                                    // 获取表格容器
                                    var container = $('.jbox-content>div').eq(1);
                                    jpage.page(_data,"villageTemp",container,10);
                                    //设置已选中村的option
                                    $(".select-switch").find("option[value='"+mapApi.curr_path_id+"']").attr("selected","selected");
                                    //绑定select切换事件
                                    $(".select-switch select").on("change",function(){
                                        var curVillage = $(this).val();
                                        //重置分页
                                        $(".page").html("");
                                        var newData = res[area][curVillage];
                                        var membersTemp = template("villageTemp", newData);
                                        $('.jbox-content>div').eq(1).html("").html(membersTemp);
                                        jpage.page(newData,"villageTemp",container,10);
                                    })
                                    //家庭列表绑定点击事件
                                    container.on("click","tr",function() {
                                        var text = $("#tab").find("li.active").text();
                                        var name = $(this).find("td:eq(1)").text();
                                        var family = data.data.filter(function(a) {
                                            return a.name == name;
                                        });
                                        var $pop = $.jBox('', { title: name, buttons: {}, border: 0, opacity: 0.4 });
                                        document.getElementsByTagName('body')[0].style.padding = "0";
                                        $pop.find("#jbox").css("top", "2.6vw");
                                        if(text == "产业扶贫"){//****************************************************
                                            var cardHtml = template('helpCardTemp',{} );
                                            document.getElementsByClassName('jbox-content')[1].innerHTML = cardHtml;
                                            //绑定图片放大事件
                                            $(".physexam-record img").viewer();
                                            //绑定家庭成员点击事件
                                            $pop.find(".per-mid tbody").on("click","tr", function(){
                                                var member = $(this).children("td").eq(0).text();
                                                var $popOther = $.jBox('', { title: member, buttons: {}, border: 0, opacity: 0.4 });
                                                document.getElementsByTagName('body')[0].style.padding = "0";
                                                $popOther.find("#jbox").css("top", "2.6vw");
                                                var html = template('helpCardTemp',{} );
                                                document.getElementsByClassName('jbox-content')[2].innerHTML = html;
                                                //绑定图片放大事件
                                                $popOther.find(".physexam-record img").viewer();
                                            })
                                        }else {

                                            document.getElementsByClassName('jbox-content')[1].innerHTML = template('personalTemp',family[0] );
                                            chart.barChart("fupinBar",[2016,2017,2018,2019],[520,120,685,520],true);
                                            chart.barChart("profitBar",[2016,2017,2018,2019],[520,120,685,520],true);
                                        }
                                    });
                            })
                        }
                    });


                }, //getSubmap
                //切换地图公共方法 mapApi.showMap
                //传入地图 id
            "showMap":function(mapid){
                    if(mapid=="moqi"){
                        var idStr='#'+mapid;
                        $('svg').removeClass('show');
                        $(idStr).addClass('show');
                        $('.map-links').removeClass('show');
                        $('.map-tips').removeClass('show');
                        //mapApi.curr_svg.find(".validMap").css("fill", mapApi.outColor);
                        mapApi.getMap($(idStr));
                        mapApi.hoverLock = true;
                        mapApi.curr_path_id=false;
                        return;
                    }
                    var idStr='#'+mapid+'Svg';
                    $('svg').removeClass('show');
                    $('.map-links').removeClass('show');
                    $('.map-tips').removeClass('show');
                    //mapApi.curr_svg.find(".validMap").css("fill", mapApi.outColor);
                    $(idStr).addClass('show');
                    mapApi.getSubMap($(idStr));
                    mapApi.hoverLock = true;
                    mapApi.curr_path_id=false;
                },

            "poorRate":function(){
                    var poordata={
                        "nierjizhen":"1%",
                        "baoshanzhen":"3%",
                        "dengteke":"5%",
                        "xiwaertuzhen":"11%",
                    }
                    for (var key in poordata) {

                        console.log("1%"<0.03);

                        if(parseInt(poordata[key])<=1){
                            $('#'+key).addClass('colorL');
                        }else if(parseInt(poordata[key])>=5){
                            $('#'+key).addClass('colorL');
                           // alert(key);
                        }else{
                            //$('#'+key).addClass('colorL');
                            console.log(key);
                        }
                    }
            },
        }; //mapApi
        //初始化地图方法；
        mapApi.init();

    
    //地图模块js ---------end----------

});