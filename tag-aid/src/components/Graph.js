import React, { PropTypes, Component } from 'react';
import * as d3 from 'd3'

const margin = {top: 30, right: 50, bottom: 10, left: 30};
    const width = 900 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

export default class Graph extends Component {
  componentDidMount() {
    // append the svg sankey
    const svg = d3.select(this.svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
      .scaleLinear()
      .domain([0, 29])
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale);
    svg
     .append("g")
     .attr("transform", "translate(0,30)")
     .call(xAxis);

  }

  render() {
    return (
      <div>
        <svg ref={(svg) => { this.svg = svg }}></svg>
      </div>
    );
  }
}

Graph.propTypes = {
};
