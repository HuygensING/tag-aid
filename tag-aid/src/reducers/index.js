import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import indexTextsReducer from './indexTexts';
import selectedTextReducer from './selectedText';

export default combineReducers({
  routing: routerReducer,
  indexTexts: indexTextsReducer,
  selectedText: selectedTextReducer
});
