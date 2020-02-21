/* Module Javascript file */

// Module level libraries
import {_l,_e,_w,_i} from './console';
import {Block} from './block';
import {Validation} from './validation';
import {Data} from './data';
import {el} from './element';

var instance = false;
export function Module(){
    if(instance) return instance;
    instance = this;
    this.resources = {};


    Module.prototype.load = function(modules = []){
        if(!modules instanceof Array) throw new Error("Module load function must call with array value.");
        var MODULE_SCOPE = this;
        (modules).forEach(function(module, i){
            _l(module.name);
            // module object
            MODULE_SCOPE.resources[module.name] = new module();
        
            // get controls 
            (MODULE_SCOPE.resources[module.name].controls).forEach(function(control, i){
                MODULE_SCOPE.resources[module.name][control.name] = new control();
                // copy resources to controls 

                // module resources
                MODULE_SCOPE.resources[module.name][control.name].routes= MODULE_SCOPE.resources[module.name].routes;
                MODULE_SCOPE.resources[module.name][control.name].models = MODULE_SCOPE.resources[module.name].models;
                MODULE_SCOPE.resources[module.name][control.name].views = MODULE_SCOPE.resources[module.name].views[control.name];

                // framework resources
                MODULE_SCOPE.resources[module.name][control.name]._Data = Data;
                MODULE_SCOPE.resources[module.name][control.name]._Block = Block;
                MODULE_SCOPE.resources[module.name][control.name]._Module = Module;
                MODULE_SCOPE.resources[module.name][control.name]._Validation = Validation;
                MODULE_SCOPE.resources[module.name][control.name]._el = el;
                //resources.push(resource);
            });
            
            // add routes to State
            for(var route in MODULE_SCOPE.resources[module.name].routes){
                State.when(route, MODULE_SCOPE.resources[module.name].routes[route], module.name, MODULE_SCOPE.resources[module.name]);
            }
        
            // add module to State
            State.module(module.name,MODULE_SCOPE.resources[module.name]);
        });
    }

    Module.prototype.get = function(name = null){
        return typeof this.resources[name] !== "undefined"?this.resources[name]:this.resources;
    }
}
