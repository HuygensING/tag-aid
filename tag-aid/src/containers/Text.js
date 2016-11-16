import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Text extends Component {
  render {
    const { title, witnesses } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <h2></h2>
        <div className="selectors">
          <div className="witnesses-check">
            {witnesses.map(witness => (
                <input type="checkbox" key={witness.value} checked={witness.checked}>{witness.value}</input>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
