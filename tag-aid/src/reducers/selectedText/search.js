import { SEARCH_TEXT_LOADING, SEARCH_TEXT_SUCCESS, SEARCH_TEXT_FAILURE } from '../../actions';
const defaultState = {
  searching : false,
  results : [],
}

export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case SEARCH_TEXT_LOADING:
      return {
        ...previousState,
        searching : true
      };
    case SEARCH_TEXT_FAILURE:
      return {
        ...previousState,
        searching : false,
        results : []
      };
    case SEARCH_TEXT_SUCCESS:
      return {
        ...previousState,
        searching : false,
        results : payload
      };

    default:
      return previousState;
  }
};
