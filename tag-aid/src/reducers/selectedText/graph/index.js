import { GET_GRAPH_SUCCESS } from '../../../actions'

const defaultState = {
  nodesById: {},
  linksById: {},
  loadedPositions: {},
};
export default (previousState = defaultState, { type, payload }) => {
  if (type === GET_GRAPH_SUCCESS) {
    const { graph, start, end } = payload;
    const newNodesById = graph.nodes.reduce((result, node) => ({
      ...result,
      [node.nodeId]: node
    }), {})

    const newLoadedPosition = {}
    for (let i = start;i <= end;i++) {
      newLoadedPosition[i] = true;
    }
    // const newLinksById = graph.links.reduce((result, link) => ({
    //   ...result,
    //   [link.nodeId]: node
    // }), {})

    return {
      nodesById: {
        ...previousState.nodesById,
        ...newNodesById
      },
      loadedPositions: {
        ...previousState.loadedPositions,
        ...newLoadedPosition
      }
    }
  }
  return previousState;
}
