var myChart = echarts.init(document.getElementById('main'));
            option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [1,2,3],
                    type: 'line'
                }]
            };
            myChart.setOption(option);