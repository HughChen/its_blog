/////////////////////////////////////
////// Example 4 Tree Diagram ///////
/////////////////////////////////////
var margin4 = {top: 0, right: 0, bottom: 0, left: 0},
  width4 = 370 - margin4.right - margin4.left,
  height4 = 220 - margin4.top - margin4.bottom;

var tree4 = d3.layout.tree()
  .size([height4, width4]);

var diagonal4 = d3.svg.diagonal()
  .projection(function(d) { return [d.x, d.y]; });

var svg4 = d3.select("#ex4_divtree").append("svg")
  .attr("width", width4 + margin4.right + margin4.left)
  .attr("height", height4 + margin4.top + margin4.bottom)
  .append("g")
  .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");

update4(treeData[0]);

function update4(source) {
	/* @desc Update tree SVG (doesn't seem to update text for some reason) */

	// Compute the new tree layout.
	var nodes = tree4.nodes(source).reverse(),
	links = tree4.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 50 + 20; });
	nodes.forEach(function(d) { d.x = (d.x - 10) * 1.5; });

	// Declare the nodes…
	var node = svg4.selectAll("g.node")
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
	var link = svg4.selectAll("path.link")
	.data(links, function(d) { return d.target.id; });

	// Enter the links.
	link.enter().insert("path", "g")
	.attr("class", "link")
	.attr("d", diagonal);
}

/////////////////////////////////////
////// Brute force computation //////
/////////////////////////////////////
function get_rem_feats(ex4_feat) {
	var rem_feats;
	if (ex4_feat == 1) {
		rem_feats = [2,3];
	} else if (ex4_feat == 2) {
		rem_feats = [1,3];
	} else if (ex4_feat == 3) {
		rem_feats = [1,2];
	}
	return(rem_feats);
}

function update_phi_ele(phi) {
	for (var i=0; i < phi.length; i++) {
		document.getElementById("ex4_phi"+(i+1)+"_val").innerHTML = round(phi[i],3).toString();
	}
}

function fill_sets(s,si,sn) {
	var s_ele  = document.getElementById(sn);
	var si_ele = document.getElementById(sn+"i");
	s_ele.innerHTML = "{"+s+"}";
	si_ele.innerHTML = "{"+si+"}";
}

function compute_hs_hsi(currs, currsi) {
	hs  = [];
	hsi = [];
	for (var i=0; i<feats.length; i++) {
		if (currs.includes(i+1)) {
			document.getElementById("ex4_hs"+(i+1)).innerHTML = foregroundx[i];
			hs.push(foregroundx[i]);
		} else {
			document.getElementById("ex4_hs"+(i+1)).innerHTML = backgroundx[i];
			hs.push(backgroundx[i]);
		}

		if (currsi.includes(i+1)) {
			document.getElementById("ex4_hsi"+(i+1)).innerHTML = foregroundx[i];
			hsi.push(foregroundx[i]);
		} else {
			document.getElementById("ex4_hsi"+(i+1)).innerHTML = backgroundx[i];
			hsi.push(backgroundx[i]);
		}
	}
	return([hs,hsi]);
}

function get_pairs_value(hybrid_sample) {
	var node = treeData[0];
	var s_t_pairs  = [];
	var nextnode;
	while (!(node["name"].includes("Leaf"))) {
		ind  = Number(node["variable"][1])-1;
		thre = Number(node["threshold"]);
		if (hybrid_sample[ind] <= thre) {
			nextnode = node.children[0];
		} else {
			nextnode = node.children[1];
		}
		s_t_pairs.push([node,nextnode]);
		node = nextnode;
	}
	var ex4value = node["value"];
	return([s_t_pairs, ex4value]);
}

