import { fetchJson } from '../util/fetch';

export const getGraph = (start, end) =>
  fetchJson(`/data/vizgraph_${start}-${end}.json`).then(({ json }) => json);
