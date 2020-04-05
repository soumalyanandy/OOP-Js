/* Element File */
import {_l,_e,_w,_i} from './console';
import {Prototype} from './prototype';
import {Helper} from './helper';
import {Route} from './route';
import {Module} from './module';

/*
    Rules to follow : 
    1. To call 'dynamic event listner' we need unique element id.
    2. 
*/

/* Add/Update Window Object */
window.Array = Prototype.Array;
window.NodeList = Prototype.NodeList;
window.State = new Route('hash', false);

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
    'SUBMIT' : 'submit',
    'KEYUP' : 'keyup'
}

/* Wrapper */
export function el(selector, parent = null, func_name = null, callBackFunc = false){
    var Element = new Ele();
    if(func_name == null){
        Element.set(selector, parent);
    } else{
        Element = Element[func_name](selector);
    }
    if(typeof callBackFunc === "function") callBackFunc();
    return Element;
}

var Ele;
/* singletons! */
(function() {
    var instance;
    Ele = function Ele(){
        this.debug = false;
        this.Listeners = [];
        this.observe = [];
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

Ele.prototype.create = function(tag){
    return doc.createElement(tag.toUpperCase());
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
                //_w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                //_w("Element : "+e.target);
                State.listen();
                if(args.length == 3){
                    callback.apply({},[e, doc, State.modules, args.slice(2)]);
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
                    //_w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                    //_w("Element : "+e.target);
                    if(args.length == 3){
                        callback.apply({},[e, selector, parent_selector, State.modules, args.slice(2)]);
                    } else {
                        callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
                    }
                }
                el(ele).eventListener((EVENTS[event] || EVENTS.DOM_MODIFY), Handler);
            });
        }
    } catch(err){
        _e(err);
    }
}

