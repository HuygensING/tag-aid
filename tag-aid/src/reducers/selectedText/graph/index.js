import { GET_GRAPH_SUCCESS, CLEAR_POSITIONS } from '../../../actions'
import { mapValues, omit, omitBy } from 'lodash'

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
    console.time('GET_GRAPH_SUCCESS');
    console.time('GET_GRAPH_SUCCESS_INNER');

    console.time('GET_GRAPH_SUCCESS_newNodesById');
    const { graph, start, end } = payload;
    const mergedNodesById = graph.readings.reduce((result, node) => ({
      ...result,
      [node.id]: node
    }), {})

    const newNodesById = {
      ...previousState.nodesById,
      ...mergedNodesById
    };
    console.timeEnd('GET_GRAPH_SUCCESS_newNodesById');

    console.time('GET_GRAPH_SUCCESS_newLinksById');
    const mergedLinksById = graph.relationships.reduce((result, link) => ({
      ...result,
      [link.id]: { ...link, value: link.witness.length }
    }), {})

    const newLinksById = {
      ...previousState.linksById,
      ...mergedLinksById
    }
    console.timeEnd('GET_GRAPH_SUCCESS_newLinksById');


    console.time('GET_GRAPH_SUCCESS_newLoadedPosition');
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
    console.timeEnd('GET_GRAPH_SUCCESS_newLoadedPosition');

    console.time('GET_GRAPH_SUCCESS_newNodesAtPositionByWitness');
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
    console.timeEnd('GET_GRAPH_SUCCESS_newNodesAtPositionByWitness');

    console.time('GET_GRAPH_SUCCESS_newLinksByNodes');
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
    console.timeEnd('GET_GRAPH_SUCCESS_newLinksByNodes');


    console.timeEnd('GET_GRAPH_SUCCESS_INNER');
    const out =  {
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

    console.timeEnd('GET_GRAPH_SUCCESS');
    return out;
  } else if (type === CLEAR_POSITIONS) {

    // Range to take
    const { start, end } = payload

    // Is pos to clea?
    const isClearPos = (pos) => ((+pos) < (+start)) || ((+pos) > (+end))

    // Unique nodes ids to clear
    const nodesToClear = Object.keys(previousState.nodesAtPosition).reduce((result, pos) => {
      if (isClearPos(pos)) {
        return {
          ...result,
          ...previousState.nodesAtPosition[pos]
        }
      }
      return result
    }, {})

    // Compute links ids to clear from nodes ids to clear
    const linksToClear = Object.keys(previousState.linksByNodes).reduce((result, nodeId) => {
      if (nodesToClear[nodeId]) {
        return {
          ...result,
          ...previousState.linksByNodes[nodeId]
        }
      }
      return result
    }, {})

    return {
      nodesById: omit(previousState.nodesById, Object.keys(nodesToClear)),
      linksById: omit(previousState.linksById, Object.keys(linksToClear)),
      loadedPositions: omitBy(previousState.loadedPositions, (_, pos) => isClearPos(pos)),
      nodesAtPosition: omitBy(previousState.nodesAtPosition, (_, pos) => isClearPos(pos)),
      nodesAtPositionByWitness: mapValues(previousState.nodesAtPositionByWitness, (nodesAtPosition) =>
        omitBy(nodesAtPosition, (_, pos) => isClearPos(pos))),
      linksByNodes: omit(previousState.linksByNodes, Object.keys(nodesToClear))
    }
  }

  return previousState;
}
