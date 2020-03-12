var foregroundx = [0,0,10];
var backgroundx = [10,10,0];

function ex3_reset() {
	treeData = JSON.parse(JSON.stringify(treeData0));

	function s_update(s_name, value) {
		var s      = document.getElementById(s_name);
		s.value = value;
		s.paired_out.innerHTML = value;
		s.paired_out2.innerHTML = value;
		s.paired_out3.innerHTML = value;
	}
	s_update("fx1",0);
	s_update("fx2",0);
	s_update("fx3",10);
	s_update("bx1",10);
	s_update("bx2",10);
	s_update("bx3",0);
	foregroundx = [0,0,10];
	backgroundx = [10,10,0];

	setup_all_sliders();

	svg.selectAll("path.link").remove();
	svg.selectAll("g.node").remove();

	update(treeData[0]);
}

/////////////////////////////////////////////////////////////////
////// Sliders for inputting foreground/background samples //////
/////////////////////////////////////////////////////////////////
function slider_setup(s_name, sample, index) {
  var s      = document.getElementById(s_name);
  var s_out  = document.getElementById(s_name+"_out");
  var s_out2 = document.getElementById("ex4_"+s_name);
  var s_out3 = document.getElementById("ex5_"+s_name);
  s.value = sample[index];
  s_out.innerHTML = s.value;
  s.paired_out = s_out;
  s.paired_out2 = s_out2;
  s.paired_out3 = s_out3;
  s.oninput = function() {
    sample[index] = Number(this.value);
    this.paired_out.innerHTML = this.value;
    this.paired_out2.innerHTML = this.value;
    this.paired_out3.innerHTML = this.value;
    update(treeData[0]);
  	ex4_reset();
  	ex5_reset();
    ex6_reset();
  }
}

function setup_all_sliders() {
	slider_setup("fx1", foregroundx, 0);
	slider_setup("fx2", foregroundx, 1);
	slider_setup("fx3", foregroundx, 2);
	slider_setup("bx1", backgroundx, 0);
	slider_setup("bx2", backgroundx, 1);
	slider_setup("bx3", backgroundx, 2);
}

setup_all_sliders();

/////////////////////////////////////
////// Tree data and functions //////
/////////////////////////////////////
// Deep copy - maintain original treedata for resetting
var treeData = JSON.parse(JSON.stringify(treeData0));
// root = treeData[0];

//// Generate the tree diagram ////
var margin = {top: 0, right: 10, bottom: 10, left: 10},
  width = 680 - margin.right - margin.left,
  height = 350 - margin.top - margin.bottom;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#graphic").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get tooltip element
var divtooltip = d3.select('div.tooltip');

// Erase tool tips
function rectclick(d) {divtooltip[0][0].innerHTML = "";}
svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "#ffffff")
  .style("fill-opacity", .1)
  .on("click", rectclick);

update(treeData[0]);

/////////////////////////////////////
///// Start of Helper functions /////
/////////////////////////////////////
function tree_to_list() {
	var node_queue = [treeData[0]];
	var node_list  = [];

	while (node_queue.length > 0) {
		node = node_queue.pop();
		node_list.push(node);
		if (node.children) {
			node_queue.push(node.children[0]);
			node_queue.push(node.children[1]);
		}
	}
	return(node_list);
}

function update_all_text() {
	tree_nodes = tree_to_list();

	for (var i=0; i<tree_nodes.length; i++) {
		d = tree_nodes[i]
		if (d.name.startsWith("Leaf")) {
			update_node_text(d,true,false);
		} else {
			update_node_text(d,false,false);
		}
	}
}

function update_links() {
  /* @desc Update the colors for links in the tree */
  var nodes = tree.nodes(treeData[0]).reverse(), links = tree.links(nodes);
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Update colors
  link[0].forEach(function(d) {
    var d2 = d.__data__;
    if (d2.source.variable == "x1") {
      fxval = foregroundx[0];
      bxval = backgroundx[0];
    } else if (d2.source.variable == "x2") {
      fxval = foregroundx[1];
      bxval = backgroundx[1];
    } else if (d2.source.variable == "x3") {
      fxval = foregroundx[2];
      bxval = backgroundx[2];
    }

    let fleft = false;
    let bleft = false;

    if (fxval <= d2.source.threshold) fleft = true;
    if (bxval <= d2.source.threshold) bleft = true;

    var stroke = document.createAttribute("stroke");
    if (d2.target.childtype == "left") {
      if (fleft && !bleft) {
        stroke.value = "#b3de69"; // Green
      } else if (!fleft && bleft) {
        stroke.value = "#fb8072"; // Red
      } else if (fleft && bleft) {
        stroke.value = "#80b1d3"; // Blue
      } 
    } else {
      if (fleft && !bleft) {
        stroke.value = "#fb8072"; // Red
      } else if (!fleft && bleft) {
        stroke.value = "#b3de69"; // Green
      } else if (!fleft && !bleft) {
        stroke.value = "#80b1d3"; // Blue
      } 
    }
    d.attributes.setNamedItem(stroke);
  });
}

