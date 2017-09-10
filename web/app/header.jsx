import { Breadcrumb, Icon, Layout, Menu } from 'antd';
import React, { Component } from 'react'

import { NavLink } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class componentName extends Component {
    render() {
        return <Header>
            <Menu
                mode="horizontal"
            >
                <Menu.Item key="home" >
                    <NavLink to="/home" activeClassName="active">
                        <Icon type="home" />
                        <span>首页</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="avgprice" >
                    <NavLink to="/avgprice" activeClassName="active">
                        <Icon type="line-chart" />
                        <span>日走势</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="avgpricemon" >
                    <NavLink to="/avgpricemon" activeClassName="active">
                        <Icon type="line-chart" />
                        <span>月走势</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="quantity" >
                    <NavLink to="/quantity" activeClassName="active">
                        <Icon type="bar-chart" />
                        <span>房源统计</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
        </Header>
    }
}

export default componentName