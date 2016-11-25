import React, { PropTypes, Component } from 'react';
import * as d3 from 'd3';
import { sankey } from 'd3-sankey';
import '../styles/graph-style.css';

const margin = {top: 40, right: 50, bottom: 40, left: 20};
    const width = 1000 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

export default class Graph extends Component {
  componentDidMount() {
    this.drawSankey(this.props.nodes, this.props.links);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.nodes !== this.props.nodes) || (nextProps.links !== this.props.links)) {
      this.drawSankey(nextProps.nodes, nextProps.links);
    }
  }

  drawSankey(allNodes, allLinks) {
    // append the svg sankey
    const svg = d3.select(this.svg).html('')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
      .scaleLinear()
      .domain([0, 29])
      .range([0, width]);

    // const xAxis = d3.axisBottom(xScale);
    // svg
    //  .append("g")
    //  .attr("transform", "translate(0,30)")
    //  .call(xAxis);

    const nodePosMap = allNodes.reduce((result, node, i) => ({
      ...result,
      [node.nodeId]: i
    }), {})

    const links = allLinks.map(link => ({
      ...link,
      source: nodePosMap[link.source],
      target: nodePosMap[link.target]
    }))
    .filter(link => link.source && link.target)
    // FIXME: Do the right sort before
    .sort((a, b) => a.source - b.source)

    const nodes = [...allNodes]

    const sankeyLayout = sankey()
        .nodes(nodes)
        .links(links)
        .nodeWidth(2)
        .nodePadding(35)
        .size([width, height])
        .layout(150);

  const path = sankeyLayout.link();
  const colors = ["#F34336",
                  "#E81E63",
                  "#9B27AF",
                  "#673AB6",
                  "#3F51B4",
                  "#2195F2",
                  "#03A8F3",
                  "#00BBD3",
                  "#009587",
                  "#4CAE50",
                  "#8AC24A",
                  "#CCDB39",
                  "#FEEA3B",
                  "#FEC007",
                  "#FE9700",
                  "#FE5722"];
  const colorScale = d3.scaleOrdinal()
                      .domain(this.props.witnesses)
                      .range(colors);

  console.log(this.props.witnesses);


  // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .style("stroke",(d) => {
          if (d.witnesses.indexOf(this.props.witness) !== -1) {
            return colorScale(this.props.witness);
          }
          return '#f0f0f0';
        })
        // .style("stroke-width", 5)
        .sort(function(a, b) { return b.dy - a.dy; });
  //
  // // add the link titles
    // link.append("title")
    //       .text(function(d) {
    //   		return d.source.name + " → " +
    //               d.target.name + "\n" + format(d.value); });
  //
  // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
  		  return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        // .origin(function(d) { return d; })
        .on("start", function() {
  		  this.parentNode.appendChild(this); })
        .on("drag", dragmove));
  //
  // // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return Math.abs(d.dy); })
        .attr("width", 2)
        .style("fill", "#ddd")
        .style("opacity", 1)
      .append("title")
        .text(d => {
          return d.word
        })
  //
  // // add circles on top of the rectangles
    node.append("circle")
        .attr("cx", function(d) { return d.dx-1; })
        .attr("cy", 0)
        .attr("r", 3)
        .style("fill", function(d){
  	      	if (d.majority === "true") {
  	      		return "red";
  	      	} else {
  	      		return "#aaa";
  	      	}
        	});
  //
  // // add in the title for the nodes
    node.append("text")
        .attr("class", "word")
        .attr("x", 0)
        .attr("y", function(d) { return -11; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", null)
        .text(function(d) { return d.word; });
  //
  // // the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr("transform",
          "translate(" + d.x + "," + (
                  d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
              ) + ")");
      sankeyLayout.relayout();
      link.attr("d", path);
    }

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
