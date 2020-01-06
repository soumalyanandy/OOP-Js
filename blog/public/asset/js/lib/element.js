/* Element File */
import {_l,_e,_w,_i} from './console';

/* Constants */
const system = window;
const doc = window.document;
const EVENTS = {
    'LOAD' : 'load',
	'READYSTATE' : 'readystatechange',
	'MODIFY' : 'DOMSubtreeModified',
	'CHANGE' : 'change'
}

/* Wrapper */
export function Element(selector, parent = null){
    var Element = new Ele();
    Element.set(selector, parent);
    return Element;
}

var Ele;
/* singletons! */
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
})();

/* Element Class Properties */
Ele.prototype.set = function(selector, parent = null){
    //parent 
    this.elements = {};
    this.selectors = {};
    this.parent = parent == null?doc:doc.querySelector(parent);
    this.id = null;
    if(this.parent == doc){
        this.id = 'doc'; 
    } else {
        this.id = this.parent.tagName+"#"+this.parent.id;
    }
    this.elements[this.id] = Array.prototype.slice.call((this.parent).querySelectorAll(selector));
    
    var THIS = this;
    for (var key in this.elements) {
        if (this.elements.hasOwnProperty(key)) {
            this.elements[key].forEach(function(el,i){
                THIS.selectors[key] = [];
                THIS.selectors[key].push(el.tagName+"#"+el.id);
            });
        }
    }
}
Ele.prototype.dynamic = function(){
    var args = arguments;
    var SELECTORS = this.selectors;
    try{
	    if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		    throw new Error('Invalid callback in element.js on line no. 69!');
        }

        var event = (typeof args[0] === 'function')?null:args[0].toUpperCase();
        var callback = (typeof args[0] === 'function')?args[0]:args[1];
        for (var key in this.elements) {
            if (this.elements.hasOwnProperty(key)) {
                this.elements[key].forEach(function(el, i){
                    _l("Event : "+(EVENTS[event] || EVENTS.MODIFY));
                    el.addEventListener((EVENTS[event] || EVENTS.MODIFY),function(e){
                        callback.apply({},[e, SELECTORS[key][i], el]);
                    });
                });
            }
        }
    } catch(err){
        _e(err);
    }
}

Ele.prototype.on = function(){
    var args = arguments;
    var SELECTORS = this.selectors;
    var PARENT = this.parent;
    try{
        if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		    throw new Error('Invalid callback in element.js on line no. 93!');
        }

        var event = (typeof args[0] === 'function')?null:args[0].toUpperCase();
        var callback = (typeof args[0] === 'function')?args[0]:args[1];
        for (var key in this.elements) {
            if (this.elements.hasOwnProperty(key)) {
                (this.elements[key]).forEach(function(el, i){
                    (PARENT).addEventListener(EVENTS.MODIFY, function(ev){
                        var qs = (PARENT).querySelectorAll(SELECTORS[key][i]);
                        for (const ele of qs) {
                            ele.addEventListener((EVENTS[event] || EVENTS.MODIFY), function(e) {
                                _l("Event : "+(EVENTS[event] || EVENTS.MODIFY));
                                callback.apply({},[e, SELECTORS[key][i], ele, ev.target]);
                            });
                        }
                        /* (PARENT).querySelector(SELECTORS[key][i]).addEventListener((EVENTS[event] || EVENTS.MODIFY), function(e){
                            _l("Event : "+(EVENTS[event] || EVENTS.MODIFY));
                            callback.apply({},[e, SELECTORS[key][i], el, ev.target]);
                        }); */
                    });
                });
            }
        }
    } catch(err){
        _e(err);
    }
}


