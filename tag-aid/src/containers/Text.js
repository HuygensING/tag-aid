import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setSelectedText, toggleWitness, getGraph } from '../actions';
import WitnessText from '../components/WitnessText'

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
    } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <div className="selectors">
          <button onClick={() => getGraph(0, 20)}>0-20</button>
          <button onClick={() => getGraph(20, 40)}>20-40</button>
          <button onClick={() => getGraph(40, 60)}>40-60</button>
          <div className="witnesses-check">
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
              </div>
            ))}
          </div>
        </div>
        <div className="witnesses-text">
          {selectedWitnesses.map(witness => (
            <div key={witness}>
              <h2>{witness}</h2>
              <WitnessText nodes={nodesByWitness[witness] || []} />
            </div>
          ))}
        </div>
      </div>
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
    const positions = Object.keys(nodesAtPositionByWitness[key]).sort()
    nodesByWitness[key] = positions.map(pos => {
      const nodeId = nodesAtPositionByWitness[key][pos]
      return state.selectedText.graph.nodesById[nodeId]
    })
  }

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
  }
}

export default connect(mapStateToProps, {
  setSelectedText,
  toggleWitness,
  getGraph
})(Text)
