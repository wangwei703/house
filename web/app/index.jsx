import "./app.less";

import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import React, { Component } from 'react'

import AvgPrice from './avgprice';
import AvgPriceMon from './avgpricemon';
import HOME from './home';
import Header from './header';
import { Layout } from 'antd';
import Quantity from './quantity';

const { Content, Footer, Sider } = Layout;

export default class App extends Component {

  render() {
    return (
      <HashRouter>
        <Layout>
          <Header />
          <Content>
            <Switch>
              <Route exact path="/home" component={HOME} />
              <Route exact path="/avgprice" component={AvgPrice} />
              <Route exact path="/avgpricemon" component={AvgPriceMon} />
              <Route exact path="/quantity" component={Quantity} />
              <Redirect from='/' to='/avgprice' />
            </Switch>
          </Content>
        </Layout>
      </HashRouter>
    );
  }
}