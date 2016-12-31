import { SET_TOGGLE } from '../../../actions'

const defaultState = {
  showRuler: true,
  showVarationsMarks: true,
  showNodes: true,
  showEdges: true
}

export default (previousState = defaultState, { type, payload }) => {
  if (type === SET_TOGGLE) {
    if (typeof previousState[payload] !== 'undefined') {
      return {
        ...previousState,
        [payload]: !previousState[payload]
      }
    }
  }
  return previousState
}
