
import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGIN_UPDATE
} from '../actions/types';


const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  error: '',
  photo: '',
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case LOGIN_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_FAIL:
      return { ...state, error: 'These credentials do not match our records.', password: '', loading: false };
    case 'SET_USER':
      return { ...state, ...INITIAL_STATE, user: action.payload};
      case 'LOGOUT_USER':
      return { ...state, ...INITIAL_STATE};  
    default:
      return state;
  }
};