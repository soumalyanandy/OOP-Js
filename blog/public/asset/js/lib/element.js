/* Element File */
import {_l,_e,_w,_i} from './console';

/* Constants */
const system = window;
const doc = window.document;
const EVENTS = {
    'LOAD' : 'load',
    'DOM_READY' : 'DOMContentLoaded',
	'READYSTATE' : 'readystatechange',
	'DOM_MODIFY' : 'DOMSubtreeModified',
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
        this.observe = new Array();
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
    this.elements = {};
    this.selectors = {};
    this.target = null;
    //parent 
    this.parent = parent == null?doc:doc.querySelector(parent);
    this.id = null;
    
    if(this.isElement(selector)){
        this.target = selector;
    } else {
        if(this.parent == doc){
            this.id = 'doc'; 
        } else {
            this.id = this.parent.tagName+"#"+this.parent.id;
        }
        this.target = this.elements[this.id] = Array.prototype.slice.call((this.parent).querySelectorAll(selector));
        
        var THIS = this;
        for (var key in this.elements) {
            if (this.elements.hasOwnProperty(key)) {
                this.elements[key].forEach(function(el,i){
                    THIS.selectors[key] = Array();
                    THIS.selectors[key].push(el.tagName+"#"+el.id);
                });
            }
        }
    }
}

Ele.prototype.get = function(id = null){
    if(id == null){
        return this.target instanceof Array?this.target[0]:this.target;
    }
    return this.elements[id].length > 1?this.elements[id][0]:false;
}

Ele.prototype.getAll = function(id = null){
    if(id == null){
        return this.target;
    }
    return this.elements[id].length > 1?this.elements[id]:false;
}

Ele.prototype.on = function(){
    var args = this.collection(arguments); // Array like object OR Collection
    var SELECTORS = this.selectors;
    var PARENT = this.parent;
    var THIS = this;
    try{
	    if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		    throw new Error('Invalid callback in element.js on line no. 93!');
        }

        var event = (typeof args[0] === 'function')?null:args[0].toUpperCase();
        var callback = (typeof args[0] === 'function')?args[0]:args[1];

        (this.target).forEach(function(el, i){
            var Handler = function(){
                var e = THIS.collection(arguments);
                e = e[0];
                e.stopPropagation();
                e.stopImmediatePropagation();
                var element = e.target;
                var selector = element.tagName+"#"+element.id;
                var parent_selector = (THIS.parent !== doc)?THIS.parent.tagName+"#"+THIS.parent.id:doc; 
                _w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                _w("Element : "+e.target);
                callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
            }
            Element(el).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), Handler);
        });
    } catch(err){
        _e(err);
    }
}

Ele.prototype.dynamic = function(){
    var args = this.collection(arguments); // Array like object OR Collection
    var SELECTORS = this.selectors;
    var PARENT = this.parent;
    var THIS = this;
    try{
        if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		    throw new Error('Invalid callback in element.js on line no. 93!');
        }

        var event = (typeof args[0] === 'function')?null:args[0].toUpperCase();
        var callback = (typeof args[0] === 'function')?args[0]:args[1];
        
        (this.target).forEach(function(el, i){
            var Handler = function(){
                var e = THIS.collection(arguments);
                e = e[0];
                e.stopPropagation();
                e.stopImmediatePropagation();
                var element = e.target;
                var selector = element.tagName+"#"+element.id;
                var parent_selector = (THIS.parent !== doc)?THIS.parent.tagName+"#"+THIS.parent.id:doc; 
                _w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                _w("Element : "+e.target);
                callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
            }
            Element(el).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), Handler);
            var ParentHaldler = function(){
                var ev = THIS.collection(arguments);
                ev = ev[0];
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                var element = PARENT; //ev.target;
                var parent_selector = (element !== doc)?element.tagName+"#"+element.id:'doc';
                _w("PARENT Element : "+element);
                /* which parent was under observation */
                if(typeof THIS.observe[parent_selector] !== "undefined"){ 
                    var qs = (element).querySelectorAll(el.tagName+"#"+el.id);
                    for (const ele of qs) {
                        var ChildHandler = function() {
                            var e = THIS.collection(arguments);
                            e = e[0];
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            var element = e.target;
                            var child_selector = element.tagName+"#"+element.id;
                            _w("Called Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                            _w("CHILD Element : "+element);
                            callback.apply({},[e, child_selector, parent_selector, args.slice(2)]);
                        }
                        Element(ele).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), ChildHandler);
                    }
                }
            }
            Element(PARENT).eventListener(EVENTS.DOM_MODIFY, ParentHaldler);
        });
    } catch(err){
        _e(err);
    }
}

Ele.prototype.eventListener = function(event, callBackFunc, useCapture = false){
    if(!this.target.id && this.target !== doc){
        _e(this.target.tagName+" Element must have an ID.");
        return false;
    }
    if(typeof this.observe['doc'] === "undefined" && this.target === doc){
        this.observe['doc'] = event;
        (doc.addEventListener)?this.target.addEventListener(event, callBackFunc, useCapture) : this.target.attachEvent(event, callBackFunc, useCapture);
    } else if (doc.addEventListener && !this.target.hasAttribute('event')) {   // For all major browsers, except IE 8 and earlier
        this.target.addEventListener(event, callBackFunc, useCapture);
        this.target.setAttribute('event', event);
        this.observe[this.target.tagName+"#"+this.target.id] = event;
    } else if (doc.attachEvent && !this.target.hasAttribute('event')) { // For IE 8 and earlier versions
        this.target.attachEvent(event, callBackFunc, useCapture);
        this.target.setAttribute('event', event);
        this.observe[this.target.tagName+"#"+this.target.id] = event;
    }
}

Ele.prototype.removeListener = function(event, callBackFunc, useCapture = true){
    if (doc.removeEventListener && this.target.hasAttribute('event')) {   // For all major browsers, except IE 8 and earlier
        this.target.removeEventListener(event, callBackFunc, useCapture);
        this.target.removeAttribute('event');
    } else if (doc.detachEvent && this.target.hasAttribute('event')) { // For IE 8 and earlier versions
        this.target.detachEvent(event, callBackFunc, useCapture);
        this.target.removeAttribute('event');
    }
}

Ele.prototype.observe = function(){
    _w(this.observe);
}

//Returns true if it is a DOM node
Ele.prototype.isNode = function(o){
    return (
      typeof Node === "object" ? o instanceof Node : 
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
}
  
//Returns true if it is a DOM element    
Ele.prototype.isElement = function(o){
    return (
      typeof HTMLElement === "object" || o === doc? o instanceof HTMLElement || o === doc : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
}

/*
    @title : Collection of values
    @name : collection
    @desc : convert array like objects to array.
    @param : Object arrayLikeObject
    @return : Array/Null
*/
Ele.prototype.collection = function(arrayLikeObject = new Object()){
    var size = arrayLikeObject.length, cloned = null, i;
    if (size > 0) {
        cloned = new Array(size); // Fixed size array
        if (arrayLikeObject.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = arrayLikeObject.charAt(i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = arrayLikeObject[i];
          }
        }
    }
    return cloned;
}


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