Ele.prototype.dynamic = function(){ //_l('dynamic');
    var args = Helper.collection(arguments); // Array like object OR Collection
    var SELECTORS = this.selectors;
    var PARENT = this.parent;
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
        
        (this.target).forEach(function(ele, i){
            var Handler = function(){
                var e = Helper.collection(arguments);
                e = e[0];
                e.stopPropagation();
                e.stopImmediatePropagation();
                var element = e.target;
                var selector = element.tagName+"#"+element.id;
                var parent_selector = (PARENT !== doc)?PARENT.tagName+"#"+PARENT.id:doc; 
                //_w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                //_w("Element : "+e.target);
                if(args.length == 3){
                    callback.apply({},[e, selector, parent_selector, State.modules, args.slice(2)]);
                } else {
                    callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
                }
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
            //_w("PARENT Element : "+parent_element);
            // which parent was under observation 
            //if(typeof THIS.observe[parent_selector] !== "undefined"){ 
            /* _l("TARGET:");
            _l(ev.target);
            _l("OBSERVE");
            _l(THIS.observe); */
            
            for(var ele in THIS.observe){
                if(THIS.debug) _l("ele : "+ele);
                var qs = (parent_element).querySelectorAll(ele);
                for (var elem of qs) {
                    if(THIS.debug) _l("qs_ele : "+elem);
                    THIS.observe[ele].forEach(function(obj, k){
                        if(THIS.debug) _l("evt : "+obj.evt);
                        var ChildHandler = function() {
                            var e = Helper.collection(arguments);
                            e = e[0];
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            var element = e.target;
                            var child_selector = element.tagName+"#"+element.id;
                            //_w("Called Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                            //_w("CHILD Element : "+element);
                            if(args.length == 3){
                                obj.callBack.apply({},[e, child_selector, parent_selector, State.modules, args.slice(2)]);
                            } else {
                                obj.callBack.apply({},[e, child_selector, parent_selector, args.slice(2)]);
                            }
                        }
                        el(elem).eventListener((obj.evt || EVENTS.DOM_MODIFY), ChildHandler);
                    });
                }
            }
        }
        el(PARENT).eventListener(EVENTS.DOM_MODIFY, ParentHandler);
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

Ele.prototype.removeAllListener = function(){ //_l("remove all listner .........");
    //_removeAllListener(this);
}

Ele.prototype.observeEvents = function(){
    _w(this.observe);
}

Ele.prototype.isEvent = function(ele){
    if(0 !== ele.prototype.indexOf("on")){
        return false;
    }
    return true;
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
    var listener_obj = {};
    var event_exists = false;
    //_l("Slug change : "+State.slugChangeCount());
    //_l("Attach event start");
    if(instance.debug) _l("previous observe");
    if(instance.debug) _l(instance.observe[target.tagName+"#"+target.id]);
    var found_listner = false;
    
    if(instance.observe[target.tagName+"#"+target.id]){
        instance.observe[target.tagName+"#"+target.id].forEach(function(obj, k){
            if(instance.debug) _l("k : "+k);
            if(instance.debug) _l("obj.evt : "+obj.evt);
            if(instance.debug) _l("event : "+event);
            //_l("k : "+k);
            //_l("obj.evt : "+obj.evt);
            //_l("event : "+event);
            //_l("exists : " + (obj.evt.toLowerCase() == event.toLowerCase() && obj.callBack.toString() == callBackFunc.toString()));
            if(obj.evt.toLowerCase() == event.toLowerCase() && obj.callBack.toString() == callBackFunc.toString()){
                found_listner = true;
                event_exists = true;
                listener_obj = obj;
            } else {
                if(evt.indexOf(event) === -1) evt.push(event);
            }
        });
    } else {
        if(evt.indexOf(event) === -1) evt.push(event);
    }
    if(instance.debug) _l("listner found : "+found_listner);
    //if(!found_listner) instance.Listeners.push({evt : event, callBack : callBackFunc, capture : useCapture});
    if(!instance.observe[target.tagName+"#"+target.id]) instance.observe[target.tagName+"#"+target.id] = [];
    //_l('element evt list : ------------------------');
    //_l(evt);
    //_l("event_exists : "+event_exists);

    /* Event Listener will call for document element event (call more than one time) */
    if (target.hasAttribute) {  // && !event_exists
        if(instance.debug) _l("Adding event for : "+target.tagName+"#"+target.id+", "+event);
        var evt_str = evt.join(" ");
        //_l(typeof evt_str); 
        //target = document.getElementById(target.id);
        if(instance.debug) _l("Target element : ");
        if(instance.debug) _l(target);
        target.setAttribute('event', evt_str);
        if(!found_listner) instance.observe[target.tagName+"#"+target.id].push({evt : event, callBack : callBackFunc, capture : useCapture}); // = instance.Listeners;
        //instance.Listeners = [];
        if(event_exists){
            if(instance.debug) _l("event listener removed for : "+event+" in "+target.tagName+"#"+target.id);
            (target.removeEventListener)?target.removeEventListener(listener_obj.evt, listener_obj.callBack, listener_obj.capture) : target.detachEvent(listener_obj.evt, listener_obj.callBack, listener_obj.capture);
        }
        if(instance.debug) _l("event listener added for : "+event+" in "+target.tagName+"#"+target.id);
        if(instance.debug) _l(instance.observe);
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    /* Event Handler will call for window event (call one time) */
    else if(target instanceof Window && !event_exists){ //typeof instance.observe['win'] === "undefined" && 
        instance.observe['win'] = [{evt : event, callBack : callBackFunc, capture : useCapture}];
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    /* Event Listener will call for document event (call more than one time) */
    else if(target instanceof HTMLDocument){ // typeof instance.observe['doc'] === "undefined" &&  && !event_exists
        instance.observe['doc'] = [{evt : event, callBack : callBackFunc, capture : useCapture}];
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    //_l(instance.observe);
    if(instance.debug) _l("Observe");
    if(instance.debug) _l(instance.observe);
}

/* ---------------------------------- not in use ---------------------------------- */
function _detachEvent(instance, target, event, callBackFunc, useCapture = false){
    /* check element events */
    var evt = [];
    var event_exists = false;
    var callBack = false;
    var capture = '';
    var listener = [];
    if(instance.debug) _l(target);
    if(target != null && target.hasAttribute){
        /* evt = target.getAttribute('event');
        if(evt.indexOf(event) === -1){
            return false;
        } else { 
            if(typeof evt == "string"){
                event_exists = 0;
            } else {
                evt.remove(event);
                event_exists = evt.length;
            }
        } */

        var found_listner = false;
        if(instance.observe[target.tagName+"#"+target.id]){
            instance.observe[target.tagName+"#"+target.id].forEach(function(obj, k){
                if(instance.debug) _l("k : "+k);
                if(instance.debug) _l("obj.evt : "+obj.evt);
                if(instance.debug) _l("event : "+event);
                if(obj.evt.toLowerCase() == event.toLowerCase()){
                    evt.remove(event);
                    found_listner = true;
                    event_exists = true;
                    callBack = obj.callBack;
                    capture = obj.capture;
                } else {
                    listener.push(obj);
                }
            });
        }
    } 
    if(instance.debug) _l(' ------------------- remove listner ------------------- ');
    if(instance.debug) _l(instance.observe);
    /*if(typeof instance.observe['win'] !== "undefined" && target instanceof Window){
        delete instance.observe['win'];
        (target.removeEventListener)?target.removeEventListener(event, callBack, capture) : target.detachEvent(event, callBack, capture);
    } else if(typeof instance.observe['doc'] !== "undefined" && target instanceof HTMLDocument){
        delete instance.observe['doc'];
        (target.removeEventListener)?target.removeEventListener(event, callBack, capture) : target.detachEvent(event, callBack, capture);
    } else*/ if (target != null && event_exists) { 
        (target.removeEventListener)?target.removeEventListener(event, callBack, capture) : target.detachEvent(event, callBack, capture);
        if(evt.length > 0) target.setAttribute('event', evt);
        else target.removeAttribute('event');
        instance.observe[target.tagName+"#"+target.id] = listener;
    } /* else {
        if(target != null){
            var evt_info = instance.observe[0];
            (target.removeEventListener)?target.removeEventListener(evt_info.evt, evt_info.callBack, evt_info.capture) : target.detachEvent(evt_info.evt, evt_info.callBack, evt_info.capture);
            //(target.removeEventListener)?target.removeEventListener(event, callBackFunc, useCapture) : target.detachEvent(event, callBackFunc, useCapture);
            target.removeAttribute('event');
            delete instance.observe[target.tagName+"#"+target.id];
        }
    } */
    if(instance.debug) _l("after Observe");
    if(instance.debug) _l(instance.observe);
}

/* ---------------------------------- not in use ---------------------------------- */
function _removeAllListener(instance){ return false;
    //_l("REMOVE ALL LISTENER ------------------->"); 
    //_l(typeof instance.observe); 
    //return false;
    for(var sel in instance.observe){
        var obj_arr = instance.observe[sel];
        //_l("removing .. "+sel);
        //_l(obj_arr);
        for(var i in obj_arr){
            var obj = obj_arr[i];
            switch(sel){
                case 'win' : sel = system; break;
                case 'doc' : sel = doc; break;
            }
            instance.target = (sel instanceof Window || sel instanceof HTMLDocument)?sel:doc.querySelector(sel);
            instance.removeListener(obj.evt, obj.callBack, obj.capture);
        }
    }
    /*instance.observe.forEach(function(obj_arr, sel){
        _l("removing .. "+sel);
        _l(obj_arr);
        obj_arr.forEach(function(obj_info, i){
            switch(sel){
                case 'win' : sel = system; break;
                case 'doc' : sel = doc; break;
            }
            instance.target = (sel instanceof Window || sel instanceof HTMLDocument)?sel:doc.querySelector(sel);
            _l("REMOVE LISTENER ------------------->");
            _l(sel);
            instance.removeListener(obj_info.evt, obj_info.callBack, obj_info.capture);
        });
    });*/
    instance.observe = new Array();
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

/*
https://stackoverflow.com/questions/4402287/javascript-remove-event-listener

element.querySelector('.addDoor').onEvent('click', function (e) { });
element.querySelector('.addDoor').removeListeners();


HTMLElement.prototype.onEvent = function (eventType, callBack, useCapture) {
this.addEventListener(eventType, callBack, useCapture);
if (!this.myListeners) {
    this.myListeners = [];
};
this.myListeners.push({ eType: eventType, callBack: callBack });
return this;
};


HTMLElement.prototype.removeListeners = function () {
if (this.myListeners) {
    for (var i = 0; i < this.myListeners.length; i++) {
        this.removeEventListener(this.myListeners[i].eType, this.myListeners[i].callBack);
    };
   delete this.myListeners;
};
};

Javascript removeEventListener not working

This is because that two anonymous functions are completely different functions. Your removeEventListener's argument is not a reference to the function object that was previously attached.

function foo(event) {
              app.addSpot(event.clientX,event.clientY);
              app.addFlag = 1;
          }
 area.addEventListener('click',foo,true);
 area.removeEventListener('click',foo,true);
 
*/