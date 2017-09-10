import React, { Component, PropTypes } from 'react'
import { getOptions, getTitle } from "./options";

import ChartBase from "./chartbase";

class AvgPrice extends ChartBase {
    format(rptData) {
        let source = Object.entries(rptData.source);
        let series = [],
            dataStyle = {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40, 0.5)',
                }
            }, placeHolderStyle = {
                normal: {
                    color: 'rgba(44,59,70,1)',//未完成的圆环的颜色
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: 'rgba(44,59,70,1)'//未完成的圆环的颜色
                }
            };
        source.forEach(_s => {
            series.push({
                name: 'Line 1',
                type: 'pie',
                clockWise: false,
                radius: ["50%", "55%"],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['25%', '50%'],
                data: [{
                    value: 75,
                    name: '01',
                    label: {
                        normal: {
                            formatter: '{d}￥',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '35',
                                fontWeight: 'normal',
                                color: '#3dd4de'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#944BE8',
                            shadowColor: '#944BE8',
                            shadowBlur: 10,
                            opacity:.6
                        }
                    }
                }, {
                    value: 25,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            });
        });
        return { series };
    }
    renderChart() {
        let { name, rptdata } = this.props;
        console.log(name, rptdata);
        let options = this.buildChartOptions(name, rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildChartOptions(title, data) {
        let { series } = this.format(data);
        console.log(series);
        let opts = getOptions({
            title: getTitle(title),
            series
        });
        return opts;
    }
    componentDidMount() {
        super.componentDidMount();
        this.renderChart();
    }
    componentDidUpdate() {
        this.renderChart();
    }
}
AvgPrice.propTypes = {
    rptdata: PropTypes.object
}
export default AvgPrice;
