///////////////////////////
////// Ex. 2 Presets //////
///////////////////////////
function ex2_set_preset(prefix,letter) {
	letters = ["A", "B", "C", "D"];
	for (var i = 0; i < letters.length; i++) {
		if (letters[i] == letter) {
			document.getElementById(prefix+letters[i]).className = "w3-button w3-teal";
		} else {
			document.getElementById(prefix+letters[i]).className = "w3-button w3-green";
		}
	}
}

function ex2_presetA() {
	ex2_set_preset("ex2_preset","A");

	// Reset covariance
	for (var i=0; i<4; i++)
		for (var j=0; j<4; j++)
			document.getElementById("ex2_cor"+(i+1)+(j+1)).value = 0.0;

	for (var i=0; i<4; i++)
		document.getElementById("ex2_cor"+(i+1)+(i+1)).value = 1.0;

	// Reset explicand and beta
	for (var i=0; i<4; i++) {
	    document.getElementById("ex2_x"+(i+1)).value = 1;
	    document.getElementById("ex2_b"+(i+1)).value = i+1;
	}

	// Update preset text
	var text = document.getElementById("ex2_preset_text");
	text.innerHTML = "Independent variables.";

	// Update shapley values
	ex2_updateSV();
}

function ex2_presetB() {
	// Reset covariance
	ex2_presetA();

	ex2_set_preset("ex2_preset","B");

	document.getElementById("ex2_cor"+3+4).value = 0.99;
	document.getElementById("ex2_cor"+4+3).value = 0.99;

	// Update preset text
	var text = document.getElementById("ex2_preset_text");
	text.innerHTML = "Pair of highly correlated variables.";

	// Update shapley values
	ex2_updateSV();
}

function ex2_presetC() {
	// Reset covariance
	ex2_presetA();

	ex2_set_preset("ex2_preset","C");

    document.getElementById("ex2_b"+4).value = 0;

	// Update preset text
	var text = document.getElementById("ex2_preset_text");
	text.innerHTML = "Variable not used by model (independent).";

	// Update shapley values
	ex2_updateSV();
}

function ex2_presetD() {
	// Reset covariance
	ex2_presetB();

	ex2_set_preset("ex2_preset","D");

    document.getElementById("ex2_b"+4).value = 0;

	// Update preset text
	var text = document.getElementById("ex2_preset_text");
	text.innerHTML = "Variable not used by model (pair correlation).";

	// Update shapley values
	ex2_updateSV();
}

/////////////////////////////////////
////// Ex2 Initialize elements //////
/////////////////////////////////////
// @desc Set paired output for symmetric matrix
for (var i=0; i<4; i++) {
	for (var j=0; j<4; j++) {
		if (i != j) {
			var s = document.getElementById("ex2_cor"+(i+1)+(j+1));
			var o = document.getElementById("ex2_cor"+(j+1)+(i+1));
			s.paired_out = o;					
		}
	}
}

// @desc Set onchange functions
for (var i=0; i<4; i++)
	for (var j=0; j<4; j++)
		document.getElementById("ex2_cor"+(i+1)+(j+1)).onchange = ex2_updateSV;

// @desc Set onchange functions
for (var i=0; i<4; i++) {
    document.getElementById("ex2_x"+(i+1)).onchange = ex2_updateSV;
    document.getElementById("ex2_b"+(i+1)).onchange = ex2_updateSV;
}

//////////////////////////////////
////// Ex2 Helper functions //////
//////////////////////////////////
function round(num,places) {
	return(Math.round(num * (10**places))/(10**places));
}

const powerSet = Arr => Arr.reduce((subsets, value) => 
	subsets.concat(subsets.map(set => [value,...set])),[[]]);

