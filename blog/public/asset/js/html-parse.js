/* Block Class */
function Block(selector, debug = false){
	this.selector = document.querySelector(selector);
	this.template_selector = '';
	this.is_template = false;
	this.templateHTML = '';
	this.layout = this.selector.innerHTML;
	this.parseHTML = '';
	this.parseTMPL = '';
	this.var = {};
	this.varTMPL = {};
	this.hooks = [];
	this.debug = debug;
	if(debug){
		console.log('Block debug mode : ON');
		console.log('If Template has been assigned then template related details will be displayed.');
	}
}

/*Function.prototype.construct = function(selector, debug = false) {
  	this.selector = document.querySelector(selector);
	this.layout = this.selector.innerHTML;
	this.parseHTML = '';
	this.var = {};
	this.debug = debug;
	if(debug){
		console.log('Block debug mode : ON');
	}
};*/

Block.prototype.assign = function(key = '', val = ''){
	_assign(this, key, val);
}

Block.prototype.assignAll = function(arr = []){
	for (var key in arr) {
		if (arr.hasOwnProperty(key)) {
			_assign(this, key, arr[key]);
		}
	}
}

Block.prototype.parse = function(buffer = false){
	_parse(this);
	if(buffer){
		return (!this.is_template)?this.parseHTML:this.parseTMPL;
	} else {
		_render(this);
	}
}

Block.prototype.dump = function(){
	console.log('Block debug instance :------------------------------------->');
	var output = '';
	for (var property in this) {
	  output += property + ': ' + this[property]+'; ';
	}
	console.log(output);
	if(this.is_template){
		console.log('Template debug html :----------------------------------->');
		console.log(this.parse(true));
	} else {
		console.log('Block debug html :----------------------------------->');
		console.log(this.parse(true));
	}
}

Block.prototype.render = function(buffer = false, callbackFunc = false){
	if(!buffer){
		_parse(this);
		_render(this, callbackFunc);
		_clear(this);
	} else {
		return this.parse(true);
	}
}

Block.prototype.template = function(selector){
	_template(this, selector);
}

Block.prototype.append = function(val = [], callbackFunc = false, needToClear = true){
	this.assignAll(val);
	_parse(this);
	_render(this);
	if(needToClear) _clear(this);
	if(typeof callbackFunc === 'function') callbackFunc.apply({});
}

Block.prototype.cycle = function(arr = [], callbackFunc = false){
	for (var key in arr) {
		if (arr.hasOwnProperty(key)) {
			var val = JSON.parse(arr[key]);
			_call_hook(this, 'before-append-in-cycle', val);
			this.append(val, false, false);
			for (var k in val) {
				if (val.hasOwnProperty(k)) {
					_clear(this, k);
				}
			}
		}
	}
	_clear(this);
	if(typeof callbackFunc === 'function') callbackFunc.apply({});
}

Block.prototype.hook_reg = function(hookObj = {}){
	_hooks(this, hookObj);
}

/* Abstructions */
function _hooks(instance, hook = {}){
	instance.hooks.push(hook);
}

function _call_hook(instance, key, val){
	for (var i=0; i < instance.hooks.length; i++) {
		var hook = instance.hooks[i];
		if(hook.hasOwnProperty(key)){ 
			if(typeof hook[key] === 'function'){
				hook[key].apply({}, [val]);
			}
		}
	}
}

function _clear(instance, key = false){
	if(!instance.is_template){
		if (instance.hasOwnProperty(key)) {
			delete instance[key];
		} else {
			instance.parseHTML = '';
			instance.var = {};
		}
	} else {
		if (instance.hasOwnProperty(key)) {
			delete instance[key];
		} else {
			instance.is_template = false;
			instance.template_selector = '';
			instance.parseTMPL = '';
			instance.varTMPL = {};
			instance.templateHTML = '';
		}
	}
}

function _assign(instance, key, val){
	if(!instance.is_template){
		instance.var[key.trim()] = val.trim();
	} else {
		instance.varTMPL[key.trim()] = val.trim();
	}
	
	if(instance.debug){
		var type = (!instance.is_template)?'Block':'Template';
		var data = (!instance.is_template)?instance.var:instance.varTMPL;
		console.log(`${type} assign values :------------------------------>`);
		console.log(data);
	}
}

function _parse(instance){
	if(!instance.is_template){
		instance.parseHTML = instance.layout;
	} else {
		instance.parseTMPL = instance.templateHTML;
	}
	
	if(instance.debug) {
		var type = (!instance.is_template)?'Block':'Template';
		console.log(`${type} parsing values :----------------------------->`);
	}
	var data = (!instance.is_template)?instance.var:instance.varTMPL;
	for(var key in data){
		if(instance.debug){
			console.log('pair : '+key+' => '+data[key]);
		}
		if(!instance.is_template){
			instance.parseHTML = instance.parseHTML.replace('('+key+')', data[key]);
		} else {
			instance.parseTMPL = instance.parseTMPL.replace('('+key+')', data[key]);
		}
	}
}

function _render(instance, callbackFunc = false){
	if(instance.debug){
		if(!instance.is_template) {
			console.log('Block parse html :------------------------------------------------>');
			console.log(instance.parseHTML);
		} else {
			console.log('Template parse html :------------------------------------------------>');
			console.log(instance.parseTMPL);
		}
	}
	if(!instance.is_template) instance.selector.innerHTML = instance.parseHTML;
	else {
		var html = instance.selector.innerHTML;
		html += instance.parseTMPL;
		instance.selector.innerHTML = html;
	}
	if(typeof callbackFunc === 'function') callbackFunc.apply({});
}

function _template(instance, selector){
	instance.is_template = true;
	instance.template_selector = document.querySelector(selector);
	instance.templateHTML = instance.template_selector.innerHTML.trim();
}