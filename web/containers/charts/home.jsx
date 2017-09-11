import React, { Component, PropTypes } from 'react'
import { getLegend, getOptions, getTitle } from "./options";

import echarts from 'echarts';
import extend from './extend';

class Home extends Component {
    formatSeries(data, option = {}) {
        if (!data) return;
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
            itemStyle = option.itemStyle,
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
        console.log(data);
        let val = data.v,
            p = data.p ? Math.floor(data.p * 10000) / 100 : null,
            labelColor = p ? (p > 0 ? "#48c15e" : "#ef6670") : "#000",
            v = val ? Math.min(100, Math.floor(val / 200)):0;
        delete option.itemStyle;
        let labelNormal = option.labelNormal(val, p, labelColor);//:`${val} ￥(${p}%)`;
        delete option.labelNormal;
        return extend(true, {
            type: 'pie',
            clockWise: false,
            itemStyle: dataStyle,
            hoverAnimation: false,
            startAngle: 270,
            center: ['50%', '50%'],
            data: [{
                value: v,
                label: {
                    normal: labelNormal
                },
                itemStyle
            }, {
                value: 100 - v,
                name: 'invisible',
                itemStyle: placeHolderStyle
            }]
        }, option);
    }
    formatDaySeries(data) {
        return this.formatSeries(data, {
            name: "当日均价",
            radius: ['65%', '68%'],
            itemStyle: {
                normal: {
                    color: '#944BE8',
                    shadowColor: '#944BE8',
                    shadowBlur: 5
                }
            },
            labelNormal: (v, p, c) => {
                if (typeof v === "number" && typeof p === "number") {
                    p = p < 0 ? p : `+${p}`;
                    return this.dataLabel(`￥${v}/${p}%`, c, 28);
                } else if (typeof v === "number") {
                    return this.dataLabel(`￥${v}/--`, c, 28);
                } else {
                    return this.dataLabel(null, c, 28);
                }
            }
        })
    }
    formatMonSeries(data) {
        return this.formatSeries(data, {
            name: "当月均价",
            radius: ['72%', '75%'],
            itemStyle: {
                normal: {
                    color: '#02D4BF',
                    shadowColor: '#02D4BF',
                    shadowBlur: 5
                }
            },
            labelNormal: (v, p, c) => {
                if (typeof v === "number" && typeof p === "number") {
                    p = p < 0 ? p : `+${p}`;
                    return this.dataLabel(`\n\n\n\n\n\n￥${v}/${p}%`, "#4a667a", 16);
                } else if (typeof v === "number") {
                    return this.dataLabel(`\n\n\n\n\n\n￥${v}/--`, "#4a667a", 16);
                } else {
                    return this.dataLabel(null, "#4a667a", 16);
                }

            }
        })
    }
    dataLabel(text, color, fontSize) {
        return {
            formatter: text,
            position: 'center',
            show: !!text,
            lineHeight: 86,
            textStyle: {
                fontSize,
                fontWeight: 'normal',
                fontFamily: "Lato",
                color
            }
        }
    }
    format(rptData) {
        let series = [];
        if (rptData) {
            let ds = this.formatDaySeries(rptData.day, {
                name: "当日"
            });
            if (ds) {
                series.push(ds);
            }
            let ms = this.formatMonSeries(rptData.mon, {
                radius: ["65%", "70%"],
                name: "当月"
            });
            if (ms) {
                series.push(ms);
            }
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
            backgroundColor: "rgba(0,0,0,0)",
            title: {
                text: title,
                bottom: 15,
                left: 'center',
                textStyle: {
                    color: "#526e82",
                    fontWeight: "normal",
                    fontSize: 16
                }
            },
            legend: getLegend({
                top: 15,
                data: ["当日均价", "当月均价"]
            }),
            series
        });
        return opts;
    }

    componentDidUpdate() {
        this.renderChart();
    }
    componentDidMount() {
        this.myChart = echarts.init(this.refs.chart, 'theme');
        this.renderChart();
    }
    componentWillUnmount() {
        this.myChart && this.myChart.dispose();
        this.myChart = null;
    }
    render() {
        return (
            <div ref="chart" style={{ height: "100%", width: "100%" }}></div>
        )
    }
}
Home.propTypes = {
    rptdata: PropTypes.object
}
Home.defaultProps = {
    cls: 'report-chart-content'
}
export default Home;
