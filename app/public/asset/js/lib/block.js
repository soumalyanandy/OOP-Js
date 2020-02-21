/* Block Class */
import {_l,_e,_w,_i} from './console';
export function Block(id, classes = [], debug = false){
	var BLOCK_SCOPE = this;
	/* create block if not exists */ 
	if(document.querySelector(id) == null){ 
		var element = document.createElement('DIV');
		element.id = id.replace("#","");
		element.className = classes.join(" ");
		/* search for hidden attribute _appView */
		BLOCK_SCOPE.ele_found = false;
		document.querySelectorAll("*").toArray().forEach(function(ele, i){
			if(ele.hasAttribute("_appView") && !BLOCK_SCOPE.ele_found){
				BLOCK_SCOPE.selector = ele.appendChild(element);
				BLOCK_SCOPE.ele_found = true;
			}
		});
	} else {
		BLOCK_SCOPE.selector = document.querySelector(id);
	}
	
	BLOCK_SCOPE.template_selector = '';
	BLOCK_SCOPE.is_template = false;
	BLOCK_SCOPE.is_append = true;
	BLOCK_SCOPE.templateHTML = '';
	BLOCK_SCOPE.layout = BLOCK_SCOPE.selector.innerHTML;
	BLOCK_SCOPE.parseHTML = '';
	BLOCK_SCOPE.parseTMPL = '';
	BLOCK_SCOPE.var = {};
	BLOCK_SCOPE.varTMPL = {};
	BLOCK_SCOPE.hooks = Array(); // [] => Array.prototype
	BLOCK_SCOPE.debug = debug;
	if(debug){
		_l('Block debug mode : ON');
		_l('If Template has been assigned then template related details will be displayed.');
	}


	/*Function.prototype.construct = function(selector, debug = false) {
		BLOCK_SCOPE.selector = document.querySelector(selector);
		BLOCK_SCOPE.layout = BLOCK_SCOPE.selector.innerHTML;
		BLOCK_SCOPE.parseHTML = '';
		BLOCK_SCOPE.var = {};
		BLOCK_SCOPE.debug = debug;
		if(debug){
			_l('Block debug mode : ON');
		}
	};*/

	Block.prototype.empty = function(){
		BLOCK_SCOPE.selector.innerHTML = "";
	}

	Block.prototype.assign = function(key = '', val = ''){
		_assign(this, key, val);
	}

	Block.prototype.assignAll = function(arr = Array()){
		for (var key in arr) {
			if (arr.hasOwnProperty(key)) {
				_assign(this, key, arr[key]);
			}
		}
	}

	Block.prototype.parse = function(buffer = false){
		_parse(this);
		if(buffer){
			return (!BLOCK_SCOPE.is_template)?BLOCK_SCOPE.parseHTML:BLOCK_SCOPE.parseTMPL;
		} else {
			_render(this);
		}
	}

	Block.prototype.dump = function(){
		_l('Block debug instance :------------------------------------->');
		var output = '';
		for (var property in this) {
		output += property + ': ' + this[property]+'; ';
		}
		_l(output);
		if(BLOCK_SCOPE.is_template){
			_l('Template debug html :----------------------------------->');
			_l(BLOCK_SCOPE.parse(true));
		} else {
			_l('Block debug html :----------------------------------->');
			_l(BLOCK_SCOPE.parse(true));
		}
	}

	Block.prototype.render = function(buffer = false, callbackFunc = false){
		if(!buffer){
			_parse(this);
			_render(this, callbackFunc);
			_clear(this);
		} else {
			return BLOCK_SCOPE.parse(true);
		}
	}

	Block.prototype.template = function(selector){
		_template(this, selector);
	}

	Block.prototype.templateRaw = function(html){
		_templateRaw(this, html);
	}
	
	Block.prototype.append = function(val = Array(), callbackFunc = false, needToClear = true){
		_set_position(this, 'append');
		BLOCK_SCOPE.assignAll(val); 
		_parse(this); 
		_render(this); 
		if(needToClear) _clear(this); 
		if(typeof callbackFunc === 'function') callbackFunc.apply({},[BLOCK_SCOPE.selector]);
	}

	Block.prototype.prepend = function(val = Array(), callbackFunc = false, needToClear = true){
		_set_position(this, 'prepend');
		BLOCK_SCOPE.assignAll(val);
		_parse(this);
		_render(this);
		if(needToClear) _clear(this);
		if(typeof callbackFunc === 'function') callbackFunc.apply({},[BLOCK_SCOPE.selector]);
	}

	Block.prototype.cycle = function(arr = Array(), callbackFunc = false){ 
		for (var key in arr) { 
			if (arr.hasOwnProperty(key)) {  
				var val = (typeof arr[key] !== "object")?JSON.parse(arr[key]):arr[key];
				val["_key"] = key;
				_call_hook(this, 'before-append-in-cycle', val);
				BLOCK_SCOPE.append(val, false, false);
				for (var k in val) {
					if (val.hasOwnProperty(k)) {
						_clear(this, k);
					}
				}
			}
		}
		_clear(this);
		_call_hook(this, 'after-cycle-before-callback'); //middleware
		if(typeof callbackFunc === 'function') callbackFunc.apply({},[BLOCK_SCOPE.selector]);
	}

	Block.prototype.hook_reg = function(hookObj = {}){
		_hooks(this, hookObj);
	}
}

/* Abstructions */
function _hooks(instance, hook = {}){
	instance.hooks.push(hook);
}

function _call_hook(instance, key, val = ''){
	for (var i=0; i < instance.hooks.length; i++) {
		var hook = instance.hooks[i];
		if(hook.hasOwnProperty(key)){ 
			if(typeof hook[key] === 'function'){
				//_l(key+" hook called from Block.js");
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
		if (instance.varTMPL.hasOwnProperty(key)) {
			delete instance.varTMPL[key];
		} else {
			instance.is_template = false;
			instance.template_selector = '';
			instance.parseTMPL = '';
			instance.varTMPL = {};
			instance.templateHTML = '';
			instance.is_append = true;
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
		_l(`${type} assign values :------------------------------>`);
		_l(data);
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
		_l(`${type} parsing values :----------------------------->`);
	}
	var data = (!instance.is_template)?instance.var:instance.varTMPL;
	for(var key in data){
		if(instance.debug){
			_l('pair : '+key+' => '+data[key]);
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
			_l('Block parse html :------------------------------------------------>');
			_l(instance.parseHTML);
		} else {
			_l('Template parse html :------------------------------------------------>');
			_l(instance.parseTMPL);
		}
	} 
	if(!instance.is_template) instance.selector.innerHTML = instance.parseHTML;
	else { 
		if(instance.is_append){
			var html = instance.selector.innerHTML;
			html += instance.parseTMPL; 
			//instance.selector.append(instance.parseTMPL);
		} else {
			var html = instance.parseTMPL;
			html += instance.selector.innerHTML; 
			//instance.selector.prepend(instance.parseTMPL);
		}
		//_l(html);
		instance.selector.innerHTML = html;
	}
	_call_hook(instance, 'after-render-before-callback'); //middleware
	if(typeof callbackFunc === 'function') callbackFunc.apply({});
}

function _template(instance, selector){ 
	instance.is_template = true;
	instance.template_selector = document.querySelector(selector);
	instance.templateHTML = instance.template_selector.innerHTML.trim();
}

function _templateRaw(instance, html){ 
	instance.is_template = true;
	instance.templateHTML = html;
}

function _set_position(instance, type){
	instance.is_append = (type === 'append')?true:false;
}
