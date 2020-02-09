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

function Exporter() {
	this.collection = collection;
	this.ltrim = ltrim;
  this.rtrim = rtrim;
  this.timestamp = timestamp;
};
export var Helper = new Exporter();
