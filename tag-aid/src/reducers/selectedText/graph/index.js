import { GET_GRAPH_SUCCESS } from '../../../actions'

const defaultState = {
  nodesById: {},
  linksById: {},
  loadedPositions: {},
  nodesAtPosition: {},
  nodesAtPositionByWitness: {},
  linksByNodes: {},
};
export default (previousState = defaultState, { type, payload }) => {
  if (type === GET_GRAPH_SUCCESS) {
    const { graph, start, end } = payload;
    const mergedNodesById = graph.readings.reduce((result, node) => ({
      ...result,
      [node.id]: node
    }), {})

    const newNodesById = {
      ...previousState.nodesById,
      ...mergedNodesById
    };

    const mergedLinksById = graph.relationships.reduce((result, link) => ({
      ...result,
      [link.id]: { ...link, value: link.witness.length }
    }), {})

    const newLinksById = {
      ...previousState.linksById,
      ...mergedLinksById
    }

    const newLoadedPosition = {}
    for (let i = start;i <= end;i++) {
      newLoadedPosition[i] = true;
    }

    const newNodesAtPosition = graph.readings.reduce((result, node) => ({
      ...result,
      [node.rank]: {
        ...(result[node.rank] || {}),
        [node.id]: true
      }
    }), previousState.nodesAtPosition)

    const newNodesAtPositionByWitness = graph.relationships.reduce((result, link) => {
      const nodeSource = newNodesById[link.source];
      const nodeTarget = newNodesById[link.target];

      const newNodesAtPosition = {
        [nodeTarget.rank]: nodeTarget.id,
        [nodeSource.rank]: nodeSource.id
      }
      return link.witness.reduce((wResult, witness) => ({
        ...wResult,
        [witness]: {
          ...(wResult[witness] || {}),
          ...newNodesAtPosition
        }
      }), result)
    }, previousState.nodesAtPositionByWitness)

    const newLinksByNodes = graph.relationships.reduce((result, link) => ({
      ...result,
      [link.target]: {
        ...result[link.target],
        [link.id]: true
      },
      [link.source]: {
        ...result[link.source],
        [link.id]: true
      }
    }), previousState.linksByNodes);

    return {
      nodesById: newNodesById,
      linksById: newLinksById,
      loadedPositions: {
        ...previousState.loadedPositions,
        ...newLoadedPosition
      },
      nodesAtPosition: newNodesAtPosition,
      nodesAtPositionByWitness: newNodesAtPositionByWitness,
      linksByNodes: newLinksByNodes,
    }
  }
  return previousState;
}
