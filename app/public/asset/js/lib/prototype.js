import { _l } from "./console";

/* Prototype file for extending inbuilt javascript object properties */
/* 
NOTE : if define any property to a datatype then it is act as user defined properties 
and it will ack as an item of the user defined data set. 
But user did not assign the function inside of his data set. 
Means if you assign an object with data then if object got any user defined properties then 
that also act as an item of the data object. Which can create error. So it is better to check if
you have right type of data when loop through the data set. 
Check with IF condition for specific type of data and then process with that.
*/

/* Node list prototype */

/*
    @method : toArray
    @desc : convert nodelist to array 
*/
if(!NodeList.prototype.toArray) { // check previous existance
    NodeList.prototype.toArray = function() { 
        return Array.prototype.slice.call(this);
    }
}

/* Array prototype */

/*
    @method : remove
    @desc : remove an array element by id
    @reference : https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
*/
if(!Array.prototype.remove) { // check previous existance
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}

/* 
    @method : indexOf
    @desc : check if value exists inside of the array
    @suggestion : take care of IE8 and below
*/
if(!Array.prototype.indexOf) { // check previous existance
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

/* 
    @method : inArray
    @desc : check if value exists inside of the array
    @suggestion : take care of IE9 and above
*/
if(!Array.prototype.hasItem) { // check previous existance
    Array.prototype.hasItem = function(item) {
        return this.indexOf(item) !== -1?true:false;
    };
}

/* 
    @method : print
    @desc : print array in the console in human readable form
    @suggestion : use to debug array
*/
if(!Array.prototype.print) { // check previous existance
    Array.prototype.print = function() {
        _l("ARRAY PRINT --start--");
        this.forEach(function(val,key){
            _l("Key : "+key+" Value : "+val);
            if(typeof val == "object"){
                _l("__Inside of ARRAY");
                val.printR();
            }
        });
        _l("ARRAY PRINT --end--");
    };
}

/* 
    @method : print
    @desc : print object in the console in human readable form
    @suggestion : use to debug object
*/
if(!Object.prototype.print) { // check previous existance
    Object.prototype.print = function() {
        _l("OBJECT PRINT --start--");
        _l(JSON.stringify(this));
        _l("OBJECT PRINT --end--");
    };
} 

function Exporter(){
    this.Array = Array;
    this.Object = Object;
    this.NodeList = NodeList;
}

export var Prototype = new Exporter();