
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import { connect } from 'react-redux'

import Dashboard from './components/Dashboard'
import Login from './components/Auth/Login'

Login
class Initial extends Component {

	componentDidMount(){
		
	}
  render() {
  	const { auth,isLogout } = this.props
    console.log(auth,isLogout)
    if(isLogout){
     return <Login />
    }
		if(auth.user != null){
			return <Dashboard />
		}
    return (
      <Login />
    );
  }
}

const styles = StyleSheet.create({

});

const mapStateToProps = ({ auth }) => {

	return {auth}
}

export default connect(mapStateToProps, {})(Initial);