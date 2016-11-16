import { combineReducers } from 'redux';
import witnessesReducer from './witnesses';

export default combineReducers({
  witnesses: witnessesReducer
});
