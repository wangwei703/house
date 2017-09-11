import React, { Component } from 'react'

import AvgPrice from "containers/charts/avgprice";
import Community from "../cfg/comm.js";

class componentName extends Component {
    state = {
        community: [],
        list: []
    }
    loadAvgData() {
        var url = `./data/avg.json?_dc=${new Date().getTime()}`;
        fetch(url, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.loadListData().then(listJson => {
                        let list = listJson.data || [];
                        let comm = [];
                        comm = Community.map(c => {
                            let data = json.data.filter(h => h.c === c.key),
                                date = json.date,
                                houseData=list.find(i=>i.key===c.key),
                                listData=[];
                            if(houseData){
                                listData=houseData.source||[];
                            }
                            date.sort((d1, d2) => d1 > d2 ? 1 : (d1 < d2 ? -1 : 0));
                            return {
                                key: c.key,
                                name: c.name,
                                data: {
                                    data,
                                    date,
                                    source: json.source,
                                    list:listData
                                }
                            }
                        })
                        this.setState({
                            community: comm
                        });
                    });
                });
            } else {
                throw response.statusText;
            }
        }).catch(e => {
            message.error(typeof e === "string" ? e : '加载数据文件失败');
        });
    }
    loadListData() {
        var url = `./data/list.json?_dc=${new Date().getTime()}`;
        return fetch(url, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return {};
        });
    }
    componentDidMount() {
        this.loadAvgData();
        this.loadListData();
    }
    render() {
        return (
            <div className="report-main">
                {
                    this.state.community.map(c => {
                        return <AvgPrice key={c.key} name={c.name} rptdata={c.data} style={{ minHeight: "30rem" }} />
                    })
                }
            </div>
        )
    }
}

export default componentName