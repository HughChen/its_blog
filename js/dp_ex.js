/////////////////////////////////////
////// Example 6 Tree Diagram ///////
/////////////////////////////////////
var margin6 = {top: 0, right: 0, bottom: 0, left: 0},
	width6 = 370 - margin6.right - margin6.left,
	height6 = 220 - margin6.top - margin6.bottom;

var tree6 = d3.layout.tree()
	.size([height6, width6]);

var diagonal6 = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg6 = d3.select("#ex6_divtree").append("svg")
	.attr("width", width6 + margin6.right + margin6.left)
	.attr("height", height6 + margin6.top + margin6.bottom)
	.append("g")
	.attr("transform", "translate(" + margin6.left + "," + margin6.top + ")");

update6(treeData[0]);

function update6(source) {
	/* @desc Update tree SVG (doesn't seem to update text for some reason) */

	// Compute the new tree layout.
	var nodes = tree6.nodes(source).reverse(),
	links = tree6.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 50 + 20; });
	nodes.forEach(function(d) { d.x = (d.x+10) * 1.5; });

	// Declare the nodes…
	var node = svg6.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter the nodes.
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })

	nodeEnter.append("circle")
		.attr("r", 10)
		.style("fill", "#fff")
		.style("stroke", "#e8e8e8")

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
	var link = svg6.selectAll("path.link")
		.data(links, function(d) { return d.target.id; });

	// Enter the links.
	link.enter().insert("path", "g")
		.attr("class", "link")
		.attr("d", diagonal);
}

/////////////////////////////////////////
////// Example 6 dynamic tree algo //////
/////////////////////////////////////////
function add_pn_text(n_name,txt,is_pos) {
	var node = svg6.selectAll("g.node");

	node.append("text")
		.attr("y", function(d) { 
			if (d.name.includes("Leaf")) {
				if (is_pos) {
					return(-6);
				} else {
					return(6);
				}
			} else {
				if (is_pos) {
					return(-6);
				} else {
					return(6);
				}
			}})
		.attr("x", function(d) { 
			if (d.name.includes("Leaf")) {
				if ([1,3,5,7].includes(Number(d.name[4]))) {
					return(2);
				} else { // Left leaves
					return(2);
				}
			} else {
				return(2);
			}})
		.attr("dy", ".35em")
		.attr("text-anchor", function(d) {
			if (d.name.startsWith("Leaf")) {
				if ([1,3,5,7].includes(Number(d.name[4]))) {
					return "end"
				} else { // Right leaves
					return "end"
				}
			} else {
				return "end"
			}
		})
		.text(function(d) { 
			if (d.name == n_name) {
				return round(txt,2);
			}
		})
		.style("font-family", "courier")
		.style("font-size", "12px")
		.style("fill", function(d) {
			if (is_pos) {
				return("green");
			} else {
				return("red");
			}
		})
		.style("fill-opacity", 1);
}

function ex6_reset_tree() {
var nodes = tree6.nodes(treeData[0]).reverse(), links = tree6.links(nodes);
var link = svg6.selectAll("path.link").data(links, 
	function(d) { return d.target.id; });

// Update colors
	link[0].forEach(function(d) {
		var stroke = document.createAttribute("stroke");
		d.attributes.setNamedItem(stroke);
	});
}