function color_tree(s_t_pairs, s_t_pairsi) {
	var nodes = tree4.nodes(treeData[0]).reverse(), links = tree4.links(nodes);
	var link = svg4.selectAll("path.link").data(links, 
		function(d) { return d.target.id; });

	// Remove colors
	reset_tree();

	// Color the appropriate pairs
	for (var j=0; j<s_t_pairs.length; j++) {
		s_t_pair  = s_t_pairs[j];
		s_t_pairi = s_t_pairsi[j];

		// Update colors
		link[0].forEach(function(d) {
			var d2 = d.__data__;
			is_hs = (d2.source.name == s_t_pair[0].name) & (d2.target.name == s_t_pair[1].name)
			is_hsi = (d2.source.name == s_t_pairi[0].name) & (d2.target.name == s_t_pairi[1].name)
			var stroke = document.createAttribute("stroke");
			if (is_hs & is_hsi) {
				stroke.value = "#80b1d3";
				d.attributes.setNamedItem(stroke);
			} else if (is_hs) {
				stroke.value = "#fb8072";
				d.attributes.setNamedItem(stroke);
			} else if (is_hsi) {
				stroke.value = "#b3de69";
				d.attributes.setNamedItem(stroke);
			}
		});
	}
}

function ex4_update_step(s_name, currs, currsi) {
	currs_name = s_name;
	document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "#D0D0D0";

	var hs_hsi = compute_hs_hsi(currs, currsi);
	hs  = hs_hsi[0];
	hsi = hs_hsi[1];

	var value  = get_pairs_value(hs);
	s_t_pairs  = value[0];
	ex4value   = value[1];

	var value  = get_pairs_value(hsi);
	s_t_pairsi = value[0];
	ex4valuei  = value[1];

	color_tree(s_t_pairs, s_t_pairsi);

	document.getElementById(currs_name+"_val").innerHTML = ex4value;
	document.getElementById(currs_name+"i_val").innerHTML = ex4valuei;

	var contribution = W_dict[currs_name]*(ex4valuei-ex4value);
	phi[ex4_feat-1] = phi[ex4_feat-1] + contribution;
	update_phi_ele(phi);
}

function reset_bf_values() {
	for (var i = 0; i < 4; i++) {
		document.getElementById("s"+(i+1)+"_val").innerHTML = "";
		document.getElementById("s"+(i+1)+"i_val").innerHTML = "";
	}
}

function reset_hs_values() {
	for (var i = 0; i < feats.length; i++) {
		document.getElementById("ex4_hs"+(i+1)).innerHTML = "";
		document.getElementById("ex4_hsi"+(i+1)).innerHTML = "";
	}
}

function reset_tree() {
	var nodes = tree4.nodes(treeData[0]).reverse(), links = tree4.links(nodes);
	var link = svg4.selectAll("path.link").data(links, 
		function(d) { return d.target.id; });

	// Remove colors
	link[0].forEach(function(d) {
		var stroke = document.createAttribute("stroke");
		d.attributes.setNamedItem(stroke);
	});
}

function reset_phi_values() {
	for (var i = 0; i < feats.length; i++) {
		document.getElementById("ex4_phi"+(i+1)+"_val").innerHTML = "";
	}
}

function reset_colors() {
	// Brute force colors
	for (var i = 0; i < 4; i++) {
		document.getElementById("ex4_s"+(i+1)+"_row").style.backgroundColor = "";
	}

	// FG & BG Colors
	document.getElementById("ex4_hS").style.backgroundColor = "";
	document.getElementById("ex4_hSi").style.backgroundColor = "";
	document.getElementById("ex4_fxS").style.backgroundColor = "";
	document.getElementById("ex4_fxSi").style.backgroundColor = "";

	// Attribution colors
	for (var i = 0; i < feats.length; i++) {
		document.getElementById("ex4_phi"+(i+1)).style.backgroundColor = "";
	}
}

function reset_sets() {
	sn_names = ["s1", "s2", "s3", "s4"];
	for (var i = 0; i < sn_names.length; i++) {
		sn = sn_names[i];
		var s_ele  = document.getElementById(sn);
		var si_ele = document.getElementById(sn+"i");
		s_ele.innerHTML  = "";
		si_ele.innerHTML = "";
	}
}

