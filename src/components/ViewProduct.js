"use strict";

import React, { Component } from "react";
import { BASE_URL } from "../Settings";

import {
  FlatList,
  View,
  Modal,
  Image,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView
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
  ListItem,
  Form,
  Input,
  Item,
  Label
} from "native-base";
import SideBar from "./SideBar";

import axios from "axios";

const errorTextStyle = {
  color: "#FF2D00",
  marginLeft: 10,
  paddingLeft: 20,
  fontSize: 13
};

class ViewProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockList: [],
      priceList: [],
      modalVisible: false,
      modalVisible2: false,
      field: [],
      formModalVisible: false,
      toBeReplace: "",
      current: "",
      product: {}
    };
  }

  componentWillMount() {
    const { product } = this.props;
    this.setState({
      product
    });
  }

  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
    axios
      .get(`ajax_product_update_price.php?name=${this.props.product.name}`)
      .then(result => {
        this.setState({
          priceList: result.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setModalVisible2(visible) {
    this.setState({ modalVisible2: visible });
    axios
      .get(`ajax_stock_update.php?name=${this.props.product.name}`)
      .then(result => {
        this.setState({
          stockList: result.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onButtonPress = property => {
    const { product } = this.props;
    this.setState({
      field: property,
      formModalVisible: true,
      current: product[property],
      toBeReplace: ''
    });
  };

  requiredValidationHas(field) {
    if (this.state[field] == "") {
      this.setState({
        errors: [...this.state.errors, ...[field]]
      });
    }
  }

  requiredValidation(field) {
    if (this.state[field] == "") {
      return "Field Required";
    }
  }


  next() {
    this.setState(
      {
        errors: [],
        loading: true
      },
      () => {
        this.requiredValidationHas("toBeReplace");
        

        setTimeout(() => {
          this.setState(
            {
              loading: false
            },
            () => {
              if (!this.state.errors.length > 0) {
                this.setState({
                  loading: true
                });
                this.formModalSubmit();
              }
            }
          );
        }, 500);
      }
    );
  }

  formModalSubmit = () => {
    const data = new FormData();
    const { current, toBeReplace, field, product } = this.state;
    let key = field
    if(key == 'remainingstock')
      key = 'stock'
    data.append(key, toBeReplace);
    data.append("id", product.productid);
    data.append("current", current);
    data.append("product_name", product.name);
    axios
      .post("ajax_update_product.php", data)
      .then(result => {
        console.log(result)
        if (key == "stock") {
          product.remainingstock = parseFloat(toBeReplace)+parseFloat(current);
        } else {
          product[field] = toBeReplace;
        }
        this.setState({
          formModalVisible: false,
          product
        });
      })
      .catch(error => {
        console.log(error.response);

        this.setState({
          formModalVisible: false
        });
      });
  };




  render() {
    const { product } = this.state;

    const { priceList, stockList } = this.state;

    const sList = stockList.map(data => {
      return (
        <ListItem key={data.id}>
          <Body>
            <Text>{`New Stock: ${data.new_stock}`}</Text>
            <Text note>{`Prior Stock: ${data.prior_stock}`}</Text>
            <Text note>{`Added Stock: ${data.added_stock}`}</Text>
          </Body>
          <Right>
            <Text note>{data.date_updated}</Text>
          </Right>
        </ListItem>
      );
    });

    const pList = priceList.map(data => {
      return (
        <ListItem key={data.id}>
          <Body>
            <Text>{`New Price: ${data.new_price}`}</Text>
            <Text note>{`Prior Price: ${data.prior_price}`}</Text>
          </Body>
          <Right>
            <Text note>{data.date_updated}</Text>
          </Right>
        </ListItem>
      );
    });

    return (
      <Container>
        <Drawer
          ref={ref => {
            this.drawer = ref;
          }}
          content={<SideBar navigator={this.navigator} onLogoutClick={this.openDrawer.bind(this)} />}
          onClose={() => this.closeDrawer()}
        >
          <Header>
            <Left>
              <Button transparent onPress={this.openDrawer.bind(this)}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>{`${product.name}`}</Title>
            </Body>
            <Right />
          </Header>

          <Content>
            <Card>
              <CardItem />
              <CardItem cardBody>
                <Image
                  source={{
                    uri: `${BASE_URL}${product.productmedia}`
                  }}
                  style={{ height: 200, width: null, flex: 1 }}
                />
              </CardItem>

              <CardItem>
                <Left>
                  <Text>{`Name: ${product.name}`}</Text>
                </Left>
                <Right>
                  <Button small onPress={this.onButtonPress.bind(this, "name")}>
                    <Text>Edit</Text>
                  </Button>
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <Text>{`Price: ${product.price}`}</Text>
                </Left>
                <Right>
                  <Button
                    small
                    onPress={this.onButtonPress.bind(this, "price")}
                  >
                    <Text>Edit</Text>
                  </Button>
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <Text>{`Stock: ${product.remainingstock}`}</Text>
                </Left>
                <Right>
                  <Button
                    small
                    onPress={this.onButtonPress.bind(this, "remainingstock")}
                  >
                    <Text>Edit</Text>
                  </Button>
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <Text>{`Description: ${product.description}`}</Text>
                </Left>
                <Right>
                  <Button
                    small
                    onPress={this.onButtonPress.bind(this, "description")}
                  >
                    <Text>Edit</Text>
                  </Button>
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <Button
                    transparent
                    onPress={this.setModalVisible2.bind(this, true)}
                  >
                    <Icon name="eye" />
                    <Text>View Stock</Text>
                  </Button>
                </Left>
                <Body>
                  <Button
                    transparent
                    onPress={this.setModalVisible.bind(this, true)}
                  >
                    <Icon active name="eye" />
                    <Text>View Price Update</Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.formModalVisible}
              onRequestClose={() => {}}
            >
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <ScrollView>
                  <View style={{ paddingTop: 30 }}>
                    <Form>
                      <Item inlineLabel>
                        <Label>Current Value</Label>
                        <Input
                          editable={false}
                          selectTextOnFocus={false}
                          value={this.state.current}
                        />
                      </Item>
                      <Item inlineLabel last>
                        <Label>Edited</Label>
                        <Input
                          value={this.state.toBeReplace}
                          onChangeText={text => {
                            this.setState({
                              toBeReplace: text
                            });
                          }}
                        />
                      </Item>
                      <Text style={errorTextStyle}>
                      {this.requiredValidation("toBeReplace")}
                    </Text>
                    </Form>
                  </View>
                </ScrollView>
                <View>
                  <Button
                    full
                    success
                    onPress={this.next.bind(this)}
                  >
                    <Text>Submit</Text>
                  </Button>
                  <Button
                    full
                    danger
                    onPress={() => {
                      this.setState({
                        formModalVisible: false
                      });
                    }}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {}}
            >
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <ScrollView>
                  <List>{pList}</List>
                </ScrollView>
                <Button
                  full
                  danger
                  onPress={() => {
                    this.setModalVisible(false);
                  }}
                >
                  <Text>Close</Text>
                </Button>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible2}
              onRequestClose={() => {}}
            >
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <ScrollView>
                  <List>{sList}</List>
                </ScrollView>
                <Button
                  full
                  danger
                  onPress={() => {
                    this.setModalVisible2(false);
                  }}
                >
                  <Text>Close</Text>
                </Button>
              </View>
            </Modal>
          </Content>
        </Drawer>
      </Container>
    );
  }
}

export default ViewProduct;
