/* Block Class */
import {_l,_e,_w,_i} from './console';
import { Hook } from './hook';
import {File} from './file';

/*
	Rules to follow : 
	1. Block ID should be unique through out the page.
	2. If call empty() method after element selection then the document state get changed and new html generated so old element object will not work.
	3. If call render() method then use callBack function to get the current block object and by that we can select element under it and process.
*/

export function Block(id, classes = [], debug = false){
	//var BLOCK_SCOPE = this;
	/* create block if not exists */ 
	if(document.querySelector(id) == null){ 
		var element = document.createElement('DIV');
		element.id = id.replace("#","");
		element.className = classes.join(" ");

		/* search for hidden attribute _appView */
		this.selector = document.querySelector("DIV[_appView]").appendChild(element);
	} else {
		this.selector = document.querySelector(id);
	}
	
	this.template_selector = '';
	this.is_template = false;
	this.is_append = true;
	this.templateHTML = '';
	this.layout = this.selector.innerHTML;
	this.parseHTML = '';
	this.parseTMPL = '';
	this.var = {};
	this.varTMPL = {};
	this.hooks = Array(); // [] => Array.prototype
	this.debug = debug;
	if(debug){
		_l('Block debug mode : ON');
		_l('If Template has been assigned then template related details will be displayed.');
	}


	/*Function.prototype.construct = function(selector, debug = false) {
		this.selector = document.querySelector(selector);
		this.layout = this.selector.innerHTML;
		this.parseHTML = '';
		this.var = {};
		this.debug = debug;
		if(debug){
			_l('Block debug mode : ON');
		}
	};*/

	Block.prototype.appView = function(){
		/* search for hidden attribute _appView */
		return document.querySelector("DIV[_appView]").innerHTML;
	}

	Block.prototype.empty = function(){
		this.selector.innerHTML = "";
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
			return (!this.is_template)?this.parseHTML:this.parseTMPL;
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
		if(this.is_template){
			_l('Template debug html :----------------------------------->');
			_l(this.parse(true));
		} else {
			_l('Block debug html :----------------------------------->');
			_l(this.parse(true));
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

	Block.prototype.hasTemplate = function(bool){
		_setTemplate(this, bool);
	}

	Block.prototype.template = function(selector){
		_template(this, selector);
	}

	Block.prototype.templateRaw = function(html){
		_templateRaw(this, html);
	}
	
	Block.prototype.append = function(val = Array(), callbackFunc = false, needToClear = true, buffer = false){
		_set_position(this, 'append');
		this.assignAll(val); 
		_parse(this); 
		_render(this, false, buffer); 
		if(needToClear) _clear(this); 
		if(typeof callbackFunc === 'function') callbackFunc.apply({},[this.selector]);
	}

	Block.prototype.prepend = function(val = Array(), callbackFunc = false, needToClear = true, buffer = false){
		_set_position(this, 'prepend');
		this.assignAll(val);
		_parse(this);
		_render(this, false, buffer);
		if(needToClear) _clear(this);
		if(typeof callbackFunc === 'function') callbackFunc.apply({},[this.selector]);
	}

	Block.prototype.cycle = function(arr = Array(), callbackFunc = false){ 
		for (var key in arr) { 
			if (arr.hasOwnProperty(key)) {  
				var val = (typeof arr[key] !== "object")?JSON.parse(arr[key]):arr[key];
				val["_key"] = key;
				_call_hook(this, 'before-append-in-cycle', val);
				this.append(val, false, false, false);
				for (var k in val) {
					if (val.hasOwnProperty(k)) {
						_clear(this, k);
					}
				}
			}
		}
		_render(this, false, true);
		_clear(this);
		_call_hook(this, 'after-cycle-before-callback'); //middleware
		if(typeof callbackFunc === 'function') callbackFunc.apply({},[this.selector]);
	}

	Block.prototype.hook_reg = function(hookObj = {}){
		_hooks(this, hookObj);
	}
}

/* Abstructions */
//var hook_instance = false;
function _hooks(instance, hook = {}){
	//if(!hook_instance) hook_instance = new Hook(true);
	Hook.register("BLOCK", hook);
}

function _call_hook(instance, key, val = ''){
	//if(!hook_instance) hook_instance = new Hook(true);
	return Hook.call("BLOCK", key, val);
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
			//_l('pair : '+key+' => '+data[key]);
			instance.parseTMPL = instance.parseTMPL.replace('('+key+')', data[key]);
			//_l(instance.parseTMPL);
		}
	}
}

function _render(instance, callbackFunc = false, buffer = false){ 
	if(instance.debug){
		if(!instance.is_template) {
			_l('Block parse html :------------------------------------------------>');
			_l(instance.parseHTML);
		} else {
			_l('Template parse html :------------------------------------------------>');
			_l(instance.parseTMPL);
		}
	} 
	//setTimeout(function(){
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
			if(!buffer) instance.selector.innerHTML = html;
		}
	//},500,instance,buffer);
	_call_hook(instance, 'after-render-before-callback'); //middleware
	if(typeof callbackFunc === 'function') callbackFunc.apply({}, [instance.selector]);
}

function _setTemplate(instance, bool){
	instance.is_template = bool;
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
