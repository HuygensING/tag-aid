import { SET_SELECTED_TEXT } from '../../actions';

const defaultState = {};
export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case SET_SELECTED_TEXT:
      return payload;
    default:
      return previousState;
  }
};
