/* Element File */
import {_l,_e,_w,_i} from './console';
import {Prototype} from './prototype';
import {Helper} from './helper';
import {Route} from './route';
import {Module} from './module';

/*
    Rules to follow : 
    1. To call 'dynamic event listner' we need unique element id.
    2. To call 'simple event listner' we need unique element id.
    3. Element ID should me unique through out the page.
*/

/* Add/Update Window Object */
window.Array = Prototype.Array;
window.NodeList = Prototype.NodeList;
window.Object = Prototype.Object;
window.State = new Route('hash', false);
window.elementSelectors = [];
window.EventObserve = [];


/* Constants */
const system = window.window;
const doc = window.document;
const EVENTS = {
    'LOAD' : 'load',
    'DOM_READY' : 'DOMContentLoaded',
	'READYSTATE' : 'readystatechange',
	'DOM_MODIFY' : 'DOMSubtreeModified', // For Developer : It may cause infinit loop written in MDN. 
	'CHANGE' : 'change',
    'CLICK' : 'click',
    'BLUR' : 'blur',
    'FOCUS' : 'focus',
    'SUBMIT' : 'submit',
    'KEYUP' : 'keyup',
    'KEYDOWN' : 'keydown',
    'KEYPRESS' : 'keypress',
    'MOUSEOVER' : 'mouseover',
    'MOUSEOUT' : 'mouseout',
    'MOUSEENTER' : 'mouseenter',
    'MOUSELEAVE' : 'mouseleave',
}

