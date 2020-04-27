/* Module.js */
import { _l } from '../../lib/console';

/* control */
var notFoundControl = function(){
    //if(instance) return instance;
    //instance = this;
   
    /* property : Private */
    
    /* (prototype)method/action : Public */
    notFoundControl.prototype.show = function(){
        /* copy controller instance(SCOPE) */
        var SCOPE = this;

        /* create 404 block */
        var error404Block = new SCOPE._Block('#error404',['row']);
        error404Block.empty();
        error404Block.templateRaw(SCOPE.views['error_404_template']);
        error404Block.assign('site_url',State.site_url);
        error404Block.render();
    };
};


export function notFound(){
    this.controls = [notFoundControl];
    //this.models = [];
    this.views = {
        'notFoundControl' : {
            'error_404_template' : `
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-body">
                                <h1 class="text-center">404 Not Found</h1>
                                <a href="(site_url)" class="btn btn-info" id="back" name="back">Back to Home page</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    //this.routes = {};
}


