import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import indexTextsReducer from './indexTexts';
import selectedTextReducer from './selectedText';
import { UNLOAD_SELECTED_TEXT } from '../actions'

// Hight Order Reducer for reset a piece of state
const resetStateOn = (clearActionsTypes, reducer) => (previousState , action) => {
  // Is a clear action type! Reset this piece of state
  if (clearActionsTypes.indexOf(action.type) !== -1) {
    return reducer(undefined, action)
  }
  return reducer(previousState, action)
}

export default combineReducers({
  routing: routerReducer,
  indexTexts: indexTextsReducer,
  selectedText: resetStateOn([UNLOAD_SELECTED_TEXT], selectedTextReducer),
});
