import React from "react";
import { Image, BackHandler } from "react-native";
import { Container, Content, Text, ListItem, Right, Badge } from "native-base";
import { Actions } from "react-native-router-flux";
import axios from "axios";

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTap: false,
      products: []
    };
  }

  componentWillMount() {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.backAndroid()
    ); // Remove listener
  }

  componentDidMount() {
    axios
      .get(`ajax_product.php`)
      .then(result => {
        this.setState({
          products: result.data.filter( item => {
            return item.remainingstock < 4
          })
        });
        console.log(result.data);
      })
      .catch(error => {
        console.log(error);
        console.log("error");
      });
  }
  backAndroid() {
    if (this.state.isTap) {
      BackHandler.exitApp();
    }

    this.setState({ isTap: true });
    ToastAndroid.showWithGravityAndOffset(
      "Double tap to exit",
      500,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    setTimeout(() => {
      this.setState({ isTap: false });
    }, 1000);

    return true;
  }

  render() {
    return (
      <Container>
        <Content>
          <Image
            source={require("../assets/Courtyard.png")}
            style={{
              resizeMode: "cover",
              width: 260,
              height: 160
            }}
          />

          <ListItem button onPress={() => Actions.dashboard()}>
            <Text>Dashboard</Text>
          </ListItem>
          <ListItem button onPress={() => Actions.main_screen()}>
            <Text>Product</Text>
          </ListItem>
          <ListItem button onPress={() => Actions.sales()}>
            <Text>Sales Report</Text>
          </ListItem>
          <ListItem button onPress={() => Actions.main_screen({ notify:true})}>
            <Text>Notifications</Text>
            <Right>
            {
              this.state.products.length > 0 ? (<Badge danger>
                <Text>{this.state.products.length}</Text>
              </Badge>):null
            }
              
            </Right>
          </ListItem>

          <ListItem button onPress={() => Actions.first({ isLogout: true })}>
            <Text>Logout</Text>
          </ListItem>
        </Content>
      </Container>
    );
  }
}