/* Wrapper */
export function el(selector = false, parent = null, func_name = null, callBackFunc = false){
    var Element = new Ele();
    if(!selector) return Element;
    if(func_name == null){
        Element.set(selector, parent);
    } else{
        Element = Element[func_name](selector);
    }
    if(typeof callBackFunc === "function") callBackFunc();
    return Element;
}
//window.EventObserve = el(false, null, 'observe');
var Ele;
/* singletons! */
(function() {
    var instance;
    Ele = function Ele(){
        this.debug = false;
        this.actions = [];
        this.actionListeners = [];
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
    /*
        NOTE : if selector is an element object then if we check expression (selector == false), 
        it will evaluate to true. To get currect result we need to check with === operator. 
    */
    if(selector === false){
        throw new Error('Invalid selector at ele.set() function.');
    }

    this.elements = {};
    this.selectors = {};
    this.target = null; 
    this.parent_sel = null;
   
    //parent 
    this.parentOfTarget = (parent == null)?doc:doc.querySelector(parent);
    this.parentOfTarget = (selector == 'window')?system:this.parentOfTarget;
    if(this.parentOfTarget == system){
        this.parent_sel = 'win'; 
    } else if(this.parentOfTarget == doc){
        this.parent_sel = 'doc'; 
    } else {
        this.parent_sel = this.parentOfTarget.tagName+"#"+this.parentOfTarget.id;
    }
    // check for element type
    if(this.isElement(selector)){
        this.target = (selector == 'window')?system:selector;
        if(this.elements[this.parent_sel] instanceof Array){
            this.elements[this.parent_sel].push(selector);
        } else {
            this.elements[this.parent_sel] = [selector];
        }
    } else {
        var query_selector = (parent == null)?selector:parent+' '+selector; //_l(query_selector);
        this.target = this.elements[this.parent_sel] = (this.parentOfTarget).querySelectorAll(query_selector).toArray(); //Array.prototype.slice.call((this.parentOfTarget).querySelectorAll(parent+selector));
    }
    //_l(this.target);
    var THIS = this;
    for (var key in this.elements) {
        if (this.elements.hasOwnProperty(key)) {
            this.elements[key].forEach(function(el,i){
                if(typeof window.elementSelectors[key] !== 'object'){ 
                    window.elementSelectors[key] = [];
                } 
                if(!THIS.selectorExists(window.elementSelectors[key], el.tagName+"#"+el.id)){ //typeof window.EventObserve[el.tagName+"#"+el.id] === "undefined"
                    window.elementSelectors[key].push({
                        'sel' : el.tagName+"#"+el.id,
                        'dynamic' : false
                    });
                }
            });
        }
    }
    /* _l('------- ELEMENT ------');
    _l(window.elementSelectors);
    _l('------- OBSERVE ------');
    _l(window.EventObserve); */
}

Ele.prototype.selectorExists = function(arr, sel){
    var exists = false;
    arr.forEach(function(obj, i){
        if(obj.sel == sel){
            exists = true;
        }
    });
    return exists;
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

Ele.prototype.create = function(tag, text = "", id = "", name = "", classes = [], style = [], attr = []){
    //return doc.createElement(tag.toUpperCase());
    if(id == null || id == ""){
        throw new Error('Id can not be blank at ele.create() function.');
    }
    var element = doc.createElement(tag.toUpperCase());
    element.id = id;
	if(text != "") element.innerHTML = text;
	if(name != "") element.name = name;
	if(classes.length > 0) element.className = classes.join(" ");
	// add styles
	style.forEach(function(obj, key){ 
		element.style[obj.key] = obj.val;
	});
	// add attributes 
	attr.forEach(function(obj, key){
		element.setAttribute(obj.key, obj.val);
    }); 
    //_l('Created element : ');
    //_l(element);
	// append to parent
    this.get().appendChild(element);
    // set element as current target and return class reference
    return el("#"+id); //.get()
}

Ele.prototype.delete = function(){
    var el = this.get();
    //_l(this.target);
    // remove listner
    _detachCurrentListeners(false, el.tagName+"#"+el.id);
    // set parent as current target and return
    var parent = this.end();
    // remove element
    el.remove();
    // return class reference
    return parent;
}

Ele.prototype.end = function(){
    //var el = this.get();
    // get parent 
    //var parent = el.parentElement;
    // set parent as current target and return class reference
    return this.closest('parent'); //el(parent.tagName+"#"+parent.id);
}

Ele.prototype.parent = function(selector = false, ifExistsFlag = false){
    var el = this.get();
    // get expected parent 
    var parent, selector;
    var exists = false;
    // if selector exists
    if(selector){
        // traverse parents
        while (el) {
            // get parent element
            parent = el.parentElement;
            // if current parent matches the expected
            if (parent && parent.matches(selector)) {
                exists = true;
                if(parent.id) selector = parent.tagName+"#"+parent.id;
                else if(parent.className) selector = parent.tagName+"."+parent.className.split(" ").join(".");
                else selector = parent.tagName;
                this.set(selector);
                return !ifExistsFlag?this:exists;
            }
            // reset element with new parent
            el = parent;
        }
    } else if(el.parentElement){
        exists = true;
        // will return the immidiate one
        parent = el.parentElement;
        if(parent.id) selector = parent.tagName+"#"+parent.id;
        else if(parent.className) selector = parent.tagName+"."+parent.className.split(" ").join(".");
        else selector = parent.tagName;
        this.set(selector);
        return !ifExistsFlag?this:exists;
    }
    // did not find one
    _l("did not find any parent");
    return !ifExistsFlag?this.end():exists;
}

Ele.prototype.hasParent = function(selector = false){
    return this.parent(selector, true)?true:false;
}

Ele.prototype.closest = function(type = 'parent', selector = false){
    if(type == 'parent'){
        return this.parent(selector);
    } else {
        return this.child(selector);
    }
}

Ele.prototype.child = function(selector = false, ifExistsFlag = false){
    var el = this.get();
    // get expected child 
    var child;
    var exists = false;
    // if selector exists
    if(selector){
        // traverse childs
        child = _nestedChild(el, selector);
        if(child != null){ 
            exists = true;
            this.set(child);
            return !ifExistsFlag?this:exists;
        }
    } else if(el.children.length > 0){
        exists = true;
        // will return the immidiate level children
        this.target = el.children;
        return !ifExistsFlag?this:exists;
    }
    
    // did not find one
    _l("did not find any child");
    return !ifExistsFlag?this.end():exists;
}

Ele.prototype.hasChild = function(selector = false){
    return this.child(selector, true)?true:false;
}

/* get Previous Siblings */
Ele.prototype.prevSiblings = function(sel = false) {
    var ele = this.get();
    if(typeof ele === "undefined") throw new Error("Element not found in ele.prevSiblings()");
    var sibs = [];
    var elem;
    while (!sibs.hasItem(ele.previousElementSibling)) {
        elem = ele.previousElementSibling
        if(sel && elem.matches(sel)) sibs.push(elem);
        else if(!sel) sibs.push(elem);
    }
    // set target
    this.target = sibs;
    return this;
}

/* get Next Siblings */
Ele.prototype.nextSiblings = function(sel = false) {
    var ele = this.get();
    if(typeof ele === "undefined") throw new Error("Element not found in ele.nextSiblings()");
    var sibs = [];
    var elem;
    while (elem = ele.nextElementSibling) {
        if(sel && elem.matches(sel)) sibs.push(elem);
        else if(!sel) sibs.push(elem);
    }
    // set target
    this.target = sibs;
    return this;
}

/* get All Siblings */
Ele.prototype.siblings = function(sel = false) {
    var ele = this.get();
    if(typeof ele === "undefined") throw new Error("Element not found in ele.siblings()");
    var sibs = [];
    var elem = ele.parentElement.firstElementChild;
    do {
        //if (elem.nodeType === 3) continue; // text node
        //if (!filter || filter(elem)) sibs.push(elem);
        if(sel && elem.matches(sel)) sibs.push(elem);
        else if(!sel) sibs.push(elem);
    } while (elem = elem.nextElementSibling)
    // set target
    this.target = sibs;
    return this;
}

Ele.prototype.filter = function(str){
    var elArr = this.getAll();
    if(typeof str !== "function"){
        this.target = _filter(elArr, str);
    } else {
        this.target = _filter(elArr, false, str);
    }
    return this;
}

Ele.prototype.reg_action = function(action, listner){
    if(!this.actions.hasItem(action)){
        this.actions.push(action);
        this.actionListeners.push(listner);
    }
}

Ele.prototype.del_action = function(action){
    var pos = this.actions.hasItem(action);
    if(pos != -1){
        this.actions.splice(pos, 1);
        this.actionListeners.splice(pos, 1);
    }
}

Ele.prototype.action = function(command){
    var ELEMENT_SCOPE = this;
    (this.actions).forEach(function(action, idx){
        if(action.toUpperCase() == command.toUpperCase()){
            if(ELEMENT_SCOPE.get().hasAttribute('_'+command)){
                var param = ELEMENT_SCOPE.get().getAttribute('_'+command);
                //var ele = ELEMENT_SCOPE.get().tagName+"#"+ELEMENT_SCOPE.get().id;
                ELEMENT_SCOPE.actionListeners[idx].call({param},[ELEMENT_SCOPE.get()]);
            }
        }
    });
    /*switch(command){
        case "redirect" :
            if(this.get().hasAttribute('_redirect')){
                var route = this.get().getAttribute('_redirect');
                State.goto(route); 
            }
        break;
        case "confirm_redirect" : 
            if(this.get().hasAttribute('_confirm_redirect')){ 
                var param = this.get().getAttribute('_confirm_redirect').split(",");
                if(confirm(param[0])){
                    State.goto(param[1]); 
                }
            }
        break;
    }*/
}

Ele.prototype.observe = function(){
    return this.observe;
}

Ele.prototype.on = function(){
    var args = Helper.collection(arguments); // Array like object OR Collection
    var SELECTORS = this.selectors;
    var PARENT = this.parentOfTarget;
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
                var parent_selector = (THIS.parentOfTarget !== doc)?THIS.parentOfTarget.tagName+"#"+THIS.parentOfTarget.id:doc; 
                //_w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                //_w("Element : "+e.target);
                State.listen();
                if(args.length == 3){
                    callback.apply({},[e, doc, State.modules, args.slice(2)]);
                } else {
                    callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
                }
            }
            if(typeof EVENTS[event] !== "undefined") this.eventListener(EVENTS[event], Handler);
            else _l(event+" is currently not supported");
        } else { //_l("ON method target list : "); _l(this.target);
            (this.target).forEach(function(ele, i){ 
                var Handler = function(){
                    var e = Helper.collection(arguments);
                    e = e[0];
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    var element = e.target;
                    var selector = element.tagName+"#"+element.id;
                    var parent_selector = (THIS.parentOfTarget !== doc)?THIS.parentOfTarget.tagName+"#"+THIS.parentOfTarget.id:doc; 
                    //_w("Event : "+(EVENTS[event] || EVENTS.DOM_MODIFY));
                    //_w("Element : "+e.target);
                    if(args.length == 3){
                        callback.apply({},[e, selector, parent_selector, State.modules, args.slice(2)]);
                    } else {
                        callback.apply({},[e, selector, parent_selector, args.slice(2)]); //, el
                    }
                }
                if(typeof EVENTS[event] !== "undefined") el(ele).eventListener((EVENTS[event]), Handler);
                else _l(event+" is currently not supported");
            });
        }
    } catch(err){
        _e(err);
    }
}