function ex2_updateSV() {
	/** 
	* @desc Update the shapley value HTML elements
	* @author Hugh Chen hugh.chen1@gmail.com
	**/
	// Update paired element
	if (this.paired_out) this.paired_out.value = this.value;

	//// Load the covariance matrix ////
	// Initialize
	var cov = [];
	for (var i=0; i<4; i++) cov[i] = new Array(4);

	// Load values from inputs
	for (var i=0; i<4; i++)
		for (var j=0; j<4; j++)
			cov[i][j] = Number(document.getElementById("ex2_cor"+(i+1)+(j+1)).value);

	//// Load explicand and beta ////
	var x = new Array(4);
	var b = new Array(4);
	for (var i=0; i<4; i++) {
	    x[i] = Number(document.getElementById("ex2_x"+(i+1)).value);
	    b[i] = Number(document.getElementById("ex2_b"+(i+1)).value);
	}

	//// Update CE phi ////
	CE_phi = CE_SV(x, b, cov);
	for (var i=0; i<4; i++)
	    document.getElementById("ex2_CE_phi"+(i+1)).innerHTML = round(CE_phi[i],4);

	//// Update ICE phi ////
	ICE_phi = ICE_SV(x, b);
	for (var i=0; i<4; i++)
	    document.getElementById("ex2_ICE_phi"+(i+1)).innerHTML = round(ICE_phi[i],4);

}

function matSub(mat, xind, yind) {
	/** 
	* @desc Index into matrix with lists for xind and yind
	**/
	var mat2 = new Array();
	for (var i = 0; i < xind.length; i++) {
		mat2.push(mat[xind[i]]);
	}

	var mat3 = new Array();
	for (var i = 0; i < mat2.length; i++) {
		var row = new Array();
		for (var j = 0; j < yind.length; j++) {
			row.push(mat[xind[i]][yind[j]]);
		}
		mat3.push(row);
	}

	return(mat3);
}

function matMul(m1, m2) {
	/** 
	* @desc Multiply matrices
	**/
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function get_hybrid(x, S, cov) {
	/** 
	* @desc Get hybrid sample based on conditional expectation
	* from the covariance cov and the set S
	**/
	if (S.length == 0) {
		return([0.0,0.0,0.0,0.0]);
	} else if (S.length == 4) {
		return(x);
	} else {
		S_inv = new Array();
		for (var j=0; j<4; j++)
			if (!S.includes(j))
				S_inv.push(j);

		var x_S = new Array();
		for (var j=0; j<S.length; j++)
			x_S.push([x[S[j]]]);

		// Estimate conditional expectation
		var cov22 = matSub(cov,S,S);
		var cov12 = matSub(cov,S_inv,S);
		mu_new = matMul(matMul(cov12,math.inv(cov22)), x_S);

		// Form hybrid x_h
		var x_h = new Array();
		for (var j=0; j<x.length; j++)
			x_h[j] = x[j];
		for (var j=0; j<S_inv.length; j++)
			x_h[S_inv[j]] = mu_new[j][0];
		return(x_h);
	}
}

// Linear function
function f(x, b) {
	/** 
	* @desc Linear function
	**/
	var y = 0;
	for (var i=0; i<4; i++)
		y += x[i]*b[i];
	return(y);
}

function CE_SV(x, b, cov) {
	/** 
	* @desc Conditional expectation shapley values.
	* Assuming linear model f and multivariate normal
	* distribution.
	**/
	set_lst = powerSet([0,1,2,3]);
	phi  = [0,0,0,0];
	fact = [1,1,2,6,24];

	for (var i=0; i<set_lst.length; i++) {
		S = set_lst[i];
		S.sort();
		var x_h = get_hybrid(x, S, cov);

		// Get the weighting terms
		if (S.length != x.length)
			W_neg = fact[S.length]*fact[x.length-S.length-1]/fact[x.length];
		if (S.length != 0)
			W_pos = fact[S.length-1]*fact[x.length-(S.length-1)-1]/fact[x.length];

		for (var j = 0; j < x.length; j++) {
			if (S.includes(j))
				phi[j] += W_pos * f(x_h, b);
			else
				phi[j] -= W_neg * f(x_h, b);
		}
	}
	return(phi);
}

function ICE_SV(x, b) {
	/** 
	* @desc Interventional conditional expectation shapley 
	* values.  Assuming linear model f.
	**/
	var phi = new Array(4);
	for (var i=0; i<4; i++)
		phi[i] = x[i]*b[i];
	return(phi);
}