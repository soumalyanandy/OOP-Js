/* Form Validation Class */ 
export function FromValidation(selector, debug = false){
	this.selector = document.querySelector(selector);
	this.formSubmitData = {};
	this.validation_error = false;
	this.debug = debug;
	if(this.debug){
		_l('FromValidation debug mode : ON');
	}


FromValidation.prototype.formData = function(dataObj = {}){
	_setFromData(this, dataObj);
}

FromValidation.prototype.getFormData = function(callbackFunc = false){
	_getFormData(this, callbackFunc);
}

FromValidation.prototype.block = function(blockObj = {}){
	_setFormBlock(this,blockObj);
}

FromValidation.prototype.run = function(callbackFunc = false){
	_validate(this, callbackFunc);
}

FromValidation.prototype.setRules = function(ruleArr = []){
	_setRules(this, ruleArr);
}

FromValidation.prototype.setErrorMessages = function(errorMsgObj = {}){
	_errorMessages(this, errorMsgObj);
}

FromValidation.prototype.dump = function(){
	_l('FromValidation debug object :------------------------------------->');
	var output = '';
	for (var property in this) {
	  output += property + ': ' + this[property]+'; ';
	}
	_l(output);
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
	obj.rules = [];
}

function _validate(obj, callbackFunc = false){ 
	for(var key in obj.formSubmitData){
		if(!obj.validation_error && obj.rules.indexOf('required') !== -1 && obj.formSubmitData[key] == ""){ 
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
		}*/ else {}
	}
	if(typeof callbackFunc === 'function') callbackFunc.apply({}, [obj.validation_error, obj.block, obj.formSubmitData, obj.selector]);
}

function _l(txt){
    console.log(txt);
}

function _e(txt){
    console.error(txt);
}
}