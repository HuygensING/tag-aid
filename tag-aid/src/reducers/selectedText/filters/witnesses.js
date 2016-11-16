import { TOGGLE_WITNESSES } from '../actions';

const defaultState = {};
export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case TOGGLE_WITNESSES:
      return {
        ...previousState,
        [payload]: !previousState[payload]
      };
    default:
      return previousState;
  }
};
