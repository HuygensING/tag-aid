import { SET_SLIDER_VALUE } from '../../../actions'

const defaultState = {
  nodeHeight: 20,
  nodeWidth: 50,
  nodeOpacity: 50,
  edgeOpacity: 50
}

export default (previousState = defaultState, { type, payload }) => {
  if (type === SET_SLIDER_VALUE) {
    if (typeof previousState[payload.slider] !== 'undefined') {
      return {
        ...previousState,
        [payload.slider]: payload.value
      }
    }
  }
  return previousState
}
