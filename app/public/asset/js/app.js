/* Bootstrap Javascript File (Front Controller) */

/* include libraries */
import {_l,_e,_w,_i} from './lib/console';
import {vCSS} from './lib/vcss';

/* Element JS */
import {el} from './lib/element';

/* include modules */
import {Blog} from './modules/blog/module';

el("window").on("load", [Blog], function(ev, doc, modules){ 
  _l(modules['Blog']);
  _l("window load");

  /* variable css */
  var vcss=new vCSS(`
    .p0{
      padding: 0;
    }
    .m0{
      margin: 0;
    }
    .container{
      _p0;
      _m0;
      background: #eee;
    }
    .Ele{
      border: 1px dotted red;
    }
    .f-sans-b{
      font-family: sans-serif;
      font-style: normal;
    }
    .row{
      height: 100%;
      width: 100%;
      margin: 2px;
    }
    .col{
      _m0;
      padding: 2px;
    }
    .fLeft{
      float: left;
    }
    .col-sm12{
      _col;
      width:100%;
    }
    .col-sm6{
      _col;
      width:60%;
    }
    .col-sm4{
      _col;
      _fLeft;
      width:40%;
    }
    .col-sm3{
      _col;
      width:30%;
    }
    .col-sm2{
      _col;
      width:20%;
    }
    .col-sm1{
      _col;
      width:10%;
    }
    .ht100{
      height: 100px;
    }
    .ht200{
      height: 200px;
    }
    .ht500{
      height: 500px;
    }
    .ht1000{
      height: 1000px;
    }
  `).stylize();
});