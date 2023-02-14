
import React, {Component} from 'react';

import { Root,Spinner } from "native-base";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import axios from 'axios';

import Router from './src/Router';
import {View} from 'react-native';

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import { persistStore, persistReducer } from 'redux-persist'

import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension'
import { BASE_URL } from './src/Settings'

import storage from 'redux-persist/lib/storage'

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
      super(props);
  }

  componentWillMount(){
    console.log(BASE_URL)
    axios.defaults.baseURL = `${BASE_URL}`
  }
  
  renderLoading(){
      return (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner color='green' />
        </View>
      )
  }

  render() {
    const persistConfig = {
    key: 'root1',
    storage,
    whitelist: ['auth']

  }
  const persistedReducer = persistReducer(persistConfig, reducers)


  const middlewares = [
       ReduxThunk
  ];

    if (__DEV__) {
      middlewares.push(createLogger());
  }

    const store = createStore(persistedReducer, {}, applyMiddleware(...middlewares))
    const persistor = persistStore(store)

    return (
     <Provider store={store}>
      <PersistGate loading={this.renderLoading()} persistor={persistor}>
          <Root>
           <Router />
          </Root>
      </PersistGate>
    </Provider>

    );
  }
}
