import React, { PropTypes, Component } from 'react';
import * as d3 from 'd3';
import { sankey } from 'd3-sankey';
import { some } from 'lodash'
import '../styles/graph-style.css';

export default class Graph extends Component {

  componentDidMount() {
    this.drawSankey(this.props.nodes, this.props.links);
    this.attachEventHandlers();
    this.updateNodeOpacity(this.props.nodeOpacity);
    this.updateNodeWidth(this.props.nodeWidth);
    this.updateEdgeOpacity(this.props.edgeOpacity);
    this.updateNodeVisibility(this.props.showNodes);
    // this.updateEdgeVisibility(this.props.showEdges);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.nodes !== this.props.nodes) || (nextProps.links !== this.props.links)) {
      this.drawSankey(nextProps.nodes, nextProps.links);
    }

    if((nextProps.nodeOpacity !== this.props.nodeOpacity)){
      this.updateNodeOpacity(nextProps.nodeOpacity);
    }

    if((nextProps.edgeOpacity !== this.props.edgeOpacity)){
      this.updateEdgeOpacity(nextProps.edgeOpacity);
    }

    if((nextProps.nodeWidth !== this.props.nodeWidth)){
      this.updateNodeWidth(nextProps.nodeWidth);
    }

    if((nextProps.showNodes !== this.props.showNodes)){
      this.updateNodeVisibility(nextProps.showNodes);
    }

