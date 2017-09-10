import React, { Component, PropTypes } from 'react'

import Community from "../cfg/comm.js";

import RealTimeRpt from "containers/charts/home";
import { Card, Col, Row } from 'antd';

class Report extends Component {
    state = {
        day: [],
        mon: []
    }
    componentDidMount() {
        var url = `./data/home.json?_dc=${new Date().getTime()}`;
        fetch(url, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    let day = [], mon = [];
                    Community.forEach(c => {
                        let dayData = json.day.filter(d => d.c === c.key);
                        day.push({
                            key: c.key,
                            name: c.name,
                            data: {
                                data: dayData,
                                source: json.source
                            }
                        });
                        let monData = json.mon.filter(d => d.c === c.key);
                        mon.push({
                            key: c.key,
                            name: c.name,
                            data: {
                                data: monData,
                                source: json.source
                            }
                        })
                    })
                    this.setState({
                        day, mon
                    });
                });
            } else {
                throw response.statusText;
            }
        }).catch(e => {
            message.error(typeof e === "string" ? e : '加载数据文件失败');
        });
    }
    render() {
        return (
            <div className="report-main">
                <Row gutter={16} style={{flex:1}}>
                    {
                        this.state.day.map(c => {
                            return <Col span={8}>
                                <Card title={c.name} bordered={false} bodyStyle={{padding:0}}>
                                    <RealTimeRpt key={c.key} name={c.name} rptdata={c.data} style={{ height: '100%', width: "100%",margin:0 }} />
                                    <RealTimeRpt key={c.key+"-1"} name={c.name} rptdata={c.data} style={{ height: '100%', width: "100%",margin:0 }} />
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div>
        )
    }
}

export default Report