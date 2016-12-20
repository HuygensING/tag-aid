export const SET_TEXTS = 'SET_TEXTS';
export const setTexts = (texts) => ({
  type: SET_TEXTS,
  payload: texts
});

export const SET_SELECTED_TEXT = 'SET_SELECTED_TEXT';
export const setSelectedText = (text) => ({
  type: SET_SELECTED_TEXT,
  payload: text
});

export const TOGGLE_WITNESS = 'TOGGLE_WITNESS';
export const toggleWitness = (witness) => ({
  type: TOGGLE_WITNESS,
  payload: witness
});

export const SET_VIEWED_POSITION = 'SET_VIEWED_POSITION';
export const setViewedPosition = (start, end) => ({
  type: SET_VIEWED_POSITION,
  payload: { start, end }
});

export const GET_GRAPH = 'GET_GRAPH';
export const GET_GRAPH_LOADING = 'GET_GRAPH_LOADING';
export const GET_GRAPH_FAILURE = 'GET_GRAPH_FAILURE';
export const GET_GRAPH_SUCCESS = 'GET_GRAPH_SUCCESS';
export const getGraph = (start, end) => ({
  type: GET_GRAPH,
  payload: { start, end }
});


export const SEARCH_TEXT = 'SEARCH_TEXT';
export const SEARCH_TEXT_LOADING = 'SEARCH_TEXT_LOADING';
export const SEARCH_TEXT_FAILURE = 'SEARCH_TEXT_FAILURE';
export const SEARCH_TEXT_SUCCESS = 'SEARCH_TEXT_SUCCESS';
export const searchText = (text) => ({
  type: SEARCH_TEXT,
  payload: text
});