function update_internal_tooltip(var_name, thres_val, new_click) {
  /* @desc Update tooltip based on variable and threshold */
  var content;
  content =  "<div style='text-align: center;background: white;width:200px; box-shadow:3px 3px 5px #797878;height:190px; padding:8%;position:relative;z-index:10'>";
  content += '<table style="width:300px;display:inline;margin-right:25px;font-size:16px;">'
  content += '<col width="60px"><col width="60px"><col width="60px">'
  content += '<tr align="center"><td colspan="3">Variable</td></tr>'
  content += '<tr align="center">'
  if (var_name == "x1") {
    content += "<td><input class='w3-button w3-teal' type='button' id='x1button' value='x1'/></td>";
  } else {
    content += "<td><input class='w3-button w3-green' type='button' id='x1button' value='x1'/></td>";
  }

  if (var_name == "x2") {
    content += "<td><input class='w3-button w3-teal' type='button' id='x2button' value='x2'/></td>";
  } else {
    content += "<td><input class='w3-button w3-green' type='button' id='x2button' value='x2'/></td>";
  }

  if (var_name == "x3") {
    content += "<td><input class='w3-button w3-teal' type='button' id='x3button' value='x3'/></td>";
  } else {
    content += "<td><input class='w3-button w3-green' type='button' id='x3button' value='x3'/></td>";
  }
  content += '</tr>';  
  content += '<tr align="center"><td colspan="3"><br>Threshold</td></tr>'
  content += '<tr align="center"><td colspan="3"><input type="range" min="-15" max="15" value="'+thres_val+'" class="slider" id="xthres"></td></tr>';
  content += '<tr align="center"><td colspan="3" id="xthres_out"></td></tr>';
  content += '</table>';

  // Check if new_click
  if (new_click) {
    divtooltip.html(content)
      .style("left", (d3.event.pageX) + "px") 
      .style("top", (d3.event.pageY) + "px")
      .style("display", "block");
  } else {
    divtooltip.html(content);
  }

  // Update the slider output
  s_name = "xthres";
  var s     = document.getElementById(s_name);
  var s_out = document.getElementById(s_name+"_out");
  s_out.innerHTML = s.value;
  s.paired_out    = s_out;
  s.oninput = function() {
	this.paired_out.innerHTML = this.value;
  }

  let d = curr_node;
  function get_click_f(var_name) {
	return function () {
		d.variable = var_name;
		update_node_text(d, false, false);
		update_internal_tooltip(d.variable, d.threshold, false);
	 	ex4_reset();
	 	ex5_reset();
    ex6_reset();
	}
  }
  divtooltip.select('input#x1button').on('click', get_click_f("x1"));
  divtooltip.select('input#x2button').on('click', get_click_f("x2"));
  divtooltip.select('input#x3button').on('click', get_click_f("x3"));

  divtooltip.select('input#xthres').on('click', function () {
    var thresval = document.getElementById("xthres").value;
    d.threshold = Number(thresval);
    update_node_text(d, false, false);
    ex4_reset();
    ex5_reset();
    ex6_reset();
  })
}

// Update leaf tooltip
function update_leaf_tooltip(value, new_click) {
  /* @desc Update leaf tooltip based on variable and threshold */
  var content;
  content =  "<div style='text-align:center;background:white;width:200px;box-shadow:3px 3px 5px #797878;height:105px; padding:8%;position:relative;z-index:10'>";
  content += '<table style="width:300px;display:inline;margin-right:25px;font-size:16px;">'

  content += '<col width="60px"><col width="60px"><col width="60px">'
  content += '<tr align="center"><td colspan="3">Value</td></tr>'
  content += '<tr align="center"><td colspan="3"><input type="range" min="-15" max="15" value="'+value+'" class="slider" id="leafvalue"></td></tr>'
  content += '<tr align="center"><td colspan="3" id="leafvalue_out">Value</td></tr>'
  content += '</table>'

  // Check if new_click
  if (new_click) {
    divtooltip.html(content)
      .style("left", (d3.event.pageX) + "px") 
      .style("top", (d3.event.pageY) + "px")
      .style("display", "block");
  } else {
    divtooltip.html(content);
  }

  // Update the slider output
  s_name = "leafvalue";
  var s     = document.getElementById(s_name);
  var s_out = document.getElementById(s_name+"_out");
  s_out.innerHTML = s.value;
  s.paired_out    = s_out;
  s.oninput = function() {
    this.paired_out.innerHTML = this.value;
  }

  d = curr_node;
  divtooltip.select('input#leafvalue').on('click', function () {
    var leafvalue = document.getElementById("leafvalue").value;
    d.value = leafvalue;
    update_node_text(d, true, false);
    ex4_reset();
    ex5_reset();
    ex6_reset();
  })
}

