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

  // Set and color current node
  ex3_curr_node = treeData[0]["name"];
  // Reset and recolor current node
  ex3_reset_all_node_colors();
  ex3_change_node_color(ex3_curr_node);

  // Update button colors
  update_feat_select_color();

  // Update theshold value
  update_threshold_value();

  // Update example 3 text and links
  update_all_text();

  // Refresh other examples
  ex4_reset();
  ex5_reset();
  ex6_reset(); 
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
  width = 400 - margin.right - margin.left,
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

    if (fxval < d2.source.threshold) fleft = true;
    if (bxval < d2.source.threshold) bleft = true;

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

function update(source) {
  /* @desc Update tree SVG (doesn't seem to update text for some reason) */

  // Compute the new tree layout.
  var nodes = tree.nodes(source).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80 + 20; });
  nodes.forEach(function(d) { d.x = d.x*1 - 25; });

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
    .attr("r", 12)
    .style("fill", "#fff")
    .style("stroke", "#e8e8e8");

  nodeEnter.append("text")
    .attr("y", function(d) { 
      return d.children || d._children ? 0 : 25; })
    .attr("x", function(d) { 
      return d.children || d._children ? 18 : 0; })
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
    .style("font-size", "14px")
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
  } else {
    // Get appropriate node
    let nodes = tree.nodes(treeData[0]).reverse(), links = tree.links(nodes);
    nodes.forEach(function(d) { d.y = d.depth * 100 + 60; });
    let node = svg.selectAll("g.node");
    let n1 = node[0].filter(n => n.__data__["name"] == d.name);
    
    // Update the HTML
    n1[0].lastChild.innerHTML = d.variable+"&gt;"+d.threshold;
  }
}

// Toggle children on click.
function click(d) {
  ex3_curr_node = d["name"];
  update_all();
}

var ex3_x1_ele = document.getElementById("ex3_x1_select");
var ex3_x2_ele = document.getElementById("ex3_x2_select");
var ex3_x3_ele = document.getElementById("ex3_x3_select");

function get_node(node_name) {
  var return_node;
  var node_queue = [treeData[0]];
  while (node_queue.length > 0) {
    node = node_queue.pop();
    if (node["name"] == node_name) {
      return_node = node;
    }
    if (node.children) {
      node_queue.push(node.children[0]);
      node_queue.push(node.children[1]);
    }
  }
  return(return_node);
}

function update_feat_select_color() {
  if (ex3_curr_node.includes("Leaf")) {
    document.getElementById("ex3_var_label").style.visibility = 'hidden';
    ex3_x1_ele.style.visibility = 'hidden';
    ex3_x2_ele.style.visibility = 'hidden';
    ex3_x3_ele.style.visibility = 'hidden';
  } else {
    document.getElementById("ex3_var_label").style.visibility = 'visible';
    ex3_x1_ele.style.visibility = 'visible';
    ex3_x2_ele.style.visibility = 'visible';
    ex3_x3_ele.style.visibility = 'visible';
    ex3_x1_ele.className = "w3-button w3-green";
    ex3_x2_ele.className = "w3-button w3-green";
    ex3_x3_ele.className = "w3-button w3-green";
    if (get_node(ex3_curr_node)["variable"] == "x1") {
      ex3_x1_ele.className = "w3-button w3-teal";
    } else if (get_node(ex3_curr_node)["variable"] == "x2") {
      ex3_x2_ele.className = "w3-button w3-teal";
    } else if (get_node(ex3_curr_node)["variable"] == "x3") {
      ex3_x3_ele.className = "w3-button w3-teal";
    }
  }
}

function update_threshold_value() {
  if (ex3_curr_node.includes("Leaf")) {
    document.getElementById("ex3_val_div").style.display   = "block";
    document.getElementById("ex3_thres_div").style.display = "none";
    var slider = document.getElementById("ex3_thres");
    var val = get_node(ex3_curr_node)["value"];
    slider.value = val;
    slider.paired_out.innerHTML = val;
  } else {
    document.getElementById("ex3_thres_div").style.display = "block";
    document.getElementById("ex3_val_div").style.display   = "none";
    var slider = document.getElementById("ex3_thres");
    var threshold = get_node(ex3_curr_node)["threshold"];
    slider.value = threshold;
    slider.paired_out.innerHTML = threshold;
  }
}

function update_all() {
  // Reset and recolor current node
  ex3_reset_all_node_colors();
  ex3_change_node_color(ex3_curr_node);

  // Update button colors
  update_feat_select_color();

  // Update theshold value
  update_threshold_value();

  // Update example 3 text and links
  update_all_text();

  // Refresh other examples
  ex4_reset();
  ex5_reset();
  ex6_reset(); 
}

// Function to update treeData based on the ex3_curr_node
function ex3_update_node(node_name, field_name, value) {
  get_node(node_name)[field_name] = value;
  // Update everything
  update_all();
}

s_name = "ex3_thres"
var s      = document.getElementById(s_name);
var s_out  = document.getElementById(s_name+"_out");
s.paired_out = s_out;
s.oninput = function() {
  ex3_update_node(ex3_curr_node, "threshold", this.value);
  this.paired_out.innerHTML = this.value;
  update_all();
}

s_name = "ex3_val"
var s      = document.getElementById(s_name);
var s_out  = document.getElementById(s_name+"_out");
s.paired_out = s_out;
s.oninput = function() {
  ex3_update_node(ex3_curr_node, "value", this.value);
  this.paired_out.innerHTML = this.value;
  update_all();
}

function ex3_select_feat1() {ex3_update_node(ex3_curr_node, "variable", "x1");}
function ex3_select_feat2() {ex3_update_node(ex3_curr_node, "variable", "x2");}
function ex3_select_feat3() {ex3_update_node(ex3_curr_node, "variable", "x3");}

// Change node colors
var newColor = "rgb(1,151,136)";

function ex3_reset_all_node_colors() {
  var nodes = svg.selectAll("g.node");
  nodes[0].forEach(function (d) {
    oldHTML = d.innerHTML;
    if (oldHTML.includes(newColor)) {
      splitHTML = oldHTML.split(newColor);
      prefix = splitHTML[0];
      suffix = splitHTML[1];
      newHTML = prefix + "rgb(255, 255, 255)" + suffix;
      d.innerHTML = newHTML;      
    }
  })
}

function ex3_change_node_color(node_name) {
  var nodes = svg.selectAll("g.node");
  nodes[0].forEach(function (d) {
    if (d.__data__["name"] == node_name) {
      oldHTML = d.innerHTML;
      if (oldHTML.includes("rgb(255, 255, 255)")) {
        splitHTML = oldHTML.split("rgb(255, 255, 255)");
        prefix = splitHTML[0];
        suffix = splitHTML[1];
        newHTML = prefix + newColor + suffix;
        d.innerHTML = newHTML;
      }
    }
  })
}

var ex3_curr_node = "n1";

ex3_change_node_color(ex3_curr_node);