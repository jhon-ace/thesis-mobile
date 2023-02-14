import {AsyncStorage} from 'react-native';

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import { persistStore, persistReducer } from 'redux-persist'

import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';;

const persistConfig = {
  key: 'root1',
  storage:AsyncStorage
}
const persistedReducer = persistReducer(persistConfig, reducers)


const middlewares = [
	ReduxThunk
];

if (__DEV__) {
  middlewares.push(createLogger());
}

export default () => {
  let store = createStore(persistedReducer, {}, applyMiddleware(...middlewares))
  console.log(store);
  let persistor = persistStore(store)
  return { store, persistor }
}
