require.config({
    paths: {
        'echarts': '../lib/echarts.min'
    }
});
define(['echarts'], function(echarts) {
    /**
     * 首页-致贫原因情况-饼图
     * 有legend 有label
     * @param id 容器id
     * @param chartData 数据
     * @param label 是否显示中间固定的label
     */
    var pieChart = function(id, label, chartData) {
        var pie = echarts.init(document.getElementById(id));
        pie.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{b}<br/>{c}<br/>{d}%"
            },
            legend: {
                orient: 'horizontal',
                bottom: '20',
                right: '0',
                itemHeight: '5',
                itemWidth: 5,
                width: 10,
                textStyle: {
                    color: '#fff'
                },
                data: chartData.legend
            },
            series: [{
                type: 'pie',
                radius: chartData.radius || ['30%', '50%'],
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
                center: chartData.center || ["30%", "50%"],
                color: chartData.color,
                data: chartData.data
            }]
        });
        resize_window(pie)
    };

    /**
     * 实心饼图
     *
     */

    var fullPieChart = function(id, chartData) {
        var fullPie = echarts.init(document.getElementById(id)).setOption({
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
            series: [{
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
            }]
        });
        resize_window(fullPie);
    };

    /**
     * 类似仪表盘
     * param id : string 图表容器
     * param barData : object value:占比，color:颜色
     */
    var gauge = function(id, barData) {
        var gaugeChart = echarts.init(document.getElementById(id))
        gaugeChart.setOption({
            series: [{
                name: '',
                type: 'gauge',
                center: ['50%', '60%'], // 默认全局居中
                radius: '65%',
                axisLine: {
                    show: false,
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [barData.value, barData.color], //第一个参数：控制进度条位置 第二个参数：进度条颜色
                            [1, '#384149'] //背景颜色
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
                    textStyle: { fontSize: '20', color: '#fff' },

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
        });
        resize_window(gaugeChart);
    };

    /**
     * 显示label和labelline且位置居中的饼图
     * @param id : string 图表容器
     * @param pieData : object
     * @pieData.color : 颜色(可以为array)
     * @pieData.data  : 数据
     */
    var labelPie = function(id, pieData) {
        var labelPieChart = echarts.init(document.getElementById(id))
        labelPieChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{b}<br/>{c}人<br/>{d}%"
            },
            color: pieData.color,
            series: [{
                type: 'pie',
                center: pieData.center || ["50%", "60%"],
                radius: pieData.radius || ['35%', '60%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: "{b}{c}人"
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: pieData.data
            }]
        });
        resize_window(labelPieChart);
    };

    var legendPie = function(id, pieData) {
        var legendPie = echarts.init(document.getElementById(id))
        legendPie.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{b}<br/>{c}人<br/>{d}%"

            },
            legend: {
                orient: 'horizontal',
                bottom: '20',
                //left:'0',
                itemHeight: '5',
                itemWidth: 5,
                // width:10,
                textStyle: {
                    color: '#fff'
                },
                data: pieData.legend
            },
            color: pieData.color,
            series: [{
                type: 'pie',
                center: pieData.center || ["50%", "60%"],
                radius: pieData.radius || ['35%', '60%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: "{c}"
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: pieData.data
            }]
        });
        resize_window(legendPie);
    };
    /**
     * 显示label和labelline饼图(针对健康扶贫右侧)
     * @param id : string 图表容器
     * @param pieData : object
     * @pieData.color : 颜色(可以为array)
     * @pieData.data  : 数据
     */
    var labelPieChart = function(id, pieData) {
        var labelPieChart = echarts.init(document.getElementById(id))
        labelPieChart.setOption({
            title:{
                text:pieData.title,
                show:pieData.titleShow,
                textStyle: {
                    color: '#fff',
                    fontSize: '12'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}:{c}"
            },
            color: pieData.color,
            series: [{
                type: 'pie',
                center: pieData.center || ["50%", "60%"],
                radius: pieData.radius || ['35%', '60%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        textStyle: {
                            color: '#fff',
                            fontSize: '10'
                        },
                        formatter: pieData.formatter || "{b} :  {c}"
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        lineStyle: {
                            color: '#fff'
                        },
                        length: 10,
                        length2: 6
                    }
                },
                data: pieData.data
            }]
        });
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
    var xBarChart = function(id, barData) {
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({
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
                top: "0%",
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
                splitLine: { show: false }
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
            color: barData.color
        });
        resize_window(chart);
    };
    /**
     * 折线图
     * @param id : string 图表容器
     * @data.xArr : X轴数据
     * @data.yArr  : Y轴数据
     */
    var lineChart = function(id, data) {
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({
            title: {
                text: data.title || '本周签约医生签约数量                        单位:人',
                textStyle: {
                    color: '#fff',
                    fontSize: '14'
                }
            },
            color:["#fff"],
            grid: data.grid,
            tooltip: data.tooltip,
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: data.axisLabelColor || '#d0d0d0',
                        width: data.axisLineWidth || 1
                    }
                },
                type: 'category',
                boundaryGap: true,
                data: data.xArr
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: data.axisLabelColor || '#d0d0d0',
                        width: data.axisLineWidth || 1
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    textStyle: data.axisLabelColor || "#d0d0d0"
                }
            },
            series: [{
                name: '签约数量',
                type: 'line',
                data: data.yArr,
                lineStyle: {
                    normal: {
                        color: data.axisLabelColor || '#2fd819',
                        width: data.axisLineWidth || 1
                    }
                },
                areaStyle: {normal: {color:'rgba(72, 153, 241, 0.3)'}},
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: data.axisLabelColor || "#fff",
                            fontSize: "16"
                        },
                        formatter:data.formatter||"{c}"
                    }
                }

            }]
        });
        resize_window(chart);
    };
    /**
     * 双折线图（生态扶贫）
     * @param id : string 图表容器
     * @data.xArr : X轴数据
     * @data.yArr  : Y轴数据
     */
    var doubleLineChart = function(id, data) {
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({
            title: {
                text: '资金增长（单位：元）',
                textStyle: {
                    color: '#fff',
                    fontSize: '14'
                }
            },
            grid: {
                top: 100,
                left: 10,
                right: 10,
                height: '60%'
            },
            color: ["#fff"],
            legend: {
                data: [{
                    name: '低保标准',
                    textStyle: {
                        color: "#fff",
                        fontSize:"12"
                    }
                }, {
                    name: '扶贫保障标准',
                    textStyle: {
                        color: "#5cd25b",
                        fontSize:"12"
                    }
                }],
                right: 0,
                top: 40
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: '{b}<br/>金额：{c}'
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#5cd25b',
                        width: 2
                    }
                },
                type: 'category',
                boundaryGap: true,
                data: data.xArr
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#5cd25b',
                        width: 2
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
                }
            },
            series: [{
                name: '扶贫保障标准',
                type: 'line',
                data: data.yArr,
                areaStyle: {normal: {color:'rgba(72, 153, 241, 0.3)'}},
                lineStyle: {
                    normal: {
                        color: '#5cd25b',
                        width: 2
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        textStyle: {
                            color: "#5cd25b",
                            fontSize: "16"
                        }
                    }
                },
            }, {
                name: '低保标准',
                type: 'line',
                data: data.yArrs,
                areaStyle: {normal: {color:'rgba(72, 153, 241, 0.3)'}},
                lineStyle: {
                    normal: {
                        color: '#fff',
                        width: 2
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: "#fff",
                            fontSize: "16"
                        }
                    }
                }
            }]
        });
        resize_window(chart);
    };
    var centerChart = function(id, barData) {
        var centerChart = echarts.init(document.getElementById(id));
        centerChart.setOption({

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
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            xAxis: [{
                type: 'category',

                //data : ['种植养殖', '龙头企业合作社', '电商扶贫', '光伏扶贫'],
                data: barData.xNames,
                axisTick: {
                    show: false,
                    alignWithLabel: false
                },
                splitLine: { show: false },
                axisLine: {
                    lineStyle: {
                        color: '#3398DB'
                    }
                }


            }],
            yAxis: [{

                splitLine: { show: false },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#3398DB'
                    }
                },
                axisLabel: {
                    show: false
                }
            }, {
                name: '人民币:万元',
                splitLine: { show: false },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#3398DB'
                    }
                },
                axisLabel: {
                    show: false
                }
            }],
            series: [

                {
                    //name:'收益万元数',
                    name: barData.pointName,
                    type: 'bar',
                    barWidth: '40%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    //data:[0.5, 0.3, 0.2, 0.2]
                    data: barData.data

                }
            ]
        });
        resize_window(centerChart);
    };



    var youChart = function(id, barData) {
        var youChart = echarts.init(document.getElementById(id));
        youChart.setOption({
            title: {
                text: '合计：7319户，15283人，投入2.9亿元，预计每户收益1.2万元',
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
                },
                formatter: "{b}<br/>{c}户"
            },
            // legend: {
            //     orient: 'vertical',
            //     x: '20%',
            //     y: '25%',
            //     itemGap: 66,
            //     textStyle: {
            //         color: '#fff',
            //     },
            //     itemWidth: 16,
            //     //backgroundColor:'#f00',
            //     data: ['3901户,9677人投入1874.36万元', '231户，551人 投入3万元', '120户，300人 投入3万元', '5197户，1884人 投入370万元']
            // },
            label: {
                normal: {
                    show:true,
                    position: 'bottom',
                    offset:['30','40'],
                    formatter: "{b}:{c}户"
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
                splitLine: { show: false },
                axisTick: {
                    show: false,
                },
                axisLine: { 
                    lineStyle: {
                        color: '#3398DB'
                    }
                },
                axisLabel: {
                    show: false
                },
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false,
                },
                data: ['光伏扶贫', '电商扶贫' ,'龙头企业', '种植养殖'],
                axisLine: {
                    lineStyle: {
                        color: '#3398DB'
                    }
                }
            },
            series: [{
                label:{
                    normal:{
                        show:true,
                        position:'bottom',
                        offset:[43,0],
                        textStyle:{
                            color:'#fff'
                        }
                    }
                },
                name: '',
                type: 'bar',
                barWidth: '40%',
                data:[6276, 120, 1274, 3091]

            }, {
                name: '3901户,9677人投入1874.36万元',
                type: 'bar',
                //barWidth: '40%',
                //data: [182, 234, 290, 302]
            }, {
                name: '231户，551人 投入3万元',
                type: 'bar',
                //barWidth: '40%',
                //data: [182, 234, 290, 302]
            }, {
                name: '120户，300人 投入3万元',
                type: 'bar',
                //ata: [182, 234, 290, 302]
            }, {
                name: '5197户，1884人 投入370万元',
                type: 'bar',

                //data: [182, 234, 290, 302]
            }, ]
        });
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
    var colorLineChart = function(id, data) {
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({
            title: {
                text: data.title,
                textStyle: {
                    color: data.color,
                    fontSize: 12,
                    fontWeight: 'normal'
                },
                right: '-5',
                top: '0'
            },
            color: [data.color],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: "{b}：{c}" + data.unit
            },
            grid: {
                left: '3%',
                right: '10%',
                top: '20%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                name: data.xName,
                data: data.xAxisData,
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: data.color,
                        width: 2
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                name: data.yName,
                interval: data.interval,
                min: 0,
                axisLine: {
                    lineStyle: {
                        color: data.color,
                        width: 2
                    }
                },
                splitLine: { show: false }
            }],
            series: [{
                type: 'bar',
                barWidth: '18%',
                data: data.data,
                label: {
                    normal: {
                        show: true,
                        formatter: "{c}" + data.unit,
                        position: "top"
                    }
                }
            }]
        });
        resize_window(chart);
    };

    var treeChart = function(id, barData) {
        var treeChart = echarts.init(document.getElementById(id));
        treeChart.setOption({

            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: "{b}<br/>{c}户"
            },
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'shadow'
            //     },
            //     formatter: "{b}<br/>{c}户"
            // },
            grid: {
                left: '15%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        fontSize: 18
                    },
                    formatter: "{c}万亩"

                },
                emphasis: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        fontSize: 18
                    },
                    formatter:"{c}万亩"

                },

            },
            xAxis: [{
                type: 'category',
                data: ['2016', '2017'],
                splitLine: { show: false },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#3398DB'
                    }
                },
                axisLabel: {
                    //show:false
                    textStyle: {
                        color: '#3398DB',
                        fontSize: 16
                    }
                }
            }],
            yAxis: [{
                name: barData.yName,
                //type : 'value',
                splitLine: { show: false },
                axisTick: {
                    show: false,
                },
                nameLocation: 'end',
                nameRotate: "0",
                nameTextStyle: {
                    left:'20%',
                    fontSize: 16
                },
                axisLine: {
                    lineStyle: {
                        color: '#3398DB'
                    }
                },
                axisLabel: {
                    show: false
                }
            }],
            series: [{
                name: '',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 0, 0, [
                                { offset: 0, color: '#1287b3' }, //颜色参数
                                { offset: 1, color: '#0ed1f1' }
                            ]
                        )
                    },
                    emphasis: {
                        color: []
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            color: '#f8ec04',
                            type: 'solid'
                        }
                    },
                    data: [
                        [3000,3601.5]
                    ]
                },
                barWidth: '60%',
                data: barData.data
            }]
        });
        resize_window(treeChart);
    };
    /**
     * 重置浏览器窗口图表随之变化
     * @param Chart 图表
     */
    function resize_window(Chart) {
        $(window).resize(function() {
            Chart.resize();
        });
    }

    return {
        'pieChart': pieChart,
        'gauge': gauge,
        'labelPie': labelPie,
        'fullPieChart': fullPieChart,
        'xBarChart': xBarChart,
        'legendPie': legendPie,
        'centerChart': centerChart,
        'labelPieChart': labelPieChart,

        'lineChart': lineChart,
        'colorLineChart': colorLineChart,

        'doubleLineChart': doubleLineChart,
        'treeChart': treeChart,

        'youChart': youChart,
        'lineChart': lineChart

    };
});
