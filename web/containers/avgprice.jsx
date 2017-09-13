import React, { Component, PropTypes } from 'react'
import { getLegend, getLineSeries, getOptions, getTitle, getToolbox, getX, getY } from "./options";

import ChartBase from "./chartbase";

class AvgPrice extends ChartBase {
    format(rptData) {
        let source = Object.entries(rptData.source);
        let l = [], list = [], x = [], s = [], scatter = [];
        x = rptData.date;;
        l = source.map(s => s[1]);
        source.forEach((_s, g) => {
            let _d = [];
            x.map(_x => {
                let h = rptData.data.find(_h => _h.s === _s[0] && _h.d === _x);
                if (h) {
                    _d.push(h.a);
                } else {
                    _d.push(null);
                }
                let dayHouse = rptData.data.find(_h => _h.s === _s[0] && _h.d === _x);
                if (dayHouse) {
                    let scatterData = [];
                    dayHouse.u.forEach(_u => {
                        if (Array.isArray(_u)) {
                            scatterData.push([_x, _u[0] * 50, _u[1]]);
                        } else if (typeof _u === "number") {
                            scatterData.push([_x, _u * 50, 1]);
                        }
                    });
                    scatter.push({
                        g,
                        name: _s[1],
                        data: scatterData
                    });
                }
            });
            s.push({
                name: _s[1],
                data: _d
            });
        });
        return { l, x, s, scatter };
    }
    renderChart() {
        let { rptdata, scatter } = this.props;
        let options = this.buildChartOptions(rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildScatterSeries(data) {
        let series = [];
        data.forEach((item) => {
            let data = item.data.map((d, i) => ({
                value: d,
                symbolOffset: [3 * (3 - i % 5), 0],
                symbolSize: Math.max(1, Math.min(6, d[2] / 2))
            }));
            let normal = {
                opacity: .6,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                color: item.g === 0 ? 'rgb(237, 140, 49)' : 'rgb(14, 141, 142)'
            };
            series.push({
                name: item.name,
                type: 'scatter',
                data,
                hoverAnimation: false,
                legendHoverLink: false,
                silent: true,
                itemStyle: {
                    normal
                },
                largeThreshold: 20,
                blendMode: 'lighter',
                animationDelay: function (idx) {
                    return idx * 10 + 1500;
                },
            });
        });
        // window.setTimeout(() => {
        //     this.myChart.setOption({
        //         series: newSeries
        //     })
        // }, 2000);
        return series;
    }
    buildChartOptions(data) {
        let { x, l, s, scatter } = this.format(data);
        let series = s.map(getLineSeries),
            xAxis = getX({
                data: x
            }),
            yAxis = [getY({
                type: 'value',
                name: "日均价",
                axisLabel: {
                    formatter: '{value} ￥'
                }
            })];
        series = series.concat(this.buildScatterSeries(scatter));
        let opts = getOptions({
            toolbox: getToolbox(),
            legend: getLegend({
                data: l
            }),
            tooltip: {
                axisPointer: {
                    type: 'shadow'
                },
                formatter(a) {
                    let title = a[0].axisValue,
                        line = a.filter(_a => _a.seriesType === "line"),
                        scatter = a.filter(_a => _a.seriesType === "scatter");
                    return `<b style="padding:8px 0">${title}</b><br />
                            ${line.map(l => {
                            let val = typeof l.value === "number" ? l.value : "--",
                                scatter = a.filter(_a => _a.seriesType === "scatter" && _a.seriesName === l.seriesName),
                                sum = scatter.reduce((x, b) => x + (b.data.value[2] || 0), 0);
                            return `<div style='padding:2px 0'>
                                         <div style="display:inline-block;text-align:left;width:5rem;font-size:16px;">${l.marker + l.seriesName}</div>:
                                         <div style="display:inline-block;text-align:left;width:5rem;padding-left:.3rem;font-size:1rem;letter-spacing:.1rem;"><b>${val}￥</b></div >
                                         <div style="display:inline-block;text-align:right;width:3rem;font-size:14px;color:#ccc;">${sum}套</div>
                                    </div > `
                        }).join("")}`
                }
            },
            xAxis,
            yAxis,
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
