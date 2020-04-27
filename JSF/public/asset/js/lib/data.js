/* Data Base File */
import {_l,_e,_w,_i} from './console';
export function Data(model, debug = false){
    try{
        if(typeof model === "undefined") throw("Data Error : Please give model name.");
        this.model = model;
        this.PostData = {};
        this.SaveData = {};
        this.unique_id = null; //_genUniqueId();
        this.debug = debug;
        if(debug){
            _l('Data debug mode : ON');
        }
    } catch(err){
        _e(err);
    }


Data.prototype.data = function(data){
    _data(this, data);
}

Data.prototype.save = function(){
    return _save(this);
}

Data.prototype.delete = function(){
    return _delete(this);
}

Data.prototype.get = function(id){ 
    return _get(this, id);
}

Data.prototype.getAll = function() {
    return _getAll(this);
}


/* Abstructions */
function _clear(instance){
    instance.PostData = {};
    instance.SaveData = {};
}

function _genUniqueId(){
    return new Date().getTime();
}

function _data(instance, dataObj){
    for(var key in dataObj){
        if(instance.debug) _l('form data pair : '+key+' => '+dataObj[key].trim());
		if(typeof dataObj[key] !== 'function') instance.PostData[key] = dataObj[key].trim();
	}
}

function _save(instance){
    var id = (instance.unique_id != null)?instance.unique_id:_genUniqueId();
    try{
        localStorage.setItem(instance.model+id, JSON.stringify(instance.PostData));
    } catch(err){
        _e(err); 
        return false;
    }
    return instance.model+id;
}

function _delete(instance){ _l('delete id : '+instance.unique_id);
    if(instance.unique_id != null){
        try{
            localStorage.removeItem(instance.model+instance.unique_id);
        } catch(err){
            _e(err); 
            return false;
        }
    }
}

function _get(instance, id){
    var id = id.indexOf(instance.model) !== -1?id:instance.model+id;
    try{
        var data = localStorage.getItem(id); 
        instance.SaveData[id] = (data != null)?JSON.parse(data):{};
    } catch(err){
        _e(err); 
        return false;
    }
    return instance.SaveData[id];
}

function _getAll(instance){
    var keys = Array(), prop, i;
    for (prop in localStorage) {
        if (hasOwnProperty.call(localStorage, prop) && prop.indexOf(instance.model) !== -1) {
            keys.push(prop);
        }
    }
    i = keys.length;
	while ( i-- ) { 
        instance.get( keys[i] );
    }
	return instance.SaveData;
}

}