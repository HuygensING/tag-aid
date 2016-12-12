import { SET_VIEWED_POSITION } from '../../actions';

const defaultState = {
  start: 0,
  end: 0
};
export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case SET_VIEWED_POSITION:
      return {
        ...payload,
        start: payload.start >= 0 ? payload.start : 0,
        end: payload.end >= 20 ? payload.end : 20
      };
    default:
      return previousState;
  }
};
