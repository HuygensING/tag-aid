import { SET_SLIDER_VALUE } from '../../../actions'

const defaultState = {
  nodeHeight: 20,
  nodeWidth: 3,
  nodeOpacity: 0.5,
  edgeOpacity: 1
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
