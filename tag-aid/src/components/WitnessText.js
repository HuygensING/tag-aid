import React from 'react';
import '../styles/witness-text-style.css';

const WitnessText = (props) => {
  return (
    <div className="witness-text">
      <p>
      {props.nodes.map((node, idx) => (
        <span key={node.nodeId} className={node.viewed ? 'pos-viewed-in-text' : ''}>{node.word}</span>
      ))}
      </p>
    </div>
  )
}

export default WitnessText;
