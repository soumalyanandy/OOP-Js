/* Element File */
import {_l,_e,_w,_i} from './console';
import {Prototype} from './prototype';
import {Helper} from './helper';
import {Route} from './route';
import {Module} from './module';

/* Add/Update Window Object */
window.Array = Prototype.Array;
window.NodeList = Prototype.NodeList;
window.State = new Route('hash', true);

/* Constants */
const system = window.window;
const doc = window.document;
const EVENTS = {
    'LOAD' : 'load',
    'DOM_READY' : 'DOMContentLoaded',
	'READYSTATE' : 'readystatechange',
	'DOM_MODIFY' : 'DOMSubtreeModified',
	'CHANGE' : 'change',
    'CLICK' : 'click',
    'SUBMIT' : 'submit'
}

/* Wrapper */
export function el(selector, parent = null){
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
    // selector
    switch(true){
        case 'window': selector = system; break;
        case 'document': selector = doc; break;
    }
   
    //parent 
    this.parent = parent == null?doc:doc.querySelector(parent);
    var parent = parent == null?'':parent+' ';
    this.id = null;

    if(this.isElement(selector)){
        this.target = selector == 'window'?window.window:selector;
    } else {
        if(this.parent == doc){
            this.id = 'doc'; 
        } else {
            this.id = this.parent.tagName+"#"+this.parent.id;
        }
        this.target = this.elements[this.id] = (this.parent).querySelectorAll(parent+selector).toArray(); //Array.prototype.slice.call((this.parent).querySelectorAll(parent+selector));
        
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

Ele.prototype.find = function(selector){
    this.target = (this.get()).querySelectorAll(selector).toArray(); //Array.prototype.slice.call((this.get()).querySelectorAll(selector));
    return this;
}

Ele.prototype.on = function(){
    var args = Helper.collection(arguments); // Array like object OR Collection
    var SELECTORS = this.selectors;
    var PARENT = this.parent;
    var THIS = this;
   
    try{
	    /* if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		    throw new Error('Invalid callback in element.js on line no. 93!');
        } */

        /* if(typeof args[0] !== 'string'){
            throw new Error('Invalid event type at ele.on() function.');
        } else if(!args[1] instanceof Array){
            throw new Error('Invalid module type at ele.on() function.');
        } else if(typeof args[2] !== 'function'){
            throw new Error('Invalid callback at ele.on() function.');
        } */

        //var event = (typeof args[0] === 'function')?EVENTS.DOM_MODIFY:args[0].toUpperCase();
        //var callback = (typeof args[0] === 'function')?args[0]:args[1];
        if(args.length == 3){
            if(typeof args[0] !== 'string'){
                throw new Error('Invalid event type at ele.on() function.');
            } else if(!args[1] instanceof Array){
                throw new Error('Invalid module type at ele.on() function.');
            } else if(typeof args[2] !== 'function'){
                throw new Error('Invalid callback at ele.on() function.');
            }

            var event = (typeof args[0] === 'function')?EVENTS.DOM_MODIFY:args[0].toUpperCase();
            var modules = (args[1] instanceof Array)?args[1]:[];
            var callback = (typeof args[2] === 'function')?args[2]:function(){};
            
            /* Load module */
            var module = new Module();
            module.load(modules);
        } else {
            if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
                throw new Error('Invalid callback in element.js.');
            }

            var event = (typeof args[0] === 'function')?EVENTS.DOM_MODIFY:args[0].toUpperCase();
            var callback = (typeof args[0] === 'function')?args[0]:args[1];
        }
        /* var event = (typeof args[0] === 'function')?EVENTS.DOM_MODIFY:args[0].toUpperCase();
        var module = (args[1] instanceof Array)?args[1]:[];
        var callback = (typeof args[2] === 'function')?args[2]:function(){}; */

        if(this.target instanceof Window){
            var Handler = function(){
                var e = Helper.collection(arguments);
                e = e[0];
                e.stopPropagation();
                e.stopImmediatePropagation();
                var element = e.target;
                var selector = element.tagName+"#"+element.id;
                var parent_selector = (THIS.parent !== doc)?THIS.parent.tagName+"#"+THIS.parent.id:doc; 
                _w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                _w("Element : "+e.target);
                State.listen();
                if(args.length == 3){
                    callback.apply({},[e, doc, State.modules]);
                } else {
                    callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
                }
            }
            this.eventListener(EVENTS[event], Handler);
        } else {
            (this.target).forEach(function(ele, i){
                var Handler = function(){
                    var e = Helper.collection(arguments);
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
                el(ele).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), Handler);
            });
        }
    } catch(err){
        _e(err);
    }
}

