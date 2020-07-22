/////////////////////////////////////
////// Example 5 Tree Diagram ///////
/////////////////////////////////////
var margin5 = {top: 0, right: 0, bottom: 0, left: 0},
  width5 = 370 - margin5.right - margin5.left,
  height5 = 220 - margin5.top - margin5.bottom;

var tree5 = d3.layout.tree()
  .size([height5, width5]);

var diagonal5 = d3.svg.diagonal()
  .projection(function(d) { return [d.x, d.y]; });

var svg5 = d3.select("#ex5_divtree").append("svg")
  .attr("width", width5 + margin5.right + margin5.left)
  .attr("height", height5 + margin5.top + margin5.bottom)
  .append("g")
  .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

update5(treeData[0]);

function update5(source) {
	/* @desc Update tree SVG (doesn't seem to update text for some reason) */

	// Compute the new tree layout.
	var nodes = tree5.nodes(source).reverse(),
	links = tree5.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 50 + 20; });
	nodes.forEach(function(d) { d.x = (d.x+10) * 1.5; });

	// Declare the nodes…
	var node = svg5.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter the nodes.
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })

	nodeEnter.append("circle")
		.attr("r", 10)
		.style("fill", "#fff")
		.style("stroke", "#e8e8e8");

	nodeEnter.append("text")
		.attr("y", function(d) { 
		  return d.children || d._children ? 0 : 20; })
		.attr("x", function(d) { 
		  return d.children || d._children ? 15 : 0; })
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
	var link = svg5.selectAll("path.link")
	.data(links, function(d) { return d.target.id; });

	// Enter the links.
	link.enter().insert("path", "g")
	.attr("class", "link")
	.attr("d", diagonal);
}

///////////////////////////////////////
////// Example 5 Naive tree algo //////
///////////////////////////////////////
function ex5_reset_tree() {
	var nodes = tree5.nodes(treeData[0]).reverse(), links = tree5.links(nodes);
	var link = svg5.selectAll("path.link").data(links, 
		function(d) { return d.target.id; });

	// Update colors
	link[0].forEach(function(d) {
		var stroke = document.createAttribute("stroke");
		d.attributes.setNamedItem(stroke);
	});
}

function ex5_color_tree(s_t_pairs, colors) {
	var nodes = tree5.nodes(treeData[0]).reverse(), links = tree5.links(nodes);
	var link = svg5.selectAll("path.link").data(links, 
		function(d) { return d.target.id; });

	// Remove colors
	// ex5_reset_tree();

	// Color the appropriate pairs
	for (var j=0; j<s_t_pairs.length; j++) {
		s_t_pair = s_t_pairs[j];
		color    = colors[j]

		// Update colors
		link[0].forEach(function(d) {
			var d2 = d.__data__;
			is_source = (d2.source.name == s_t_pair[0].name)
			is_target = (d2.target.name == s_t_pair[1].name)
			if (is_source & is_target) {
				var stroke = document.createAttribute("stroke");
				stroke.value = color;
				d.attributes.setNamedItem(stroke);				
			}
		});
	}
}

