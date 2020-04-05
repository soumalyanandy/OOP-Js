/* Module.js */
import { _l } from '../../lib/console';

import {CRUD} from './controls/crud';
import {Hook} from './hooks/hook';
import {CRUD_VIEW} from './views/crud';
import {Route} from './config/route';

export function Blog(){
    this.controls = [CRUD];
    this.models = [];
    this.hooks = Hook,
    this.views = {
        'CRUD' : CRUD_VIEW
    };
    this.routes = Route;
}

