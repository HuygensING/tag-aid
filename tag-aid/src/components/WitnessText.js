import React from 'react';

const WitnessText = (props) => {
  return (
    <div>
    <p>
    {props.nodes.map((node, idx) => (
      <span key={node.nodeId}>{node.word}</span>
    ))}
    </p>
    </div>
  )
}

export default WitnessText;