Ele.prototype.dynamic = function(){ //_l(this.selectors);
    var args = Helper.collection(arguments); // Array like object OR Collection
    var SELECTORS = window.elementSelectors;
    var target = this.get()
    var CURRENT_TARGET = target.tagName+"#"+target.id;
    

    /* Make element event listener dynamic */
    for(var parent in SELECTORS){
        if(SELECTORS.hasOwnProperty(parent)){
            SELECTORS[parent].forEach(function(obj, i){
                if(obj.sel == CURRENT_TARGET){
                    obj.dynamic = true;
                }
            });
        }
    }
   
    /* On Event ! */
    if(args.length == 3){
        this.on(args[0],args[1],args[2]);
    } else {
        this.on(args[0],args[1]);
    }
    

    /*try{
        //if(typeof args[0] !== 'function' && typeof args[1] !== 'function') {
		//    throw new Error('Invalid callback in element.js on line no. 123!');
        //} 

        //if(typeof args[0] !== 'string'){
        //    throw new Error('Invalid event type at ele.on() function.');
        //} else if(!args[1] instanceof Array){
        //   throw new Error('Invalid module type at ele.on() function.');
        //} else if(typeof args[2] !== 'function'){
        //    throw new Error('Invalid callback at ele.on() function.');
        //} 

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
            
            // Load module 
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
        
        //  IF WE USE DOCUMENT SUB_TREE_MODIFIED EVENT TO REBIND EVENT LISTENERS 
        //  THEN BROWSER WILL GET HANGED !! SO DO NOT USE THIS TYPE OF LOGIC.
        //-------------- TOO MUCH RECURSIONS -------------
        var THIS = this;
        var PARENT = this.parentOfTarget;
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
            // _l("TARGET:");
            //_l(ev.target);
            //_l("OBSERVE");
            //_l(THIS.observe); 
            _l("ParentHandler called !");
            for(var ele in THIS.observe){
                if(THIS.debug) _l("ele : "+ele);
                if(ele.indexOf("#") !== -1){
                    var qs = (parent_element).querySelectorAll(ele); //(parent_element)
                    for (var elem of qs) { //_l(elem);
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
                                // remove Listener
                                //element.removeEventListener(e,ChildHandler,false);
                                
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
        }
        el(PARENT).eventListener(EVENTS.DOM_MODIFY, ParentHandler);
        //-------------- TOO MUCH RECURSIONS -------------
        
    } catch(err){
        _e(err);
    }*/
}

