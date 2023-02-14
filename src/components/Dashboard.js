"use strict";

import React, { Component } from "react";

import {
  FlatList,
  View,
  Modal,
  Image,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from "react-native";

import {
  Container,
  Header,
  Title,
  Drawer,
  Card,
  CardItem,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  List,
  ListItem
} from "native-base";
import SideBar from "./SideBar";

import axios from "axios";

import { Actions } from "react-native-router-flux";


class ViewProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSale:0,
      dailySale:0,
      totalProducts:0,
      yesterdaySale:0,
      todaySale:0,
      weeklySale:0,
      monthlySale:0
    };
  }

  componentDidMount(){

    axios.get(`ajax_dashboard.php`).then( result => {
        console.log(result)
        this.setState({
            totalSale:result.data.totalSales,
            dailySale:result.data.dailySales,
            totalProducts:result.data.totalProducts,
            yesterdaySale:result.data.yesterdaySales,
            todaySale:result.data.todaySales,
            weeklySale:result.data.weeklySales,
            monthlySale:result.data.monthlySales
        })
    })
  }



  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();

  };

  render() {
    return (
      <Container>
        <Drawer
          ref={ref => {
            this.drawer = ref;
          }}
          content={<SideBar navigator={this.navigator}/>}
          onClose={() => this.closeDrawer()}
        >
          <Header>
            <Left>
              <Button transparent onPress={this.openDrawer.bind(this)}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Dashboard</Title>
            </Body>
            <Right />
          </Header>

          <Content>
            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Total Sale</Text>
                      <Text>{this.state.totalSale}</Text>
                    </Body>
              </CardItem>
            </Card>
            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Total Products</Text>
                      <Text>{this.state.totalProducts}</Text>
                    </Body>
              </CardItem>
            </Card>

            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Daily Sales Report</Text>
                      <Text>{this.state.dailySale}</Text>
                    </Body>
              </CardItem>
            </Card>

            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Yesterday Sales</Text>
                      <Text>{this.state.yesterdaySale}</Text>
                    </Body>
              </CardItem>
            </Card>


            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Today Sales</Text>
                      <Text>{this.state.todaySale}</Text>
                    </Body>
              </CardItem>
            </Card>


            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Weekly Sales</Text>
                      <Text>{this.state.weeklySale}</Text>
                    </Body>
              </CardItem>
            </Card>

            <Card padder>
              <CardItem>
                    <Left>
                      <Icon name="cart"  style={{ fontSize:80}}/>
                    </Left>

                    <Body>
                      <Text>Monthly Sale</Text>
                      <Text>{this.state.monthlySale}</Text>
                    </Body>
              </CardItem>
            </Card>
           

          </Content>
        </Drawer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});

export default ViewProduct;
