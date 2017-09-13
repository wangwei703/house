import React, { Component, PropTypes } from 'react'
import { getLegend, getOptions, getTitle } from "./options";

import ChartBase from "./chartbase";
import extend from './extend';

class Home extends ChartBase {
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
        let val = data.v,
            p = data.p ? Math.floor(data.p * 10000) / 100 : null,
            labelColor = p ? (p >= 0 ? "#48c15e" : "#ef6670") : "#48c15e",
            v = val ? Math.min(100, Math.floor(val / 200)) : 0;
        delete option.itemStyle;
        let labelNormal = option.labelNormal(val, p, labelColor);//:`${val} ￥(${p}%)`;
        delete option.labelNormal;
        return extend(true, {
            type: 'pie',
            clockWise: false,
            itemStyle: dataStyle,
            hoverAnimation: false,
            startAngle: 270,
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
    formatDaySeries(data,idx) {
        return this.formatSeries(data, {
            name: "当日",
            radius: ['75%', '80%'],
            itemStyle: {
                normal: {
                    color: '#02D4BF',
                    shadowBlur: 30,
                    shadowColor: 'rgba(0, 255, 229, 0.6)'
                }
            },
            center: [this.getOffsetX(idx), '53%'],
            labelNormal: (v, p, c) => {
                if (typeof v === "number" && typeof p === "number") {
                    p = p < 0 ? p : `+${p}`;
                    return this.dataLabel(`￥${v}/${p}%`, c, 24);
                } else if (typeof v === "number") {
                    return this.dataLabel(`￥${v}/--`, c, 24);
                } else {
                    return this.dataLabel(null, c, 24);
                }
            }
        })
    }
    formatMonSeries(data,idx) {
        return this.formatSeries(data, {
            name: "当月",
            radius: ['65%', '66%'],
            center: [this.getOffsetX(idx), '53%'],
            itemStyle: {
                normal: {
                    color: '#944BE8',
                    shadowBlur: 10,
                    shadowColor: 'rgba(144, 60, 240, 0.73)'
                }
            },
            labelNormal: (v, p, c) => {
                if (typeof v === "number" && typeof p === "number") {
                    p = p < 0 ? p : `+${p}`;
                    return this.dataLabel(`\n\n\n\n￥${v}/${p}%`, "#4a667a", 16);
                } else if (typeof v === "number") {
                    return this.dataLabel(`\n\n\n\n￥${v}/--`, "#4a667a", 16);
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
    getTitle(text, idx) {
        return {
            text,
            top: '35%',
            left: this.getOffsetX(idx),
            textAlign: 'center',
            textStyle: {
                color: "#668297",
                fontWeight: "normal",
                fontSize: 18
            }
        }
    }
    getOffsetX(idx,offset=0){
        let x=idx*50+25;
        return x+"%";
    }
    format(rptData) {
        let series = [], title = [];
        if (Array.isArray(rptData)) {
            rptData.forEach((rptdata, idx) => {
                title.push(this.getTitle(rptdata.name, idx));
                let data = rptdata.data;
                let ds = this.formatDaySeries(data.day, idx);
                if (ds) {
                    series.unshift(ds);
                }
                let ms = this.formatMonSeries(data.mon,idx);
                if (ms) {
                    series.unshift(ms);
                }
            })
        }
        return { title,series };
    }
    renderChart() {
        let { rptdata } = this.props;
        let options = this.buildChartOptions(rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildChartOptions(data) {
        let { title, series } = this.format(data);
        let opts = getOptions({
            backgroundColor: "rgba(0,0,0,0)",
            title,
            legend: getLegend({
                top: 10,
                itemGap: 24,
                data: ["当日", "当月"],
                textStyle: {
                    fontSize: 14
                }
            }),
            series
        });
        return opts;
    }
    componentDidUpdate() {
        this.renderChart();
    }
    componentDidMount() {
        super.componentDidMount();
        this.renderChart();
    }
}
Home.propTypes = {
    rptdata: PropTypes.array
}
// Home.defaultProps = {
//     cls: 'column-count2'
// }
export default Home;
