import {
  // GET_TEXTS_LOADING,
  // GET_TEXTS_FAILURE,
  GET_TEXTS_SUCCESS,
} from '../actions';

const defaultState = [];
export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case GET_TEXTS_SUCCESS:
      return payload;
    default:
      return previousState;
  }
};
