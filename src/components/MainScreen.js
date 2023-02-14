import React, { Component } from "react";
import SideBar from "./SideBar";

import { FlatList, PixelRatio, StyleSheet } from "react-native";

import {
  Container,
  Header,
  Title,
  Drawer,
  ListItem,
  Thumbnail,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  ActionSheet
} from "native-base";
import { Actions } from "react-native-router-flux";
import ImagePicker from "react-native-image-picker";

import axios from "axios";
import { BASE_URL } from "../Settings";

const BUTTONS = ["View", "Cancel"];
const CANCEL_INDEX = BUTTONS.length - 1;

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      products: []
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  componentDidMount() {
    axios
      .get(`ajax_product.php`)
      .then(result => {
        if (this.props.notify) {
          this.setState({
            products: result.data.filter(item => {
              return item.remainingstock < 4;
            })
          });
        } else {
          this.setState({
            products: result.data
          });
        }

        console.log(result.data);
      })
      .catch(error => {
        console.log(error);
        console.log("error");
      });
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
          avatarSource: source
        });
      }
    });
  }

  viewActions = item => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: "Actions"
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Actions.view_product({ product: item });
            break;
          default:
        }
      }
    );
  };

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => (
    <ListItem thumbnail>
      <Left>
        <Thumbnail
          square
          source={{
            uri: `${BASE_URL}${item.productmedia}`
          }}
        />
      </Left>
      <Body>
        <Text>{`${item.name}`}</Text>
        <Text note numberOfLines={1}>{`Price: ${item.price} | Remaining: ${
          item.remainingstock
        }`}</Text>
      </Body>
      <Right>
        <Button transparent>
          <Icon
            name="dots-horizontal"
            type="MaterialCommunityIcons"
            onPress={this.viewActions.bind(this, item)}
          />
        </Button>
      </Right>
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
          content={
            <SideBar
              navigator={this.navigator}
              onLogoutClick={this.openDrawer.bind(this)}
            />
          }
          onClose={() => this.closeDrawer()}
        >
          <Header>
            <Left>
              <Button transparent onPress={this.openDrawer.bind(this)}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Product List</Title>
            </Body>
            <Right />
          </Header>

          <Content>
            <FlatList
              data={this.state.products}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Content>
        </Drawer>
        <Footer>
          <FooterTab>
            <Button
              full
              onPress={() => {
                Actions.add_product();
              }}
            >
              <Text> Add New Product</Text>
            </Button>
          </FooterTab>
        </Footer>
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