function reset_all_node_colors() {
	var nodes = svg5.selectAll("g.node");
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

function reset_node_color(node_name) {
	var nodes = svg5.selectAll("g.node");
	nodes[0].forEach(function (d) {
		if (d.__data__["name"] == node_name) {
			oldHTML = d.innerHTML;
			if (oldHTML.includes(newColor)) {
				splitHTML = oldHTML.split(newColor);
				prefix = splitHTML[0];
				suffix = splitHTML[1];
				newHTML = prefix + "rgb(255, 255, 255)" + suffix;
				d.innerHTML = newHTML;
			}
		}
	})
}

function change_node_color(node_name) {
	var nodes = svg5.selectAll("g.node");
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

function ex5_update_str(str) {
	// document.getElementById("ex5_naive_step").innerHTML = str;
}

function ex5_update_np_sp() {
	document.getElementById("ex5_sp").innerHTML = "["+sp_lst+"]";
	document.getElementById("ex5_np").innerHTML = "["+np_lst+"]";
}

function ex5_update_phi() {
	for (var i = 0; i < ex5_phi.length; i++) {
		document.getElementById("ex5_phi"+(i+1)+"_val").innerHTML = round(ex5_phi[i],3);
	}
}

function ex5_update_h() {
	for (var i = 0; i < h.length; i++) {
		if (h[i] == "none") {
			document.getElementById("ex5_h"+(i+1)).innerHTML = "";
		} else {
			document.getElementById("ex5_h"+(i+1)).innerHTML = h[i];
		}
	}
}

function fact(x) {
	if (x == 0) {
		return(1);
	} else if (x == 1) {
		return(1);
	} else if (x == 2) {
		return(2);
	} else if (x == 3) {
		return(6);
	} else if (x == 4) {
		return(24);
	}
}

function compute_W(s_len, n_len) {
	var num = fact(s_len) * fact(n_len-s_len-1);
	var den = fact(n_len);
	return(num/den);
}

function ex5_code_reset() {
    for (var i=0; i < 27; i++) {
		var a = document.getElementById("naivecode_"+(i+1));
		var b = a.getElementsByTagName("pre")[0];
		b.style.background = "#ffffff";
    }
}

function ex5_code_color(lines) {
    for (var i=0; i < lines.length; i++) {
    	line = lines[i];
		var a = document.getElementById("naivecode_"+(line+1));
		var b = a.getElementsByTagName("pre")[0];
		b.style.background = "#f5f2f0";
    }
}

function ex5_reset() {
	// Reset variables
	ex5_phi = [0,0,0];
	nextnodes = [];
	nodesseen = [];
	np_lst = [];
	sp_lst = [];
	h = ["none", "none", "none"];
	h_dict = {};
	h_dict[treeData[0].name] = h;
	np_dict = {};
	sp_dict = {};
	np_dict[treeData[0].name] = [];
	sp_dict[treeData[0].name] = [];
	nextnodes.push(treeData[0]);

	ex5_update_str("Naive algorithm");
	ex5_update_np_sp();
	ex5_update_phi();
	ex5_update_h();
	ex5_code_reset()

	// Reset tree
	reset_all_node_colors();
	ex5_reset_tree();

	// Update text
	svg5.selectAll("g.node").remove();
	update5(treeData[0]);
}

var ex5_phi = [0,0,0];
var currnode;
var nextnodes = [];
var nodesseen = [];
var np_lst = [];
var sp_lst = [];
var h = ["none", "none", "none"];
var h_dict = {};
h_dict[treeData[0].name] = h;
var np_dict = {};
var sp_dict = {};
np_dict[treeData[0].name] = [];
sp_dict[treeData[0].name] = [];
ex5_update_np_sp();
ex5_update_phi();
nextnodes.push(treeData[0]);

function naiveRunAll() {
	for (var i = 0; i < 20; i++) {
		naiveStep();
	}
}

function naiveStep() {

	if (nextnodes.length == 0) {
		return(1);
	}

	if (currnode) {
		reset_node_color(currnode["name"]);
	}
	currnode = nextnodes.pop();
	change_node_color(currnode["name"]);

	np_lst = np_dict[currnode.name];
	sp_lst = sp_dict[currnode.name];
	h = h_dict[currnode.name];

	ex5_update_np_sp();
	ex5_update_h();

	// Case 1: at a leaf
	if (currnode["name"].includes("Leaf")) {
		ex5_code_reset();
		ex5_code_color([3,4,5,6,7,8,9]);
		var value = currnode["value"];
		ex5_update_str('<strong>Case 1</strong>: At a leaf');
		for (var k = 0; k < ex5_phi.length; k++) {
			var currvar = "x"+(k+1);
			if (np_lst.includes(currvar)) {
				if (sp_lst.includes(currvar)) {
					currW  = compute_W(sp_lst.length-1, np_lst.length);
					ex5_phi[k] = ex5_phi[k] + currW*value;
				} else {
					currW  = compute_W(sp_lst.length, np_lst.length);
					ex5_phi[k] = ex5_phi[k] - currW*value;
				}
			}
		}
		ex5_update_phi();
		return(1);
	}

	// Case 2-4: Internal node
	// Color both children of node
	ex5_code_reset();
	ex5_code_color([10,11,12]);
	n_thres = Number(currnode["threshold"]);
	n_var   = Number(currnode["variable"][1])-1;
	fxval   = foregroundx[n_var];
	bxval   = backgroundx[n_var];

	// Determine where foreground/background goes
	var lchild = currnode["children"][0];
	var rchild = currnode["children"][1];
    var fleft = false;
    var bleft = false;

	if (fxval <= n_thres) {
		fleft  = true;
		fchild = lchild;
	} else {
		fchild = rchild;
	}

	if (bxval <= n_thres) {
		bleft  = true;
		bchild = lchild;
	} else {
		bchild = rchild;
	}

	// Color the children of the current node
	var s_t_pairs = [];
	var colors = [];

	if (np_lst.includes(currnode.variable)) {
		ex5_code_color([13,14,15,16,17,18]);
		ex5_update_str('<strong>Case 2</strong>: Previously seen feature');
		if (sp_lst.includes(n_var)) {
			s_t_pairs.push([currnode,fchild]);
			colors.push("#b3de69");
			if (!nodesseen.includes(currnode)) {
				nextnodes.push(fchild);
				np_dict[bchild.name] = np_lst;
				sp_dict[bchild.name] = sp_lst;
				h_dict[bchild.name]  = h;
			}
		} else {
			s_t_pairs.push([currnode,bchild]);
			colors.push("#fb8072");
			if (!nodesseen.includes(currnode)) {
				nextnodes.push(bchild);
				np_dict[bchild.name] = np_lst;
				sp_dict[bchild.name] = sp_lst;
				h_dict[bchild.name]  = h;
			}
		}
	} else if (fchild == bchild) {
		ex5_code_color([19,20,21]);
		ex5_update_str('<strong>Case 3</strong>: Foreground and background match');
		s_t_pairs.push([currnode,fchild]);
		colors.push("#80b1d3");
		
		if (!nodesseen.includes(currnode)) {
			np_dict[bchild.name] = np_lst;
			sp_dict[bchild.name] = sp_lst;
			h_dict[bchild.name]  = h;
			nextnodes.push(fchild);
		}
	} else {
		ex5_code_color([22,23,24,25]);
		ex5_update_str('<strong>Case 4</strong>: Foreground and background differ');
		s_t_pairs.push([currnode,fchild]);
		colors.push("#b3de69");

		s_t_pairs.push([currnode,bchild]);
		colors.push("#fb8072");

		if (!nodesseen.includes(currnode)) {
			np_dict[fchild.name] = np_lst.concat([currnode.variable]);
			sp_dict[fchild.name] = sp_lst.concat([currnode.variable]);

			var h2 = h.slice();
			h2[n_var] = foregroundx[n_var];
			h_dict[fchild.name]  = h2;

			np_dict[bchild.name] = np_lst.concat([currnode.variable]);
			sp_dict[bchild.name] = sp_lst;

			var h3 = h.slice();
			h3[n_var] = backgroundx[n_var];
			h_dict[bchild.name]  = h3;

			nextnodes.push(rchild);
			nextnodes.push(currnode);
			nextnodes.push(lchild);
		}
	}
	ex5_color_tree(s_t_pairs, colors);
	nodesseen.push(currnode);
}