Ele.prototype.dynamic = function(){
    var args = Helper.collection(arguments); // Array like object OR Collection
    var SELECTORS = this.selectors;
    var PARENT = this.parent;
    var TARGET = this.target;
    var THIS = this;
    try{
        if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		    throw new Error('Invalid callback in element.js on line no. 123!');
        }

        /* if(typeof args[0] !== 'string'){
            throw new Error('Invalid event type at ele.on() function.');
        } else if(!args[1] instanceof Array){
            throw new Error('Invalid module type at ele.on() function.');
        } else if(typeof args[2] !== 'function'){
            throw new Error('Invalid callback at ele.on() function.');
        } */

        var event = (typeof args[0] === 'function')?EVENTS.DOM_MODIFY:args[0].toUpperCase();
        var callback = (typeof args[0] === 'function')?args[0]:args[1];
        
        (this.target).forEach(function(ele, i){
            var Handler = function(){
                var e = Helper.collection(arguments);
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
            el(ele).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), Handler);
        });
        var ParentHandler = function(){
            var args = Helper.collection(arguments);
            var ev = args[0];
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            var target_elements = args[1];
            var parent_element = PARENT; //ev.target;
            var parent_selector = (parent_element !== doc)?parent_element.tagName+"#"+parent_element.id:'doc';
            _w("PARENT Element : "+parent_element);
            /* which parent was under observation */
            //if(typeof THIS.observe[parent_selector] !== "undefined"){ 
            (TARGET).forEach(function(ele, i){
                var qs = (parent_element).querySelectorAll(ele.tagName+"#"+ele.id);
                for (const elem of qs) {
                    var ChildHandler = function() {
                        var e = Helper.collection(arguments);
                        e = e[0];
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        var element = e.target;
                        var child_selector = element.tagName+"#"+element.id;
                        _w("Called Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                        _w("CHILD Element : "+element);
                        callback.apply({},[e, child_selector, parent_selector, args.slice(2)]);
                    }
                    el(elem).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), ChildHandler);
                }
            });
        }
        el(doc).eventListener(EVENTS.DOM_MODIFY, ParentHandler);
    } catch(err){
        _e(err);
    }
}

Ele.prototype.eventListener = function(event, callBackFunc, useCapture = false){
    _attachEvent(this, this.target, event, callBackFunc, useCapture);
}

Ele.prototype.removeListener = function(event, callBackFunc, useCapture = true){
    _detachEvent(this, this.target, event, callBackFunc, useCapture);
}

Ele.prototype.observeEvents = function(){
    _w(this.observe);
}

//Returns true if it is a DOM node
Ele.prototype.isNode = function(o){
    return (
      typeof Node === "object" ? o instanceof Node: 
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
}
  
//Returns true if it is a DOM element    
Ele.prototype.isElement = function(o){ 
    return (
      typeof HTMLElement === "object" || o === doc || o === 'window' ? o instanceof HTMLElement || o === doc || o === 'window' : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
}

/* Abstruction */
function _attachEvent(instance, target, event, callBackFunc, useCapture = false){
    if(!target.id && !target instanceof HTMLDocument && !target instanceof Window){
        _e(target.tagName+" Element must have an ID.");
        return false;
    }

    /* check element events */
    var evt = [];
    var event_exists = false;
    _l(target);
    if(target.hasAttribute){
        evt = target.getAttribute('event');
        evt = evt == null?[]:evt;
        _l(evt.indexOf(event));
        if(evt.indexOf(event) === -1){
            evt.push(event);
        } else {
            event_exists = true;
        }
    } 
    _l(evt);
    if (target.hasAttribute && !event_exists) { _l("ok");  
        target.setAttribute('event', evt);
        instance.observe[target.tagName+"#"+target.id] = evt;
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } else if(typeof instance.observe['win'] === "undefined" && target instanceof Window){
        instance.observe['win'] = event;
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } else if(typeof instance.observe['doc'] === "undefined" && target instanceof HTMLDocument){
        instance.observe['doc'] = event;
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    _l(instance.observe);
}

function _detachEvent(instance, target, event, callBackFunc, useCapture = true){
   
    /* check element events */
    var evt = [];
    var event_exists = false;
    if(target.hasAttribute){
        evt = target.getAttribute('event');
        if(evt.indexOf(event) === -1){
            return false;
        } else {
            evt.remove(event);
            event_exists = evt.length;
        }
    } 

    if(typeof instance.observe['win'] !== "undefined" && target instanceof Window){
        delete instance.observe['win'];
        (target.removeEventListener)?target.removeEventListener(event, callBackFunc, useCapture) : target.detachEvent(event, callBackFunc, useCapture);
    } else if(typeof instance.observe['doc'] !== "undefined" && target instanceof HTMLDocument){
        delete instance.observe['doc'];
        (target.removeEventListener)?target.removeEventListener(event, callBackFunc, useCapture) : target.detachEvent(event, callBackFunc, useCapture);
    } else if (target.hasAttribute('event') && event_exists) { 
        (target.removeEventListener)?target.removeEventListener(event, callBackFunc, useCapture) : target.detachEvent(event, callBackFunc, useCapture);
        target.setAttribute('event', evt);
        instance.observe[target.tagName+"#"+target.id] = evt;
    } else {
        target.removeAttribute('event');
        delete instance.observe[target.tagName+"#"+target.id];
    }
}


/*
References : 

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

