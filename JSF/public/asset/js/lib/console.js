/* Console js file */
export function _l(txt){
    console.log(txt);
}

export function _i(txt){
    console.info(txt);
}

export function _w(txt){
    console.warn(txt);
}

export function _e(txt){
    console.error(txt);
}

export function _dd(exp){
	eval(exp);
	return false;
}

export function _exit(val){
    console.log(val);
    return false;
}