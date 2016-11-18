import { takeLatest } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import {
  GET_GRAPH,
  GET_GRAPH_LOADING,
  GET_GRAPH_FAILURE,
  GET_GRAPH_SUCCESS
} from '../actions';
import { getGraph } from '../api'

function *handleGetGraph({ payload: { start, end } }) {
  yield put({ type: GET_GRAPH_LOADING });
  try {
    const graph = yield call(getGraph, start, end)
    yield put({ type: GET_GRAPH_SUCCESS, payload: { start, end, graph }})
  } catch (error) {
    yield put({ type: GET_GRAPH_FAILURE, error });
  }
}

export default function *tagAidSaga() {
  yield takeLatest(GET_GRAPH, handleGetGraph);
}
