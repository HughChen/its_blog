var slider_elements = ["s_n","s_a","s_b","s_c","s_ab","s_ac","s_bc","s_abc"];

for (var i = 0; i < slider_elements.length; i++) {
	var s = document.getElementById(slider_elements[i]);
	var s_out = document.getElementById(slider_elements[i]+"_out");
	s_out.innerHTML = s.value;
	s.paired_out = s_out;
	s.oninput = function() {this.paired_out.innerHTML = this.value;}
}

function ex1_set_preset(prefix,letter) {
	letters = ["A", "B", "C", "D"];
	for (var i = 0; i < letters.length; i++) {
		if (letters[i] == letter) {
			document.getElementById(prefix+letters[i]).className = "w3-button w3-teal";
		} else {
			document.getElementById(prefix+letters[i]).className = "w3-button w3-green";
		}
	}
}

function ex1_presetA() {
	ex1_set_preset("ex1_preset","A");
	for (var i = 0; i < slider_elements.length; i++) {
		var s = document.getElementById(slider_elements[i])
		s.value = 0;
		s.oninput();
		s.onchange();
		var text = document.getElementById("ex1_preset_text");
		text.innerHTML = 'No credit.';
	}
}

function ex1_presetB() {
	ex1_set_preset("ex1_preset","B");
	values = [0,1,1,1,2,2,2,3];
	for (var i = 0; i < slider_elements.length; i++) {
		var s = document.getElementById(slider_elements[i])
		s.value = values[i];
		s.oninput();
		s.onchange();
		var text = document.getElementById("ex1_preset_text");
		text.innerHTML = 'All equals.';
	}
}

function ex1_presetC() {
	ex1_set_preset("ex1_preset","C");
	values = [0,5,1,1,6,6,2,7];
	for (var i = 0; i < slider_elements.length; i++) {
		var s = document.getElementById(slider_elements[i])
		s.value = values[i];
		s.oninput();
		s.onchange();
		var text = document.getElementById("ex1_preset_text");
		text.innerHTML = 'Ava the superstar.';
	}
}

function ex1_presetD() {
	ex1_set_preset("ex1_preset","D");
	values = [0,0,1,1,1,1,2,2];
	for (var i = 0; i < slider_elements.length; i++) {
		var s = document.getElementById(slider_elements[i])
		s.value = values[i];
		s.oninput();
		s.onchange();
		var text = document.getElementById("ex1_preset_text");
		text.innerHTML = 'Ava the small potato.';
	}
}

function calcSV() {

	var s_null = document.getElementById("s_n").value
	var s_a = document.getElementById("s_a").value
	var s_b = document.getElementById("s_b").value
	var s_c = document.getElementById("s_c").value
	var s_ab = document.getElementById("s_ab").value
	var s_ac = document.getElementById("s_ac").value
	var s_bc = document.getElementById("s_bc").value
	var s_abc = document.getElementById("s_abc").value

	if (isNaN(s_null) || isNaN(s_a) || isNaN(s_b) || isNaN(s_c) ||
		isNaN(s_ab) || isNaN(s_ac) || isNaN(s_bc) || isNaN(s_abc)) {
		return;
	}

	var phi_a = 1/3*(s_abc-s_bc)+1/6*(s_ab-s_b)+1/6*(s_ac-s_c)+1/3*(s_a-s_null);
	var phi_b = 1/3*(s_abc-s_ac)+1/6*(s_ab-s_a)+1/6*(s_bc-s_c)+1/3*(s_b-s_null);
	var phi_c = 1/3*(s_abc-s_ab)+1/6*(s_ac-s_a)+1/6*(s_bc-s_b)+1/3*(s_c-s_null);

	document.getElementById("phi_a").innerHTML = Math.round(phi_a*100)/100;
	document.getElementById("phi_b").innerHTML = Math.round(phi_b*100)/100;
	document.getElementById("phi_c").innerHTML = Math.round(phi_c*100)/100;
}