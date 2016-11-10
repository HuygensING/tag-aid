import { SET_TEXTS } from '../actions';

const defaultState = [];
export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case SET_TEXTS:
      return payload;
    default:
      return previousState;
  }
};
