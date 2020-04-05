/* Form Validation Class */ 
import {_l,_e,_w,_i} from './console';
export function Validation(selector, debug = false){
	this.selector = document.querySelector(selector);
	this.formSubmitData = {};
	this.validation_error = false;
	this.ignoreFieldCheck = '#valid';
	this.debug = debug;
	if(this.debug){
		_l('Validation debug mode : ON');
	}

	Validation.prototype.formData = function(dataObj = {}){
		_setFromData(this, dataObj);
	}

	Validation.prototype.getFormData = function(callbackFunc = false){
		_getFormData(this, callbackFunc);
	}

	Validation.prototype.block = function(blockObj = {}){
		_setFormBlock(this,blockObj);
	}

	Validation.prototype.run = function(callbackFunc = false){
		_validate(this, callbackFunc);
	}

	Validation.prototype.setRules = function(ruleArr = Array()){
		_setRules(this, ruleArr);
	}

	Validation.prototype.setErrorMessages = function(errorMsgObj = {}){
		_errorMessages(this, errorMsgObj);
	}

	Validation.prototype.dump = function(){
		_l('Validation debug object :------------------------------------->');
		var output = '';
		for (var property in this) {
		output += property + ': ' + this[property]+'; ';
		}
		_l(output);
	}
}

/* Abstruction */
function _setFromData(obj, dataObj){
	for(var key in dataObj){
		if(obj.debug) _l('form data pair : '+key+' => '+dataObj[key].trim());
		obj.formSubmitData[key] = dataObj[key].trim();
	}
}

function _getFormData(obj, callbackFunc = false){
	if(typeof callbackFunc === 'function') callbackFunc.apply({}, [obj.formSubmitData, obj.selector]);
}

function _setFormBlock(obj, block){
	obj.block = block;
}

function _setRules(obj, rules){
	obj.rules = rules;
}

function _errorMessages(obj, errorMsgObj){
	if(obj.debug) {
		_l('form error messages :--------------------------------------->');
		_l(errorMsgObj);
	}
	obj.errorMessages = errorMsgObj;
}

function _clear(obj){
	obj.errorMessages = {};
	obj.block = '';
	obj.rules = Array();
}

function _validate(obj, callbackFunc = false){ 
	var key='', val='';
	for(var key in obj.formSubmitData){
		if(key.indexOf(obj.ignoreFieldCheck) === -1 && !obj.validation_error && obj.rules.indexOf('required') !== -1 && obj.formSubmitData[key] == ""){ 
			obj.validation_error = true;
			obj.block.assign('form-alert-msg',obj.errorMessages[key]['required']);
		} /*else if(obj.formSubmitData['category'] == ""){
			obj.validation_error = true;
			obj.block.assign('form-alert-msg',obj.errorMessages['title']['required']);
		} else if(obj.formSubmitData['file'] == ""){
			obj.validation_error = true;
			obj.block.assign('form-alert-msg',obj.errorMessages['title']['required']);
		} else if(obj.formSubmitData['desc'] == ""){
			obj.validation_error = true;
			obj.block.assign('form-alert-msg',obj.errorMessages['title']['required']);
		}*/ else {
			val = obj.formSubmitData[key];
			delete obj.formSubmitData[key];
			key = key.replace(obj.ignoreFieldCheck,'');
			obj.formSubmitData[key] = val;
		}
	}
	if(typeof callbackFunc === 'function') callbackFunc.apply({}, [obj.validation_error, obj.block, obj.formSubmitData, obj.selector]);
}