    if((nextProps.showEdges !== this.props.showEdges)){
      this.updateEdgeVisibility(nextProps.showEdges);
    }
  }

  makeColorScale = () => {
    const colors = [
      "#F34336",
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
      "#FE5722",
    ];
    console.log('~~', this.props.witnesses)
    const colorScale = d3.scaleOrdinal()
      .domain(this.props.witnesses)
      .range(colors);
    return colorScale;
  }

  drawSankey(allNodes, allLinks) {
    const { setViewedPosition, viewedPosition } = this.props;

    const margin = { top: 40, right: 50, bottom: 40, left: 20 };
    const width = 1000 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // append the svg sankey
    const svg = d3.select(this.svg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    const topG = d3.select(this.topG)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const makeNodePosMap = (nodes) => nodes.reduce((result, node, i) => ({
      ...result,
      [node.id]: i
    }), {})

    // First node map
    let nodePosMap = makeNodePosMap(allNodes)

    // Calculate missing nodes
    // const missingNodes = allLinks.reduce((result, link) => {
    //   const missing = {}
    //   if (typeof nodePosMap[link.source] === 'undefined') {
    //     missing[link.source] = { id: link.source, text: 'X', rank: viewedPosition.start, fake: true }
    //   }
      // if (typeof nodePosMap[link.target] === 'undefined') {
      //   missing[link.target] = { id: link.target, text: 'X' , rank: 0}
      // }
      // return { ...result, ...missing }
    // }, {})

    // Sankey nodes
    const nodes = [ ...allNodes ];

    // let xN = Object.keys(missingNodes).map(k => missingNodes[k])
    // const nodes = [ ...xN, ...allNodes ];

    // Re-build node map with missing nodes
    // nodePosMap = makeNodePosMap(nodes)

    // Sankey links
    const links = allLinks.map(link => ({
      ...link,
      source: nodePosMap[link.source],
      target: nodePosMap[link.target]
    }))
    .filter(link => typeof link.source !== 'undefined' && typeof link.target !== 'undefined')
    // FIXME: Do the right sort before
    .sort((a, b) => Number(a.source) - Number(b.source))

    console.info("nodes and links", nodes.length, links.length)

    const sankeyLayout = sankey()
        .nodes(nodes)
        .links(links)
        .nodeWidth(2)
        .nodePadding(35)
        .size([width, height])
        .layout(150);

  let path = sankeyLayout.link();
  const colorScale = this.makeColorScale();


    // add in the links
    var link = d3.select(this.linkGroup).selectAll(".link")
        .data(links, l=>+l.id).attr("d", path)

      link.exit().remove();

      const isLinkGraphWitness = (l) => l.witness.indexOf(this.props.witness) !== -1
      const isNodeGraphWitness = (n) =>
        some(n.sourceLinks, isLinkGraphWitness) || some(n.targetLinks, isLinkGraphWitness)

      link
        .enter().append("path")
        .attr("class", (d) => {
          const witnessClass = isLinkGraphWitness(d) ? 'link-graph-witness' : ''
          return `link with-source-${d.source.id} with-target-${d.target.id} ${witnessClass}`;
        })
        .style('opacity', (d) => {
          return (!this.props.showEdges || isLinkGraphWitness(d)) ? this.props.edgeOpacity : '1'
        })
        // .style("visibility", this.props.showEdges ? "visible" : "hidden")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .style("stroke", (d) => {
          if (this.props.showEdges && isLinkGraphWitness(d)) {
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
  // var node = d3.select(this.nodeGroup).selectAll(".node.fake").remove()
  // add in the nodes
    var node = d3.select(this.nodeGroup).selectAll(".node")
        .data(nodes, d => +d.id)
        .attr("transform", function(d) {
  		  return "translate(" + d.x + "," + d.y + ")"; })

    node.exit().remove();

    let enter = node
      .enter().append("g")
        .attr("class", function(d) {
          return d.fake ? 'node fake' : 'node'
         })
        .attr("transform", function(d) {
  		  return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        // .origin(function(d) { return d; })
        .on("start", function() {
  		  this.parentNode.appendChild(this); })
        .on("drag", dragmove))

    // add the rectangles for the nodes
    enter.append("rect")
        .attr("height", function(d) {
          return d.value;
          //return Math.abs(d.dy);
        })
        .attr("width", 2)
        .style("fill", "#ddd")
        .style("opacity", 1)
      .append("title")
        .text(d => {
          return d.text
        })
    // add circles on top of the rectangles
    enter.append("circle")
        .attr("class", (d) => {
          return isNodeGraphWitness(d) ? 'circle-shape circle-shape-graph-witness' : 'circle-shape'
        })
        .attr("cx", function(d) { return d.dx-1; })
        .attr("cy", 0)
        .attr("r", this.props.nodeWidth / 2)
        .attr('opacity', (d) => {
          return isNodeGraphWitness(d) ? this.props.nodeOpacity : '1'
        })
        .style("visibility", this.props.showNodes ? "visible" : "hidden")
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


  //
  // // the function for moving the nodes
    const linkGroup = this.linkGroup;
    function dragmove(d) {
      d3.select(this).attr("transform",
          "translate(" + d.x + "," + (
                  d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
              ) + ")");
      sankeyLayout.relayout();
      const newPath = sankeyLayout.link();
      d3.select(linkGroup).selectAll(".link")
          .attr("d", newPath)
    }

  }

  attachEventHandlers(){
    const that = this;

    const graphDrag = function(d, evt) {
      const { setViewedPosition, viewedPosition, maxNodes } = that.props;
      const dx = Number(d3.select(this).attr('dx') || 0) - d3.event.dx
      d3.select(this).attr('dx', dx)
      if (Math.abs(dx) > 20) {
        let delta = parseInt(dx / 20);
        setViewedPosition(viewedPosition.start + delta, viewedPosition.end + delta)
        if (viewedPosition.start + delta < 0) {
          setViewedPosition(0, 20)
        } else if (viewedPosition.end + delta > maxNodes) {
          setViewedPosition(maxNodes - 20, maxNodes)
        } else {
          setViewedPosition(viewedPosition.start + delta, viewedPosition.end + delta)
        }
      }
    }

    const graphDragEnd = function(d, evt) {
      d3.select(this).attr('dx', 0)
    }

    d3.select(this.svg)
      .call(d3.drag().on("drag", graphDrag).on("end", graphDragEnd))
  }

  updateNodeOpacity(opacity){
    d3.select(this.svg).selectAll('.circle-shape-graph-witness')
      .style("opacity", this.props.nodeOpacity)
  }

  updateNodeVisibility(visibility){
    d3.select(this.svg).selectAll('.circle-shape')
      .style("visibility", visibility ? "visible" : "hidden")
  }

  updateNodeWidth(width){
    d3.select(this.svg).selectAll('.circle-shape')
      .attr("r", width / 2)
  }

  updateEdgeOpacity(opacity) {
    if (this.props.showEdges) {
      d3.select(this.svg).selectAll('path.link-graph-witness')
        .style("opacity", opacity);
    }
  }

  updateEdgeVisibility(visibility) {
    if (visibility) {
      const colorScale = this.makeColorScale();
      d3.select(this.svg).selectAll('path.link-graph-witness')
        .style('stroke', colorScale(this.props.witness))
        .style('opacity', '' + this.props.edgeOpacity);
    } else {
      d3.select(this.svg).selectAll('path.link-graph-witness')
        .style('stroke', '#f0f0f0')
        .style('opacity', '1');
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
