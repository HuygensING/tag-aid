import { combineReducers } from 'redux';
import textReducer from './text';
import filtersReducer from './filters'
import viewedPositionReducer from './viewedPosition'
import graphReducer from './graph'

export default combineReducers({
  text: textReducer, // nome, witnesses, numero di nodi totali, ...
  filters: filtersReducer, // gestione filtri viz  per witness
  viewedPosition: viewedPositionReducer, // gestisce la porzione di testo visualizzata
  graph: graphReducer // gestisce la struttura dati del grafo
});
