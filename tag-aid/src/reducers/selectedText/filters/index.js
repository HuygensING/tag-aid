import { combineReducers } from 'redux';
import witnessesReducer from './witnesses';
import slidersReducer from './sliders';
import togglesReducer from './toggles';

export default combineReducers({
  witnesses: witnessesReducer,
  sliders: slidersReducer,
  toggles : togglesReducer,
});
