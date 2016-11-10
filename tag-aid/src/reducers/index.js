import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import textsReducer from './texts';

export default combineReducers({
  routing: routerReducer,
  texts: textsReducer,
});
