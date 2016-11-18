import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setSelectedText, toggleWitness } from '../actions';

class Text extends Component {
  componentWillMount() {
    this.props.setSelectedText({
      title: 'Parzival',
      witnesses: ["D", "Fr21", "Fr69", "G", "I", "L", "M", "Mk", "O", "Ok", "Q", "R", "T", "U", "V", "Z"]
    })
  }

  render() {
    const { text: { title, witnesses }, witnessesCheck, toggleWitness } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <div className="selectors">
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
  console.log(witnessesCheck)
  return {
    witnessesCheck,
    text: state.selectedText.text,
  }
}

export default connect(mapStateToProps, {
  setSelectedText,
  toggleWitness
})(Text)
