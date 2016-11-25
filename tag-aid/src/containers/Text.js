import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setSelectedText, toggleWitness, getGraph } from '../actions';
import WitnessText from '../components/WitnessText';
import Graph from '../components/Graph';
import { Grid, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import '../styles/hi-faceted-search.css';


class Text extends Component {
  componentWillMount() {
    this.props.setSelectedText({
      title: 'Parzival',
      witnesses: ["D", "Fr21", "Fr69", "G", "I", "L", "M", "Mk", "O", "Ok", "Q", "R", "T", "U", "V", "Z"]
    })
    this.props.getGraph(0, 20);
  }

  render() {
    const {
      text: { title, witnesses },
      witnessesCheck,
      selectedWitnesses,
      toggleWitness,
      getGraph,
      nodesByWitness,
      linksByWitness,
      allNodes,
      allLinks,
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
                    <FormControl type="text" className="form-control search" placeholder="Search token" />
                      <span className="input-group-btn">
                        <Button bsClass="btn btn-default">
                          <span className="glyphicon glyphicon-search"></span>
                        </Button>
                      </span>
                  </InputGroup>
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
                        <button onClick={() => getGraph(0, 20)}>0-20</button>
                        <button onClick={() => getGraph(20, 40)}>20-40</button>
                        <button onClick={() => getGraph(40, 60)}>40-60</button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* MAIN AREA */}
              <Col sm={9} md={9} mdOffset={1}>
                <div id="chart-area">
                  {selectedWitnesses.map(witness => (
                    <Graph key={witness} nodes={allNodes} links={allLinks} witness={witness} witnesses={witnesses} />
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

const emptyList = []
function mapStateToProps(state) {
  const witnessesCheck = (state.selectedText.text.witnesses || emptyList).map(witness => ({
    value: witness,
    checked: !!state.selectedText.filters.witnesses[witness]
  }))
  const selectedWitnesses = (state.selectedText.text.witnesses || emptyList).filter(witness => (
    state.selectedText.filters.witnesses[witness]
  ))

  const nodesByWitness = {}
  const nodesAtPositionByWitness = state.selectedText.graph.nodesAtPositionByWitness

  const witnessesKeys = Object.keys(nodesAtPositionByWitness)
  for (let i = 0; i < witnessesKeys.length; i++) {
    const key = witnessesKeys[i];
    const positions = Object.keys(nodesAtPositionByWitness[key]).map(pos => Number(pos)).sort((a, b) => a - b)
    nodesByWitness[key] = positions.map(pos => {
      const nodeId = nodesAtPositionByWitness[key][pos]
      return state.selectedText.graph.nodesById[nodeId]
    })
  }

  const linksByWitness = {};
  const linksByNodes = state.selectedText.graph.linksByNodes;

  for (let i = 0; i < witnessesKeys.length; i++) {
    const key = witnessesKeys[i];

    const positions = Object.keys(nodesAtPositionByWitness[key]).map(pos => Number(pos)).sort((a, b) => a - b)
    linksByWitness[key] = positions.map(pos => {
      const nodeId = nodesAtPositionByWitness[key][pos]
      return Object.keys(linksByNodes[nodeId])
    })
    .reduce((result, links) => [...result, ...links], [])
    .map(linkId => state.selectedText.graph.linksById[linkId])
  }

  const allNodes = Object.keys(nodesAtPositionByWitness).reduce((result, witness) => {
    return [...result, ...Object.values(nodesAtPositionByWitness[witness]).filter(id => result.indexOf(id) === -1)]
  }, []).map(id => state.selectedText.graph.nodesById[id])

  const allLinks = allNodes.reduce((result, node) => {
    return [...result, ...Object.keys(linksByNodes[node.nodeId]).filter(id => result.indexOf(id) === -1)]
  }, []).map(linkId => state.selectedText.graph.linksById[linkId])
  // console.log(allLinks)
  // console.log(allNodes)


  // const nodes = Object.values(state.selectedText.graph.nodesById);

  // const nodes = state.selectedText.graph.nodesAtPositionByWitness.reduce((result, nodesAtPosition, key) => ({
  //   ...result,
  //   [key]: Object.keys(nodesAtPosition).map()
  // }))
  return {
    witnessesCheck,
    selectedWitnesses,
    text: state.selectedText.text,
    nodesByWitness,
    linksByWitness,
    allNodes,
    allLinks,
  }
}

export default connect(mapStateToProps, {
  setSelectedText,
  toggleWitness,
  getGraph
})(Text)
