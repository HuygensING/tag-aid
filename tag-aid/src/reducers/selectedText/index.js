import { combineReducers } from 'redux';
import textReducer from './text';
import filtersReducer from './filters'

export default combineReducers({
  /// sub-reducers
  text: textReducer, ///nome, witnesses, numero di nodi totali
  filters: filtersReducer//filters: , // gestione filtri viz  per witness
  //nodes: ,
});
