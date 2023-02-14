import React, { Component } from "react";
import { Scene, Router, Stack, ActionConst } from "react-native-router-flux";
import Login from "./components/Auth/Login";
import MainScreen from "./components/MainScreen";
import AddProduct from "./components/AddProduct";
import ViewProduct from "./components/ViewProduct";
import Dashboard from "./components/Dashboard";
import Sales from "./components/Sales";
import Initial from "./Initial";

export default class RouterComponent extends Component {
  render() {
    return (
      <Router>
        <Stack key="auth">
          <Scene
            key="first"
            component={Initial}
            title="Initial"
            type={ActionConst.RESET}
            initial
            hideNavBar
          />
          <Scene key="login" component={Login} title="Login" hideNavBar />
          <Scene
            key="main_screen"
            component={MainScreen}
            title="MainScreen"
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene
            key="add_product"
            component={AddProduct}
            title="AddProduct"
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene
            key="view_product"
            component={ViewProduct}
            title="ViewProduct"
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene
            key="dashboard"
            component={Dashboard}
            title="Dashboard"
            type={ActionConst.RESET}
            hideNavBar
          />
          <Scene key="sales" component={Sales} title="Sales" hideNavBar />
        </Stack>
      </Router>
    );
  }
}
