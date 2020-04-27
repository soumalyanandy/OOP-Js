/* Module.js */
import { _l } from '../../lib/console';

import {CRUD} from './controls/crud';
import {Hook} from './hooks/hook';
import {CRUD_VIEW} from './views/crud';
import {Route} from './config/route';

export function Blog(){
    this.controls = [CRUD];
    this.models = [];
    this.actions = {
        'redirect' : function(eleObj){
            State.goto(this.param);
        },
        'confirm_redirect' : function(eleObj){
            var param = this.param.split(',');
            if(confirm(param[0])){
                State.goto(param[1]); 
            }
        }
    };
    this.hooks = Hook;
    this.views = {
        'CRUD' : CRUD_VIEW
    };
    this.routes = Route;
}

