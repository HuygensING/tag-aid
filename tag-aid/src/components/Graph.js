import React, { PropTypes, Component, PureComponent } from 'react';
import * as d3 from 'd3';
import { sankey } from 'd3-sankey';
import { some, get, uniq } from 'lodash'
import { WITNESS_COLORS } from '../util/colors'
import '../styles/graph-style.css';
import * as api from '../api'


class NodeLink extends Component {

  state = { node : null }

  componentWillMount(){
    const { nodeId, handleLink } = this.props
    api.getTextNode(nodeId)
    .then(node => this.setState({node}))
    // api.getGraph
  }
  render(){
    const { node } = this.state
    if(!node) return null
    return (<p>
      {node.text} <a onClick={() => this.props.handleLink(node.rank)}>{node.rank}</a>
    </p>)
  }
}


export default class Graph extends Component {

  componentDidMount() {
    this.drawSankey(this.props.nodes, this.props.links);
    this.attachEventHandlers();
    this.updateNodeOpacity(this.props.nodeOpacity);
    this.updateNodeWidth(this.props.nodeWidth);
    this.updateEdgeOpacity(this.props.edgeOpacity);
    this.updateNodeVisibility(this.props.showNodes);
    this.updateEdgeVisibility(this.props.showEdges);
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
    const colorScale = d3.scaleOrdinal()
      .domain(this.props.witnesses)
      .range(WITNESS_COLORS);
    return colorScale;
  }

  drawSankey(allNodes, allLinks) {
    const { setViewedPosition, viewedPosition, nodeWidth, handleOpenPopover, handleClosePopover, witnesses, text } = this.props;

    const margin = { top: 40, right: 50, bottom: 40, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    const that = this;

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
    //     missing[link.source] = { id: link.source, text: 'MS',
    //       rank: viewedPosition.start -1,
    //       fake: true }
    //   }
    //   if (typeof nodePosMap[link.target] === 'undefined') {
    //     missing[link.target] = { id: link.target, text: 'MT' ,
    //     rank:  viewedPosition.end + 1,
    //     fake: true }
    //   }
    //   return { ...result, ...missing }
    // }, {})
    let missingNodes = {}
    let nodesToDrop = {}
    let annotatedNodes = {}
    allLinks.forEach((link, i) => {
        if (link && typeof nodePosMap[+link.source] === 'undefined') {
          const idx = nodePosMap[+link.target]
          const targetNode = allNodes[idx]
          if(true || targetNode.rank !== viewedPosition.start){
            if(!annotatedNodes[targetNode.id]){
              annotatedNodes[targetNode.id] = { sourcesOut: [[link.value, +link.source]] }
            } else {
              if(!annotatedNodes[targetNode.id].sourcesOut){
                  annotatedNodes[targetNode.id].sourcesOut = []
              }
              annotatedNodes[targetNode.id].sourcesOut.push([link.value, +link.source])
            }
          }

          // targetNode.sourcesOut = targetNode.sourcesOut || 0
          // targetNode.sourcesOut += link.value
          // console.log(targetNode.sourcesOut)

        //   if(+targetNode.rank > viewedPosition.start){
        //     if(!missingNodes[link.source]){
        //       missingNodes[link.source] = {
        //         id: link.source, text: 'SOURCE',
        //         rank: viewedPosition.start,
        //         fake: true,
        //         sourceLinks : [{...link}]
        //       }
        //     } else {
        //       missingNodes[link.source].sourceLinks.push({...link})
        //     }
        //   }
        } else {
          //nodesToDrop[link.source] = true
        }
        if (link && typeof nodePosMap[+link.target] === 'undefined') {
          const idx = nodePosMap[+link.source]
          const sourceNode = allNodes[idx]
          if(true || sourceNode.rank !== viewedPosition.end){
            if(!annotatedNodes[idx]){
              annotatedNodes[sourceNode.id] = { targetsOut: [[link.value, link.target]] }
            } else {
              if(!annotatedNodes[sourceNode.id].targetsOut){
                annotatedNodes[sourceNode.id].targetsOut = []
              }
              annotatedNodes[sourceNode.id].targetsOut.push([link.value, link.target])
            }
          }

          // sourceNode.targetsOut = sourceNode.targetsOut || 0
          // sourceNode.targetsOut += link.value
          // console.log(sourceNode.targetsOut)
        //   if(+sourceNode.rank < viewedPosition.end){
        //     if(!missingNodes[link.target]){
        //       missingNodes[link.target] = {
        //         id: link.target, text: 'TARGET',
        //         rank: viewedPosition.end,
        //         fake: true,
        //         targetLinks : [{...link}]
        //       }
        //     } else {
        //       missingNodes[link.target].targetLinks.push({...link})
        //     }
        //
        //   }
        } else {
          //nodesToDrop[link.target] = true
        }
    })

    // let syntethicNodes = Object.keys(missingNodes)
    //   .filter(k => !nodesToDrop[k])
    //   .map(k => missingNodes[k])
    //
    // console.log("syntethicNodes", syntethicNodes)
    // const nodes = [ ...syntethicNodes, ...allNodes ];
    //
    // // Re-build node map with missing nodes
    // nodePosMap = makeNodePosMap(nodes)
    // Sankey nodes
    const nodes = [ ...allNodes ];

    // Sankey links
    const links = allLinks.filter(l=>l).map(link => ({
      ...link,
      source: nodePosMap[link.source],
      target: nodePosMap[link.target]
    }))
    .filter(link => typeof link.source !== 'undefined' && typeof link.target !== 'undefined')
    // FIXME: Do the right sort before
    .sort((a, b) => Number(a.source) - Number(b.source))


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
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", (d) => {
          const witnessClass = isLinkGraphWitness(d) ? 'link-graph-witness' : ''
          return `link with-source-${d.source.id} with-target-${d.target.id} ${witnessClass}`;
        })
        .style('opacity', (d) => {
          return (!this.props.showEdges || isLinkGraphWitness(d)) ? this.props.edgeOpacity : '1'
        })
        // .style("visibility", this.props.showEdges ? "visible" : "hidden")

