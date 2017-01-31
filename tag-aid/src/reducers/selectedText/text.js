import { SET_SELECTED_TEXT_SUCCESS } from '../../actions';

const defaultState = null;
export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case SET_SELECTED_TEXT_SUCCESS:
      return payload;
    default:
      return previousState;
  }
};
