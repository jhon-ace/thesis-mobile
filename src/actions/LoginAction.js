import { Actions } from 'react-native-router-flux';
import axios from 'axios';

import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGIN_UPDATE
} from './types';

export const loginUpdate = ({ prop, value }) =>{
   return {
    type: LOGIN_UPDATE,
    payload: { prop, value }
  };
}

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: user
  }
}

export const logoutUser = () => {
  return {
    type: 'LOGOUT_USER'
  }
}

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    let data =  new FormData()

    data.append('username', email)
    data.append('password', password)

    dispatch({ type: LOGIN_USER });

    axios.post(`login_ajax.php`,data).then( result => {

   dispatch({ type: 'SET_USER',payload:result.data});
   dispatch({ type: LOGIN_USER_SUCCESS});
   Actions.dashboard()
    }).catch( error => {

      console.log(error.response)
      loginUserFail(dispatch);

    })
    }
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};
