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
                        radius: ['35%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                textStyle: {
                                    color:'#fff'
                                }
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
     * 重置浏览器窗口图表随之变化
     * @param Chart 图表
     */
    function resize_window(Chart) {
        $(window).resize(function () {
            Chart.resize();
        });
    };

    return {
        'pieChart':pieChart,
        'gauge':gauge,
        'labelPie':labelPie,
        'fullPieChart':fullPieChart
    }
})
