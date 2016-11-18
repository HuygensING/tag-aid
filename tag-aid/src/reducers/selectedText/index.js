import { combineReducers } from 'redux';
import textReducer from './text';
import filtersReducer from './filters'
import graphReducer from './graph'

export default combineReducers({
  /// sub-reducers
  text: textReducer, ///nome, witnesses, numero di nodi totali
  filters: filtersReducer,//filters: , // gestione filtri viz  per witness
  graph: graphReducer,
  //nodes: ,
});
