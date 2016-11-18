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
      nodes,
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
              <WitnessText nodes={nodes} />
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
  const nodes = Object.values(state.selectedText.graph.nodesById);
  return {
    nodes,
    witnessesCheck,
    selectedWitnesses,
    text: state.selectedText.text,
  }
}

export default connect(mapStateToProps, {
  setSelectedText,
  toggleWitness,
  getGraph
})(Text)
