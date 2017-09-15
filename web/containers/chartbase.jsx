import React, { Component } from 'react'

import echarts from './echarts';

class ChartBase extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.myChart = echarts(this.refs.chart);
    }
    componentWillUnmount() {
        this.myChart && this.myChart.dispose();
        this.myChart = null;
    }
    render() {
        return (
            <div ref="chart" className={this.props.cls} style={{ ...this.props.style }}></div>
        )
    }
}
ChartBase.defaultProps = {
    cls: 'report-chart-content'  
 }
export default ChartBase