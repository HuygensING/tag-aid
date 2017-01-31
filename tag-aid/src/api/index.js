import { fetchJson } from '../util/fetch';

const API_URL = 'https://tag-aid.huygens.knaw.nl'
const TEXT_ID = 'aeb7d4b8-15af-4cb5-8c87-fa38661943a0'

// export const getGraph = (start, end) =>
//   fetchJson(`/data/vizgraph_${start}-${end}.json`).then(({ json }) => json)
//   .then(json => ({
//     ...json,
//     links: json.links.map(link => ({ ...link, linkId: `${link.source}-${link.target}` }))
//   }))

export const getGraph = (start, end) =>
  fetchJson(`/stemmarest/tradition/${TEXT_ID}/subgraph/${start}/${end}`).then(({ json }) => json)
  .then(graph => ({
    ...graph,
    relationships: graph.relationships.map(link => {
      const swappedLink = {
        ...link,
        source: link.target,
        target: link.source
      }
      return swappedLink
    })
  }))

export const searchText = (text) =>
  fetchJson(`/stemmarest/tradition/${TEXT_ID}/search/${text}`)
  .then(({ json }) => json)

export const getTextInfo = () =>
  fetchJson(`/stemmarest/tradition/${TEXT_ID}`)
  .then(({ json }) => json)

export const getTextWitnesses = () =>
  fetchJson(`/stemmarest/tradition/${TEXT_ID}/witnesses`)
  .then(({ json }) => json)
