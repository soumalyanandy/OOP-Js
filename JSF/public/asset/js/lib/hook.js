/* HOOK Javascript File */
import {_l,_e,_w,_i} from './console';
//var instance = false;
export function hook(debug = false){
    //if(instance) return instance;
    //instance = this;
    this.hooks = [];
    this.debug = debug;

    /* Prototype/Public functions */
    hook.prototype.register = function(type, hook = {}){
        _hooks(this, type, hook);
    }

    hook.prototype.dump = function(){
        _l("HOOKS :-");
        for(var hook in this.hooks){
            _l("hook : "+hook);
            _l("callback : ");
            _l(this.hooks[hook]);
        }
    }

    hook.prototype.call = function(type, key, data, classObject, callBack = false){
        return _call_hook(this, type, key, data, classObject, callBack);
    }
    return this;
}

/* Abstructions */
function _hooks(instance, type, hook = {}){
    instance.hooks[type] = [];
    if(instance.debug) {
        _l("Hook type "+type+" => Hook :: ");
        _l(hook);
        _l(" pushed !");
    }
    instance.hooks[type].push(hook);
}

function _call_hook(instance, type, key, val = '', classObject, callBack){
    if(typeof instance.hooks[type] !== "undefined"){
        for (var i=0; i < instance.hooks[type].length; i++) {
            var hook = instance.hooks[type][i];
            if(hook.hasOwnProperty(key)){ 
                if(typeof hook[key] === 'function'){
                    if(instance.debug) _l(key+" hook called from "+type);
                    hook[key].apply(classObject, [val, callBack]);
                    return true;
                }
            }
        }
    }
    return false;
}

export var Hook = new hook();