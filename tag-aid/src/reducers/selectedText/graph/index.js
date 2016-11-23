import { GET_GRAPH_SUCCESS } from '../../../actions'

const defaultState = {
  nodesById: {},
  linksById: {},
  loadedPositions: {},
  nodesAtPositionByWitness: {},
  linksByNodes: {},
};
export default (previousState = defaultState, { type, payload }) => {
  if (type === GET_GRAPH_SUCCESS) {
    const { graph, start, end } = payload;
    const mergedNodesById = graph.nodes.reduce((result, node) => ({
      ...result,
      [node.nodeId]: node
    }), {})

    const newNodesById = {
      ...previousState.nodesById,
      ...mergedNodesById
    };

    const mergedLinksById = graph.links.reduce((result, link) => ({
      ...result,
      [link.linkId]: link
    }), {})

    const newLinksById = {
      ...previousState.linksById,
      ...mergedLinksById
    }

    const newLoadedPosition = {}
    for (let i = start;i <= end;i++) {
      newLoadedPosition[i] = true;
    }

    const newNodesAtPositionByWitness = graph.links.reduce((result, link) => {
      const nodeSource = newNodesById[link.source];
      const nodeTarget = newNodesById[link.target];

      const newNodesAtPosition = {
        [nodeTarget.pos]: nodeTarget.nodeId,
        [nodeSource.pos]: nodeSource.nodeId
      }
      return link.witnesses.reduce((wResult, witness) => ({
        ...wResult,
        [witness]: {
          ...(wResult[witness] || {}),
          ...newNodesAtPosition
        }
      }), result)
    }, previousState.nodesAtPositionByWitness)

    const newLinksByNodes = graph.links.reduce((result, link) => ({
      ...result,
      [link.target]: {
        ...result[link.target],
        [link.linkId]: true
      },
      [link.source]: {
        ...result[link.source],
        [link.linkId]: true
      }
    }), previousState.linksByNodes);

    return {
      nodesById: newNodesById,
      linksById: newLinksById,
      loadedPositions: {
        ...previousState.loadedPositions,
        ...newLoadedPosition
      },
      nodesAtPositionByWitness: newNodesAtPositionByWitness,
      linksByNodes: newLinksByNodes,
    }
  }
  return previousState;
}