function ex4_code_reset() {
    for (var i=0; i < 10; i++) {
		var a = document.getElementById("bf_"+(i+1));
		var b = a.getElementsByTagName("pre")[0];
		b.style.background = "#ffffff";
    }
}

function ex4_code_color(lines) {
    for (var i=0; i < lines.length; i++) {
    	line = lines[i];
		var a = document.getElementById("bf_"+(line+1));
		var b = a.getElementsByTagName("pre")[0];
		b.style.background = "#f5f2f0";
    }
}

function ex4_reset() {
	// Reset visuals
	reset_bf_values();
	reset_hs_values();
	reset_tree();
	reset_phi_values();
	reset_colors();
	reset_sets();
	ex4_code_reset()

	// Update text
	svg4.selectAll("g.node").remove();
	update4(treeData[0]);

	// Start over
	ex4_feat  = 1;
	curr_step = -1;
}


var feats = [1,2,3];
var phi = [0,0,0];
var W_dict = {"s1":1/3,"s2":1/6,"s3":1/6,"s4":1/3};
var rem_feats;
var ex4_feat  = 1;
var curr_step = -1;
var hs; var hsi;
var ex4value; var ex4valuei;
var currs_name; var currs; var currsi;

var s1; var s1i;
var s2; var s2i;
var s3; var s3i;
var s4; var s4i;

var s_t_pairs; var s_t_pairsi;

function bruteForceRunAll() {
	while (curr_step <= 20) {
		bruteForceStep();
	}
}

