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
  List,
  H1,
  ListItem,
  Thumbnail,
  Drawer,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  ActionSheet,
  Form,
  Item,
  Input,
  Label
} from "native-base";
import { Actions } from "react-native-router-flux";
import ImagePicker from "react-native-image-picker";
import SideBar from "./SideBar";
import axios from "axios";

const errorTextStyle = {
  color: "#FF2D00",
  marginLeft: 10,
  paddingLeft: 20,
  fontSize: 13
};

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarSource: null,
      photo: null,
      product: {
        product_price: "",
        stock: "",
        product_barcode: "",
        product_name: ""
      },
      errors: [],
      loading: false
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          photo: response
        });
      }
    });
  }
  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();
  };

  submitForm() {
    const { product, photo } = this.state;
    const data = new FormData();

    data.append("product_name", product.product_name);
    data.append("price", product.product_price);
    data.append("stock", product.stock);
    data.append("barcode", product.product_barcode);
    data.append("description", product.product_description);
    if (photo != null) {
      data.append("fileToUpload", {
        uri: photo.uri,
        type: photo.type, // or photo.type
        name: photo.fileName
      });
    } else {
      data.append("fileToUpload", {
        uri: "",
        type: "", // or photo.type
        name: ""
      });
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios
      .post(`add_product_ajax.php`, data, config)
      .then(result => {
        console.log(result);

        ToastAndroid.showWithGravityAndOffset(
          `Product save`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        Actions.main_screen();
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
      });
  }

  getError(field) {
    return "";
  }
  requiredValidation(field) {
    if (this.state.product[field] == "") {
      return "Field Required";
    }
  }

  numberValidation(field) {
    if (this.state.product[field] == "") {
      return "";
    }
    var rx = new RegExp(/^\d+(?:\.\d{1,2})?$/);
    if (!rx.test(this.state.product[field])) {
      return "Invalid Input";
    }
  }

  requiredValidationHas(field) {
    if (this.state.product[field] == "") {
      this.setState({
        errors: [...this.state.errors, ...[field]]
      });
    }
  }

  numberValidationHas(field) {
    var rx = new RegExp(/^\d+(?:\.\d{1,2})?$/);
    if (!rx.test(this.state.product[field])) {
      this.setState({
        errors: [...this.state.errors, ...[field]]
      });
    }
  }

  next() {
    this.setState(
      {
        errors: [],
        loading: true
      },
      () => {
        this.requiredValidationHas("product_name");
        this.requiredValidationHas("product_barcode");
        this.numberValidationHas("stock");
        this.numberValidationHas("product_price");
        if (this.state.photo == null) {
          this.setState({
            errors: [...this.state.errors, ...["photo"]]
          });
        }

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
                this.submitForm();
              }
            }
          );
        }, 500);
      }
    );
  }
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
              <Title>Add Product</Title>
            </Body>
            <Right />
          </Header>

          <Content>
            <View style={styles.container}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View
                  style={[
                    styles.avatar,
                    styles.avatarContainer,
                    { marginBottom: 20 }
                  ]}
                >
                  {this.state.avatarSource === null ? (
                    <Text>Product Photo</Text>
                  ) : (
                    <Image
                      style={styles.avatar}
                      source={this.state.avatarSource}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={errorTextStyle}>
                {`${this.state.photo == null ? "Photo Required" : ""}`}
              </Text>
            </View>
            <View style={{ flex: 1, marginTop: 22, justifyContent: "center" }}>
              <View style={{ alignItems: "center" }} />
              <Form>
                <Item floatingLabel>
                  <Label>Product Name</Label>
                  <Input
                    value={this.state.product.product_name}
                    onChangeText={text => {
                      this.setState({
                        product: {
                          ...this.state.product,
                          product_name: text
                        }
                      });
                    }}
                  />
                </Item>
                <Text style={errorTextStyle}>
                  {this.requiredValidation("product_name")}
                </Text>
                <Item floatingLabel>
                  <Label>Product Description</Label>
                  <Input
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.product.product_description}
                    onChangeText={text => {
                      this.setState({
                        product: {
                          ...this.state.product,
                          product_description: text
                        }
                      });
                    }}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Price</Label>
                  <Input
                    keyboardType="numeric"
                    value={this.state.product.product_price}
                    onChangeText={text => {
                      this.setState({
                        product: {
                          ...this.state.product,
                          product_price: text
                        }
                      });
                    }}
                  />
                </Item>
                <Text style={errorTextStyle}>
                  {this.numberValidation("product_price")}
                </Text>
                <Item floatingLabel>
                  <Label>Stocks</Label>
                  <Input
                    keyboardType="numeric"
                    value={this.state.product.stock}
                    onChangeText={text => {
                      this.setState({
                        product: {
                          ...this.state.product,
                          stock: text
                        }
                      });
                    }}
                  />
                </Item>
                <Text style={errorTextStyle}>
                  {this.numberValidation("stock")}
                </Text>
                <Item floatingLabel>
                  <Label>Barcode</Label>
                  <Input
                    keyboardType="numeric"
                    value={this.state.product.product_barcode}
                    onChangeText={text => {
                      this.setState({
                        product: {
                          ...this.state.product,
                          product_barcode: text
                        }
                      });
                    }}
                  />
                </Item>
                <Text style={errorTextStyle}>
                  {this.requiredValidation("product_barcode")}
                </Text>
              </Form>
              <Button
                full
                disabled={this.state.loading}
                onPress={this.next.bind(this)}
              >
                <Text>Submit</Text>
              </Button>
            </View>
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

export default AddProduct;