        .style("stroke-width", function(d) { return Math.max(1, Math.abs(d.dy)); })
        .style("stroke", (d) => {
          if (this.props.showEdges && isLinkGraphWitness(d)) {
            return colorScale(this.props.witness);
          }
          return '#f0f0f0';
        })
        // .style("stroke-width", 5)
        .sort(function(a, b) { return b.dy - a.dy; })
        .on("click", function(d){
          const selection = d3.select(this)

          const node = selection.node()
          selection.attr("old-stroke", selection.style("stroke"));
          selection.classed("edge-selected", true);

          const nodeWitnesses = d.witness
          const isAllWitnesses = witnesses.length === nodeWitnesses.length
          const msg = `${isAllWitnesses ? 'all' : nodeWitnesses.length} witness${nodeWitnesses.length > 1 ? 'es' : ''}`

          handleOpenPopover(node, <div>
            <p>
              <small>edge</small><br/>
              <b>{d.source.text} - {d.target.text}</b>
            </p>
            <p>Appears in {msg}</p>
          </div>, ()=>selection.classed("edge-selected", false))
        })

      .merge(link)
        .attr("d", path)
        .attr("class", (d) => {
          const witnessClass = isLinkGraphWitness(d) ? 'link-graph-witness' : ''
          return `link with-source-${d.source.id} with-target-${d.target.id} ${witnessClass}`;
        })
        .style('opacity', (d) => {
          return (!this.props.showEdges || isLinkGraphWitness(d)) ? this.props.edgeOpacity : '1'
        })
        // .style("visibility", this.props.showEdges ? "visible" : "hidden")

