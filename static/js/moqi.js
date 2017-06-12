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
            "progressBar": "../js/progressBar",
            "countDown": "../js/countDown",
            "page": "../js/page",
            "viewer": "../lib/viewer"
        },
        shim: {
            'jbox': {
                deps: ['jquery']
            },
            'migrate': {
                deps: ['jquery']
            },
            'viewer': {
                deps: ['jquery'],
                exports: "jQuery.fn.viewer"
            }

        }
    });

    require(['jquery', 'migrate', 'template', 'chart', 'charts', 'jbox', 'progressBar', 'countDown', 'viewer', 'page'], function($, migrate, template, chart, charts, jbox, progressBar, countDown, viewer, jpage) {
        //当前所选区域对应的全局变量
        var area = "moqi";
        var area_name = "";
        //图片浏览插件option设置
        $.fn.viewer.setDefaults({ navbar: false, title: false });
        //由于贫困家庭与首页共用签约，提取公共部分
        /**
         * 家医签约点击方法，暂时不做保存筛选条件的处理
         */
        function bottomBind() {
            $(".bottom-head").on("click", function() {
                $(".bottom-header ul li").removeClass("click-active").eq(0).addClass("click-active")
                var $this = $(this).siblings(".bottom-content");
                $this.slideToggle(function() {
                    // api.getDoctorSign('illnessCasuses');
                });

            });
        }
        var sideResize = function() {
            var height = $("header").height();
            var clientHeight = $(window).height();
            var margin = +$("#rightSide").css("margin-top").slice(0, -2);
            var sideHeight = clientHeight - height - margin;
            $("#rightSide,#leftSide").height(sideHeight - 2);
        };
        //莫旗全镇名字数据  多次用到定义全局变量;
        var townNameList = ["尼尔基镇", "红彦镇", "宝山镇", "西瓦尔图镇", "塔温敖宝镇", "腾克镇", "巴彦鄂温克民族乡", "阿尔拉镇", "哈达阳镇", "杜拉尔鄂温克民族乡", "汉古尔河镇", "奎勒河镇", "库如奇乡", "登特科办事处", "额尔和办事处", "坤密尔提办事处", "卧罗河办事处"];
        // 数据加载
        var api = {
            'getHomePage': function() {
                //右侧--------------------start
                $.getJSON("../js/json/homePage/dutyHost.json", function(data) {
                    if (data) {
                        $('#rightSide').html(template('homepageRightSideTemp', data[area]));
                        //进度条生成
                        $("#performance").find(".progressBar").each(function() {
                            var percent = $(this).find(".progressRate").text();
                            if (percent.substr(-1) !== "%") {
                                percent = percent.slice(0, -1) + "%";
                            }
                            progressBar.generate($(this), percent);
                        });
                    }
                    $(".command").viewer();
                    $(".management").viewer();
                })
                $("#rightSide").on("click", "div", function() {
                    if ($(this).attr("id") == "performance") {
                        $(".government").trigger("click");
                    }
                });
                //右侧--------------------end

                //左侧--------------------start
                //获取首页左侧数据
                $.ajaxSettings.async = false;
                var dataLeft = {},
                    targetChart = {};
                $.getJSON("../js/json/homePage/basicInfoV2.json", function(res) {
                    dataLeft['basicInfo'] = res.basic_info[area];
                });
                $.getJSON("../js/json/homePage/targetV2.json", function(res) {
                    targetChart = res.overcome_poverty_aim[area].aim;
                });
                $('#leftSide').html(template('homepageLeftSideTemp', dataLeft));
                var chartData = {};
                chartData.color = ["#1fa9f4", "#0cb871"];
                chartData.yAxisData = [2017, 2018, 2019];
                //数据更改，暂时写死 --bytlw 20170608
                var people = [],
                    family = [];
                for (var i = 0, length = targetChart.length; i < length; i++) {
                    family.push(targetChart[i].house_num);
                    people.push(targetChart[i].person_num);
                }
                chartData.data = [{ name: "目标户数", type: "bar", data: [1900,1900,1109], barMaxWidth: 10 }, { name: "目标人数", type: "bar", data: [4580,4580,2974], barMaxWidth: 10 }]
                charts.xBarChart("targetChart", chartData)
                //左侧--------------------end
                //底部--------------------start
                $('.bottom').html(template('povertyStatus', {}));
                //底部按钮点击事件
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                            if ($(".bottom-head").hasClass("active")) {
                                $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png");
                            } else {
                                $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png");
                            }
                            api.getPovertyDistribution();
                        }
                    });
                });
                //贫困状况切换标题
                $(".bottom-header ul").on("click", "li", function() {
                    var activeBool = $(this).hasClass("click-active");
                    if (!activeBool) {
                        $(this).addClass("click-active");
                        $(this).siblings("li").removeClass("click-active");
                        if ($(this).hasClass("povertyDistribution")) {
                            api.getPovertyDistribution();
                        } else {
                            api.getPovertyCauses();
                        }
                    }
                });
                //底部--------------------end
            },
            'getRelocate': function() {
                $("#whole").show().html(template('relocateTemp', {}));
                $(".bottom").show().html(template('rebuildTemp', {}));
                var firstData = {
                    color: '#57d454',
                    title: '总量：2908 户',
                    data: [1990, 1018],
                    xAxisData: ['2016年', '2017年'],
                    unit: "户",
                    xName: '时间',
                    yName: '数量',
                    interval: 700
                }
                charts.colorLineChart("targetNumChart", firstData);
                var secondData = {
                    color: '#03b8fd',
                    title: '总量：901 户',
                    data: [222, 182, 265, 232],
                    xAxisData: ['2016年', '2017年', '2018年', '2019年'],
                    unit: "户",
                    xName: '时间',
                    yName: '数量',
                    interval: 150
                }
                charts.colorLineChart("centerNumChart", secondData);
                var thirdData = {
                    color: '#fbe603',
                    title: '总量：1.73 亿',
                    data: [1.64, 0.09],
                    xAxisData: ['2016年', '2017年'],
                    unit: "亿",
                    xName: '时间',
                    yName: '资金',
                    interval: 1
                }
                charts.colorLineChart("targetFundChart", thirdData);
                var fourthData = {
                    color: '#fc8a03',
                    title: '总投入：10354 万',
                    data: [2717, 2275, 2763, 2599],
                    xAxisData: ['2016年', '2017年', '2018年', '2019年'],
                    unit: "万",
                    xName: '时间',
                    yName: '额度',
                    interval: 1000
                }
                charts.colorLineChart("centerFundChart", fourthData);
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            api.slide("rebuildSlideBox", "box-wrapper", 1900, 3);
                        }
                        $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                        if ($(".bottom-head").hasClass("active")) {
                            $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png")
                        } else {
                            $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png")
                        }
                    });
                });
            },
            'getGovernment': function() {
                $("#leftSide").html(template('governmentTemp_left', {}));
                chart.pieChart("satisfactionChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '100',"分");
                chart.pieChart("attendanceChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '100',"分");
                chart.pieChart("resumptionChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '100', "分");
                chart.pieChart("disciplineChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '100', '分');
                $("#rightSide").html(template('governmentTemp_right', {}));
                chart.pieChart("secretaryChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '220', '人');
                chart.pieChart("workTeamChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '55', "支");
                chart.pieChart("cadreChart", "#1b9deb", "#1b9deb", [{ "value": 100 }], '1322', '人');
                $('.bottom').html(template('governmentTemp_bottom', {}));
                $(".command").viewer();
                // bottomBind();
                //底部按钮点击事件
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                            if ($(".bottom-head").hasClass("active")) {
                                $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png");
                            } else {
                                $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png");
                            }
                            $(".fileOne").viewer();
                            $(".file2").viewer({navbar: true});
                            $(".file3").viewer({navbar: true});
                            $(".file4").viewer({navbar: true});
                        }
                    });
                });


            },
            'getEcologyTotalFamily': function() {
                chart.barChart("ecologyHardchart", townNameList, [5, 32, 299, 49, 95, 340, 186, 126, 32, 94, 96, 26, 16, 13, 10, 89, 92]);
            },
            'getEcologyTotalPeople': function() {
                chart.barChart("ecologyHardchart", townNameList, [11, 66, 766, 49, 95, 340, 186, 333, 97, 94, 266, 69, 31, 32, 100, 180, 294]);
            },
            'getEcologyplantNum': function() {
                chart.barChart("ecologyHardchart", townNameList, [79, 140, 300, 220, 245, 560, 295.5, 165, 100, 200, 180, 220, 140, 180, 265, 160, 152]);
            },
            'getPovertyDistribution': function() {
                //chart.barChart("poverty_status",["登特科办事处","哈达阳镇","西瓦尔图镇","阿尔拉镇","尼尔基镇","塔温敖宝镇","巴彦鄂温克民族乡","宝山镇","杜拉尔鄂温克民族乡","奎勒河镇","库如奇乡","腾克镇","汉古尔河镇","额尔和办事处","坤密尔提办事处","卧罗河办事处"],[968,600,454,286,2222,452,679,706,179,934,235,1253,1020,581,342,680]);
                chart.barChart("poverty_status", ["登特科办事处", "哈达阳镇", "西瓦尔图镇", "阿尔拉镇", "尼尔基镇", "塔温敖宝镇", "巴彦鄂温克民族乡", "宝山镇", "杜拉尔鄂温克民族乡", "奎勒河镇", "库如奇乡", "腾克镇", "汉古尔河镇", "额尔和办事处", "坤密尔提办事处", "卧罗河办事处"], [402, 271, 192, 112, 881, 184, 334, 291, 75, 354, 94, 457, 395, 218, 159, 233]);

            },
            'getPovertyCauses': function() {
                // chart.barChart("poverty_status",["因病","因灾","因学","因残","缺土地","缺资金","缺技术","缺劳力","缺水","自身发展动力不足","交通条件落后"],[9990,2882,372,1349,10374,3806,688,774,22,524,116]);
                chart.barChart("poverty_status", ["因病", "因灾", "因学", "缺土地", "缺资金", "缺技术", "缺劳力", "自身发展动力不足", "交通条件落后"], [1989, 265, 33, 1906, 428, 97, 132, 56, 3]);

            },
            'getDisease': function() {
                //左侧------start
                var data = {
                    disease: [
                        { name: "脑血管病", percent: "25.66%" },
                        { name: "高血压", percent: "10.44%" },
                        { name: "糖尿病", percent: "6.41%" },
                        { name: "关节病", percent: "4.89%" },
                        { name: "肺气肿", percent: "3.48%" },
                        { name: "精神疾病", percent: "3.29%" },
                        { name: "   关节炎", percent: "3.60%" },
                        { name: "肺结核病", percent: "1.96%" },
                        { name: "心肌病", percent: "1.64%" },
                        { name: "肝炎", percent: "1.13%" },
                        { name: "肝硬化", percent: "0.98%" },
                        { name: "其他疾病", percent: "35.82%" }
                    ],

                };
                $('#leftSide').html(template('healthLeftSideTemp', data));
                $(".progressLi").each(function() {
                    var length = $(this).find("p:eq(0)").text().split("").length;
                    if (length > 5) {
                        $(this).find("p:eq(0)").css("font-size", ".9vw");
                        $(this).find("p").css("line-height", "1vw");
                    }
                    var percent = $(this).find("p:eq(1)").text();
                    progressBar.generate(this, percent);
                })
                var diseaseStructure = {
                    // legend:["高血压","脑血管病","糖尿病","冠心病","脑梗","布病","类风湿性关节炎","关节病","胆囊炎","心肌病","肺结核","腰间盘突出","其他"],
                    color: ['#3cb7f6', '#1991d4', '#1578ae', '#116794', '#105e88'],
                    center: ["45%", "45%"],
                    radius: ["30%", "50%"],
                    data: [
                        { value: 267, name: '高血压' },
                        { value: 656, name: '脑血管病' },
                        { value: 164, name: '糖尿病' },
                        { value: 125, name: '关节病' },
                        { value: 89, name: '肺气肿' }
                    ],
                    total: "3356"
                }
                charts.labelPie("diseaseStructureChart", diseaseStructure);
                var chartData_x = ["高血压", "糖尿病",  "重症精神病","结核病"];
                var charData_y = ['267', '164', '84', '50'];
                chart.barChart("keyPopulationChart", chartData_x, charData_y);
                //右侧---------end
                //右侧--------------------start
                //五人小组统计
                $('#rightSide').html(template('povertyRightSideTemp_disease', {}));
                var structure = {
                    color: ['#3cb7f6','#1991d4', '#1578ae', '#136d9e', '#105e88'],
                    data: [
                        { value: 267, name: '家医团队' },
                        { value: 3713, name: '健康家人' },
                        { value: 223, name: '专科医生' },
                        { value: 2456, name: '帮扶干部' },
                        { value: 220, name: '村支书' }
                    ],
                };
                charts.labelPieChart("fiveGroupSumChart", structure);
                //五人小组覆盖率
                chart.pieChart("fiveGroupCoverRate", "#abfb06", "#4b586d", [{ "value": 47.92, "name": '已完成' }, { "value": 52.08, "name": '未完成' }], '47.92%', "\n完成率");
                //体检建档
                var documentSum = {
                    color: ['#fff100', '#63c727', '#1fa9f4', '#e9733f'],
                    data: [
                        { value: 614, name: '完全丧失劳动能力' },
                        { value: 864, name: '完全恢复劳动能力' },
                        { value: 3713, name: '健康人群' },
                        { value: 1079, name: '部分恢复劳动能力' }
                    ],
                    radius: ['40%', '60%'],
                    center: ["50%", "50%"],
                    formatter: "{b}\n{c}\n({d}%)"
                };
                charts.labelPieChart("diseaseStructureChartRight", documentSum);
                $.ajax({
                        type: 'GET',
                        url: 'http://api.homedoctor.grdoc.org/government/get-this-week-sign',
                        dataType: 'json',
                        async:true,
                        data: {
                            province: '内蒙古',
                            city: '呼伦贝尔',
                            region: '莫力达瓦达斡尔族自治旗'
                        },
                        success: function(res) {
                            var lineData = {};
                            if (res) {
                                var _data = res.data;
                                var xArr = [];
                                var yArr = [];
                                for (var i = 0; i < _data.length; i++) {
                                    xArr.push(_data[i].date);
                                    yArr.push(_data[i].signing_total_number);
                                }
                                lineData.xArr = xArr;
                                lineData.yArr = yArr;
                                lineData.grid = {
                                    top: 40,
                                    left: 40,
                                    height: '50%'
                                };
                                lineData.tooltip = {
                                    trigger: 'axis',
                                    formatter: '{b}<br/>签约数量：{c}'
                                };
                                charts.lineChart("diseaseIncidenceChart", lineData);
                            }
                        }
                    })
                    //右侧--------------------end

                //左侧--------------------end

                //底部--------------------start
                $('.bottom').html(template('helpingStatus', {}));
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                            if ($(".bottom-head").hasClass("active")) {
                                $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png")
                            } else {
                                $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png")
                            }
                            // api.slide("slideBox_r","box-wrapper",1900);
                            api.getDiseasePoor();
                        }
                    });
                });

                $(".bottom-header ul").on("click", "li", function() {
                    var activeBool = $(this).hasClass("click-active");
                    if (!activeBool) {
                        $(this).addClass("click-active");
                        $(this).siblings("li").removeClass("click-active");
                        if ($(this).hasClass("diseasePoor")) {
                            api.getDiseasePoor();
                        } else {
                            api.getFivePeopleGroupNum();
                        }
                    }
                });
                //底部--------------------end

            }, //健康扶贫
            'getDiseasePoor': function() {
                chart.barChart("helping_status", townNameList, [1110, 270, 153, 147, 200, 75, 438, 34, 262, 82, 668, 258, 124, 532, 245, 164, 171]);
            },
            'getFivePeopleGroupNum': function() {
                chart.barChart("helping_status", townNameList, [44,32,33,23,12,13,34,11,4,3,9,13,7,4,17,5,3]);

            },
            'getEducation': function() {
                $(".mapBox").hide();
                $("#rightSide").hide();
                // $("#leftTabs").addClass("hide");
                //右侧--------------------start
                //存储全部数据，方便获取
                var totalData = {};
                var cur_data = {};
                var current_county = "尼尔基镇";
                $.getJSON("../js/json/education.json",function(res){
                    totalData = res;
                    cur_data.list = res[current_county];
                    $("#rightContent").html(template("educationRightSideTemp",{})).find("tbody").html(template("educationRightSideTableTemp", cur_data));
                });
                $(".rightContent-title").on("click", "div", function() {
                    var checkedBool = $(this).hasClass("active");
                    if (!checkedBool) {
                        current_county = $(this).text();
                        $(this).addClass("active").siblings("div").removeClass("active");
                        cur_data.list = totalData[current_county];
                        $("#rightContent").find("tbody").html("").html(template("educationRightSideTableTemp", cur_data));
                    } else {
                        return;
                    }
                });
                $(".bottom").html("").html(template("eduHelpTemp", {}));
                //右侧--------------------end

                //左侧--------------------start
                //获取首页左侧数据
                $('#leftSide').html(template('educationLeftSideTemp', {}));
                var dataObj = {
                    xArr: ["2016年", "2017年"],
                    data: [155.23, 500],
                    titleBool: true
                };
                // chart.blueBarChart("annualBar", dataObj)
                //左侧--------------------end

                //底部--------------------start
                //家医签约按钮点击事件
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            // $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                            if ($(".bottom-head").hasClass("active")) {
                                $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png");
                            } else {
                                $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png");
                            }
                            api.slide("eduSlideBox", "box-wrapper", 1900, 7);
                            // api.getPovertyDistribution();
                        }
                    });
                });
                //贫困状况切换标题
                $(".bottom-header ul").on("click", "li", function() {
                    var activeBool = $(this).hasClass("click-active");
                    if (!activeBool) {
                        $(this).addClass("click-active");
                        $(this).siblings("li").removeClass("click-active");
                        if ($(this).hasClass("povertyDistribution")) {
                            api.getPovertyDistribution();
                        } else {
                            api.getPovertyCauses();
                        }
                    }
                });
                //底部--------------------end
            },
            'getDoctorSign': function(type) {
                $.getJSON("../js/json/homePage/doctorSign.json", function(data) {
                    if (data) {
                        var dataObj = data[type];
                        var townArr = [];
                        var dataArr = [];
                        for (p in dataObj) {
                            townArr.push(p);
                            dataArr.push(dataObj[p]);
                        }
                        chart.barChart("doctorSign", townArr, dataArr);
                    }
                })
            },
            "getfallback": function() {
                mapApi.mapPlay("none");
                $('#centerSide').css('display', 'block');

                //左侧
                $('#leftSide').html(template('fallbackLeftSideTemp', {}));
                // charts.legendPie("productionTotalChart",poverty);
                var dataObj = {
                    xArr: ["2015", "2016", "2017"],
                    yArrs: [3100, 3100, 3800],
                    yArr: [2855, 2896, 2951]
                };
                charts.doubleLineChart("fallbackTotalChart", dataObj);
                //左侧 end

                //右侧 start
                $('#rightSide').html(template('fallbackRightSideTemp', {}));

                //右侧 end
                // charts.youChart("fallbackNumChart");

                //中间 start
                $('#centerSide').html(template('fallbackCenterSideTemp', {}));
                var shouYiData = {
                    xArr: ['2015', '2016', '2017'],
                    yArr: [31.7, 44.45, 43.43],
                    title: " ",
                    axisLineWidth: 2,
                    yLabelShow: false,
                    axisLabelColor: "#21b9fa",
                    grid: {
                        top: 40,
                        left: 40,
                        height: '60%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}<br/>占比：{c}%'
                    },
                    formatter: "{c}%"
                };
                charts.lineChart("fallbackYieldChart", shouYiData);
                var touZiData = {
                    xArr: ['2015', '2016', '2017'],
                    yArr: [2600, 2800, 2950],
                    title: " ",
                    axisLineWidth: 2,
                    yLabelShow: false,
                    axisLabelColor: "#fa8a25",
                    grid: {
                        top: 40,
                        left: 40,
                        height: '60%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}<br/>资金：{c}'
                    },
                };

                charts.lineChart("fallbackInvestChart", touZiData);
                //中间 end
                //底部 start
                $('.bottom').html("").html(template('fallbackBottomTemp', {}));
                // bottomBind();
                //底部按钮点击事件
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            // clearTimeout(timeOut);
                        } else {
                            // $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                            if ($(".bottom-head").hasClass("active")) {
                                $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png")
                            } else {
                                $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png")
                            }
                            // api.slide("slideBox_r","box-wrapper",1900);
                            chart.barChart("fallback_status", townNameList, [771, 407, 706, 228, 113, 554, 578, 217, 218, 119, 138, 541, 70, 258, 547, 25, 87]);
                        }
                    });
                });
                //底部end
            },
            //产业扶贫相关方法
            "getProduction": function() {
                mapApi.mapPlay("none");
                

                //左侧
                $('#leftSide').html(template('productionLeftSideTemp', {}));

                var poverty = {
                    legend: townNameList,
                    color: ['#ffcf02', '#00a7f8', '#157dd0', '#f87309', '#a4a5a6', '#ffc200', '#157dd0', '#54b645', '#155c94', '#b35c24', '#a27f00', '#f87309', '#a4a5a6', '#ffc200', '#157dd0', '#54b645', '#155c94', '#b35c24', '#a27f00'],
                    center: ["50%", "30%"],
                    radius: ["25%", "45%"],
                    data: [
                        { value: 802, name: '尼尔基镇' },
                        { value: 325, name: '红彦镇' },
                        { value: 331, name: '宝山镇' },
                        { value: 369, name: '西瓦尔图镇' },
                        { value: 219, name: '塔温敖宝镇' },
                        { value: 384, name: '腾克镇' },
                        { value: 478, name: '巴彦鄂温克民族乡' },
                        { value: 114, name: '阿拉尔镇' },
                        { value: 299, name: '哈达阳镇' },
                        { value: 178, name: "拉杜尔鄂温克民族乡" },
                        { value: 252, name: "汉古尔河镇" },
                        { value: 147, name: "奎勒河镇" },
                        { value: 123, name: "库如奇乡" },
                        { value: 364, name: "登特科办事处" },
                        { value: 309, name: "额尔和办事处" },
                        { value: 204, name: "坤密尔提办事处" },
                        { value: 179, name: "卧罗河办事处" },
                    ],
                    total: "3356"
                };
                charts.legendPie("productionTotalChart", poverty);
                //左侧 end

                //右侧 start
                $('#rightSide').html(template('productionRightSideTemp', {}));

                //右侧 end
                charts.youChart("productionNumChart");

                //中间 start
                $('#centerSide').html(template('productionCenterSideTemp', {}));
                var shouYiData = {
                    title: '每户预计收益成效',
                    xNames: ['种植养殖', '龙头企业合作社', '电商扶贫', '光伏扶贫'],
                    data: [0.5, 0.3, 0.2, 0.2],
                    pointName: '收益万元数'
                };
                charts.centerChart("productionYieldChart", shouYiData);

                var touZiData = {
                    title: '资金投入',
                    xNames: ['种植养殖', '龙头企业合作社', '电商扶贫', '光伏扶贫'],
                    data: [1874.36, 700, 500, 26600],
                    pointName: '投资数'
                };

                charts.centerChart("productionInvestChart", touZiData);
                //中间 end
                // 底部 start
                $(".bottom").show().html(template('productionBottomTemp', {}));
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            api.slide("productionSlideBox", "box-wrapper", 1900, 3);
                        }
                        $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                        if ($(".bottom-head").hasClass("active")) {
                            $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png");
                        } else {
                            $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png");
                        }
                    });
                });
                //底部 end
            },
            //生态扶贫相关方法
            'getEcology': function() {
                $(".mapBox").hide();

                $('#leftSide').html(template('ecologyLeftTemp', {}));

                $('#rightSide').html(template('ecologyRightTemp', {}));

                $('#centerSide').html(template('ecologyCenterTemp', {}));

                var protectData = {
                    yName: '护林面积 ',
                    data: [15, 16]
                };
                var returnData = {
                    yName: '累计还林面积',
                    data: [0.92, 10.89]
                };

                charts.treeChart("protectTreeChart", protectData);

                charts.treeChart("returnTreeChart", returnData);

                //底部--------------------start
                $('.bottom').html(template('ecologyHard', {}));
                // bottomBind();
                //底部按钮点击事件
                $(".bottom-head").on("click", function() {
                    var $this = $(this).siblings(".bottom-content");
                    $this.slideToggle(function() {
                        var showBool = $this.is(":visible");
                        if (!showBool && window.timeOut) {
                            clearTimeout(timeOut);
                        } else {
                            $(".bottom-header").find("li:eq(0)").addClass("click-active").siblings().removeClass("click-active");
                            if ($(".bottom-head").hasClass("active")) {
                                $(".bottom-head").removeClass("active").find("img").attr("src", "../images/up_arrow.png")
                            } else {
                                $(".bottom-head").addClass("active").find("img").attr("src", "../images/down_arrow.png")
                            }

                            api.getEcologyTotalFamily();
                        }
                    });
                });
                //贫困状况切换标题
                $(".bottom-header ul").on("click", "li", function() {
                    var activeBool = $(this).hasClass("click-active");
                    if (!activeBool) {
                        $(this).addClass("click-active");
                        $(this).siblings("li").removeClass("click-active");
                        if ($(this).hasClass("totalFamily")) {
                            api.getEcologyTotalFamily();
                        } else if ($(this).hasClass("totalPeople")) {
                            api.getEcologyTotalPeople();
                        } else {
                            api.getEcologyplantNum();
                        }
                    }
                });
                //底部--------------------end
            },

            /**
             * 轮播图方法
             * @param id 容器id
             * @param wrapper 滚动元素父标签
             */
            'slide': function(id, wrapper, time, num) {
                var timeGap = time || 2200;
                var outerBox = $("#" + id);
                var innerBoxArr = outerBox.children("." + wrapper).children();
                var leng = innerBoxArr.length;
                // outerBox.children().animate({left:0},"fast")
                if (leng <= num) return;
                // var i=1;
                var leftFlag = 0;
                var perWidth = innerBoxArr[0].offsetWidth;
                var distance = perWidth / timeGap;
                var setLeft = function(arr) {
                    /*if(leftFlag > perWidth*(leng-1)) {
                     leftFlag = 0;
                     outerBox.children().animate({left: "0px"});
                     };*/
                    leftFlag += distance;
                    leftFlagPx = "-" + leftFlag + "px";
                    outerBox.children().css({ left: leftFlagPx });
                    //如果第一个模块滚出视线，则将其移动到该列末尾
                    if (leftFlag > perWidth) {
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
            'openPopWindow': function(title) {
                var $pop = $.jBox('', { title: title, buttons: {}, border: 0, opacity: 0.4 });
                document.getElementsByTagName('body')[0].style.padding = "0";
                var title = document.getElementsByClassName("jbox-title")[0];
                title.style.width = "96%";
                return $pop;
            }

        };
        $(function() {
            //左右两侧高度适应屏幕
            sideResize();
            window.onresize = function() {
                sideResize();
            };
            //加载倒计时
            countDown.countDown("2018/1/1");
            //刷新时触发首页点击事件
            api.getHomePage(area);
            //绑定右上角区域切换事件
            $("#areaSelectInHeader").on("change", function() {
                    var town = $(this).val();

                    area = town;
                    mapApi.showMap(town);
                    mapApi.getData();
                });
                //切换头部标签
            $("#tab").on("click", "li", function() {
                var activeBool = $(this).hasClass("active");
                if (!activeBool) {
                    $(this).addClass("active");

                    $(this).siblings("li").removeClass("active")
                    $("body>div").hide();

                    $(this).siblings("li").removeClass("active");

                }
                //map 的显示隐藏
                if (!$(this).hasClass("production")&&!$(this).hasClass("relocate")) {
                    mapApi.mapPlay("block");
                    $('#centerSide').hide();
                }
                if ($(this).hasClass("homepage")) { //点击首页按钮
                    $(".bottom").show();
                    $(".mapBox").show();
                    $("#leftSide").show();
                    $("#rightSide").show();
                    api.getHomePage(area);
                    mapApi.init("moqi", "homepage");
                } else if ($(this).hasClass("production")) { //产业扶贫
                    $(".bottom").show();
                    $(".mapBox").show();
                    $('#centerSide').show();
                    $("#leftSide").show();
                    $("#rightSide").show();
                    api.getProduction();
                } else if ($(this).hasClass("government")) { //党建促脱贫
                    $(".mapBox").show();
                    $("#leftSide").show();
                    $(".bottom").show();
                    $("#rightSide").show();
                    api.getGovernment();
                    mapApi.init("moqi", "government");
                } else if ($(this).hasClass("health")) { //健康脱贫
                    $(".bottom").show();
                    $(".mapBox").show();
                    $("#leftSide").show();
                    $("#rightSide").show();
                    api.getDisease();
                    mapApi.init("moqi", "health");
                } else if ($(this).hasClass("ecology")) { //生态脱贫
                    $(".bottom").show();
                    $('#centerSide').show();
                    $("#leftSide").show();
                    $("#rightSide").show();
                    api.getEcology();
                } else if ($(this).hasClass("education")) { //教育脱贫
                    $(".bottom").show();
                    $("#leftSide").show();
                    $("#rightContent").show();
                    api.getEducation();
                } else if ($(this).hasClass("fallback")) { //兜底脱贫
                    $("#leftSide").show();
                    $("#rightSide").show();
                    $(".bottom").show();
                    api.getfallback();
                } else if ($(this).hasClass("relocate")) {
                    $("#whole").show();
                    $(".bottom").show();
                    api.getRelocate();
                }
            });
        });



        //地图模块js ---------start----------

        var mapApi = {
            "oSvgBox": $("#svgBox"),
            "curr_svg": false, //当前显示地图对象
            "hoverLock": true, //hover事件开关；
            "curr_path_id": false, //当前选中path对象id;
            "curr_path_name":"",//当前选中path对象的name
            "Next_map_name": null,
            "scrollX": document.documentElement.scrollLeft || document.body.scrollLeft,
            "scrollY": document.documentElement.scrollTop || document.body.scrollTop,
            "dis_w": $('.map-tips').width(), //鼠标坐标偏移量
            "dis_h": $('.map-tips').height(), //
            "$cheangeMap": $("#changeMap"), //进入地图按钮
            "inColor": "#1d4b99", //地图选中区域颜色
            "outColor": "#1b2769", //地图可点击区域默认颜色
            "currTab": '', //当前地图对象的 页面头标签 在init()中获得；

            "init": function(id, claName) {

                mapApi.currTab = $("#tab").find("li.active").text(), //当前地图对象的 页面头标签

                    $('svg').removeClass('show');
                $("#" + id).addClass('show');


                mapApi.getMap($("#" + id));

                mapApi.canWork(claName);

                mapApi.goBack();
                //mapApi.poorRate();
            },
            /*
            根据头部tab标签 切换地图可点击 区域 canWork
            @param claName ：tab的class名
            */
            'canWork': function(claName) {
                var canWorkList = [];
                $('.validMap').removeClass('validMap');
                if (claName == 'government') {
                    canWorkList = ['hanguerhezhen','nierjizhen',"baoshanzhen","dengtekebanshichu", "xiwaertuzhen", "aerlazhen", 'shenglicun','madangqiancun','dongkunqian','shuanglongquancun','xinfacun','xinglongcun','xiaoquanzicun','fuxingcun','aerlacun','dongkunqiancun','guonicun','minzucun'];
                } else {
                    canWorkList = ['hanguerhezhen', 'nierjizhen', "baoshanzhen", "dengtekebanshichu", "xiwaertuzhen", "aerlazhen", 'fuxingcun', 'xiaoquanzicun', 'xinglongcun', 'xinfacun', 'xiangyangcun', 'shuanglongquancun', 'shenglicun', 'dongkunqiancun', 'madangqiancun', 'aerlacun', 'guonicun', 'minzucun'];
                }

                $.each(canWorkList, function(index, val) {
                    $("#" + val).addClass('validMap');
                });
            },
            "mapPlay": function(type) {
                //type= "block" || "none";
                $('.mapBox').css('display', type);
            },
            // 返回莫旗大地图
            "goBack": function() {
                $('#map-goBack').unbind("click").on('click', function(event) {
                    event.preventDefault();
                    /* Act on the event */
                    area = "moqi";
                    mapApi.showMap("moqi");
                    mapApi.getData();
                    $(this).removeClass('show');
                });
            },
             "quitHp":function(){
                $('.quitHp-btn').on('click', function(event) {
                   $('.hangPai').hide();
                });
            },

                        //村地图按钮
              "showVillageMap":function (){
                    if (mapApi.curr_path_id!='shenglicun') {
                         return;
                        alert("该村此功能暂未上线");
                       
                    }
                    $('.hangPai').show();//
                    $('#hangPai').html(template('hangPaiTemp',{}));
                     $('.'+'hp-'+mapApi.curr_path_id).show();
                    $(".hangPai").scrollTop($(window).height()/3);
                    $(".hangPai").scrollLeft($(window).width()/8);
                    mapApi.homeClick();
                    mapApi.quitHp();
            },
            "homeClick":function(){
                $('.hp-shenglicun').find('.seeInfo').on('click', function(event) {

                    var homeId=$(this).attr('data-Name');
                    //获取扶贫卡内容数据

                    $.get("http://moqi.test.grdoc.org/api/people/detail?id="+homeId, function(res) {
                        console.log(res.data);
                        //res.data.level = res.data.illness[0]?res.data.illness[0].illness_level:"";
                        var  homeBox=  $.jBox('', { title:res.data.username, buttons: {}, border: 0, opacity: 0.4 });
                        document.getElementsByClassName('jbox-content')[0].innerHTML = template('personalTemp', res.data);

                        if(!res.data.income_detail)return;
                        var self_data = res.data.income_detail.self_income;
                        var trans_data = res.data.income_detail.trans_income;
                        var selfProfit = {
                            color: ['#feef35', '#2caaf1', '#e77346', '#f6b45a ','#98da2a'],
                            data: [
                                { value: self_data.other||"", name: '其它' },
                                { value: self_data.money||"", name: '财产' },
                                { value: self_data.farm||"", name: '种植业' },
                                { value: self_data.work||"", name: '务工' },
                                { value: self_data.feed||"", name: '养殖业' }
                            ],
                            radius: ['30%', '40%'],
                            center: ["50%", "50%"],
                            formatter: "{b}\n{c}元\n({d}%)",
                            titleShow: false,
                            title: "自主性经营收入"
                        };
                        var transProfit = {
                            color: ['#feef35', '#2caaf1', '#e77346', '#f6b45a ','#98da2a'],
                            data: [
                                { value: trans_data.basic||"", name: '低保五保' },
                                { value: trans_data.ecology||"", name: '生态扶持' },
                                { value: trans_data.insurance||"", name: '养老农业保险' },
                                { value: trans_data.industry||"", name: '产业扶持' },
                                { value: trans_data.food||"", name: '粮食、良种草原补贴' }
                            ],
                            radius: ['30%', '40%'],
                            center: ["50%", "50%"],
                            formatter: "{b}\n{c}元\n({d}%)",
                            titleShow: false,
                            title: "转移性收入"
                        };
                        charts.labelPieChart("selfProfit", selfProfit);
                        charts.labelPieChart("transProfit", transProfit);
                    });

                });
            },
            //初始化 首页地图
            "getMap": function(oSvg) { //获取县地图
                mapApi.curr_svg = oSvg;
                if (mapApi.curr_svg) {
                    // console.log(mapType)

                     mapApi.hoverLock = true;

                    mapApi.oSvgBox.on("click", function(event) {
                        event.preventDefault();
                        //oSvg.find(".validMap").css("fill", mapApi.outColor);
                        $(".map-links").removeClass("show");
                        $(".map-tips").removeClass("show");
                        mapApi.hoverLock = true;
                        var mapType = mapApi.curr_svg.attr("id");
                        if (mapApi.curr_path_id && mapType == "moqi") {
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
                        $.getJSON("../js/json/map_hover.json", function(res) {

                                var data = res.povertyStructure[target];
                                $(".map-tips").html(template("mapHoverTemp", data)).addClass("show")
                                    .css({
                                        "left": x - $('.map-tips').width()/2,
                                        "top": y - $('.map-tips').height()*1.5,
                                    });
                            })
                        console.log(mapApi.dis_w);
                         //alert($('.map-tips').width());
                            //console.log($(this).attr("id"));
                    }
                });
                //鼠标点击地图
                oSvg.on("click", ".validMap", function(event) {
                    event.stopPropagation();
                    if (mapApi.curr_path_id == this.id) {
                        //如果有当前id 已选中某镇
                        // if (mapApi.curr_path_id != this.id) {
                        //     //oSvg.find(".validMap").css("fill", mapApi.outColor);
                        //     mapApi.curr_path_id = false;
                        //     area = "moqi";
                        //     mapApi.getData();
                        //     $(".map-links").removeClass("show");
                        //     mapApi.hoverLock = true;
                        //     return false;
                        // }
                        return;
                    } else {
                        //如果没有当前id;未选中镇
                        mapApi.hoverLock = false;
                        //oSvg.find(".validMap").css("fill", mapApi.outColor);
                        //this.style.fill = mapApi.inColor;
                        var x = event.pageX || event.clientX - mapApi.scrollX;
                        var y = event.pageY || event.clientY - mapApi.scrollY;
                        mapApi.curr_path_id = this.id;
                        // 改变当前选中区域名称
                        area_name = $(this).attr("data-name");
                        // console.log(area_name);
                        $(".map-tips").removeClass("show");
                        var target = this.id;
                        // alert(this.id);
                        // alert($(this).attr('data-name'));
                        $.getJSON("../js/json/map_hover.json", function(res) {
                            //var target = event.target.id;
                            var data = res.povertyStructure[target];
                            $(".map-links").html(template("mapClickTemp", data)).css({
                               "left": x - $('.map-links').width()/2,
                                "top": y - $('.map-links').height()*1.5,
                            }).addClass("show");

                            //帮进入下一级地图
                            $("#changeMap").on('click', function(event) {
                                event.stopPropagation();
                                event.preventDefault();
                                mapApi.curr_svg.removeClass('show');
                                $(".map-links").removeClass('show');

                                area = mapApi.curr_path_id;
                                // var txt = $("#tab div.active").text();


                                //获取地图两测数据；
                                $("#areaSelectInHeader").val(area);
                                mapApi.getData();

                                var _id = '#' + mapApi.curr_path_id + 'Svg';
                                $(_id).addClass('show');
                                mapApi.getSubMap($(_id));
                                mapApi.hoverLock = true;
                                mapApi.curr_path_id = false;
                            });
                        })
                    }
                    //改变当前选择区域

                    //打开督导组成员弹窗
                    $(".links-list li").eq(1).unbind("click").on("click", function() {
                        $.getJSON("../js/json/superVisorGroup.json", function(res) {
                            var data = res[mapApi.curr_path_id];
                            //alert(area);
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

            }, //getMap
            //     /**
            //      * 地图和顶部tab结合查询数据
            //      * @param type 所选中的tab
            //      */
            "getData": function() {
                var txt = $("#tab li.active").text();
                switch (txt) {
                    case "首页":
                        api.getHomePage();
                        break;
                    case "党建促脱贫":
                        api.getGovernment();
                        break;
                    case "健康扶贫":
                        api.getDisease();
                        break;
                }
            },
            //进入二级地图
            "getSubMap": function(oSvg) {

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
                oSvg.unbind("click").on('click', '.validMap', function(event) {
                    event.stopPropagation();

                    //如果没有当前id;未选中镇
                    mapApi.hoverLock = false;
                    //oSvg.find('.validMap').css('fill', mapApi.outColor);
                    //this.style.fill = mapApi.inColor;
                    var x = event.pageX || event.clientX + mapApi.scrollX;
                    var y = event.pageY || event.clientY + mapApi.scrollY;
                    mapApi.curr_path_id = this.id;
                    mapApi.curr_path_name = $(this).attr("data-name");

                    //获取当前顶部选中页签
                    var text = $("#tab").find("li.active").text();

                    //数据变量
                    // var res = "";
                    // var area = "西瓦尔图镇";
                    // var curr_path_name = "兴隆村";
                    //请求贫困家庭列表数据
                     if (text == "健康扶贫") {
                        if(event.target.parentNode.id=="shenglicun"){
                             $(".map-links").html(template("villageClickTemp", {}))
                             .css({
                            "left": x - $('.map-links').width()/2,
                             "top": y - $('.map-links').height()*1.5
                             })
                             .addClass('show');
                             //点击列表详情
                             $('#villagerList').on('click',function(){
                                $.ajaxSettings.async = false;
                                $.get("http://moqi.test.grdoc.org/api/poverty_relief_card/list?town=" + area_name + "&village=" + mapApi.curr_path_name, function(data) {
                                    // res = data;
                                    getHouseList(data,mapApi.curr_path_name);
                                    // console.log(data);
                                });
                             });
                             //点击村地图按钮
                              $('#partyVillageMap').on('click',mapApi.showVillageMap);
                             return; 
                        }
                        $.ajaxSettings.async = false;
                        $.get("http://moqi.test.grdoc.org/api/poverty_relief_card/list?town=" + area_name + "&village=" + mapApi.curr_path_name, function(data) {
                            // res = data;
                            getHouseList(data,mapApi.curr_path_name);
                            // console.log(data);
                        });
                    } else if (text == "首页") {
                        if(event.target.parentNode.id=="shenglicun"){
                             $(".map-links").html(template("villageClickTemp", {}))
                             .css({
                            "left": x - $('.map-links').width()/2,
                             "top": y - $('.map-links').height()*1.5
                             })
                             .addClass('show');
                             //点击列表详情
                             $('#villagerList').on('click',function(){
                                $.ajaxSettings.async = false;
                                $.get("http://moqi.test.grdoc.org/api/people/list?town=" + area_name + "&village=" + mapApi.curr_path_name, function(data) {
                                                           // res = data;
                                   getHouseList(data,mapApi.curr_path_name);
                                   // console.log(data);
                               });
                             });
                             //点击村地图按钮
                              $('#partyVillageMap').on('click',mapApi.showVillageMap);
                             return; 
                        }
                        $.get("http://moqi.test.grdoc.org/api/people/list?town=" + area_name + "&village=" + mapApi.curr_path_name, function(data) {
                            // res = data;
                            getHouseList(data,mapApi.curr_path_name);
                            // console.log(data);
                        });
                    } else if(text == "党建促脱贫"){
                        //modified for 党建点击村时，如果是胜利村则显示四条，其他则只显示两条 by tlw at 20170606 start
                        $(".map-links").html(template("mapPartyClickTemp", {}));
                        var committeeData={},workTeamData={};
                        $.getJSON(" ../js/json/committee.json",function(res){committeeData=res});
                        $.getJSON(" ../js/json/first_secretary.json",function(res){workTeamData=res});
                        if(event.target.parentNode.id!=="shenglicun"){
                            $("#partyHome").parent().hide();
                            $("#partyVillageClub").parent().hide();
                        }
                        if(!committeeData[mapApi.curr_path_name]){
                            $("#villageCadre").parent().hide();
                        }
                        if(!workTeamData[mapApi.curr_path_name]){
                            $("#workTeam").parent().hide();
                        }
                        $(".map-links").css({
                            "left": x - $('.map-links').width()/2,
                             "top": y - $('.map-links').height()*1.5
                        }).addClass("show");
                        //modified for 党建点击村时，如果是胜利村则显示四条，其他则只显示两条 by tlw at 20170606 end

                        //党员家按钮//
                        $('#partyHome').on('click', function(event) {
                            event.preventDefault();
                            $.getJSON("../js/json/partyMember.json",function(res){
                                var _data = {};
                                var list = [];
                                for(var p in res){
                                    list.push(res[p]);
                                }
                                _data.data = list;
                                getHouseList(_data,"党员家","partyFamilyTemp");
                            });
                        });
                        //干部按钮
                        $('#partyLeader').on('click', function(event) {
                            event.preventDefault();  
                            /* Act on the event */
                            $.getJSON("../js/json/cadre.json",function(res){
                                var membersTemp = template("cadreTemp", res.data);
                                var titleHtml = template("selectTown", {});
                                var html = titleHtml + "<div>" + membersTemp + "</div>";
                                //分页容器
                                html += "<ul class='page'></ul>";
                                $.jBox(html, { title: "干部", buttons: {}, border: 0, opacity: 0.4 });
                                document.getElementsByTagName('body')[0].style.padding = "0";
                                // 获取表格容器
                                var container = $('.jbox-content>div').eq(1);
                                jpage.page(res.data, "cadreTemp", container, 10);
                            });
                        });
                        //驻村第一书记工作队按钮
                        $('#workTeam,#villageCadre').on('click', function(event) {
                            event.preventDefault();
                            var title=mapApi.curr_path_name+'<span>村 两 委 干 部</span>';
                            // var url=" ../js/json/committee.json"
                            var listData = committeeData;
                            if(event.target.id=="workTeam"){
                                title = mapApi.curr_path_name+'<span>驻 村 第 一 书 记 工 作 队</span>';
                                // url=" ../js/json/first_secretary.json"
                                listData = workTeamData;
                            }
                            /* Act on the event */
                            // $.getJSON(url,function(res){
                                var data={};
                                    data.data = listData[mapApi.curr_path_name];
                                // var membersTemp = template("workTeamAndCadreTemp", data);
                                var html = "<div></div>";
                                //分页容器
                                html += "<ul class='page'></ul>";
                                var $pop = $.jBox(html, { title:title, buttons: {}, border: 0, opacity: 0.4 });
                                document.getElementsByTagName('body')[0].style.padding = "0";
                                // 获取表格容器
                                $pop.find(".jbox-title").css({"width":"100%","position":"relative"});
                                var container = $('.jbox-content>div').eq(0);
                                jpage.page(data.data, "workTeamAndCadreTemp", container, 10);
                            // });
                        });
                        //村地图按钮
                        $('#partyVillageMap').on('click',mapApi.showVillageMap);

                    }else{

                    }
                    /**
                     * 打开户列表的方法
                     * @param res 数据
                     * @param title 弹窗标题
                     * @param temp 党员家列表模板or村户列表
                     */
                    function getHouseList(res,title,temp) {
                        //temp为党员家列表
                        var _temp = temp||"villageTemp";
                        var membersTemp = template(_temp, res);
                        var titleHtml = template("selectTown", {});
                        var html = titleHtml + "<div>" + membersTemp + "</div>";
                        //分页容器
                        html += "<ul class='page'></ul>";
                        $.jBox(html, { title: title+"&nbsp;&nbsp;"+res.data.length+"人", buttons: {}, border: 0, opacity: 0.4 });
                        document.getElementsByTagName('body')[0].style.padding = "0";
                        // 获取表格容器
                        var container = $('.jbox-content>div').eq(1);
                        jpage.page(res.data, _temp, container, 10);
                        //设置已选中村的option
                        $(".select-switch").find("option[value='" + mapApi.curr_path_id + "']").attr("selected", "selected");
                        //绑定select切换事件
                        $(".select-switch select").on("change", function() {
                            var curVillage = $(this).val();
                            //重置分页
                            $(".page").html("");
                            var newData = res[area][curVillage];
                            var membersTemp = template("villageTemp", newData);
                            $('.jbox-content>div').eq(1).html("").html(membersTemp);
                            jpage.page(newData, "villageTemp", container, 10);
                        });
                        //家庭列表绑定点击事件
                        container.on("click", "tbody tr", function() {
                            var text = $("#tab").find("li.active").text();
                            var name = $(this).find("td:eq(1)").text();

                            var userId = $(this).attr("id");
                            console.log(userId);
                            /*var family = res.data.filter(function(a) {
                                return a.name == name;
                            });*/
                            var $pop = $.jBox('', { title: name, buttons: {}, border: 0, opacity: 0.4 });
                            document.getElementsByTagName('body')[0].style.padding = "0";
                            $pop.find("#jbox").css("top", "2.6vw");
                            if (text == "健康扶贫") {
                                getHelpPoor(userId, 1);
                                //绑定图片放大事件
                                $(".physexam-record img").viewer();
                                //绑定家庭成员点击事件
                                $pop.find(".per-mid tbody").on("click", "tr", function() {
                                    var member = $(this).children("td").eq(0).text();
                                    var memberId = $(this).attr("id");
                                    var $popOther = $.jBox('', { title: member, buttons: {}, border: 0, opacity: 0.4 });
                                    document.getElementsByTagName('body')[0].style.padding = "0";
                                    $popOther.find("#jbox").css("top", "2.6vw");
                                    getHelpPoor(memberId, 2);
                                    //绑定图片放大事件
                                    $popOther.find(".physexam-record img").viewer();
                                })
                            } else if (text == "首页") {
                                console.log(userId);

                                $.get("http://moqi.test.grdoc.org/api/people/detail?id=" + userId, function(res) {
                                    document.getElementsByClassName('jbox-content')[1].innerHTML = template('personalTemp', res.data);
                                    // chart.barChart("fupinBar", ["住房保障","产业扶持","生态扶持","教育扶持","政策兜底"], [0, 0, 0, 0,0], true);
                                    // chart.barChart("profitBar", ["自主经营性收入","政策性补贴收入"], [0, 0], true);
                                    //家庭收入
                                    if(!res.data.income_detail)return;
                                    var self_data = res.data.income_detail.self_income;
                                    var trans_data = res.data.income_detail.trans_income;
                                    var selfProfit = {
                                        color: ['#feef35', '#2caaf1', '#e77346', '#f6b45a ','#98da2a'],
                                        data: [
                                            { value: self_data.other||"", name: '其它' },
                                            { value: self_data.money||"", name: '财产' },
                                            { value: self_data.farm||"", name: '种植业' },
                                            { value: self_data.work||"", name: '务工' },
                                            { value: self_data.feed||"", name: '养殖业' }
                                        ],
                                        radius: ['30%', '40%'],
                                        center: ["50%", "50%"],
                                        formatter: "{b}\n{c}元\n({d}%)",
                                        titleShow: false,
                                        title: "自主性经营收入"
                                    };
                                    var transProfit = {
                                        color: ['#feef35', '#2caaf1', '#e77346', '#f6b45a ','#98da2a'],
                                        data: [
                                            { value: trans_data.basic||"", name: '低保五保' },
                                            { value: trans_data.ecology||"", name: '生态扶持' },
                                            { value: trans_data.insurance||"", name: '养老农业保险' },
                                            { value: trans_data.industry||"", name: '产业扶持' },
                                            { value: trans_data.food||"", name: '粮食、良种草原补贴' }
                                        ],
                                        radius: ['30%', '40%'],
                                        center: ["50%", "50%"],
                                        formatter: "{b}\n{c}元\n({d}%)",
                                        titleShow: false,
                                        title: "转移性收入"
                                    };
                                    charts.labelPieChart("selfProfit", selfProfit);
                                    charts.labelPieChart("transProfit", transProfit);
                                });
                            } else {
                                //党建弹窗点击
                                $.getJSON("../js/json/partyMember.json",function(res){
                                    var cadreHtml = template('partyMemberInfo', res[name]);
                                    // console.log(res.data.physical_exam_records);
                                    document.getElementsByClassName('jbox-content')[1].innerHTML = cadreHtml;
                                })
                            }
                        });
                    };
                    /**
                     * 获取扶贫卡数据
                     * id 用户id
                     * index 第几个弹窗
                     */
                    function getHelpPoor(id, index) {
                        //获取扶贫卡数据
                        $.ajaxSettings.async=false;
                        $.get("http://moqi.test.grdoc.org/api/poverty_relief_card/detail?id=" +id, function(res) {
                            res.data.level = res.data.illness[0]?res.data.illness[0].illness_level:"";
                            var cardHtml = template('helpCardTemp', res.data);
                            // console.log(res.data.physical_exam_records);
                            document.getElementsByClassName('jbox-content')[index].innerHTML = cardHtml;
                        });
                    }

                });
            }, //getSubmap
            //切换地图公共方法 mapApi.showMap
            //传入地图 id
            "showMap": function(mapid) {
                if (mapid == "moqi") {
                    var idStr = '#' + mapid;
                    $('svg').removeClass('show');
                    $(idStr).addClass('show');
                    $('.map-links').removeClass('show');
                    $('.map-tips').removeClass('show');
                    //mapApi.curr_svg.find(".validMap").css("fill", mapApi.outColor);
                    mapApi.getMap($(idStr));
                    mapApi.hoverLock = true;
                    mapApi.curr_path_id = false;
                    return;
                }
                var idStr = '#' + mapid + 'Svg';
                $('svg').removeClass('show');
                $('.map-links').removeClass('show');
                $('.map-tips').removeClass('show');
                //mapApi.curr_svg.find(".validMap").css("fill", mapApi.outColor);
                $(idStr).addClass('show');
                mapApi.getSubMap($(idStr));
                mapApi.hoverLock = true;
                mapApi.curr_path_id = false;
            },

            "poorRate": function() {
                var data = {
                    "nierjizhen":{
                         "dengteke": "5%",
                    },
                    "baoshanzhen": {
                         "xiwaertuzhen": "11%",
                    }
                };
                for(var  dataKey in data){
                        for (var key in dataKey) {

                        console.log("1%" < 0.03);

                        if (parseInt(poordata[key]) <= 1) {
                            $('#' + key).addClass('colorL');
                        } else if (parseInt(poordata[key]) >= 5) {
                            $('#' + key).addClass('colorL');
                            // alert(key);
                        } else {
                            //$('#'+key).addClass('colorL');
                            console.log(key);
                        }
                    }
                }
                
            },
        }; //mapApi
        //初始化地图方法；
        mapApi.init("moqi", "homePage");
        //地图模块js ---------end----------
        // $('#logout').on('click',function(event) {
        //                      $('.hangPai').show();//
        //                      $('#hangPai').html(template('hangPaiTemp',{}));
        //                      homeClick();
        //                      //alert();
        //                      $(".hangPai").scrollTop($(window).height()/3);
        //                      $(".hangPai").scrollLeft($(window).width()/8);
        //                     quitHp();
        //                     //退出按钮
        //                     function quitHp(){
        //                         $('.quitHp-btn').on('click', function(event) {
        //                            $('.hangPai').hide();
        //                         });
        //                     }
        //                     //点击房子弹出卡片
        //                     function homeClick(){
        //                         $('.hPshenglicunSvg').find('.seeInfo').on('click', function(event) {
        //                              var  homeBox=  $.jBox('', { title:'详情', buttons: {}, border: 0, opacity: 0.4 });
        //                             var homeId=$(this).attr('data-name');
        //                             //获取扶贫卡内容数据
        //                            $.get("http://moqi.test.grdoc.org/api/poverty_relief_card/detail?id=" + homeId, function(res) {
        //                                res.data.level = res.data.illness[0]?res.data.illness[0].illness_level:"";
        //                                 var cardHtml = template('helpCardTemp', res.data);
        //                                 document.getElementsByClassName('jbox-content')[0].innerHTML = cardHtml;
        //                                console.log(); 
        //                             });
        //                         });
        //                     }
        //                 });

    });
