import React, { Component } from "react";
import SideBar from "./SideBar";

import {
  FlatList
} from "react-native";

import {
  Container,
  Header,
  Title,
  ListItem,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Drawer,
  H2
  
} from "native-base";

import axios from "axios";

export default class Sales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      items: [],
      total: 0
    };
  }

  componentDidMount() {
    axios
      .get(`ajax_sales.php`)
      .then(result => {
        this.setState({
            items: result.data.items,
          total:result.data.total
        });
        console.log(result.data);
      })
      .catch(error => {
        console.log("error");
      });
  }

  

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => (
    <ListItem >
      <Body>
        <Text>{`Cashier:${item.cashier}`}</Text>
        <Text>{`Prodcut Name:${item.productname}`}</Text>
        <Text>{`Description:${item.description}`}</Text>
        <Text>{`Price:${item.price}`}</Text>
        <Text>{`Qty:${item.numberorder}`}</Text>
        <Text>{`Amount:${item.amount}`}</Text>
        <Text note numberOfLines={1}>{`${item.transactiondate}`}</Text>
      </Body>
    </ListItem>
  );

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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
          content={<SideBar navigator={this.navigator} onLogoutClick={this.openDrawer.bind(this)}/>}
          onClose={() => this.closeDrawer()}
        >
        <Header>
            <Left>
              <Button transparent onPress={this.openDrawer.bind(this)}>
                <Icon name="menu" />
              </Button>
            </Left>
          <Body>
            <Title>Sales Report</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <FlatList
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </Content>
        </Drawer>
        <Footer>
          <FooterTab>
            
              <H2 style={{ flex:1, color: 'white', justifyContent: 'center', paddingTop: 10}}> Total Sales:{this.state.total}</H2>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}


