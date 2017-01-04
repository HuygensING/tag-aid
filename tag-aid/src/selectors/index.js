import { createSelector } from 'reselect';
import { mapValues, range, isUndefined, includes, groupBy, every } from 'lodash';

const getAllWitnesses = state => state.selectedText.text.witnesses || [];
const getWitnessesFilters = state => state.selectedText.filters.witnesses;
const getRawTextSearchResults = state => state.selectedText.search.results;

// For Checkboxes
export const getWitnessesCheck = createSelector(
  getAllWitnesses,
  getWitnessesFilters,
  (witnesses, witnessesFilters) => witnesses.map(witness => ({
    value: witness,
    checked: !!witnessesFilters[witness]
  }))
);

// The witnesses selected by user
export const getSelectedWitnesses = createSelector(
  getAllWitnesses,
  getWitnessesFilters,
  (witnesses, witnessesFilters) => witnesses.filter(witness => witnessesFilters[witness])
);

const getNodesById = state => state.selectedText.graph.nodesById;
const getLinksById = state => state.selectedText.graph.linksById;
const getNodesAtPosition = state => state.selectedText.graph.nodesAtPosition;
const getNodesAtPositionByWitness = state => state.selectedText.graph.nodesAtPositionByWitness;
const getLinksByNodes = state => state.selectedText.graph.linksByNodes;
const getViewedPosition = state => state.selectedText.viewedPosition;

// How many pos padding has viewed text
const TEXT_PADDING = 90;

export const getTextNodesByWitness = createSelector(
  getNodesById,
  getNodesAtPositionByWitness,
  getViewedPosition,
  (nodesById, nodesAtPositionByWitness, { start, end }) => {
    console.time("getTextNodesByWitness")
    const out = mapValues(nodesAtPositionByWitness, nodesAtPosition =>
    // TODO: Check max end...
    range(Math.max(0, start - TEXT_PADDING) , end + TEXT_PADDING + 1)
      .map(pos => nodesAtPosition[pos])
      .filter(nodeId => !isUndefined(nodeId))
      .map(nodeId => {
        const node = nodesById[nodeId];
        const pos = Number(node.rank);
        return { ...node, pos, viewed: (pos >= start && pos <= end) };
      })
    )
    console.timeEnd("getTextNodesByWitness")
    return out;

  }
);

export const getSankeyNodes = createSelector(
  getNodesById,
  getNodesAtPosition,
  getViewedPosition,
  (nodesById, nodesAtPosition, { start, end }) => {
    console.time("getSankeyNodes")
    // Sankey draw double of nodes and show the half...
    const out = range(start, end + 1)
    .reduce((result, pos) => [...result, ...Object.keys(nodesAtPosition[pos] || {})], [])
    .map(nodeId => nodesById[nodeId])
    console.timeEnd("getSankeyNodes")
    return out;
  }
)

export const getSankeyLinks = createSelector(
  getLinksById,
  getSankeyNodes,
  getLinksByNodes,
  (linksById, nodes, linksByNodes) => {
    console.time("getSankeyLinks")
    const out = nodes.reduce((result, node) => {
    const links = Object.keys(linksByNodes[node.id]);
    return [...result, ...links.filter(linkId => !includes(result, linkId))];
    }, [])
    .map(linkId => linksById[linkId])

    console.timeEnd("getSankeyLinks")
    return out

  }
)

// For Checkboxes
export const getTextSearchResults = createSelector(
  getRawTextSearchResults,
  (results) => groupBy(results, 'rank')
);

const getLoadedPositions = state => state.selectedText.graph.loadedPositions

export const getIsGraphLoading = createSelector(
  getLoadedPositions,
  getViewedPosition,
  (loadedPositions, { start, end }) =>
    ! every(range(start, end + 1).map(pos => loadedPositions[pos]))
)
