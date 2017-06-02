require.config({
    paths: {
        'echarts': '../lib/echarts.min'
    }
});
define(['echarts'],function(echarts){
/**
 * 首页-致贫原因情况-饼图
 * 有legend 有label
 * @param id 容器id
 * @param chartData 数据
 * @param label 是否显示中间固定的label
 */
    var pieChart = function(id,label,chartData){
        var pie = echarts.init(document.getElementById(id));
        pie.setOption(
            {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c}<br/>{d}%"
                },
                legend: {
                    orient: 'horizontal',
                    bottom:'20',
                    right:'0',
                    itemHeight:'5',
                    itemWidth:5,
                    width:10,
                    textStyle:{
                        color:'#fff'
                    },
                    data:chartData.legend
                },
                series: [
                    {
                        type:'pie',
                        radius: chartData.radius||['30%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: label,
                                position: 'center',
                                formatter: chartData.total,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'lighter',
                                    color: '#fff'
                                }
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        center:chartData.center||["30%","50%"],
                        color:chartData.color,
                        data:chartData.data
                    }
                ]
            }
        );
    resize_window(pie)
    };

    /**
     * 实心饼图
     *
     */

    var fullPieChart = function(id,chartData) {
        var fullPie = echarts.init(document.getElementById(id)).setOption(
            {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c}<br/>{d}%"
                },
                legend: {
                    orient: 'horizontal',
                    bottom: '30',
                    right: '0',
                    itemHeight: '5',
                    itemWidth: 5,
                    width: 10,
                    textStyle: {
                        color: '#fff'
                    },
                    data: chartData.legend
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '70%',
                        center: ['40%', '50%'],
                        color: chartData.color,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '15',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: chartData.data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        );
        resize_window(fullPie);
    };

    /**
     * 类似仪表盘
     * param id : string 图表容器
     * param barData : object value:占比，color:颜色
     */
    var gauge = function(id,barData) {
        var gaugeChart = echarts.init(document.getElementById(id))
        gaugeChart.setOption(
            {
                series: [{
                    name: '',
                    type: 'gauge',
                    center: ['50%', '60%'], // 默认全局居中
                    radius: '65%',
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: [
                                [barData.value, barData.color],//第一个参数：控制进度条位置 第二个参数：进度条颜色
                                [1, '#384149']//背景颜色
                            ],
                            width: 10
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: false,
                        length: '0',
                        width: '0'
                    },
                    detail: {
                        formatter: '{value}%',
                        offsetCenter: [0, '0%'],
                        textStyle:{fontSize:'20',color:'#fff'},

                    },
                    data: [{
                        value: barData.dataValue,
                        label: {
                            textStyle: {
                                fontSize: 12
                            }
                        }
                    }]
                }]
            }
        );
        resize_window(gaugeChart);
    };

    /**
     * 显示label和labelline且位置居中的饼图
     * @param id : string 图表容器
     * @param pieData : object
     * @pieData.color : 颜色(可以为array)
     * @pieData.data  : 数据
     */
    var labelPie = function(id,pieData) {
        var labelPieChart = echarts.init(document.getElementById(id))
        labelPieChart.setOption(
            {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c}人<br/>{d}%"
                },
                color: pieData.color,
                series: [
                    {
                        type:'pie',
                        center:pieData.center||["50%","60%"],
                        radius: pieData.radius||['35%', '60%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                textStyle: {
                                    color:'#fff'
                                },
                                formatter:"{b}{c}人"
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                lineStyle: {
                                    color:'#fff'
                                }
                            }
                        },
                        data:pieData.data
                    }
                ]
            }
        );
        resize_window(labelPieChart);
    };

    var legendPie = function(id,pieData) {
        var legendPie = echarts.init(document.getElementById(id))
        legendPie.setOption(
            {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c}人<br/>{d}%"

                },
               legend: {
                                   orient: 'horizontal',
                                   bottom:'20',
                                   //left:'0',
                                   itemHeight:'5',
                                   itemWidth:5,
                                  // width:10,
                                   textStyle:{
                                       color:'#fff'
                                   },
                                   data:pieData.legend
                               },
                color: pieData.color,
                series: [
                    {
                        type:'pie',
                        center:pieData.center||["50%","60%"],
                        radius: pieData.radius||['35%', '60%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                textStyle: {
                                    color:'#fff'
                                },
                                formatter:"{c}"
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                lineStyle: {
                                    color:'#fff'
                                }
                            }
                        },
                        data:pieData.data
                    }
                ]
            }
        );
        resize_window(legendPie);
    };
    /**
     * 显示label和labelline饼图(针对健康扶贫右侧)
     * @param id : string 图表容器
     * @param pieData : object
     * @pieData.color : 颜色(可以为array)
     * @pieData.data  : 数据
     */
    var labelPieChart = function(id,pieData) {
        var labelPieChart = echarts.init(document.getElementById(id))
        labelPieChart.setOption(
            {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}:{c}"
                },
                color: pieData.color,
                series: [
                    {
                        type:'pie',
                        center:pieData.center||["50%","60%"],
                        radius: ['35%', '60%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                textStyle: {
                                    color:'#fff'
                                },
                                formatter:pieData.formatter || "{b} :  {c}"
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                lineStyle: {
                                    color:'#fff'
                                }
                            }
                        },
                        data:pieData.data
                    }
                ]
            }
        );
        resize_window(labelPieChart);
    };


    /**
     * 横向柱状图
     * @param id : string 图表容器
     * @param pieData : object
     * @pieData.color : 颜色(可以为array)
     * @pieData.data  : 数据
     * @pieData.yAxisData : Y轴坐标轴字段
     */
    var xBarChart = function(id,barData){
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(
             {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '2%',
                    right: '5%',
                    bottom: '3%',
                    top:"0%",
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#111',
                            width: 3
                        }
                    },
                    splitLine: {show:false}
                },
                yAxis: {
                    data: barData.yAxisData,
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#111',
                            width: 3
                        }
                    }
                },
                series: barData.data,
                 color:barData.color
            }
        );
        resize_window(chart);
    };
    /**
     * 折线图
     * @param id : string 图表容器
     * @data.xArr : X轴数据
     * @data.yArr  : Y轴数据
     */
    var lineChart = function(id,data){
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(
            {
                title: {
                    text: data.title||'本周签约医生签约数量                        单位:人',
                    textStyle:{
                        color:'#fff',
                        fontSize:'12px'
                    }
                },
                grid: data.grid,
                tooltip: data.tooltip,
                xAxis: {
                    axisLine:{
                        lineStyle:{
                            color:data.axisLabelColor||'#666',
                            width:data.axisLineWidth||1
                        }
                    },
                    type: 'category',
                    boundaryGap: true,
                    data: data.xArr
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:data.axisLabelColor||'#666',
                            width:data.axisLineWidth||1
                        }
                    },
                    splitLine: {
                        show:false
                    },
                    axisTick: {
                        show:false
                    },
                    axisLabel: {
                        show:true,
                        textStyle:data.axisLabelColor||"#666"
                    }
                },
                series: [
                    {
                        name:'签约数量',
                        type:'line',
                        data:data.yArr,
                        lineStyle: {
                            normal:{
                                color: data.axisLabelColor||'#2fd819',
                                width: data.axisLineWidth||1
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: data.axisLabelColor||"#fff"
                                }
                            }
                        }
                    }
                ]
            }
        );
        resize_window(chart);
    };
    /**
     * 双折线图（生态扶贫）
     * @param id : string 图表容器
     * @data.xArr : X轴数据
     * @data.yArr  : Y轴数据
     */
    var doubleLineChart= function(id,data){
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(
            {
                title: {
                    text: '资金增长',
                    textStyle:{
                        color:'#fff',
                        fontSize:'12px'
                    }
                },
                grid: {
                    top:40,
                    left: 10,
                    right: 10,
                    height: '80%'
                },
                color: ["#fff","#6ce6fe"],
                legend: {
                    data: [{
                        name: '低保标准',
                        textStyle: {
                            color: "#fff"
                        }
                    }, {
                        name: '扶贫保障标准',
                        textStyle: {
                            color: "#6ce6fe"
                        }
                    }],
                    right: 0
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: '{b}<br/>签约数量：{c}'
                },
                xAxis: {
                    axisLine:{
                        lineStyle:{
                            color:'#6ce6fe',
                            width: 2
                        }
                    },
                    type: 'category',
                    boundaryGap: true,
                    data: data.xArr
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#6ce6fe',
                            width: 2
                        }
                    },
                    splitLine: {
                        show:false
                    },
                    axisTick: {
                        show:false
                    },
                    axisLabel: {
                        show:false
                    }
                },
                series: [
                    {
                        name:'扶贫保障标准',
                        type:'line',
                        data:data.yArr,
                        lineStyle: {
                            normal:{
                                color: '#6ce6fe',
                                width: 2
                            }
                        },
                        label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            textStyle: {
                                color: "#6ce6fe"
                            }
                        }
                    },
                    },
                    {
                        name:'低保标准',
                        type:'line',
                        data:data.yArrs,
                        lineStyle: {
                            normal:{
                                color: '#fff',
                                width: 2
                            }
                        },
                        label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: "#fff"
                            }
                        }
                    }
                    }
                ]
            }
        );
        resize_window(chart);
    };
    var centerChart = function(id,barData) {
        var centerChart = echarts.init(document.getElementById(id));
        centerChart.setOption(
            {

               title: {
                       text: barData.title,
                       
                       textStyle: {
                       color: '#00d4ff',
                       fontStyle: 'normal',
                       fontWeight: 'normal',
                       fontFamily: 'sans-serif',
                       fontSize: 14,
                       },
                   },

                color: ['#00d4ff'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                            
                            //data : ['种植养殖', '龙头企业合作社', '电商扶贫', '光伏扶贫'],
                             data : barData.xNames,
                            axisTick: {
                                show:false,
                                alignWithLabel: false
                            },
                            splitLine: {show:false},
                             axisLine: {
                                            lineStyle: {
                                                color: '#3398DB'
                                            }
                                        }


                        }
                    ],
                    yAxis : [
                        {
                           
                            splitLine: {show:false},
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                            lineStyle: {
                                                color: '#3398DB'
                                            }
                                        },
                            axisLabel:{
                                            show:false
                            }
                        },
                        {
                           
                            splitLine: {show:false},
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                            lineStyle: {
                                                color: '#3398DB'
                                            }
                                        },
                            axisLabel:{
                                            show:false
                            }
                        }
                    ],
                    series : [

                        {
                            //name:'收益万元数',
                            name:barData.pointName,
                            type:'bar',
                            barWidth: '40%',
                            label:{
                                normal:{
                                    show:true,
                                    position:'top'
                                }
                            },
                            //data:[0.5, 0.3, 0.2, 0.2]
                            data:barData.data

                        }
                    ]
            }
        );
        resize_window(centerChart);
    };



    var youChart = function(id,barData) {
        var youChart = echarts.init(document.getElementById(id));
        youChart.setOption(
            {
                title: {
                        text: '合计:5197户,12412人投入2947.36万元',
                        textStyle: {
                        color: '#00d4ff',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'sans-serif',
                        fontSize: 12,
                        },
                    },
                    color: ['#00d4ff'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                                x: '20%',
                                y:'25%',
                                itemGap:66,
                                textStyle:{
                                    color:'#fff',
                                },
                                itemWidth:16,
                                //backgroundColor:'#f00',
                        data: ['3901户,9677人投入1874.36万元', '888','777','666']
                    },
                    label:{
                                    normal:{
                                       // show:true,
                                        position:'right'
                                    }
                                 },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                          splitLine: {show:false},
                           axisTick: {
                                show: false,
                            },
                        axisLine: {
                                       lineStyle: {
                                           color: '#3398DB'
                                       }
                                   },
                        axisLabel:{
                                            show:false
                            },
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                         axisTick: {
                                show: false,
                            },
                        data:['种植养殖', '龙头企业', '电商扶贫', '光伏扶贫'],
                        axisLine: {
                                       lineStyle: {
                                           color: '#3398DB'
                                       }
                                   }
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            barWidth: '40%',
                            data: [182, 234, 290, 302]
                        },
                        {
                            name: '3901户,9677人投入1874.36万元',
                            type: 'bar',
                            //barWidth: '40%',
                            //data: [182, 234, 290, 302]
                        },
                        {
                            name: '888',
                            type: 'bar',
                            //barWidth: '40%',
                            //data: [182, 234, 290, 302]
                        },
                        {
                            name: '777',
                            type: 'bar',
                            //ata: [182, 234, 290, 302]
                        },
                        {
                            name: '666',
                            type: 'bar',
                            
                            //data: [182, 234, 290, 302]
                        },
                    ]
            }
        );
        resize_window(youChart);
    };




    /**
     * 轴线和bar同色的柱状图
     * @param id : string 图表容器
     * @param pieData : object
     * @pieData.color : 颜色(可以为array)
     * @pieData.data  : 数据
     * @pieData.xAxisData : X轴坐标轴字段
     */
    var colorLineChart = function(id,data){
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(
            {
                title:{
                    text:data.title,
                    textStyle:{
                        color:data.color,
                        fontSize:12,
                        fontWeight:'normal'
                    },
                    right:'-5',
                    top:'0'
                },
                color: [data.color],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter:"{b}：{c}"+data.unit
                },
                grid: {
                    left: '3%',
                    right: '10%',
                    top:'20%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        name:data.xName,
                        data : data.xAxisData,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine:{
                            lineStyle:{
                                color:data.color,
                                width:2
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name:data.yName,
                        interval:data.interval,
                        min:0,
                        axisLine:{
                            lineStyle:{
                                color:data.color,
                                width:2
                            }
                        },
                        splitLine:{show:false}
                    }
                ],
                series : [
                    {
                        type:'bar',
                        barWidth: '18%',
                        data:data.data,
                        label: {
                            normal: {
                                show: true,
                                formatter:"{c}"+data.unit,
                                position:"top"
                            }
                        }
                    }
                ]
            }
        );
        resize_window(chart);
    };

     var treeChart = function(id,barData) {
        var treeChart = echarts.init(document.getElementById(id));
        treeChart.setOption(
            {

               color: ['#3398DB'],
                 tooltip : {
                     trigger: 'axis',
                     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                         data : ['2016', '2017'],
                         splitLine: {show:false},
                         axisTick: {
                             show: false,
                         },
                         axisLine: {
                                         lineStyle: {
                                             color: '#3398DB'
                                         }
                                     },
                         axisLabel:{
                                         //show:false
                                         textStyle: {
                                             color: '#3398DB',
                                             fontSize:16
                                         }
                         }
                     }
                 ],
                 yAxis : [
                     {    name:'护林面积 (亩)',
                          //type : 'value',
                          splitLine: {show:false},
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                            lineStyle: {
                                                color: '#3398DB'
                                            }
                                        },
                            axisLabel:{
                                            show:false
                            }
                     }
                 ],
                 series : [
                     {
                         name:'',
                         type:'bar',
                         barWidth: '60%',
                         data:[10, 52]
                     }
                 ]
            }
        );
        resize_window(treeChart);
    };
    /**
     * 重置浏览器窗口图表随之变化
     * @param Chart 图表
     */
    function resize_window(Chart) {
        $(window).resize(function () {
            Chart.resize();
        });
    }

    return {
        'pieChart':pieChart,
        'gauge':gauge,
        'labelPie':labelPie,
        'fullPieChart':fullPieChart,
        'xBarChart':xBarChart,
        'legendPie':legendPie,
        'centerChart':centerChart,
        'labelPieChart':labelPieChart,

        'lineChart':lineChart,
        'colorLineChart':colorLineChart,

        'doubleLineChart':doubleLineChart,
        'treeChart':treeChart,

        'youChart':youChart,
        'lineChart':lineChart

    }
})
