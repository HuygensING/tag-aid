import { combineReducers } from 'redux';
import witnessesReducer from './witnesses';
import slidersReducer from './sliders';

export default combineReducers({
  witnesses: witnessesReducer,
  sliders: slidersReducer,
});
