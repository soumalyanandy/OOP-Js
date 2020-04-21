/* Module Javascript file */

// Module level libraries
import {_l,_e,_w,_i} from './console';
import {Block} from './block';
import {Validation} from './validation';
import {Data} from './data';
import {el} from './element';
import {File} from './file';
import {Hook} from './hook';

var instance = false;
export function Module(){
    if(instance) return instance;
    instance = this;
    this.resources = {};


    Module.prototype.load = function(modules = []){ 
        if(typeof modules === 'function') throw new Error("Module load function must call with array value.");
        var MODULE_SCOPE = this;
        
        (modules).forEach(function(module, i){
            //_l(module.name);
            // module object
            MODULE_SCOPE.resources[module.name] = new module();
        
            // get controls 
            if(MODULE_SCOPE.resources[module.name].controls){
                (MODULE_SCOPE.resources[module.name].controls).forEach(function(control, i){
                    MODULE_SCOPE.resources[module.name][control.name] = new control();
                    // copy resources to controls 

                    // module resources
                    if(MODULE_SCOPE.resources[module.name].routes) MODULE_SCOPE.resources[module.name][control.name].routes= MODULE_SCOPE.resources[module.name].routes;
                    if(MODULE_SCOPE.resources[module.name].models) MODULE_SCOPE.resources[module.name][control.name].models = MODULE_SCOPE.resources[module.name].models;
                    if(MODULE_SCOPE.resources[module.name].hooks) MODULE_SCOPE.resources[module.name][control.name].hooks = MODULE_SCOPE.resources[module.name].hooks;
                    if(MODULE_SCOPE.resources[module.name].views[control.name]) MODULE_SCOPE.resources[module.name][control.name].views = MODULE_SCOPE.resources[module.name].views[control.name];

                    // framework resources
                    MODULE_SCOPE.resources[module.name][control.name]._Data = Data;
                    MODULE_SCOPE.resources[module.name][control.name]._Block = Block;
                    MODULE_SCOPE.resources[module.name][control.name]._File = File;
                    MODULE_SCOPE.resources[module.name][control.name]._Hook = Hook;
                    MODULE_SCOPE.resources[module.name][control.name]._Module = Module;
                    MODULE_SCOPE.resources[module.name][control.name]._Validation = Validation;
                    MODULE_SCOPE.resources[module.name][control.name]._el = el;
                    //resources.push(resource);

                    // register hooks if exists
                    if(MODULE_SCOPE.resources[module.name].hooks){
                        MODULE_SCOPE.resources[module.name].hooks.forEach(function(hook, i){
                            Hook.register(module.name+"."+control.name, hook);
                        });
                    }

                    // register element actions if exists
                    if(MODULE_SCOPE.resources[module.name].actions){
                        for(var action in MODULE_SCOPE.resources[module.name].actions){
                            el().reg_action(action, MODULE_SCOPE.resources[module.name].actions[action]);
                        }
                    }
                });
            }
            
            // add routes to State
            if(MODULE_SCOPE.resources[module.name].routes){
                for(var route in MODULE_SCOPE.resources[module.name].routes){
                    State.when(route, MODULE_SCOPE.resources[module.name].routes[route], module.name, MODULE_SCOPE.resources[module.name]);
                }
            }
        
            // add module to State
            State.module(module.name,MODULE_SCOPE.resources[module.name]);
        });
    }

    Module.prototype.get = function(name = null){
        if(name != null && typeof this.resources[name] === "undefined") return false;
        return name != null && typeof this.resources[name] !== "undefined"?this.resources[name]:this.resources;
    }
}
