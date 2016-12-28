import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  setSelectedText,
  toggleWitness,
  getGraph,
  setViewedPosition,
  searchText,
  setNodeWidth,
  setNodeHeight,
  setEdgeOpacity,
  setNodeOpacity,
} from '../actions';
import {
  getWitnessesCheck,
  getSelectedWitnesses,
  getTextNodesByWitness,
  getSankeyNodes,
  getSankeyLinks,
  getTextSearchResults,
} from '../selectors'
import WitnessText from '../components/WitnessText';
import Graph from '../components/Graph';
import { Grid, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import '../styles/hi-faceted-search.css';

const WITNESSES = [{"sigil":"Kr299"},{"sigil":"MuU151"},{"sigil":"Mu11475"},{"sigil":"Kf133"},{"sigil":"Gr314"},{"sigil":"Go325"},{"sigil":"An74"},{"sigil":"Er16"},{"sigil":"Kr185"},{"sigil":"Mu22405"},{"sigil":"Au318"},{"sigil":"Wi3818"},{"sigil":"Mu28315"},{"sigil":"Ba96"},{"sigil":"Sg524"}]

class Text extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchToken : '',
      searchedCurrentToken : false
    }
  }
  componentWillMount() {
    this.props.setSelectedText({
      title: 'Parzival',
      witnesses: WITNESSES.map(({ sigil }) => sigil)
    })
    this.props.setViewedPosition(0, 20);
    // this.props.getGraph(0, 400);
  }

  handleSearch = () => {
    this.setState({ searchedCurrentToken:true });
    this.props.searchText(this.state.searchToken);
  }

  render() {
    const {
      text: { title, witnesses },
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
      setNodeWidth,
      setNodeHeight,
      setNodeOpacity,
      setEdgeOpacity,
    } = this.props;
    return (
      <Grid>
          {/* TEXT NAME */}
          <Row>
            <Col md={12} className="text-header">
              <Button bsClass="btn-collapse-left-pane" componentClass="btn-collapse-left-pane">
                <span className="glyphicon glyphicon-menu-hamburger"></span>
              </Button>
              <h1>{title}</h1>
            </Col>
          </Row>
          {/* MAIN ROW */}
          <Row>
            <Col sm={3} md={2} id="left-pane">
              {/* LEFT PANE */}
              <div className="facet-group">
                {/* SEARCH */}
                <div className="facet">
                  <InputGroup>
                    <FormControl type="text" className="form-control search"
                      placeholder="Search token"
                      onChange={(e) =>  this.setState({searchToken:e.target.value, searchedCurrentToken:false})  } />
                      <span className="input-group-btn">
                        <Button bsClass="btn btn-default" onClick={()=> this.handleSearch() }>
                          <span className="glyphicon glyphicon-search"></span>
                        </Button>
                      </span>
                  </InputGroup>


                  <div style={{padding:'10px'}}>
                  { searching && <div>Searching ...</div>}
                  { !searching && this.state.searchedCurrentToken && !results.length && <div>No results for search: <b>{this.state.searchToken}</b></div>}
                  { Object.keys(searchTextResults).map(rank => (

                    <div key={rank}>
                      posizione: <a onClick={()=>setViewedPosition(+rank, +rank+20)}>{rank} ({searchTextResults[rank].length})</a>
                    </div>
                  )
                  ) }
                  </div>

                </div>

                {/* WITNESS SELECTION */}
                <div className="facet basic-facet">
                  <h2>Witnesses</h2>
                  <button className="btn btn-facet-collapse btn-facet-witnesses-collapse pull-right" data-toggle="collapse" data-target="#facet-witnesses">

                  </button>
                  <div id="facet-witnesses" className="facet-items-box collapse in">
                    <div className="selectors">
                      <div className="facet-item checkbox">
                        {witnessesCheck.map(witness => (
                          <div key={witness.value}>
                            <input
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
                        <button onClick={() => setViewedPosition(5, 25)}>Vedi: 5-25</button>
                        <button onClick={() => setViewedPosition(20, 40)}>Vedi: 20-40</button>
                        <button onClick={() => setViewedPosition(30, 50)}>Vedi: 30-50</button>
                        <button onClick={() => setViewedPosition(40, 60)}>Vedi: 40-60</button>
                        <button onClick={() => setViewedPosition(30, 60)}>Vedi: 30-60</button>
                        <button onClick={() => setViewedPosition(0, 60)}>Vedi: 0-60</button>
                      </div>
                    </div>
                  </div>

                  <p>
                      <p>
                        <div>Node Height <b>{sliders.nodeHeight}</b></div>
                        <Slider value={sliders.nodeHeight} tipFormatter={null} onChange={setNodeHeight} />
                      </p>
                      <p>
                        <div>Node Width <b>{sliders.nodeWidth}</b></div>
                        <Slider value={sliders.nodeWidth} tipFormatter={null} onChange={setNodeWidth} min={0} max={20} />
                      </p>
                      <p>
                        <div>Edge Opacity <b>{sliders.edgeOpacity}</b></div>
                        <Slider value={sliders.edgeOpacity} tipFormatter={null} onChange={setEdgeOpacity} step={0.05} min={0.0} max={1.0} />
                      </p>
                      <p>
                        <div>Node Opacity <b>{sliders.nodeOpacity}</b></div>
                        <Slider value={sliders.nodeOpacity} tipFormatter={null} onChange={setNodeOpacity} step={0.05} min={0.0} max={1.0} />
                      </p>
                  </p>

                </div>
              </Col>
              {/* MAIN AREA */}
              <Col sm={9} md={9} mdOffset={1}>
                <h2>{viewedPosition.start} {viewedPosition.end}</h2>
                <button onClick={() => setViewedPosition(viewedPosition.start - 10, viewedPosition.end - 10)}>-10</button>
                <button onClick={() => setViewedPosition(viewedPosition.start + 10, viewedPosition.end + 10)}>+10</button>
                <div id="chart-area">
                  {selectedWitnesses.map(witness => (
                    <Graph key={witness}
                      nodeOpacity={sliders.nodeOpacity} nodeWidth={sliders.nodeWidth}
                      edgeOpacity={sliders.edgeOpacity}
                      viewedPosition={viewedPosition} setViewedPosition={setViewedPosition} nodes={allNodes} links={allLinks} witness={witness} witnesses={witnesses} />
                  ))}
                </div>
                {/* <img className="img-responsive" src="http://placehold.it/3000x1500?text=chart area"  alt="Placeholder"/> */}
                {/* WITNESS TEXT */}
                <div>
                    {selectedWitnesses.map(witness => (
                      <div className="row" key={witness}>
                        <div className="col-md-1">
                          <p className="witness-code-yellow">
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
  const { text, viewedPosition } = state.selectedText
  const { searching, results } = state.selectedText.search;
  const sliders = state.selectedText.filters.sliders;
  const witnessesCheck = getWitnessesCheck(state)
  const selectedWitnesses = getSelectedWitnesses(state)
  const nodesByWitness = getTextNodesByWitness(state)
  const allNodes = getSankeyNodes(state)
  const allLinks = getSankeyLinks(state)
  const searchTextResults = getTextSearchResults(state)

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
    sliders,
  }
}

export default connect(mapStateToProps, {
  setSelectedText,
  toggleWitness,
  getGraph,
  setViewedPosition,
  searchText,
  setNodeWidth,
  setNodeHeight,
  setNodeOpacity,
  setEdgeOpacity,
})(Text)
