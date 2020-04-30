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

/* Element Prototype */
/*
    @method : matches
    @desc : check if current element is given selector or not 
*/
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;            
        };
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
    @method : remove Array element
    @desc : check if value exists inside of the array and remove that
    @suggestion : take care of IE9 and above
*/
if(!Array.prototype.removeItem) { // check previous existance
    Array.prototype.removeItem = function(item) {
        var pos = this.indexOf(item);
        if(pos != -1){
            this.splice(pos,1);
        }
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

/* 
    @method : isEmpty
    @desc : check if an object is empty or not
    @suggestion : use to check if an object is blank
*/
if(!Object.prototype.isEmpty) { // check previous existance
    Object.prototype.isEmpty = function() {
        for(var prop in this) { 
            if(this.hasOwnProperty(prop)) {
                return false;
            }
        }
        /* check of object is equal to a blank JSON */
        return JSON.stringify(this) === JSON.stringify({});
    }
}

/*if (!Element.prototype.addEventListener) {
    var oListeners = {};
    function runListeners(oEvent) {
      if (!oEvent) { oEvent = window.event; }
      for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
        if (oEvtListeners.aEls[iElId] === this) {
          for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
          break;
        }
      }
    }
    //, useCapture (will be ignored!) 
    Element.prototype.addEventListener = function (sEventType, fListener ) {
      if (oListeners.hasOwnProperty(sEventType)) {
        var oEvtListeners = oListeners[sEventType];
        for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
          if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
        }
        if (nElIdx === -1) {
          oEvtListeners.aEls.push(this);
          oEvtListeners.aEvts.push([fListener]);
          this["on" + sEventType] = runListeners;
        } else {
          var aElListeners = oEvtListeners.aEvts[nElIdx];
          if (this["on" + sEventType] !== runListeners) {
            aElListeners.splice(0);
            this["on" + sEventType] = runListeners;
          }
          for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
            if (aElListeners[iLstId] === fListener) { return; }
          }     
          aElListeners.push(fListener);
        }
      } else {
        oListeners[sEventType] = { aEls: [this], aEvts: [ [fListener] ] };
        this["on" + sEventType] = runListeners;
      }
    };
    //, useCapture (will be ignored!) 
    Element.prototype.removeEventListener = function (sEventType, fListener ) {
      if (!oListeners.hasOwnProperty(sEventType)) { return; }
      var oEvtListeners = oListeners[sEventType];
      for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
        if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
      }
      if (nElIdx === -1) { return; }
      for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
        if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
      }
    };
}*/

/* 
    @method : matches
    @desc : checks to see if the Element would be selected by the provided selectorString
    @suggestion : checks if the element "is" the selector
*/
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;            
        };
}

function Exporter(){
    this.Array = Array;
    this.Object = Object;
    this.NodeList = NodeList;
    this.Element = Element;
}

export var Prototype = new Exporter();