        .style("stroke-width", function(d) { return Math.max(1, Math.abs(d.dy)); })
        .style("stroke", (d) => {
          if (this.props.showEdges && isLinkGraphWitness(d)) {
            return colorScale(this.props.witness);
          }
          return '#f0f0f0';
        })
        // .style("stroke-width", 5)
        .sort(function(a, b) { return b.dy - a.dy; })

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
        // .on("start", function() {
  		  //     this.parentNode.appendChild(this); })
        .on("drag", dragmove))
        .on("click", function(d){
          const selection = d3.select(this)
          selection.classed("node-selected", true)
          const node = selection.node()
          // console.log("d", d)
          const nodeWitnesses = d.targetLinks.concat(d.sourceLinks).reduce((acc, value) => {
            const w = value.witness
            return uniq(acc.concat(w))
          }, [])

          const isAllWitnesses = witnesses.length === nodeWitnesses.length
          const msg = `${isAllWitnesses ? 'all' : nodeWitnesses.length} witness${nodeWitnesses.length > 1 ? 'es' : ''}`

          const targetsOut = annotatedNodes[d.id] ? get(annotatedNodes[d.id], "targetsOut", []) : []
          const sourcesOut = annotatedNodes[d.id] ? get(annotatedNodes[d.id], "sourcesOut", []) : []
          const allOut = targetsOut.concat(sourcesOut)

          // const leftConns = allOut.filter(x => { console.log("zz", x, d); return x[1].rank < d.rank})
          // const rightConns = allOut.filter(x => x[1].rank > d.rank)
        
          handleOpenPopover(node, <div>
            <p>
              <small>word</small><br/>
              <b>{d.text}</b>
            </p>
            <p>Appears in {msg}</p>
            { allOut.length > 0 && (
              <div>
                <p>{allOut.length} with nodes outside the current view.</p>
                {allOut.map((x,i) => (
                  <div key={i}>
                    <NodeLink nodeId={x[1]} handleLink={(rank)=>{
                      that.props.setViewedPosition(rank, rank+20);
                      that.props.handleClosePopover()
                    }}/>
                  </div>
                ))}

              </div>
            )}
            </div>,

            ()=>selection.classed("node-selected", false)

          )
        })


    // add the rectangles for the nodes
    enter.append("rect")
        .attr("height", function(d) {
          return Math.abs(d.dy);
        })
        .attr("width", 2)
        .style("fill", "#ddd")
        .style("opacity", 1)

    //oow
    const annotationCircle = enter.append("circle")
        .attr("class", "annotation")
        .attr("cx", function(d) { return d.dx-1; })
        .attr("cy", 0)
        .attr("r", function(d){
          if(annotatedNodes[d.id]){
            const targetsOut = get(annotatedNodes[d.id], "targetsOut", []).map(x => x[0])
            const sourcesOut = get(annotatedNodes[d.id], "sourcesOut", []).map(x => x[0])
            return `${nodeWidth / 2 + targetsOut.length * 5 + sourcesOut.length * 5}`
          }
          return 0
        })
        .attr('opacity', '.25')
        .style("fill", (d) => {
          if (this.props.showNodes && isNodeGraphWitness(d)) {
            return colorScale(this.props.witness);
          }
          return "#222";
      	})


    // add circles on top of the rectangles
    enter.append("circle")
        .attr("class", (d) => {
          return isNodeGraphWitness(d) ? 'circle-shape circle-shape-graph-witness' : 'circle-shape'
        })
        .attr("cx", function(d) { return d.dx-1; })
        .attr("cy", 0)
        .attr("r", nodeWidth / 2)
        .attr('opacity', (d) => {
          return (!this.props.showNodes || isNodeGraphWitness(d)) ? this.props.nodeOpacity : '1'
        })
        // .style("visibility", this.props.showNodes ? "visible" : "hidden")
        .style("fill", (d) => {
          if (this.props.showNodes && isNodeGraphWitness(d)) {
            return colorScale(this.props.witness);
          }
      		return "#aaa";
      	});

    // add in the title for the nodes
    enter.append("text")
        .attr("class", "word")
        .attr("x", 0)
        .attr("y", function(d) { return -11; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", null)
        .text(function(d) { return d.text; });


    const mergeNode = enter
      .merge(node)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; })
      mergeNode
      .select("rect")
      .attr("height", function(d) {
        return Math.abs(d.dy);
      })

      mergeNode
        .select("circle.annotation")
        .attr("r", function(d){
          if(annotatedNodes[d.id]){
            const targetsOut = get(annotatedNodes[d.id], "targetsOut", []).map(x => x[0])
            const sourcesOut = get(annotatedNodes[d.id], "sourcesOut", []).map(x => x[0])
            return `${nodeWidth / 2 + targetsOut.length * 5 + sourcesOut.length * 5}`
          }
          return 0
        })


      mergeNode
        .select("circle.circle-shape")
            .attr("class", (d) => {
              return isNodeGraphWitness(d) ? 'circle-shape circle-shape-graph-witness' : 'circle-shape'
            })
            .attr("cx", function(d) { return d.dx-1; })
            .attr("cy", 0)
            .attr('opacity', (d) => {
              return (!this.props.showNodes || isNodeGraphWitness(d)) ? this.props.nodeOpacity : '1'
            })
            .style("fill", (d) => {
              if (this.props.showNodes && isNodeGraphWitness(d)) {
                return colorScale(this.props.witness);
              }
          		return "#aaa";
          	});

      mergeNode
        .select("text")
          .attr("class", "word")
          .attr("x", 0)
          .attr("y", function(d) { return -11; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .attr("transform", null)
          .text(function(d) { return d.text; });


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
      that.props.handleClosePopover()

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
    if (this.props.showNodes) {
      d3.select(this.svg).selectAll('.circle-shape-graph-witness')
        .style("opacity", opacity)
    }
  }

  updateNodeVisibility(visibility){
    if (visibility) {
      const colorScale = this.makeColorScale();
      d3.select(this.svg).selectAll('.circle-shape-graph-witness')
        .style('fill', colorScale(this.props.witness))
        .style('opacity', this.props.nodeOpacity);
    } else {
      d3.select(this.svg).selectAll('.circle-shape-graph-witness')
        .style('fill', '#aaa')
        .style('opacity', '1')
    }
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
        .style('opacity', this.props.edgeOpacity);
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
