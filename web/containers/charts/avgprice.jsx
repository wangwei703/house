import React, { Component, PropTypes } from 'react'
import { getLegend, getLineSeries, getOptions, getTitle, getToolbox, getX, getY } from "./options";

import ChartBase from "./chartbase";

class AvgPrice extends ChartBase {
    format(rptData) {
        let source = Object.entries(rptData.source);
        let l = [], x = [], s = [];
        x = rptData.date;
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
            })
            s.push({
                name: _s[1],
                data: _d
            });
        });
        return { l, x, s };
    }
    renderChart() {
        let { name, rptdata } = this.props;
        let options = this.buildChartOptions(name, rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildChartOptions(title, data) {
        let { x, l, s } = this.format(data);
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
        let opts = getOptions({
            title: getTitle(title),
            toolbox: getToolbox(),
            legend: getLegend({
                data: l
            }),
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