function bruteForceStep() {
	curr_step += 1;

	////// Update steps for s1 //////
	// Highlight current feature
	if (curr_step == 0) {
		var phi_ele = document.getElementById("ex4_phi"+ex4_feat);
		phi_ele.style.backgroundColor = "#D0D0D0";
		phi = [0,0,0];
		update_phi_ele(phi);

		// Define subsets
		rem_feats = get_rem_feats(ex4_feat);
		s1  = []; 
		s1i = [ex4_feat];
		s2  = [rem_feats[0]]; 
		s2i = [rem_feats[0],ex4_feat].sort();
		s3  = [rem_feats[1]]; 
		s3i = [rem_feats[1],ex4_feat].sort();
		s4  = rem_feats.sort(); 
		s4i = [rem_feats[0],rem_feats[1],ex4_feat].sort();

		currs_name = "s1";
		currs  = s1;
		currsi = s1i;
		ex4_code_reset();
		ex4_code_color([1,2]);
	}

	// Fill in the appropriate sets
	if (curr_step == 1) {
		fill_sets(s1,s1i,"s1");
		fill_sets(s2,s2i,"s2");
		fill_sets(s3,s3i,"s3");
		fill_sets(s4,s4i,"s4");
		ex4_code_reset();
		ex4_code_color([3]);
	}

	// Highlight the row being obtained
	if (curr_step == 2) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "#D0D0D0";
	}

	// Highlight the hybrid samples and the corresponding values
	if (curr_step == 3) {
		document.getElementById("ex4_hS").style.backgroundColor = "#fbb4ae";
		document.getElementById("ex4_hSi").style.backgroundColor = "#ccebc5";
		document.getElementById("ex4_fxS").style.backgroundColor = "#fbb4ae";
		document.getElementById("ex4_fxSi").style.backgroundColor = "#ccebc5";
		ex4_code_reset();
		ex4_code_color([4,5]);
	}

	// Get the hybrid samples
	if (curr_step == 4) {
		var hs_hsi = compute_hs_hsi(currs, currsi);
		hs  = hs_hsi[0];
		hsi = hs_hsi[1];
	}

	if (curr_step == 5) {
		var value  = get_pairs_value(hs);
		s_t_pairs  = value[0];
		ex4value   = value[1];

		var value  = get_pairs_value(hsi);
		s_t_pairsi = value[0];
		ex4valuei  = value[1];

		color_tree(s_t_pairs, s_t_pairsi);
		ex4_code_reset();
		ex4_code_color([6,7]);
	}

	if (curr_step == 6) {
		document.getElementById("s1_val").innerHTML = ex4value;
		document.getElementById("s1i_val").innerHTML = ex4valuei;
	}

	if (curr_step == 7) {
		var contribution = W_dict[currs_name]*(ex4valuei-ex4value);
		phi[ex4_feat-1] = phi[ex4_feat-1] + contribution;
		update_phi_ele(phi);
		ex4_code_reset();
		ex4_code_color([8,9]);
	}

	////// Complete update for s2 //////
	if (curr_step == 8) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s2", s2, s2i);
		ex4_code_reset();
		ex4_code_color([4,5,6,7,8,9]);
	}

	////// Complete update for s3 //////
	if (curr_step == 9) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s3", s3, s3i);
	}

	////// Complete update for s4 //////
	if (curr_step == 10) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s4", s4, s4i);
	}

	if (curr_step == 11) {
		// Reset everything except for attribution values
		reset_bf_values();
		reset_hs_values();
		reset_tree();

		// Next feature
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		document.getElementById("ex4_phi"+ex4_feat).style.backgroundColor = "";
		ex4_feat = 2;
		document.getElementById("ex4_phi"+ex4_feat).style.backgroundColor = "#D0D0D0";

		// Define subsets
		rem_feats = get_rem_feats(ex4_feat);

		s1  = []; 
		s1i = [ex4_feat];
		s2  = [rem_feats[0]]; 
		s2i = [rem_feats[0],ex4_feat].sort();
		s3  = [rem_feats[1]]; 
		s3i = [rem_feats[1],ex4_feat].sort();
		s4  = rem_feats.sort(); 
		s4i = [rem_feats[0],rem_feats[1],ex4_feat].sort();

		fill_sets(s1,s1i,"s1");
		fill_sets(s2,s2i,"s2");
		fill_sets(s3,s3i,"s3");
		fill_sets(s4,s4i,"s4");

		ex4_code_reset();
		ex4_code_color([2]);
	}

	if (curr_step == 12) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s1", s1, s1i);
		ex4_code_reset();
		ex4_code_color([4,5,6,7,8,9]);
	}

	if (curr_step == 13) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s2", s2, s2i);
	}

	if (curr_step == 14) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s3", s3, s3i);
	}

	if (curr_step == 15) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s4", s4, s4i);
	}

	if (curr_step == 16) {
		// Reset everything except for attribution values
		reset_bf_values();
		reset_hs_values();
		reset_tree();

		// Next feature
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		document.getElementById("ex4_phi"+ex4_feat).style.backgroundColor = "";
		ex4_feat = 3;
		document.getElementById("ex4_phi"+ex4_feat).style.backgroundColor = "#D0D0D0";

		// Define subsets
		rem_feats = get_rem_feats(ex4_feat);
		s1  = []; 
		s1i = [ex4_feat];
		s2  = [rem_feats[0]]; 
		s2i = [rem_feats[0],ex4_feat].sort();
		s3  = [rem_feats[1]]; 
		s3i = [rem_feats[1],ex4_feat].sort();
		s4  = rem_feats.sort(); 
		s4i = [rem_feats[0],rem_feats[1],ex4_feat].sort();

		fill_sets(s1,s1i,"s1");
		fill_sets(s2,s2i,"s2");
		fill_sets(s3,s3i,"s3");
		fill_sets(s4,s4i,"s4");

		ex4_code_reset();
		ex4_code_color([2]);
	}


	if (curr_step == 17) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s1", s1, s1i);
		ex4_code_reset();
		ex4_code_color([4,5,6,7,8,9]);
	}

	if (curr_step == 18) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s2", s2, s2i);
	}

	if (curr_step == 19) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s3", s3, s3i);
	}

	if (curr_step == 20) {
		document.getElementById("ex4_"+currs_name+"_row").style.backgroundColor = "";
		ex4_update_step("s4", s4, s4i);
	}

}