function update(source) {
  /* @desc Update tree SVG (doesn't seem to update text for some reason) */

  // Compute the new tree layout.
  var nodes = tree.nodes(source).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80 + 20; });
  nodes.forEach(function(d) { d.x = d.x*1.3 + 100; });

  // Declare the nodes…
  var i = 0;
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; })
    .on("click", click)
    .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer"); })
    .on("mouseout", function(d) {
        d3.select(this).style("cursor", "default"); });

  nodeEnter.append("circle")
    .attr("r", 15)
    .style("fill", "#fff");

  nodeEnter.append("text")
    .attr("y", function(d) { 
      return d.children || d._children ? 0 : 30; })
    .attr("x", function(d) { 
      return d.children || d._children ? 20 : 0; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      if (d.name.startsWith("Leaf")) {
        return "middle"
      }
    })
    .text(function(d) { 
      if (d.name.startsWith("Leaf")) {
        return d.value;
      } else {
        return d.variable + ">" + d.threshold;   
      }
    })
    .style("font-family", "courier")
    .style("font-size", "18px")
    .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);

  // Update link colors
  update_links();
}

function update_node_text(d, is_leaf, is_tooltip) {
  /* @desc Update text of associated node */
  node_name = d.name;
  if (is_leaf) {
    // Get appropriate node
    let nodes = tree.nodes(treeData[0]).reverse(), links = tree.links(nodes);
    nodes.forEach(function(d) { d.y = d.depth * 100 + 60; });
    let node = svg.selectAll("g.node");
    let n1 = node[0].filter(n => n.__data__["name"] == d.name);

    // Update the HTML
    n1[0].lastChild.innerHTML = d.value;

    if (is_tooltip) {
	    // Update SVG
	    update_leaf_tooltip(d.value, false);	    	
    }
  } else {
    // Get appropriate node
    let nodes = tree.nodes(treeData[0]).reverse(), links = tree.links(nodes);
    nodes.forEach(function(d) { d.y = d.depth * 100 + 60; });
    let node = svg.selectAll("g.node");
    let n1 = node[0].filter(n => n.__data__["name"] == d.name);
    
    // Update the HTML
    n1[0].lastChild.innerHTML = d.variable+"&gt;"+d.threshold;

    // Update SVG
    if (is_tooltip) {
    	update_internal_tooltip(d.variable, d.threshold, false);	    	
    }
    update_links();
  }
}

var curr_node;

// Toggle children on click.
function click(d) {
  curr_node = d;
  if (d.name.startsWith("Leaf")) {
    update_leaf_tooltip(d.value, true);

    divtooltip.select('input#leafvalue').on('click', function () {
      var leafvalue = document.getElementById("leafvalue").value;
      d.value = leafvalue;
      update_node_text(d, true, false);
      ex4_reset();
      ex5_reset();
      ex6_reset();
    })
  } else { // Internal nodes
    update_internal_tooltip(d.variable, d.threshold, true);

	function get_click_f(var_name) {
		return function () {
			d.variable = var_name;
			update_node_text(d, false, false);
			update_internal_tooltip(d.variable, d.threshold, false);
			ex4_reset();
			ex5_reset();
      ex6_reset();
		}
	}
    divtooltip.select('input#x1button').on('click', get_click_f("x1"));
    divtooltip.select('input#x2button').on('click', get_click_f("x2"));
    divtooltip.select('input#x3button').on('click', get_click_f("x3"));

    divtooltip.select('input#xthres').on('click', function () {
      var thresval = document.getElementById("xthres").value;
      d.threshold = Number(thresval);
      update_node_text(d, false, false);
      ex4_reset();
      ex5_reset();
      ex6_reset();
    })
    
  }

}