import { takeLatest, delay } from 'redux-saga';
import { put, call, select, fork } from 'redux-saga/effects';
import { max } from 'lodash'
import { takeLatestAndCancel, takeEveryAndCancel } from './helpers'
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
  SET_SELECTED_TEXT,
  SET_SELECTED_TEXT_LOADING,
  SET_SELECTED_TEXT_FAILURE,
  SET_SELECTED_TEXT_SUCCESS,
  UNLOAD_SELECTED_TEXT,
  GET_TEXTS,
  GET_TEXTS_LOADING,
  GET_TEXTS_FAILURE,
  GET_TEXTS_SUCCESS,
  getGraph as getGraphAction,
  searchText as searchTextAction,
  clearPositions as clearPositionsAction,
} from '../actions';
import {
  getGraph,
  searchText,
  getTextInfo,
  getTextWitnesses,
  getTexts,
} from '../api'

function *handleGetGraph({ payload: { start, end } }) {

  yield call(delay, 100);
  yield put({ type: GET_GRAPH_LOADING });
  const textId = yield select(state => state.selectedText.text.id)
  try {
    const graph = yield call(getGraph, textId, start, end)
    yield put({ type: GET_GRAPH_SUCCESS, payload: { start, end, graph }})
  } catch (error) {
    yield put({ type: GET_GRAPH_FAILURE, error });
  }
}

const isRangeLoaded = (loaded, start, end) => {
  for (let i = start; i < end; i++) {
    if (! loaded[i]) {
      return false
    }
  }
  return true
}

const getSmallerRange = (loaded, start, end) => {
  let sStart, sEnd
  // Find first not loaded
  for (let i = start; i <= end; i++) {
    if (! loaded[i]) {
      sStart = i
      break
    }
  }

  if (typeof sStart === 'undefined') {
    // Nothing to load
    return false
  }

  // Find last not loaded
  for (let i = end; i >= sStart; i--) {
    if (! loaded[i]) {
      sEnd = i
      break
    }
  }

  return [sStart, sEnd]
}

// Generic Graph Threshold
const T = 90
// API Call Threshold
const CALL_T = T + 30
// Nodes Clear Threshold
const CLEAR_T = CALL_T + 10

function *handleSetViewedPosition({ payload: { start, end } }) {
  const loadedPositions = yield select(state => state.selectedText.graph.loadedPositions)
  const maxNodes = yield select(state => state.selectedText.text.maxNodes)
  console.log(`SetViewPos: ${start},${end}`)
  if (! isRangeLoaded(loadedPositions, Math.max(0, start - T), Math.min(end + T, maxNodes))) {
    let [ gStart, gEnd ] = getSmallerRange(loadedPositions, Math.max(0, start - CALL_T), Math.min(end + CALL_T, maxNodes))
    yield put(getGraphAction(gStart, gEnd))
    console.log(`Graph: ${gStart},${gEnd}`)
  }
}

function *clearPositions() {
  const { start, end } = yield select(state => state.selectedText.viewedPosition)
  yield put(clearPositionsAction(Math.max(0, start - CLEAR_T), end + CLEAR_T))
}

function *handleSearchText({payload}) {

  yield put({ type: SEARCH_TEXT_LOADING });
  const textId = yield select(state => state.selectedText.text.id)
  try {
    const results = yield call(searchText, textId, payload)
    yield put({ type: SEARCH_TEXT_SUCCESS, payload: results})
  } catch (error) {
    yield put({ type: SEARCH_TEXT_FAILURE, error });
  }
}

function *handleSetSelectedText({ payload }) {
  yield put({ type: SET_SELECTED_TEXT_LOADING });
  try {
    const [ text, witnesses ] = yield [
      call(getTextInfo, payload),
      call(getTextWitnesses, payload)
    ]
    yield put({ type: SET_SELECTED_TEXT_SUCCESS, payload: {
      ...text,
      maxNodes: +text.max_rank,
      witnesses: witnesses.map(({ sigil }) => sigil),
    }})
  } catch (error) {
    yield put({ type: SET_SELECTED_TEXT_FAILURE, error });
  }
}

function *handleGetTexts() {
  yield put({ type: GET_TEXTS_LOADING })
  try {
    const texts = yield call(getTexts)
    yield put({ type: GET_TEXTS_SUCCESS, payload: texts })
  } catch (error) {
    yield put({ type: GET_TEXTS_FAILURE, error })
  }
}

export default function *tagAidSaga() {
  yield fork(takeLatestAndCancel, GET_GRAPH, UNLOAD_SELECTED_TEXT, handleGetGraph);
  yield fork(takeEveryAndCancel, SET_VIEWED_POSITION, UNLOAD_SELECTED_TEXT, handleSetViewedPosition);
  yield fork(takeLatestAndCancel, SEARCH_TEXT, UNLOAD_SELECTED_TEXT, handleSearchText);
  yield fork(takeEveryAndCancel, GET_GRAPH_SUCCESS, UNLOAD_SELECTED_TEXT, clearPositions);
  yield fork(takeLatestAndCancel, SET_SELECTED_TEXT, UNLOAD_SELECTED_TEXT, handleSetSelectedText);

  yield takeLatest(GET_TEXTS, handleGetTexts);
}
