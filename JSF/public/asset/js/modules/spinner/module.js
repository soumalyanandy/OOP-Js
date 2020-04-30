/* Module.js */
import { _l } from '../../lib/console';

/* control */
var spinnerControl = function(){
    //if(instance) return instance;
    //instance = this;
   
    /* property : Private */
    
    /* (prototype)method/action : Public */
    spinnerControl.prototype.pageLoaderShow = function(){ 
        /* copy controller instance(SCOPE) */
        var SCOPE = this;

        /* Empty main view */
        State.appViewIsEmpty(true);

        /* create spinner block */
        var spinnerBlock = new SCOPE._Block('#spinner',['row']);
        spinnerBlock.empty();
        spinnerBlock.templateRaw(SCOPE.views['spinner_template']);
        spinnerBlock.render();
    }

    spinnerControl.prototype.pageLoaderHide = function(){
        /* copy controller instance(SCOPE) */
        var SCOPE = this;
        SCOPE._el('#spinner').delete();
    }
};


export function spinner(){
    this.controls = [spinnerControl];
    //this.models = [];
    this.views = {
        'spinnerControl' : {
            'spinner_template' : `
            <style>
                .loader {
                    border: 16px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 16px solid blue;
                    border-bottom: 16px solid blue;
                    width: 120px;
                    height: 120px;
                    -webkit-animation: spin 2s linear infinite;
                    animation: spin 2s linear infinite;
                }
                
                DIV#main {
                    width: 100%;
                    height: 50%;
                    /*border: 1px solid #c3c3c3;*/
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    position:absolute;
                }

                @-webkit-keyframes spin {
                    0% { -webkit-transform: rotate(0deg); }
                    100% { -webkit-transform: rotate(360deg); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div id="main"><div class="loader"></div></div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    };
    //this.routes = {};
}


