const system = window;
const doc = window.document;

const EVENTS = {
	'READYSTATE' : 'readystatechange',
	'MODIFY' : 'DOMSubtreeModified',
	'CHANGE' : 'change'
}

function JS(selector, parent = null){
	//console.log("selector : "+selector);
	var Element = new Ele();
	if(parent == null){
		Element.set(selector);
	} else {
		Element.set(parent);
		console.log('parent elements ');
		console.log(Element.elements);
		if(Object.keys(Element.elements).length > 0){ console.log('if');
			/*parent.forEach(function(el){
				new Ele(selector, el);
			});*/
			Element.set(selector, parent.elements);
		} else { console.log('else');
			Element.set(selector);
		}
	}
	return Element;
}

/* singletons! */
var Ele;
var _ELEMENTS = {};
var SELECTORS = {};
(function() {
	var instance;
	Ele = function Ele(){
		if (instance) {
	      	return instance;
	    }
		instance = this;
		
		// takes all those node-list items and dumps them in an array
		//this.selectorArr = [...document.querySelectorAll('.dom-items')];
		return instance;
	} 

	Ele.prototype.set = function(selector, parent = null){
		console.log("parent");
		console.log(parent);
		console.log("selector");
		console.log(selector);
		//node-list
		this.closests = parent == null?[doc]:parent;
		console.log("closests");
		console.log(this.closests);
		
		if(this.closests && selector != null){
			//this.closests.forEach(function(el){
				console.log(this.closests.length);
			for(var i=0; i<this.closests.length; i++){	
				console.log("selector");
				console.log(selector);
				console.log('loop closest');
				var el = this.closests[i];
				console.log(el);
				if(el === doc){
					//console.log(Array.prototype.slice.call((el).querySelectorAll(selector)));
					_ELEMENTS['doc'] = [];
					_ELEMENTS['doc'][i] = Array.prototype.slice.call((el).querySelectorAll(selector))[0];
					console.log(_ELEMENTS['doc']);
				} else {
					_ELEMENTS[el.tagName+"#"+el.id] = [];
					_ELEMENTS[el.tagName+"#"+el.id][i] = Array.prototype.slice.call((el).querySelectorAll(selector));
				}
			}
			//});
			console.log("now");







			/*
				can not able to save element objects with respect to parent in nested format.
			*/
			console.log(_ELEMENTS['doc']);
			console.log(_ELEMENTS);
			/*
				the above two line shows different values for same key 
				... CAN NOT ABLE TO UNDERSTAND WHY
			*/








		} else if(selector != null){
			console.log("query elseif");
			console.log((el).querySelectorAll(selector));
			_ELEMENTS['doc'] = Array.prototype.slice.call((this.closests).querySelectorAll(selector));
		} else {
			//_ELEMENTS = null;
		}

		this.elements = _ELEMENTS;
		console.log('element array');
		console.log(this.elements);
		
		/*var PARENTS = [];
		this.closests.forEach(function(el){
			console.log("element");
			console.log(el.tagName+"#"+el.id);
			PARENTS.push(el.tagName+"#"+el.id);
		});
		this.parents = PARENTS;*/

		
		for (var key in this.elements) {
		    if (this.elements.hasOwnProperty(key)) {
		    	//console.log(this.elements[key]);
		    	this.elements[key].forEach(function(el,i){
		    		SELECTORS[key] = {};
		    		SELECTORS[key][i] = el.tagName+"#"+el.id;
		    	});
		        //console.log(key + " -> " + this.elements[key]);
		        //SELECTORS[key] = key;
		    }
		}
		/*this.elements.forEach(function(el, idx){
			//console.log("element");
			//console.log(el.tagName+"#"+el.id);
			if(idx.indexOf("#") == -1){
				SELECTORS.push(idx);
			} else {
				SELECTORS.push(el.tagName+"#"+el.id);
			}
		});*/
		this.selectors = SELECTORS;
		console.log("Selector array : ");
		console.log(this.selectors);
	}

	Ele.prototype.getE = function(){
		return this.elements.length > 1?this.elements[0]:false;
	}

	Ele.prototype.getAllE = function(){
		return this.elements.length > 1?this.elements:false;
	}

	Ele.prototype.dynamic = function(){
		var args = arguments;
		//console.log(args);
		if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
			throw new Error('Invalid callback in html-elelemt.js on line no. 40!');
		}
		var event = (typeof args[0] === 'function')?null:args[0];
		var callback = (typeof args[0] === 'function')?args[0]:args[1];
		//console.log("event : "+event);
		//console.log("closest : "+this.closest);
		var SELECTORS = this.selectors;
		var ELEMENTS = this.elements;

		if(this.parents){
			/*this.elements.forEach(function(el, i){
				el.addEventListener((EVENTS.MODIFY || event),function(e){
					callback.apply({},[e, SELECTORS[i], el]);
				});
			});

			this.parents.forEach(function(closestEl){
				var selectedEle = new Ele(closestEl);
				selectedEle.addEventListener(EVENTS.MODIFY,function(e){
					SELECTORS.forEach(function(currentEl, index){
						var eleExists = new Ele(currentEl,closestEl);
						eleExists.forEach(function(el, i){
							el.addEventListener((EVENTS.MODIFY || event),function(e){
								callback.apply({},[e, this.selectors[i], el]);
							});
						});
					});
				});
			});*/

		} else {
			for (var key in this.elements) {
			    if (this.elements.hasOwnProperty(key)) {
			    	this.elements[key].forEach(function(el, i){
			    		el.addEventListener((EVENTS.MODIFY || event),function(e){
							callback.apply({},[e, SELECTORS[key][i], el]);
						});
			    	});
			    }
			}
			/*this.elements.forEach(function(el, i){
				el.addEventListener((EVENTS.MODIFY || event),function(e){
					callback.apply({},[e, SELECTORS[i], el]);
				});
			});*/
		}
	}
})();




/*
NodeList.prototype.toArray = function() { 
  return Array.prototype.slice.call(this);
}

// So you could call
document.querySelectorAll('div').toArray().forEach(function (el) {
  el.style.color = 'pink';
})

function $$(sel, con) {
  return Array.prototype.slice.call((con||document).querySelectorAll(sel));
}
*/

/*var User;
(function() {
  var instance;
User = function User() {
    if (instance) {
      return instance;
    }
instance = this;
// all the functionality
    this.firstName = 'John';
    this.lastName = 'Doe';
return instance;
  };
}());*/