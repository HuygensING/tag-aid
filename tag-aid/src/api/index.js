import { fetchJson } from '../util/fetch';

const API_URL = 'https://tag-aid.huygens.knaw.nl'

// DEBUG Utiliy to wrap API call in timeout...
const ttime = (fn, time) => (...args) =>
  new Promise(resolve => setTimeout(() => resolve(), time)).then(() => fn(...args))

// export const getGraph = (start, end) =>
//   fetchJson(`/data/vizgraph_${start}-${end}.json`).then(({ json }) => json)
//   .then(json => ({
//     ...json,
//     links: json.links.map(link => ({ ...link, linkId: `${link.source}-${link.target}` }))
//   }))

export const getTexts = () =>
  fetchJson(`/stemmarest/traditions`).then(({ json }) => json)

export const getGraph = (textId, start, end) =>
  fetchJson(`/stemmarest/tradition/${textId}/subgraph/${start}/${end}`).then(({ json }) => json)

export const searchText = (textId, text) =>
  fetchJson(`/stemmarest/tradition/${textId}/search/${text}`)
  .then(({ json }) => json)

export const getTextInfo = (textId) =>
  fetchJson(`/stemmarest/tradition/${textId}`)
  .then(({ json }) => json)

export const getTextWitnesses = (textId) =>
  fetchJson(`/stemmarest/tradition/${textId}/witnesses`)
  .then(({ json }) => json)


  export const getTextNode = (nodeId) =>
    fetchJson(`/stemmarest/reading/${nodeId}`)
    .then(({ json }) => json)
