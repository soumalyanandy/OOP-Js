/* Helper Javascript File */
import {_l,_e,_w,_i} from './console';
/*
    @title : Collection of values
    @name : collection
    @desc : convert array like objects to array.
    @param : Object arrayLikeObject
    @return : Array/Null
*/
function collection(arrayLikeObject = new Object()){
    var size = arrayLikeObject.length, cloned = null, i;
    if (size > 0) {
        cloned = new Array(size); // Fixed size array
        if (arrayLikeObject.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = arrayLikeObject.charAt(i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = arrayLikeObject[i];
          }
        }
    }
    return cloned;
}

/* val.replace(/^\/+/,"").replace(/\/+$/,"") */

function trim(str, char){
  var LtrimReg = new RegExp(`^\\${char}+`);
  var RtrimReg = new RegExp(`\\${char}+$`);
  return str.replace(LtrimReg,'').replace(RtrimReg,'');
}

function ltrim(str, char){ 
	var trimReg = new RegExp(`^\\${char}+`);
	return  str.replace(trimReg,'');
}

function rtrim(str, char){ 
	var trimReg = new RegExp(`\\${char}+$`);
	return  str.replace(trimReg,'');
}

function timestamp(){
  return new Date().getTime();
}

function objectHasUserDefinedPrototype(obj){
  if(Object.getPrototypeOf){
      return Object.getPrototypeOf(obj) !== Object.prototype;
  } else {
      return obj.constructor !== Object;
  }
}


function Exporter() {
  this.collection = collection;
  this.trim = trim;
	this.ltrim = ltrim;
  this.rtrim = rtrim;
  this.timestamp = timestamp;
};
export var Helper = new Exporter();


/*
References:

function is_object(mixed_var) {
    if (mixed_var instanceof Array) {
        return false;
    } else {
        return (mixed_var !== null) && (typeof( mixed_var ) == 'object');
    }
}

function objectToArray(obj) {
    var array = [], tempObject;
    for (var key in obj) {

        tempObject = obj[key];

        if (is_object(obj[key])) {
            tempObject = objectToArray(obj[key]);
        }
        array[key] = tempObject;
    }
    return array;
}

*/