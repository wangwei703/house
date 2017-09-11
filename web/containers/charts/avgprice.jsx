import React, { Component, PropTypes } from 'react'
import { getLegend, getLineSeries, getOptions, getTitle, getToolbox, getX, getY } from "./options";

import ChartBase from "./chartbase";

class AvgPrice extends ChartBase {
    format(rptData) {
        console.log(rptData);
        let source = Object.entries(rptData.source);
        let l = [], list = [], x = [], s = [], scatter = [];
        x = rptData.date;
        list = rptData.list || [];
        l = source.map(s => s[1]);
        source.forEach(_s => {
            let _d = [];
            x.map(_x => {
                let h = rptData.data.find(_h => _h.s === _s[0] && _h.d === _x);
                if (h) {
                    _d.push(h.a);
                } else {
                    _d.push(null);
                }
            });
            let nlist = list.find(_h => _h.from === _s[0]);
            if (nlist) {
                let scatterData = nlist.house.map(_h => [_h[3], _h[2]]);
                scatter.push({
                    name: _s[1],
                    data: scatterData
                });
            }
            s.push({
                name: _s[1],
                data: _d
            });
        });
        return { l, x, s, scatter };
    }
    renderChart() {
        let { name, rptdata, scatter } = this.props;
        let options = this.buildChartOptions(name, rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildChartOptions(title, data) {
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
        scatter.forEach(item => {
            let data = item.data.map((d, i) => ({
                value: d,
                symbolOffset: [3 * (3 - i % 5), 0]
            }));
            series.push({
                name: item.name,
                type: 'scatter',
                data,
                symbolSize: 3,
                hoverAnimation: false,
                legendHoverLink: false,
                silent: true,
                itemStyle: {
                    normal: {
                        opacity: .8
                    }
                }
            });
        });

        let opts = getOptions({
            title: getTitle(title),
            toolbox: getToolbox(),
            legend: getLegend({
                data: l
            }),
            tooltip: {
                axisPointer: {
                    type: 'shadow'
                },
                formatter(a, b, c) {
                    let title = a[0].axisValue,
                        line = a.filter(_a => _a.seriesType === "line"),
                        scatter = a.filter(_a => _a.seriesType === "scatter");
                    return `<b style="padding:8px 0">${title}</b><br />
                            ${line.map(l => {
                            let val = typeof l.value === "number" ? l.value : "--";
                            return "<div style='padding:2px 0'>" + l.marker + l.seriesName + "：" + val + "</div>"
                        }).join("")}
                            <div style='padding:2px 0'>
                                <span style="display:inline-block;margin-right:5px;border-radius:2px;width:9px;height:9px;background-color:#666;"></span>
                                房源数：${scatter.length}
                            </div>`
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
