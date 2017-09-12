import React, { Component, PropTypes } from 'react'
import { getBarSeries, getLegend, getOptions, getTitle, getToolbox, getX, getY } from "./options";

import ChartBase from "./chartbase";

class Quantity extends ChartBase {
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
                    _d.push(h.q);
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
        let {rptdata } = this.props;
        let options = this.buildChartOptions(rptdata);
        this.myChart && this.myChart.setOption(options);
    }
    buildChartOptions(data) {
        let { x, l, s } = this.format(data);
        let series = s.map(getBarSeries),
            xAxis = getX({
                data: x
            }),
            yAxis = [getY({
                type: 'value',
                name: "数量",
                axisLabel: {
                    formatter: '{value} 户'
                }
            })];
        let opts = getOptions({
            toolbox: getToolbox(),
            legend: getLegend({
                data: l
            }),
            tooltip: { //提示框组件
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        backgroundColor: '#6a7985'
                    }
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
Quantity.propTypes = {
    rptdata: PropTypes.object
}
export default Quantity;
