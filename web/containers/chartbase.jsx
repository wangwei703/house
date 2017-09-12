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
     componentWillReceiveProps(nextProps) {
        this.setState({ 
            min: nextProps.min||10000,
            max: nextProps.max||20000
         });
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