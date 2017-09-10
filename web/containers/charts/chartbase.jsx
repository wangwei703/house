import React, { Component } from 'react'

import echarts from 'echarts';
import theme from 'echarts/theme/shine';

class ChartBase extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.myChart = echarts.init(this.refs.chart, 'theme');
    }
    componentWillUnmount() {
        this.myChart && this.myChart.dispose();
        this.myChart = null;
    }
     componentWillReceiveProps(nextProps) {
        this.setState({ 
            min: nextProps.min||10000,
            max: nextProps.max||20000
         });
    }
    render() {
        return (
            <div ref="chart" className="report-chart-content" style={{ ...this.props.style }}></div>
        )
    }
}

export default ChartBase