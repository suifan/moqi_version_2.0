/**
 * Created by Administrator on 2017/5/17.
 */
require.config({
    paths: {
        'echarts': '../lib/echarts.min'
    }
});
define(['echarts'],function(echarts){
    var pieChart = function(id, color1,color2,dataArr,percent,label){
        var pieChart = echarts.init(document.getElementById(id));
        pieChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{b}\n{d}%",//单位参数
                padding: [2, 4],
                confine: true,
                show: false
            },
            color: [color1,color2],
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['60%', '80%'],
                    avoidLabelOverlap: false,
                    hoverAnimation:false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: percent+(label?label:"")||"{d}"+(label?label:""),
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'normal',
                                color:color1
                            }
                        }
                    },
                    data: dataArr,

                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
        resize_window(pieChart);
    };
    /**
     * 底部条形图
     * @param id
     * @param towns
     * @param data
     * @param titleBool
     */
    var barChart = function(id,towns,data,titleBool){
        var barchart = echarts.init(document.getElementById(id));
        // var towns = ["尼尔基镇", "西瓦尔图镇", "拉杜尔鄂温族乡","拉杜尔鄂","拉杜", "拉杜克民族乡", "反政府武装", "西瓦尔图镇", "拉杜尔鄂乡", "拉杜克民族乡", "反政府武装","伊拉克", "美国", "北京", "登特办事处", "坤米尔", "办事粗"];
        barchart.setOption({
            title : {
                text: '年总额(单位：万)',
                textAlign:'left',
                textStyle:{
                    color:'#fff',
                    fontSize: 10
                },
                right: 0,
                show: false
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + ':' + tar.data;
                }
            },
            grid: {
                left: '0%',
                right: '2%',
                bottom: '2%',
                height: '80%',
                //width: "100%",
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : towns,
                    axisLabel: {
                        textStyle: {
                            color: "#fff"
                        },
                        interval:0,
                        formatter: function (val) {
                            //return val.name.replace(/(.{5})/g,'$1\n'); // 让series 中的文字进行换行
                            if (val.length > 4) {
                                var _val = val.substring(0, 5) + "\n"+val.substring(5);  // 让series 中的文字超出5个显示...
                                return _val;
                            }
                            return val;
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show : true,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#3a4146",
                            width: 1
                        }
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    barWidth: '60%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color:"#fff"
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 0, 0,
                                [
                                    {offset: 0, color: '#1287b3'},//颜色参数
                                    {offset: 1, color: '#0ed1f1'}
                                ]
                            )
                        }
                    },
                    data:data
                }
            ]
        })
    };
    /**
     * 教育统计条形图
     * @param id
     * @param obj chart结构参数
     */
    var blueBarChart = function(id,obj){
        var barchart = echarts.init(document.getElementById(id));
        // var towns = ["尼尔基镇", "西瓦尔图镇", "拉杜尔鄂温族乡","拉杜尔鄂","拉杜", "拉杜克民族乡", "反政府武装", "西瓦尔图镇", "拉杜尔鄂乡", "拉杜克民族乡", "反政府武装","伊拉克", "美国", "北京", "登特办事处", "坤米尔", "办事粗"];
        barchart.setOption({
            title : {
                text: '总额(单位：万元)',
                textAlign:'left',
                textStyle:{
                    color:'#1287b3',
                    fontSize: 10
                },
                left: 0,
                show: obj.titleBool
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + ':' + tar.data;
                }
            },
            grid: {
                left: '0%',
                right: '2%',
                bottom: '3%',
                height: '80%',
                //width: "100%",
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : obj.xArr,
                    axisLabel: {
                        textStyle: {
                            color: "#1287b3"
                        },
                        interval:0,
                        formatter: function (val) {
                            //return val.name.replace(/(.{5})/g,'$1\n'); // 让series 中的文字进行换行
                            if (val.length > 4) {
                                var _val = val.substring(0, 5) + "\n"+val.substring(5);  // 让series 中的文字超出5个显示...
                                return _val;
                            }
                            return val;
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle:{
                            color:'#1287b3',
                            width:2
                        }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show : true,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle:{
                            color:'#1287b3',
                            width:2
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#1287b3",
                            width: 1
                        },
                        show:false
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    barWidth: '60%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 0, 0,
                                [
                                    {offset: 0, color: '#1287b3'},//颜色参数
                                    {offset: 1, color: '#0ed1f1'}
                                ]
                            )
                        },
                        emphasis: {
                            color: []
                        }
                    },
                    data:obj.data
                }
            ]
        })
    };
    var outPovertyChart = function(id,data){
        var barchart = echarts.init(document.querySelector("#jbox #"+id));
        barchart.setOption({
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['已脱贫','未脱贫'],
                left: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : data.townNames,
                    axisTick: {
                        alignWithLabel: true,
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",

                        },
                        interval:0,
                        formatter: function (val) {
                            //return val.name.replace(/(.{5})/g,'$1\n'); // 让series 中的文字进行换行
                            if (val.length > 3 && val.length<7 ) {
                                var _val = val.substring(0, 3) + "\n"+val.substring(3);  // 让series 中的文字超出5个显示...
                                return _val;
                            }else if(val.length>6){
                                var _val = val.substring(0, 3) + "\n"+val.substring(3,6)+"\n"+val.substring(6);  // 让series 中的文字超出5个显示...
                                return _val;
                            }
                            return val;
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#3a4146',
                            width: 2
                        }
                    }
                }

            ],
            yAxis : [
                {
                    type : 'value',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{
                            color: "#fff"
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#4c5760",
                            width: 3
                        }
                    }
                }
            ],
            series : [
                {
                    name:'已脱贫',
                    stack: '其他',
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: "#ff7151"
                        }
                    },
                    data:data.complete
                },
                {
                    name:'未脱贫',
                    type:'bar',
                    stack: '其他',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 0, 0,
                                [
                                    {offset: 0, color: '#1287b3'},//颜色参数
                                    {offset: 1, color: '#0ed1f1'}
                                ]
                            )
                        }
                    },
                    data:data.andPoor
                }
            ]
    })
        resize_window(barchart);
    }
    /**
     * 重置浏览器窗口图表随之变化
     * @param Chart 图表
     */
    function resize_window(Chart) {
        $(window).resize(function () {
            Chart.resize();
        });
    };
    return {
        'pieChart': pieChart,
        'barChart': barChart,
        'poorChart': outPovertyChart,
        'blueBarChart':blueBarChart
    }
})
