import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  setSelectedText,
  unloadSelectedText,
  toggleWitness,
  getGraph,
  setViewedPosition,
  searchText,
  setNodeWidth,
  setNodeHeight,
  setEdgeOpacity,
  setNodeOpacity,
  toggleShowRuler,
  toggleShowVarationsMarks,
  toggleShowNodes,
  toggleShowEdges
} from '../actions';
import {
  getWitnessesCheck,
  getSelectedWitnesses,
  getTextNodesByWitness,
  getSankeyNodes,
  getSankeyLinks,
  getTextSearchResults,
  getIsGraphLoading,
} from '../selectors'
import WitnessText from '../components/WitnessText';
import Graph from '../components/Graph';
import { Grid, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import '../styles/hi-faceted-search.css';

class Text extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchToken : '',
      searchedCurrentToken : false
    }
  }

  componentWillMount() {
    this.props.setSelectedText(this.props.params.textId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.textId !== this.props.params.textId) {
      // Reset state realated to current text and load the new λ
      this.props.unloadSelectedText()
      this.setState({
        searchToken: '',
        searchedCurrentToken: false
      })
      this.props.setSelectedText(this.props.params.textId)
    }
    if (nextProps.text && nextProps.text !== this.props.text) {
      this.props.setViewedPosition(0, 20);
    }
  }

  componentWillUnmount() {
    this.props.unloadSelectedText()
  }

  handleSearch = () => {
    this.setState({ searchedCurrentToken: true });
    this.props.searchText(this.state.searchToken);
  }

  render() {
    // Loading main text info nothing to do
    if (!this.props.text) {
      return <div>Loading text...</div>
    }

    const {
      text,
      text: { witnesses, maxNodes },
      viewedPosition,
      witnessesCheck,
      selectedWitnesses,
      toggleWitness,
      getGraph,
      setViewedPosition,
      nodesByWitness,
      linksByWitness,
      allNodes,
      allLinks,
      searchText,
      searching,
      results,
      searchTextResults,
      sliders,
      toggles,
      setNodeWidth,
      setNodeHeight,
      setNodeOpacity,
      setEdgeOpacity,
      toggleShowRuler,
      toggleShowVarationsMarks,
      toggleShowNodes,
      toggleShowEdges,
      isGraphLoading,
    } = this.props;

    return (
      <Grid>
          <Row> {/* TEXT NAME */}
            <Col md={12} className="text-header">
              <Button bsClass="btn-collapse-left-pane" componentClass="btn-collapse-left-pane">
                <span className="glyphicon glyphicon-menu-hamburger"></span>
              </Button>
              <h1>{text.name}</h1>
            </Col>
          </Row> {/* END TEXT NAME */}

          <Row> {/* MAIN ROW */}
            <Col sm={3} md={3} id="left-pane">{/* LEFT PANEL */}
              <div className="facet-group">
                <div className="facet"> {/* SEARCH */}
                  <InputGroup>
                    <FormControl type="text" className="form-control search"
                      placeholder="Search for a word"
                      onChange={(e) =>  this.setState({searchToken:e.target.value, searchedCurrentToken:false})  } />
                      <span className="input-group-btn">
                        <Button bsClass="btn btn-default btn-search btn-lg" onClick={()=> this.handleSearch() }>
                          <span className="glyphicon glyphicon-search"></span>
                        </Button>
                      </span>
                  </InputGroup>
                  <div>
                    { searching && <div>Searching ...</div>}
                    { !searching && this.state.searchedCurrentToken && !results.length && <div className="search-results">No results for word &ldquo;<b>{this.state.searchToken}</b>&rdquo;</div>}
                    { !searching && this.state.searchedCurrentToken && results.length > 0 &&
                      <div>
                        <div className="search-results-header">Results for word &ldquo;<b>{this.state.searchToken}</b>&rdquo;</div>
                        <ul className="search-results">
                        { Object.keys(searchTextResults).map(rank => (
                          <li key={rank}>
                          pos: <a onClick={()=>setViewedPosition(+rank, +rank+20)}>{rank}</a> &mdash; {(searchTextResults[rank].length - 1 > 1) ? <span><strong>{searchTextResults[rank].length - 1}</strong> variants</span> : <span>no variants</span>}
                          </li>
                        )
                        ) }
                        </ul>
                      </div>
                    }
                  </div>
                </div> {/* END SEARCH */}

                <div className="facet basic-facet"> {/* WITNESS SELECTION */}
                  <h2>Witnesses</h2>
                  <button className="btn btn-facet-collapse btn-facet-witnesses-collapse pull-right" data-toggle="collapse" data-target="#facet-witnesses" />
                  <div id="facet-witnesses" className="facet-items-box collapse in">
                    <div className="selectors">

                      <div className="facet-item">

                        {witnessesCheck.map(witness => (
                          <div key={witness.value} className="checkbox checkbox-witness">
                            <input
                              className="styled"
                              onChange={() => toggleWitness(witness.value)}
                              type="checkbox"
                              checked={witness.checked}
                              value={witness.value}
                              name={witness.value}
                            />
                            <label htmlFor={witness.value}>{witness.value}</label>
                            <div className="facet-item-color facet-item-color-grey pull-left"></div>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  </div> {/* END WITNESS SELECTION */}

                  <div className="facet basic-facet"> {/* GRAPH CONTROLS */}
                    <h2>Graph controls</h2>
                    <div id="facet-graph-controls" className="facet-items-box collapse in">
                      <div className="graph-control">
                        <div className="graph-control-label">Node Height</div>
                        <Slider value={sliders.nodeHeight} tipFormatter={null} onChange={setNodeHeight} />
                        <span className="slider-value">{sliders.nodeHeight}</span>
                      </div>
                      <div className="graph-control">
                        <div className="graph-control-label">Node Width</div>
                        <Slider value={sliders.nodeWidth} tipFormatter={null} onChange={setNodeWidth} min={0} max={20} />
                        <span className="slider-value">{sliders.nodeWidth}</span>
                      </div>
                      <div className="graph-control">
                        <div className="graph-control-label">Edge Opacity</div>
                        <Slider value={sliders.edgeOpacity} tipFormatter={null} onChange={setEdgeOpacity} step={0.05} min={0.0} max={1.0} />
                        <span className="slider-value">{sliders.edgeOpacity}</span>
                      </div>
                      <div className="graph-control">
                        <div className="graph-control-label">Node Opacity</div>
                        <Slider value={sliders.nodeOpacity} tipFormatter={null} onChange={setNodeOpacity} step={0.05} min={0.0} max={1.0} />
                        <span className="slider-value">{sliders.nodeOpacity}</span>
                      </div>
                      <div className="graph-control">
                        <div className="graph-control-label">Ruler</div>
                        <input
                          id="toggle-ruler"
                          className="toggle"
                          onChange={() => toggleShowRuler()}
                          type="checkbox"
                          checked={toggles.showRuler}
                        />
                        <label htmlFor='toggle-ruler'></label>
                      </div>
                      <div className="graph-control">
                        <div className="graph-control-label">Variation marks</div>
                        <input
                          id="toggle-variation-marks"
                          className="toggle"
                          onChange={() => toggleShowVarationsMarks()}
                          type="checkbox"
                          checked={toggles.showVarationsMarks}
                        />
                        <label htmlFor='toggle-variation-marks'></label>
                      </div>
                      {/* <div className="graph-control">
                        <div className="graph-control-label">Nodes</div>
                        <input
                          id="toggle-nodes"
                          className="toggle"
                          onChange={() => toggleShowNodes()}
                          type="checkbox"
                          checked={toggles.showNodes}
                        />
                        <label htmlFor='toggle-nodes'></label>
                      </div> */}
                      {/* <div className="graph-control">
                        <div className="graph-control-label">Edges</div>
                        <input
                          id="toggle-edges"
                          className="toggle"
                          onChange={() => toggleShowEdges()}
                          type="checkbox"
                          checked={toggles.showEdges}
                        />
                        <label htmlFor='toggle-edges'></label>
                      </div> */}
                    </div>
                </div> {/* END GRAPH CONTROLS */}
              </div>
            </Col> {/* END LEFT PANEL */}

            <Col sm={9} md={9}>{/* MAIN AREA */}
              {isGraphLoading && <div>Loading Graph...</div>}
              <div id="chart-area"> {/* CHART */}
                {selectedWitnesses.map(witness => (
                  <Graph key={witness}
                    maxNodes={maxNodes}
                    nodeOpacity={sliders.nodeOpacity}
                    nodeWidth={sliders.nodeWidth}
                    edgeOpacity={sliders.edgeOpacity}
                    showNodes={toggles.showNodes}
                    showEdges={toggles.showEdges}
                    showVarationsMarks={toggles.showVarationsMarks}
                    viewedPosition={viewedPosition}
                    setViewedPosition={setViewedPosition}
                    nodes={allNodes}
                    links={allLinks}
                    witness={witness}
                    witnesses={witnesses}
                  />
                ))}
              </div> {/* END CHART */}
              <div> {/* WITNESS TEXT */}
                  {selectedWitnesses.map(witness => (
                    <div className="row witness-text" key={witness}>
                      <div className="col-md-1">
                        <p className="witness-name">
                          {witness}
                        </p>
                      </div>
                      <div className="col-md-11">
                          <WitnessText nodes={nodesByWitness[witness] || []} />
                      </div>
                    </div>
                  ))}
              </div> {/* END WITNESS TEXT */}
            </Col> {/* END MAIN AREA */}

          </Row> {/* END MAIN ROW */}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  // Loading main text info
  if (!state.selectedText.text) {
    return {}
  }

  const { text, viewedPosition } = state.selectedText
  const { searching, results } = state.selectedText.search;
  const sliders = state.selectedText.filters.sliders;
  const toggles = state.selectedText.filters.toggles;
  const witnessesCheck = getWitnessesCheck(state)
  const selectedWitnesses = getSelectedWitnesses(state)
  const nodesByWitness = getTextNodesByWitness(state)
  const allNodes = getSankeyNodes(state)
  const allLinks = getSankeyLinks(state)
  const searchTextResults = getTextSearchResults(state)
  const isGraphLoading = getIsGraphLoading(state)

  return {
    text,
    viewedPosition,
    witnessesCheck,
    selectedWitnesses,
    nodesByWitness,
    allNodes,
    allLinks,
    searching,
    results,
    searchTextResults,
    isGraphLoading,
    sliders,
    toggles,
  }
}

export default connect(mapStateToProps, {
  setSelectedText,
  unloadSelectedText,
  toggleWitness,
  getGraph,
  setViewedPosition,
  searchText,
  setNodeWidth,
  setNodeHeight,
  setNodeOpacity,
  setEdgeOpacity,
  toggleShowRuler,
  toggleShowVarationsMarks,
  toggleShowNodes,
  toggleShowEdges,
})(Text)
