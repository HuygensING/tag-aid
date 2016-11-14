import React from 'react';

var data = require("../vizgraph.json");
console.log(data);

const TagAid = (props) => {
  let nodes = data.nodes;
  return (
    <div>
    <h2>Parzival</h2>
    <p>
    { nodes.map((node, idx) => (
      <span key={node.nodeId}>{node.word}</span>
    ))}
    </p>
    </div>
  )
}

export default TagAid;