Ele.prototype.refreshListeners = function(){
    _detachCurrentListeners(true);
    _attachLastListeners(true);
}

Ele.prototype.detachCurrentListeners = function(){
    _detachCurrentListeners();
}

Ele.prototype.attachLastListeners = function(){
    _attachLastListeners();
}

Ele.prototype.eventListener = function(event, callBackFunc, useCapture = false){
    _attachEvent(this, this.target, event, callBackFunc, useCapture);
}

Ele.prototype.removeListener = function(event, callBackFunc, useCapture = true){
    _detachEvent(this, this.target, event, callBackFunc, useCapture);
}

Ele.prototype.removeAllListener = function(){ 
    _removeAllListener(this);
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
function _filter(elArr, sel = false, callBack = false){
    var result = [];
    if(!callBack){
        if(sel == false || sel == null || sel == "") throw new Error('Selector can not be blank at ele.filter() function.');
        elArr.forEach(function(val, i){
            if((val && val.matches(sel))) result.push(val);
        })
        //return (ele && ele.matches(sel))?true:false;
    } else {
        if(typeof callBack !== "function") throw new Error('callBack must be of type function at ele.filter() function.');
        //return callBack(ele);
        elArr.forEach(function(val, i){
            if(callBack(val)) result.push(val);
        });
    }
    return result;
}

function _nestedChild(el, sel){
    var child, selector;
    var nestedChild;
    if(el.children.length > 0){
        for (let i = 0; i < el.children.length; i++) {
            //console.log(el.children[i].tagName);
            child = el.children[i];
            // if current child matches the expected
            if (child && child.matches(sel)) {
                if(child.id) selector = child.tagName+"#"+child.id;
                else if(child.className) selector = child.tagName+"."+child.className.split(" ").join(".");
                else selector = child.tagName;
                return selector;
            } else if((nestedChild = _nestedChild(child, sel)) != null){
                return nestedChild;
            }
        }
    } else return null;
}

function _detachCurrentListeners(tracking = false, ele = false){ //_w("_detachListeners");
	for(var parent in window.elementSelectors){
		if(window.elementSelectors.hasOwnProperty(parent)){
			window.elementSelectors[parent].forEach(function(eleObj, i){
                var selector = eleObj.sel;
                selector = Helper.rtrim(selector,"#");
                //_l("del listener from element : "+selector);
                if(!ele || ele == selector){
                    var events = window.EventObserve[selector];
                    var target = document.querySelector(selector);
                    //_l("target : ");
                    //_l(target);
                    if(target != null && typeof events !== "undefined"){
                        events.forEach(function(obj, j){
                            (target.removeEventListener)?target.removeEventListener(obj.evt, obj.callBack, obj.capture) : target.detachEvent(obj.evt, obj.callBack, obj.capture);
                        });
                    } //_l(eleObj.dynamic); _l(window.elementSelectors[parent][i]);
                    if((!eleObj.dynamic && !tracking) || ele == selector){	
                        delete window.EventObserve[selector];
                        window.elementSelectors[parent].remove(i); 
                    }
                }
			});
		}
	}
}

function _attachLastListeners(tracking = false){ //_w("_attachListeners"); 
    //_l(window.elementSelectors); _l(window.EventObserve);
	for(var parent in window.elementSelectors){
		if(window.elementSelectors.hasOwnProperty(parent)){
			window.elementSelectors[parent].forEach(function(eleObj, i){
                if((eleObj.dynamic && !tracking) || tracking){
                    var selector = eleObj.sel;
                    selector = Helper.rtrim(selector,"#");
					//_l(typeof selector);
					//_l("add listener to element : "+selector);
					var events = window.EventObserve[selector];
					var target = document.querySelector(selector);
					//_l("target : ");
                    //_l(target);
					if(target != null && typeof events !== "undefined"){
						events.forEach(function(obj, j){
							(target.addEventListener)?target.addEventListener(obj.evt, obj.callBack, obj.capture) : target.attachEvent(obj.evt, obj.callBack, obj.capture);
						});
					}
				}
			});
		}
	}
}

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
        //target.setAttribute('event', evt_str);
        if(!found_listner) { 
            instance.observe[target.tagName+"#"+target.id].push({evt : event, callBack : callBackFunc, capture : useCapture}); // = instance.Listeners;
        }
        
        //instance.Listeners = [];
        /*if(event_exists){
            if(instance.debug) _l("event listener removed for : "+event+" in "+target.tagName+"#"+target.id);
            (target.removeEventListener)?target.removeEventListener(listener_obj.evt, listener_obj.callBack, listener_obj.capture) : target.detachEvent(listener_obj.evt, listener_obj.callBack, listener_obj.capture);
        }*/
        if(instance.debug) _l("event listener added for : "+event+" in "+target.tagName+"#"+target.id);
        if(instance.debug) _l(instance.observe);
        /* if(!found_listner)  */(target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    /* Event Handler will call for window event (call one time) */
    else if(target instanceof Window && !event_exists){ //typeof instance.observe['win'] === "undefined" && 
        instance.observe['win'] = [{evt : event, callBack : callBackFunc, capture : useCapture}];
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    /* Event Listener will call for document event (call more than one time) */
    else if(target instanceof HTMLDocument && !event_exists){ // typeof instance.observe['doc'] === "undefined" &&  && !event_exists
        instance.observe['doc'] = [{evt : event, callBack : callBackFunc, capture : useCapture}];
        (target.addEventListener)?target.addEventListener(event, callBackFunc, useCapture) : target.attachEvent(event, callBackFunc, useCapture);
    } 
    window.EventObserve = instance.observe;
    if(instance.debug) _l("Observe");
    if(instance.debug) _l(instance.observe);
}

function _detachEvent(instance, target, event, callBackFunc, useCapture = false){
    var found_listner = false;
    var listener = [];
    var evt = [];
    var currentEvent = event.toLowerCase();
    var callBack = "";
    var capture = "";

    if(target.setAttribute){
        evt = target.getAttribute('event').split(" ").map(function(val, i){
            return val.toLowerCase();
        });
    }
    if(instance.observe[target.tagName+"#"+target.id]){
        instance.observe[target.tagName+"#"+target.id].forEach(function(obj, k){
            if(instance.debug) _l("k : "+k);
            if(instance.debug) _l("obj.evt : "+obj.evt);
            if(instance.debug) _l("event : "+event);
            if(obj.evt.toLowerCase() == currentEvent && obj.callBack == callBackFunc){
                found_listner = true;
                callBack = obj.callBack;
                capture = obj.capture;
                if(evt.hasItem(currentEvent)) evt.removeItem(currentEvent);
                target.setAttribute(evt.join(" "));
            } else {
                listener.push(obj);
            }
        });
        instance.observe[target.tagName+"#"+target.id] = listener;
    }
    (target.removeEventListener)?target.removeEventListener(event, callBack, capture) : target.detachEvent(event, callBack, capture);
}

function _removeAllListener(instance){ 
    if(instance.debug) _l("REMOVE ALL LISTENER ------------------->"); 
    for(var parent in window.elementSelectors){
		if(window.elementSelectors.hasOwnProperty(parent)){
			window.elementSelectors[parent].forEach(function(eleObj, i){
                var selector = eleObj.sel;
                selector = Helper.rtrim(selector,"#");
                if(instance.debug) _l("del listener from element : "+selector);
				var events = window.EventObserve[selector];
                var target = document.querySelector(selector);
                if(instance.debug) _l("target : ");
                if(instance.debug) _l(target);
				if(target != null && typeof events !== "undefined"){
                    events.forEach(function(obj, j){
						(target.removeEventListener)?target.removeEventListener(obj.evt, obj.callBack, obj.capture) : target.detachEvent(obj.evt, obj.callBack, obj.capture);
					});
                } 	
                /* remove from track list */
                delete window.EventObserve[selector];
                window.elementSelectors[parent].remove(i); 
			});
		}
	}
    /*if(instance.debug) _l("REMOVE ALL LISTENER ------------------->"); 
    if(instance.debug) _l(typeof instance.observe);
	for(var ele in instance.observe){ 
		// filter user defined prototype functions 
		if(typeof ele !== "function" && document.querySelector(ele) != null){
			if(instance.debug) _l('ele : '+ele);
			//_l('parent : '+instance.selector.tagName+"#"+instance.selector.id);
			if(instance.debug) _l(document.querySelector(ele));
			// remove listner
			var target = document.querySelector(ele);
			if(instance.debug) _l('Target to remove : ');
			if(instance.debug) _l(target);
			instance.observe[ele].forEach(function(obj, k){
				//_l("Removing event : "+obj.evt);
                //_l(obj.capture);
                instance.removeListener(obj.evt, obj.callBack, obj.capture);
			});
			delete instance.observe[ele];
		}
	}
	if(instance.debug) _l("Window Event Observe : --------------------------------------------");
    if(instance.debug) _l(instance.observe);
    if(instance.debug) _l("*************************************************************");*/
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
/*
Will the same addEventListener work?
------------------------------------
url : https://stackoverflow.com/questions/10364298/will-the-same-addeventlistener-work

func will not be called twice on click, no; but keep reading for details and a "gotcha."

From addEventListener in the spec:

If multiple identical EventListeners are registered on the same EventTarget with the same parameters the duplicate instances are discarded. They do not cause the EventListener to be called twice and since they are discarded they do not need to be removed with the removeEventListener method.

(My emphasis)

Here's an example:

var target = document.getElementById("target");

target.addEventListener("click", foo, false);
target.addEventListener("click", foo, false);

function foo() {
  var p = document.createElement("p");
  p.innerHTML = "This only appears once per click, but we registered the handler twice.";
  document.body.appendChild(p);
}
<input type="button" id="target" value="Click Me">
 Run code snippetExpand snippet
It's important to note, though, that it has to be the same function, not just a function that does the same thing. For example, here I'm hooking up four separate functions to the element, all of which will get called:

var target = document.getElementById("target");

var count;
for (count = 0; count < 4; ++count) {
  target.addEventListener("click", function() {
    var p = document.createElement("p");
    p.innerHTML = "This gets repeated.";
    document.body.appendChild(p);
  }, false);
}
<input type="button" id="target" value="Click Me">
 Run code snippetExpand snippet
That's because on every loop iteration, a different function is created (even though the code is the same).
 
*As we did not save or copy the function defination into a variable we actually create the same function defination. 
*If we use to save the defination into a variable and the call the variable from inside of the loop then that will has the same defination copy.

*/

/*
We can ignore loop and use map() for iterating array of objects : 
------------------------------------------------------------------
url : https://www.w3schools.com/jsref/jsref_map.asp

var persons = [
  {firstname : "Malcom", lastname: "Reynolds"},
  {firstname : "Kaylee", lastname: "Frye"},
  {firstname : "Jayne", lastname: "Cobb"}
];


function getFullName(item) {
  var fullname = [item.firstname,item.lastname].join(" ");
  return fullname;
}

function myFunction() {
  document.getElementById("demo").innerHTML = persons.map(getFullName);
}
*/

/*
Find closest parent : 
----------------------
    function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}
*/
/*
Get children of element :
--------------------------
https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
Has child logic
https://stackoverflow.com/questions/2161634/how-to-check-if-element-has-any-children-in-javascript
*/
/*
Find shiblings of element 
---------------------------
var result = [],
    node = this.parentNode.firstChild;

while ( node ) {
    if ( node !== this && node.nodeType === Node.ELEMENT_NODE ) 
      result.push( node );
    node = node.nextElementSibling || node.nextSibling;
}

Other way 
get all next siblings

//this will start from the current element and get all of the next siblings

function getNextSiblings(elem, filter) {
    var sibs = [];
    while (elem = elem.nextSibling) {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    }
    return sibs;
}

get all previous siblings

//this will start from the current element and get all the previous siblings

function getPreviousSiblings(elem, filter) {
    var sibs = [];
    while (elem = elem.previousSibling) {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    }
    return sibs;
}

get all siblings

//this will start from the first child of the current element's parent and get all the siblings

function getAllSiblings(elem, filter) {
    var sibs = [];
    elem = elem.parentNode.firstChild;
    do {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    } while (elem = elem.nextSibling)
    return sibs;
}

example filter to apply to above functions

// Example filter only counts divs and spans but could be made more complex
function exampleFilter(elem) {
    switch (elem.nodeName.toUpperCase()) {
        case 'DIV':
            return true;
        case 'SPAN':
            return true;
        default:
            return false;
    }
}
*/