function ex6_color_tree(s_t_pairs, colors) {
	var nodes = tree6.nodes(treeData[0]).reverse(), links = tree6.links(nodes);
	var link = svg6.selectAll("path.link").data(links, 
		function(d) { return d.target.id; });

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

function ex6_reset_all_node_colors() {
	var nodes = svg6.selectAll("g.node");
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

function ex6_reset_node_color(node_name) {
	var nodes = svg6.selectAll("g.node");
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

function ex6_change_node_color(node_name) {
	var nodes = svg6.selectAll("g.node");
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

function ex6_update_str(str) {
	// document.getElementById("ex6_dynamic_step").innerHTML = str;
}

function ex6_update_nc_sc() {
	document.getElementById("ex6_sc").innerHTML = sp_lst6.length;
	document.getElementById("ex6_nc").innerHTML = np_lst6.length;
}

function ex6_update_phi() {
	for (var i = 0; i < ex6_phi.length; i++) {
		document.getElementById("ex6_phi"+(i+1)+"_val").innerHTML = round(ex6_phi[i],3);
	}
}

function ex6_update_h() {
for (var i = 0; i < h6.length; i++) {
	if (h6[i] == "none") {
		document.getElementById("ex6_h"+(i+1)).innerHTML = "";
	} else {
		document.getElementById("ex6_h"+(i+1)).innerHTML = h6[i];
	}
}
}

function fact6(x) {
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
var num = fact6(s_len) * fact6(n_len-s_len-1);
var den = fact6(n_len);
return(num/den);
}

function ex6_code_reset() {
    for (var i=0; i < 27; i++) {
		var a = document.getElementById("dynamiccode_"+(i+1));
		var b = a.getElementsByTagName("pre")[0];
		b.style.background = "#ffffff";
    }
}

function ex6_code_color(lines) {
    for (var i=0; i < lines.length; i++) {
    	line = lines[i];
		var a = document.getElementById("dynamiccode_"+(line+1));
		var b = a.getElementsByTagName("pre")[0];
		b.style.background = "#f5f2f0";
    }
}

function ex6_reset() {
	// Reset variables
	ex6_is_initialize = true;
	ex6_phi = [0,0,0];
	nextnodes6 = [];
	nodesseen6 = [];
	np_lst6 = [];
	sp_lst6 = [];
	h6 = ["none", "none", "none"];
	h_dict6 = {};
	h_dict6[treeData[0].name] = h6;
	np_dict6 = {};
	sp_dict6 = {};
	np_dict6[treeData[0].name] = [];
	sp_dict6[treeData[0].name] = [];
	nc6 = 0;
	sc6 = 0;
	nc_dict6 = {};
	sc_dict6 = {};
	nc_dict6[treeData[0].name] = 0;
	sc_dict6[treeData[0].name] = 0;
	pos_dict6 = {};
	neg_dict6 = {};
	nextnodes6.push(treeData[0]);

	ex6_update_str("Dynamic Algorithm");
	ex6_update_nc_sc();
	ex6_update_phi();
	ex6_update_h();
	ex6_code_reset();

	// Reset tree
	ex6_reset_all_node_colors();
	ex6_reset_tree();

	// Update text
	svg6.selectAll("g.node").remove();
	update6(treeData[0]);
}

var ex6_is_initialize = true;
var ex6_phi = [0,0,0];
var currnode6;
var nextnodes6 = [];
var nodesseen6 = [];
var h6 = ["none", "none", "none"];
var h_dict6 = {};
h_dict6[treeData[0].name] = h6;
var np_lst6 = [];
var sp_lst6 = [];
var np_dict6 = {};
var sp_dict6 = {};
np_dict6[treeData[0].name] = [];
sp_dict6[treeData[0].name] = [];
var nc6 = 0;
var sc6 = 0;
var nc_dict6 = {};
var sc_dict6 = {};
nc_dict6[treeData[0].name] = 0;
sc_dict6[treeData[0].name] = 0;
var pos_dict6 = {};
var neg_dict6 = {};

ex6_update_nc_sc();
ex6_update_phi();
nextnodes6.push(treeData[0]);

function dynamicRunAll() {
	for (var i = 0; i < 20; i++) {
		dynamicStep();
	}
}

function dynamicStep() {

	if (nextnodes6.length == 0) {
		ex6_reset_all_node_colors();
		return(1);
	}

	if (currnode6) {
		ex6_reset_node_color(currnode6["name"]);
	}
	currnode6 = nextnodes6.pop();
	var nodename = currnode6["name"];
	ex6_change_node_color(nodename);

	np_lst6 = np_dict6[nodename];
	sp_lst6 = sp_dict6[nodename];
	h6 = h_dict6[nodename];

	ex6_update_nc_sc();
	ex6_update_h();

	// Case 1: at a leaf
	if (currnode6["name"].includes("Leaf")) {
		ex6_code_reset();
		ex6_code_color([3,4,5,6]);
		var value = currnode6["value"];
		if (sp_lst6.length == 0) {
			pos_dict6[nodename] = 0;
		} else {
			currW  = compute_W(sp_lst6.length-1, np_lst6.length);
			pos_dict6[nodename] = currW*value;
		}
		if (sp_lst6.length == np_lst6.length) {
			neg_dict6[nodename] = 0;
		} else {
			currW  = compute_W(sp_lst6.length, np_lst6.length);
			neg_dict6[nodename] = -currW*value;
		}
		add_pn_text(nodename,pos_dict6[nodename],true);
		add_pn_text(nodename,neg_dict6[nodename],false);
		return(1);
	}

	// Case 2-4: Internal node
	// Color both children of node
	n_thres = Number(currnode6["threshold"]);
	n_var   = Number(currnode6["variable"][1])-1;
	fxval   = foregroundx[n_var];
	bxval   = backgroundx[n_var];

	// Determine where foreground/background goes
	var lchild = currnode6["children"][0];
	var rchild = currnode6["children"][1];

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

	if (np_lst6.includes(currnode6.variable)) {
		ex6_update_str('<strong>Case 2</strong>: Previously seen feature');
		ex6_code_reset();
		if (sp_lst6.includes(n_var)) {
			s_t_pairs.push([currnode6,fchild]);
			colors.push("#b3de69");
			if (!nodesseen6.includes(currnode6)) {
				ex6_code_color([7,8,9]);
				ex6_code_color([10,11,12]);
				nextnodes6.push(currnode6);
				nextnodes6.push(fchild);
				np_dict6[bchild.name] = np_lst6;
				sp_dict6[bchild.name] = sp_lst6;
				h_dict6[bchild.name]  = h6;
			}
			// Update pos/neg
			if ((fchild.name in pos_dict6) & (fchild.name in neg_dict6)) {
				ex6_code_color([12]);
				pos_dict6[nodename] = pos_dict6[fchild.name];
				neg_dict6[nodename] = neg_dict6[fchild.name];
				add_pn_text(nodename,pos_dict6[nodename],true);
				add_pn_text(nodename,neg_dict6[nodename],false);
			}
		} else {
			s_t_pairs.push([currnode6,bchild]);
			colors.push("#fb8072");
			if (!nodesseen6.includes(currnode6)) {
				ex6_code_color([7,8,9]);
				ex6_code_color([10,13,14]);
				nextnodes6.push(currnode6);
				nextnodes6.push(bchild);
				np_dict6[bchild.name] = np_lst6;
				sp_dict6[bchild.name] = sp_lst6;
				h_dict6[bchild.name]  = h6;
			}
			// Update pos/neg
			if ((bchild.name in pos_dict6) & (bchild.name in neg_dict6)) {
				ex6_code_color([14]);
				pos_dict6[nodename] = pos_dict6[bchild.name];
				neg_dict6[nodename] = neg_dict6[bchild.name];
				add_pn_text(nodename,pos_dict6[nodename],true);
				add_pn_text(nodename,neg_dict6[nodename],false);				
			}
		}
	} else if (fchild == bchild) {
		ex6_update_str('<strong>Case 3</strong>: Foreground and background match');
		ex6_code_reset();
		s_t_pairs.push([currnode6,fchild]);
		colors.push("#80b1d3");
		// Update np/sp
		if (!nodesseen6.includes(currnode6)) {
			ex6_code_color([7,8,9]);
			ex6_code_color([15,16,17]);
			np_dict6[bchild.name] = np_lst6;
			sp_dict6[bchild.name] = sp_lst6;
			h_dict6[bchild.name]  = h6;
			nextnodes6.push(currnode6);
			nextnodes6.push(fchild);
		}
		// Update pos/neg
		if ((bchild.name in pos_dict6) & (bchild.name in neg_dict6)) {
			ex6_code_color([17]);
			pos_dict6[nodename] = pos_dict6[bchild.name];
			neg_dict6[nodename] = neg_dict6[bchild.name];
			add_pn_text(nodename,pos_dict6[nodename],true);
			add_pn_text(nodename,neg_dict6[nodename],false);
		}
	} else {
		ex6_update_str('<strong>Case 4</strong>: Foreground and background differ');
		ex6_code_reset();
		ex6_code_color([7,8,9]);
		ex6_code_color([18,19,20,21,22,23]);

		s_t_pairs.push([currnode6,fchild]);
		colors.push("#b3de69");

		s_t_pairs.push([currnode6,bchild]);
		colors.push("#fb8072");

		if (!nodesseen6.includes(currnode6)) {
			np_dict6[fchild.name] = np_lst6.concat([currnode6.variable]);
			sp_dict6[fchild.name] = sp_lst6.concat([currnode6.variable]);

			var h2 = h6.slice();
			h2[n_var] = foregroundx[n_var];
			h_dict6[fchild.name]  = h2;

			np_dict6[bchild.name] = np_lst6.concat([currnode6.variable]);
			sp_dict6[bchild.name] = sp_lst6;

			var h3 = h6.slice();
			h3[n_var] = backgroundx[n_var];
			h_dict6[bchild.name]  = h3;

			nextnodes6.push(currnode6);
			nextnodes6.push(rchild);
			nextnodes6.push(lchild);
		}

		// Update phi
		if ((lchild.name in pos_dict6) & (lchild.name in neg_dict6) &
			(rchild.name in pos_dict6) & (rchild.name in neg_dict6)) {
			ex6_code_reset();
			ex6_code_color([24,25]);
			ex6_phi[n_var] = ex6_phi[n_var] + pos_dict6[fchild.name] + neg_dict6[bchild.name];
			pos_dict6[nodename] = pos_dict6[lchild.name] + pos_dict6[rchild.name];
			neg_dict6[nodename] = neg_dict6[lchild.name] + neg_dict6[rchild.name];
			add_pn_text(nodename,pos_dict6[nodename],true);
			add_pn_text(nodename,neg_dict6[nodename],false);
			ex6_update_phi();
		}
	}

	ex6_color_tree(s_t_pairs, colors);
	nodesseen6.push(currnode6);
}
