import React, { Component } from 'react'

import AvgPrice from "containers/avgprice";
import Community from "../cfg/comm.js";
import fetchData from 'libs/comm/fetch';

class componentName extends Component {
    state = {
        community: [],
        list: []
    }
    loadAvgData() {
        fetchData("avg").then(json => {
            let comm = [];
            comm = Community.map(c => {
                let data = json.data.filter(h => h.c === c.key),
                    date = json.date
                date.sort((d1, d2) => d1 > d2 ? 1 : (d1 < d2 ? -1 : 0));
                return {
                    key: c.key,
                    name: c.name,
                    data: {
                        data,
                        date,
                        source: json.source
                    }
                }
            })
            this.setState({
                community: comm
            });
        });

    }
    componentDidMount() {
        this.loadAvgData();
    }
    render() {
        return (
            <div className="report-main">
                {
                    this.state.community.map(c => {
                        return <div key={c.key} className="report-main-item">
                            <h2 className="report-main-item-title">{c.name}</h2>
                            <div className="report-main-item-body">
                                <AvgPrice rptdata={c.data} />
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}

export default componentName