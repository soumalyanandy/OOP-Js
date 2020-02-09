/* Prototype file for extending inbuilt javascript object properties */

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

function Exporter(){
    this.Array = Array;
    this.Object = Object;
    this.NodeList = NodeList;
}

export var Prototype = new Exporter();