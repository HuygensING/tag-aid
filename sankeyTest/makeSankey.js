var margin = {top: 30, right: 50, bottom: 10, left: 30},
    width = 1300 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

// GENERAL
// append the svg line general
var svgPositionGeneral = d3.select("#positionGeneral").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height-120 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

// append the svg histogram
var svgHist = d3.select("#histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// SANKEY
// append the svg line partial
var svgPosition = d3.select("#position").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height-100 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append the svg sankey
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



// OVERVIEW
// append the svg canvas for overview to the page

// Reference line generals
svgPositionGeneral.append("line")          // attach a line
    .style("stroke", "#eee")  // colour the line
    .attr("x1", 0)     // x position of the first end of the line
    .attr("y1", 0)      // y position of the first end of the line
    .attr("x2", width)     // x position of the second end of the line
    .attr("y2", 0);

for (var i = 0; i <= width+width/188; i += width/188) {
  svgPositionGeneral.append("line")          // attach a line
    .style("stroke", "#999")  // colour the line
    .attr("x1", i)     // x position of the first end of the line
    .attr("y1", -5)      // y position of the first end of the line
    .attr("x2", i)     // x position of the second end of the line
    .attr("y2", 5);
}

var dataset;
var barPadding = 1;
var borderRadiusX = 10;
var borderRadiusY = (10);

d3.csv("footprints/normalized/overview3.csv", function(error,data){
  if(error) {
    throw(error);
  }
  else {
    dataset = data;
    yScale = d3.scale.linear()
        .domain([d3.min(dataset, function(d){return +d.number;}),d3.max(dataset, function(d){return +d.number;})])
        .range([3,height-80]);
    generateBars();
  }
  // console.log(dataset);
  // return;
});

function generateBars(){
  svgHist.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
      return(i*(width/dataset.length));
    })
    .attr("y", function(d){
      return (height - yScale(d.number)) - (height - yScale(d.number))/2;
    })
    .attr("width", width/dataset.length - barPadding)
    .attr("height", function(d){
      return yScale(d.number);
    })
    .attr("fill", "#ccc");
    // .attr("fill", function(d){
    //   return d3.rgb(255-d.number*25,255-d.number*25,255-d.number*25);
    // })
    // .attr("opacity", .5)
    // .attr({ry : borderRadiusX, rx : borderRadiusY });
  };

// SANKEY

// Reference line text partial
// svgPosition.append("line")          // attach a line
    // .style("stroke", "#eee")  // colour the line
    // .attr("x1", 0)     // x position of the first end of the line
    // .attr("y1", 0)      // y position of the first end of the line
    // .attr("x2", width)     // x position of the second end of the line
    // .attr("y2", 0);

var j = 0;
for (var i = 0; i <= width+width/28; i += width/28) {
  j += 1;
  svgPosition.append("line")          // attach a line
    .style("stroke", "#aaa")  // colour the line
    .attr("x1", i)     // x position of the first end of the line
    .attr("y1", -5)      // y position of the first end of the line
    .attr("x2", i)     // x position of the second end of the line
    .attr("y2", 5);

 svgPosition.append("text")
      .attr("x", i)
      .attr("y", -15)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", null)
      .attr("fill", "#aaa")
      .text(j);
}

var unitsPlural = "Witnesses";
var unitsSingular = "Witness";

var formatNumber = d3.format(",.0f"),    // zero decimal places

    format = function(d) {
    	if (formatNumber(d) > 1 ) {
    		return formatNumber(d) + " " + unitsPlural;
    	} else {
    		return formatNumber(d) + " " + unitsSingular;
    	}
    },
    color = d3.scale.category20();

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(2)
    .nodePadding(45)
    .size([width, height]);

var path = sankey.link();

// load the data
d3.json("test2.json", function(error, graph) {
  console.log(graph);

    // var nodeMap = {};
    // graph.nodes.forEach(function(x) {
    // 	nodeMap[x.name] = x;
    // });
    // graph.links = graph.links.map(function(x) {
    //   return {
    //     source: nodeMap[x.source],
    //     target: nodeMap[x.target],
    //     value: x.value
    //   };
    // });

  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      // .style("stroke-width", 5)
      .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
  link.append("title")
        .text(function(d) {
          return 'x'
    		// return d.source.linkId + " → " +
        //         d.target.linkId + "\n" + format(d.value);
              });

// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
		  return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() {
		  this.parentNode.appendChild(this); })
      .on("drag", dragmove));

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", 2)
      .style("fill", "#ddd")
      .style("opacity", 1)
    .append("title")
      .text(function(d) {
		  return d.name + "\n" + format(d.value) + "\n" + d.majority; })

// add circles on top of the rectangles
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
      	})
      .style("opacity", 1);

// add in the title for the nodes
  node.append("text")
      .attr("x", 0)
      .attr("y", function(d) { return -11; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", null)
      .text(function(d) { return d.name; });

// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform",
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }

});
