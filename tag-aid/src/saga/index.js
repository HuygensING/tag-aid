import { takeEvery, takeLatest, delay } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { max } from 'lodash'
import {
  GET_GRAPH,
  GET_GRAPH_LOADING,
  GET_GRAPH_FAILURE,
  GET_GRAPH_SUCCESS,
  SET_VIEWED_POSITION,
  SEARCH_TEXT,
  SEARCH_TEXT_LOADING,
  SEARCH_TEXT_FAILURE,
  SEARCH_TEXT_SUCCESS,
  getGraph as getGraphAction,
  searchText as searchTextAction,
} from '../actions';
import { getGraph, searchText } from '../api'

function *handleGetGraph({ payload: { start, end } }) {

  yield call(delay, 100);
  yield put({ type: GET_GRAPH_LOADING });
  try {
    const graph = yield call(getGraph, start, end)
    yield put({ type: GET_GRAPH_SUCCESS, payload: { start, end, graph }})
  } catch (error) {
    yield put({ type: GET_GRAPH_FAILURE, error });
  }
}

const K = 20
const Y = 40
function *handleSetViewedPosition({ payload: { start, end } }) {
  const loadedPositions = yield select(state => state.selectedText.graph.loadedPositions)
  const lastLoadedPosition = max(Object.keys(loadedPositions).map(p => +p)) || 0
  console.warn(start, end)
  if (lastLoadedPosition - end < K) {
    console.info('Calling API', lastLoadedPosition + 1, end + Y)
    yield put(getGraphAction(lastLoadedPosition + 1, end + Y))
  }
}

function *handleSearchText({payload}) {

  yield put({ type: SEARCH_TEXT_LOADING });
  try {
    const results = yield call(searchText, payload)
    yield put({ type: SEARCH_TEXT_SUCCESS, payload: results})
  } catch (error) {
    yield put({ type: SEARCH_TEXT_FAILURE, error });
  }
}


export default function *tagAidSaga() {
  yield takeLatest(GET_GRAPH, handleGetGraph);
  yield takeEvery(SET_VIEWED_POSITION, handleSetViewedPosition);
  yield takeLatest(SEARCH_TEXT, handleSearchText);
}
