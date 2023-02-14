import React, { Component } from "react";

import { StyleSheet, View, Text, BackHandler,Image } from "react-native";
import { connect } from "react-redux";
import {
  H1,
  H3,
  Container,
  Label,
  Content,
  Form,
  Item,
  Input,
  Button
} from "native-base";

import { loginUpdate, loginUser, logoutUser } from "../../actions";

class Login extends Component {
  
  constructor(props){
    super(props)

   this.state = {
      isTap: false
    }
  }
  componentWillMount() {
    
  }
  componentDidMount() {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.backAndroid()
    ); // Remove listener
    this.props.logoutUser();
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
  handleBackButton() {
    return true;
  }
  submit() {
    const { email, password } = this.props;

    this.props.loginUser({
      email,
      password
    });
  }
  render() {
    return (
      <Container style={styles.containerStlye}>
        <Content style={styles.contentStyle}>
          <View style={styles.titleStyle}>
            <H1>Courtyard</H1>
            <H3>POS Mobile</H3>
            <Image
            source={require('../../assets/Courtyard.png')}
            style={{
            resizeMode: 'cover',
            width: 260, height: 160
            }}
           />

          </View>
            
          <Form>
            <Item floatingLabel>
              <Label>Username or Email</Label>
              <Input
                value={this.props.email}
                onChangeText={value =>
                  this.props.loginUpdate({ prop: "email", value })
                }
              />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input
                value={this.props.password}
                onChangeText={value =>
                  this.props.loginUpdate({ prop: "password", value })
                }
                secureTextEntry={true}
              />
            </Item>
            <Text style={{ color: "red" }}>{this.props.error}</Text>
          </Form>

          <Button
            success
            full
            rounded
            style={styles.buttonStyle}
            onPress={this.submit.bind(this)}
            disabled={this.props.loading}
          >
            <Text> Login </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 15,
    marginBottom: 15
  },
  containerStlye: {},
  contentStyle: {
    flex: 1,
    margin: 5
  },
  dontHaveStyle: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoStyle: {
    justifyContent: "center",
    alignItems: "center"
  },
  titleStyle: {
    paddingTop: 10,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = ({ auth }) => {
  const { email, password, loading, error } = auth;

  return { email, password, loading, error };
};

export default connect(
  mapStateToProps,
  { loginUpdate, loginUser, logoutUser }
)(Login);
