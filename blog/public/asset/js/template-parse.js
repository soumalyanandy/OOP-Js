/* Template object */
function Template(selector, debug = false){
	this.selector = document.querySelector(selector);
	this.layout = this.selector.innerHTML;
	this.parseHTML = '';
	this.var = {};
	this.debug = debug;
	if(debug){
		console.log('Template debug mode : ON');
	}
}

/*Function.prototype.construct = function(selector, debug = false) {
  	this.selector = document.querySelector(selector);
	this.layout = this.selector.innerHTML;
	this.parseHTML = '';
	this.var = {};
	this.debug = debug;
	if(debug){
		console.log('Template debug mode : ON');
	}
};*/

Template.prototype.assign = function(key = '', val = ''){
	_assign(this, key, val);
}

Template.prototype.parse = function(buffer = false){
	_parse(this);
	if(buffer){
		return this.parseHTML;
	} else {
		_render(this);
	}
}

Template.prototype.debug = function(){
	console.log('Template debug object :------------------------------------->');
	var output = '';
	for (var property in this) {
	  output += property + ': ' + this[property]+'; ';
	}
	console.log(output);
	console.log('Template debug html :----------------------------------->');
	console.log(this.parse(true));
}

Template.prototype.render = function(buffer = false){
	if(!buffer){
		_parse(this);
		_render(this)
		_clear(this);
	} else {
		return this.parse(true);
	}
}

/* Abstructions */
function _clear(obj){
	obj.parseHTML = '';
	obj.var = {};
}

function _assign(obj, key, val){
	obj.var[key.trim()] = val.trim();
	if(obj.debug){
		console.log('Template assign values :------------------------------>');
		console.log(obj.var);
	}
}

function _parse(obj){
	obj.parseHTML = obj.layout;
	if(obj.debug) console.log('Template parsing values :----------------------------->');
	for(var key in obj.var){
		if(obj.debug){
			console.log('pair : '+key+' => '+obj.var[key]);
		}
		obj.parseHTML = obj.parseHTML.replace('('+key+')', obj.var[key]);
	}
}

function _render(obj){
	if(obj.debug){
		console.log('Template parse html :------------------------------------------------>');
		console.log(obj.parseHTML);
	}
	obj.selector.innerHTML = obj.parseHTML;
}