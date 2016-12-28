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
    if ((nextProps.nodes !== this.props.nodes) ||
        (nextProps.links !== this.props.links) ||
        (nextProps.nodeWidth !== this.props.nodeWidth) ||
        (nextProps.nodeOpacity !== this.props.nodeOpacity)) {
      this.drawSankey(nextProps.nodes, nextProps.links);
    }
  }

  drawSankey(allNodes, allLinks) {
    const { setViewedPosition, viewedPosition } = this.props;


    const graphDrag = function(d, evt) {
      const dx = Number(d3.select(this).attr('dx') || 0) - d3.event.dx
      d3.select(this).attr('dx', dx)
      if (Math.abs(dx) > 20) {
        let delta = parseInt(dx / 20);
        setViewedPosition(viewedPosition.start + delta, viewedPosition.end + delta)
      }
      //.attr("transform","translate(" + d3.event.x + ", 0)");
    }

    const graphDragEnd = function(d, evt) {
      // const movedPosition = Math.round(d3.select(this).attr('dx') / 45)
      d3.select(this).attr('dx', 0)
      // setViewedPosition(viewedPosition.start + movedPosition, viewedPosition.end + movedPosition)
    }

    // append the svg sankey
    const svg = d3.select(this.svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(d3.drag().on("drag", graphDrag).on("end", graphDragEnd))

    const topG = d3.select(this.topG)
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
        //

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
      [node.id]: i
    }), {})

    const links = allLinks.map(link => ({
      ...link,
      source: nodePosMap[link.source],
      target: nodePosMap[link.target]
    }))
    .filter(link => typeof link.source !== 'undefined' && typeof link.target !== 'undefined')
    // FIXME: Do the right sort before
    .sort((a, b) => Number(a.source) - Number(b.source))

    const nodes = [...allNodes]

    const sankeyLayout = sankey()
        .nodes(nodes)
        .links(links)
        .nodeWidth(2)
        .nodePadding(35)
        .size([width * 2, height])
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



  // add in the links
    var link = d3.select(this.linkGroup).selectAll(".link")
        .data(links, l=>l.id).attr("d", path)

      link.exit().remove();

      link
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .style("stroke",(d) => {
          if (d.witness.indexOf(this.props.witness) !== -1) {
            return colorScale(this.props.witness);
          }
          return '#f0f0f0';
        })
        // .style("stroke-width", 5)
        .sort(function(a, b) { return b.dy - a.dy; })

      .merge(link)
        .attr("d", path)
        .sort(function(a, b) { return b.dy - a.dy; });

  //
  // // add the link titles
    // link.append("title")
    //       .text(function(d) {
    //   		return d.source.name + " → " +
    //               d.target.name + "\n" + format(d.value); });
  //
  // add in the nodes
    var node = d3.select(this.nodeGroup).selectAll(".node")
        .data(nodes, d => d.id)
        .attr("transform", function(d) {
  		  return "translate(" + d.x + "," + d.y + ")"; })

    node.exit().remove();

    let enter = node
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
  		  return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        // .origin(function(d) { return d; })
        .on("start", function() {
  		  this.parentNode.appendChild(this); })
        .on("drag", dragmove))

    // add the rectangles for the nodes
    enter.append("rect")
        .attr("height", function(d) { return Math.abs(d.dy); })
        .attr("width", 2)
        .style("fill", "#ddd")
        .style("opacity", 1)
      .append("title")
        .text(d => {
          return d.text
        })
    // add circles on top of the rectangles
    enter.append("circle")
        .attr("cx", function(d) { return d.dx-1; })
        .attr("cy", 0)
        .attr("r", 10)
        .attr("class", "circle-shape")
        .style("fill", function(d){
  	      	if (d.majority === "true") {
  	      		return "red";
  	      	} else {
  	      		return "#aaa";
  	      	}
        	})

    // add in the title for the nodes
    enter.append("text")
        .attr("class", "word")
        .attr("x", 0)
        .attr("y", function(d) { return -11; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", null)
        .text(function(d) { return d.text; });

    enter
      .merge(node)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; })

    d3.selectAll('.circle-shape')
      .style("opacity", this.props.nodeOpacity)

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
        <svg ref={(svg) => { this.svg = svg }}>
          <g ref={(topG) => { this.topG = topG }}>
            <g ref={(linkGroup) => { this.linkGroup = linkGroup }}></g>
            <g ref={(nodeGroup) => { this.nodeGroup = nodeGroup }}></g>
          </g>
        </svg>
      </div>
    );
  }
}

Graph.propTypes = {
};
