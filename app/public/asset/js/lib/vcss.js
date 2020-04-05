/* Variable to CSS Generator file */
/*
Usage : 
var vcss = new vCSS(`
	p0{
		padding : 0;
	}
	body{
		margin : 0;
		_p0; // this variable will execute at run time and generate 'padding : 0;'.
	}
`);
Generate css tag : 
vcss.stylize(); // will generate css tag and append it and the end of HEAD tag of HTML.
*/

import {_l,_e,_w,_i} from './console';
import {Helper} from './helper';

var inst = false;
export function vCSS(css, debug = false){
	if(inst) return inst;
	inst = this;
	this.css = css;
	this.css_bracket_open = '{';
	this.css_bracket_close = '}';
	this.css_deli = '.';
	this.start_deli = '_';
	this.end_deli = ';'; 
	this.target_prop = '';
	this.target_sl = '';
	this.cssARR = [];
	this.cssString = '';
	this.debug = debug;
	this.cssObj = {};

	/* convert to object */
	_convert(this);

	/* foreach selector */
	for(this.target_sl in this.cssObj){
		this.target_prop = this.cssObj[this.target_sl];
		_exe_var(this);
		this.cssARR[this.target_sl] = this.target_prop;
	}

	/* generate css */
	_generate(this);

	vCSS.prototype.getCSS = function(){
		return(this.cssString);
	}

	vCSS.prototype.stylize = function(){
		var timestamp = Helper.timestamp();
		var styleTag = document.createElement('style');
		styleTag.type = 'text/css';
		styleTag.setAttribute('_token', "vcss"+timestamp);
		styleTag.innerHTML = this.getCSS();
		document.head.appendChild(styleTag);
	}

	vCSS.prototype.dump = function(){
		console.log(this.css);
	}
}

/* abstruction */
function _convert(obj){
	var get_pos_bracket_start = obj.css.indexOf(obj.css_bracket_open);
	if(get_pos_bracket_start != -1){
		obj.target_sl = obj.css.substring(0, get_pos_bracket_start).trim();
		var get_pos_bracket_end = obj.css.indexOf(obj.css_bracket_close)+1;
		obj.target_prop = obj.css.substring(get_pos_bracket_start, get_pos_bracket_end).trim().replace('{','').replace('}','');
		var get_var_prop_str = obj.css.substring(0, get_pos_bracket_end);
		obj.css = obj.css.replace(get_var_prop_str,'');
		obj.cssObj[obj.target_sl] = obj.target_prop;
		if(obj.debug){
			console.log('var ->');
			console.log(obj.target_sl);
			console.log('property ->');
			console.log(obj.target_prop);
			console.log('var-property ->');
			console.log(get_var_prop_str);
			console.log('remaining css ->');
			console.log(obj.css);
		}
		_convert(obj);
	}
}

function _exe_var(obj){
	if(obj.debug) console.log(obj.target_prop);
	if(typeof obj.target_prop !== "function"){
		var get_pos_var_start = obj.target_prop.indexOf(obj.start_deli);
	} else {
		get_pos_var_start = -1;
	}
	if(obj.debug) console.log(get_pos_var_start);
	if(get_pos_var_start != -1){
		var get_var_str = obj.target_prop.substring(get_pos_var_start);
		var get_pos_var_end = get_var_str.indexOf(obj.end_deli);
		var get_var = get_var_str.substring(0,get_pos_var_end);
		var var_sl = get_var.replace(obj.start_deli,obj.css_deli);
		obj.target_prop = obj.target_prop.replace(get_var+obj.end_deli, obj.cssObj[var_sl].replace(obj.css_bracket_open,'').replace(obj.css_bracket_close,'').replace('\n','').replace('\r',''));
		_exe_var(obj);
	}
}

function _generate(obj){
	for(obj.target_sl in obj.cssARR){
		obj.target_prop = obj.cssARR[obj.target_sl];
		obj.cssString += obj.target_sl+obj.css_bracket_open+'\n'+obj.target_prop+obj.css_bracket_close+'\n';
	}
}

/*
Reference : Inspired by scss (Simle Awsome CSS).
*/