import React, { Component, PropTypes } from 'react'
import { getOptions, getTitle } from "./options";
import ChartBase from "./chartbase";

class AvgPrice extends ChartBase {
    format(rptData) {
        let series = [];
        if (rptData) {
            let dataStyle = {
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
            },
                placeHolderStyle = {
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
            let a = rptData.a,
                p = Math.floor(rptData.p * 10000) / 100,
                labelColor = p > 0 ? "#48c15e" : "#ef6670";
            let v = Math.min(100, Math.floor(a / 200));
            p = p < 0 ? p : `+${p}`;
            series.push({
                name: 'Line 1',
                type: 'pie',
                clockWise: false,
                radius: ["70%", "75%"],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['50%', '55%'],
                data: [{
                    value: v,
                    name: '01',
                    label: {
                        normal: {
                            formatter:`${a} ￥\n${p}%`,
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '25',
                                fontWeight: 'normal',
                                color: labelColor
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#944BE8',
                            shadowColor: '#944BE8',
                            shadowBlur: 10,
                            opacity: .6
                        }
                    }
                }, {
                    value: 100-v,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            });
        }
        return { series };
    }
    renderChart() {
        let { name, rptdata } = this.props;
        let options = this.buildChartOptions(name, rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildChartOptions(title, data) {
        let { series } = this.format(data);
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
