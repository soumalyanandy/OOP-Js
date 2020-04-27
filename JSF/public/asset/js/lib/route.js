/* Route File */
/*
Usage : 
var URLRoute = new Route('url');
To bind states -
URLRoute.when('/url1',function(arguments ...){
	
});
To call route - 
URLRoute.goto('/url1',arguments ...);
*/

import {_l,_e,_w,_i} from './console';
import {Helper} from './helper';
import { el } from './element';
import {Hook} from './hook';
import {Module} from './module';
import {Cookie} from './cookie';
import {File} from './file';
import {notFound} from '../modules/notFound/module'; 

var listen = false;
var instance = false;
export function Route(type = 'url', debug = false){
	if(instance) return instance;
	instance = this;
	this.types = ['hash', 'url'];
	this.urls = [];
	this.urlCallBacks = {};
	this.hashes = [];
	this.hashCallBacks = {};
	this.type = type;
	this.modules = {};
	this.state = false;
	/* address info */
	this.uri = (this.type == 'url')?location.pathname.replace(/\/+$/,""):window.location.hash;
	this.site_url = location.protocol+"//"+location.hostname+location.pathname+'#/';
	this.current_url = (document.URL)?document.URL:location.protocol+"//"+location.hostname+location.pathname+window.location.hash;
	this.protocol = location.protocol;
	this.hostname = location.hostname;
	this.pathname = location.pathname;

	this.slugChange = 0;
	this.debug = debug;

	/* properties */
	Route.prototype.listen = function(){
		this.detectCurrentUrl();
		var path = this.uri; 
		_l('path : '+path);
		if(this.debug) _l(path);
		// parse route for callback
		var match = this.parse(path);
		if(this.debug) _l("match : "+match);
		//_l("match found : "+match);
		/* If match found ! */
		if(match){
			var state = this.currentState();
			if(this.debug) _l(state);
			if(typeof state !== "undefined"){
				document.title = state.title;
				if(this.type == 'url'){
					var url = this.uri+state.slug;
					if(this.debug) _l(url);
					if ("undefined" !== typeof history.pushState) { 
					    //var saveState = state;
					    //saveState.callBack = window.btoa(saveState.callBack); // encode
					    //saveState
					    window.history.pushState({slug : state.slug}, state.title, url);
					    //state.callBack.apply({},args.slice(1));
				  	} else {
				  		alert("Your browser does not support history.pushState ! Can not run callback.");
					    window.location.assign(url);
				  	}
			  	} else {
			  		//window.location.hash = state.hash;
					//state.callBack.apply({},args.slice(1));
					_runMainCallBack(window.location.hash);
			  	}
		  	} else throw new Error("Route is stateless !");
	  	} else {
	  		/* default route to landing page */
	  		if(this.type == 'url'){
	  			var url = this.uri+'/';
	  			if(this.debug) _l(url);
	  			if ("undefined" !== typeof window.history.pushState) {
				    window.history.pushState({}, '', url); 
			  	} else {
			  		alert("Your browser does not support history.pushState ! Can not run callback.");
				    window.location.assign(url);
			  	}
	  		} else { 
				//window.location.hash = '#';
	  			window.location.hash = '#/';
			}
		}
		this.listenState();
	}

	Route.prototype.listenState = function(){ 
		if(!listen){
			listen = true;
			if(this.type == 'url'){ 
				window.addEventListener("popstate", function(e){
					if(this.debug) _l("listen to url");
				    if(e.state){
				    	//this.state = e.state;
				    	if(this.debug) _l(e.state);
				    	//var callback = JSON.parse(e.state.callBack);
				    	//callback.apply({},[]);
				        //document.getElementById("content").innerHTML = e.state.html;
				        //document.title = e.state.pageTitle;
				    } //else this.state = false;
				})
				/*window.onpopstate = function(e){ 
				};*/
			} else {
				window.addEventListener("hashchange", function(e){
					_l("listen to hash");
					_l("# changed to : "+window.location.hash);
					
					//Cookie.set('hash', window.location.hash);
					/* remove all event listener */
					/*el("", null, 'removeAllListener', function(){
						_runMainCallBack(window.location.hash);
					});*/
					_runMainCallBack(window.location.hash);
				});
				/*window.onhashchange = function () {
				}*/
			}
		}
	}

	Route.prototype.detectSiteUrl = function(){
		this.site_url = location.protocol+"//"+location.hostname+location.pathname+'#/';
	}

	Route.prototype.detectCurrentUrl = function(){

	}

	Route.prototype.push = function(val){
		if(this.type == 'url' && this.urls.indexOf(val) === -1) this.urls.push(val);
		else if(this.type == 'hash' && this.hashes.indexOf(val) === -1) this.hashes.push(val);
	}

	Route.prototype.when = function(val, callBack, title="", resources = {}){
		this.push(val);	
		val = (val.length == 1)?val:Helper.rtrim(val,'/').replace("?","");
		if(this.type == 'url'){
			this.urlCallBacks[val] = {
				type : 'url',
				title : (title != "")?title:val,
				callBack : callBack,
				slug : val
			};	
		} else {
			this.hashCallBacks[val] = {
				type : 'hash',
				title : (title != "")?title:val,
				callBack : callBack,
				resources : resources,
				hash : val
			};
		}
	}

	Route.prototype.segments = function(){
		var p = [], slug = window.location.hash;
		slug = Helper.ltrim(slug,'#/');
		p[0] = slug;
		p[1] = slug.split('/');
		return p;
	}

	Route.prototype.parse = function(val){ //_l(val);
		return _parse(this, val);
	}

	Route.prototype.goto= function(){ 
		/* before redirect hook */
		_call_hook(this, 'before-redirect');

		/* before redirect remove all event listener */
		State.removeAllListners();

		/* file unload */
		State.fileUnload();

		/* loader in the app view */
		State.appViewIsEmpty(false,`<div id="main"><div class="loader"></div></div>`);

		var args = Helper.collection(arguments);
		var val = args[0];
		// parse route for callback
		var match = this.parse(val);
		if(this.debug) _l("match : "+match);
		/* If match found ! */
		if(match){
			var state = this.currentState();
			if(this.debug) _l(state);
			if(typeof state !== "undefined"){
				document.title = state.title;
				if(this.type == 'url'){
					var url = this.uri+state.slug;
					if(this.debug) _l(url);
					if ("undefined" !== typeof history.pushState) { 
					    //var saveState = state;
					    //saveState.callBack = window.btoa(saveState.callBack); // encode
					    //saveState
					    window.history.pushState({slag : state.slug}, state.title, url);
					    //state.callBack.apply({},args.slice(1));
				  	} else {
				  		alert("Your browser does not support history.pushState ! Can not run callback.");
					    window.location.assign(url);
				  	}
			  	} else {
					window.location.hash = '#/';
			  		window.location.hash = state.hash;
			  		//state.callBack.apply({},args.slice(1));
			  	}
		  	} else throw new Error("Route is stateless !");
	  	} else {
	  		/* default route to landing page */
	  		if(this.type == 'url'){
	  			var url = this.uri+'/';
	  			if(this.debug) _l(url);
	  			if ("undefined" !== typeof window.history.pushState) {
				    window.history.pushState({}, '', url); 
			  	} else {
			  		alert("Your browser does not support history.pushState ! Can not run callback.");
				    window.location.assign(url);
			  	}
	  		} else {
	  			window.location.hash = '';
	  		}
	  	}
	}

	Route.prototype.hook_reg = function(hookObj = {}){
		_hooks(this, hookObj);
	}

	Route.prototype.currentState = function(){
		return this.state;
	}	

	Route.prototype.slugChangeCount = function(){
		return this.slugChange;
	} 

	/* --: MODULE Global Functions : -- */
	Route.prototype.module = function(module, resource){
		this.modules[module] = resource;
	}

	Route.prototype.call_module_action = function(action, param = []){
		var param_collection = Helper.collection(param);
		var p = this.segments();
		if(param_collection != null){
			param_collection.forEach(function(val, key){
				p.push(val);
			});
		}
		var mod_info = action.split('.');
		var control = this.modules[mod_info[0]][mod_info[1]];
		control[mod_info[2]].apply(control, p);
	}

	/* --: BLOCK Global Functions : -- */
	Route.prototype.appViewIsEmpty = function(isEmpty = false, html = ''){
		/* search for hidden attribute _appView */
		var ele = document.querySelector("DIV[_appView]");
		if(ele){
			if(isEmpty) ele.innerHTML = '';
			else if(!isEmpty && html != '') ele.innerHTML = html;
			return ele.innerHTML;
		} 
		return '';
	}

	/* --: FILE Global Functions : -- */
	Route.prototype.addFile = function(src, type){
        File.add(src, type);
	}

	Route.prototype.filePutInHTML = function(sec){
		File.putInHTML(sec);
		/* Load File Resources */
		File.load();
	}

	Route.prototype.fileUnload = function(){
		File.unload();
	}

	/* --: element Global Functions : -- */
	Route.prototype.removeAllListners = function(){
		el().removeAllListener();
	}
}

/* Abstruction */
//var hook_instance = false;
function _hooks(instance, hook = {}){
	//if(!hook_instance) hook_instance = new Hook(true);
	Hook.register("ROUTE", hook);
}

function _call_hook(instance, key, val = ''){
	//if(!hook_instance) hook_instance = new Hook(true);
	return Hook.call("ROUTE", key, val);
}

function _runMainCallBack(slug){ //_l('here');
	//var args = Helper.collection(arguments);
	//var slug= window.location.hash;

	/* Current URL */
	//State.site_url = location.protocol+"//"+location.hostname+location.pathname+'#/';

	var route = State; //new Route('hash', true);
	route.slugChange +=1;

	/* action arguments */
	var args = route.segments();
	
	/* before redirect remove all event listener */
	//el("", null, 'removeAllListener'); 

	/* Make the app view empty */
	route.appViewIsEmpty(true);

	// parse route for callback
	var match = route.parse(slug);
	if(route.debug) _l("match : "+match);

	/* If match found ! */
	if(match){
		var state = route.currentState();
		if(route.debug) _l(state);
		if(typeof state !== "undefined"){
			//document.title = state.title;
			var module = state.resources;

			if(route.type == 'url'){
				var url = route.uri+state.slug;
				if(route.debug) _l(url);
				if ("undefined" !== typeof history.pushState) { 
					//var saveState = state;
					//saveState.callBack = window.btoa(saveState.callBack); // encode
					//saveState
					//window.history.pushState({}, state.title, url);
					state.callBack.apply({module}, args);
				} else {
					  //alert("Your browser does not support history.pushState ! Can not run callback.");
					//window.location.assign(url);
				}
			} else {
				  //window.location.hash = state.hash;
				  state.callBack.apply({module},args);
			}
		} else throw new Error("Route is stateless !");
	} else {
		/* default route to landing page */
		if(route.type == 'url'){
			var url = route.uri+'/';
			//_l(url);
			if ("undefined" !== typeof window.history.pushState) {
				//window.history.pushState({}, '', url); 
			} else {
				alert("Your browser does not support history.pushState ! Can not run callback.");
				//window.location.assign(url);
			}
		} else {
			//window.location.hash = '';
			var module = new Module();
			module.load([notFound]);
			var NotFoundModule = module.get('notFound');
			if(NotFoundModule){
				NotFoundModule.notFoundControl.show();
			} else {
				route.appViewIsEmpty(false,`
					<div style="padding : 5px; margin : 5px;">
						<div style="width : 100%; heigth : auto; border : 1px dotted black;">
							<h1 style="font-family : sarif; font-weight : bold; font-size : 40px; text-align:center;">404 Not Found</h1>
						</div>
					</div>	
				`);
			}
		}
	}
}

function _parse(instance, val){ //_l('parse hash : '+val);
	/* for each callback reference */
	if(instance.type == 'url'){
		if(instance.debug) _l(instance.urlCallBacks);
		for (var key in instance.urlCallBacks) {
			// Convert wildcards to RegEx
			var regex_key = key.replace(/\//g, '\\\/').replace(':any', '[^/]+').replace(':num', '[0-9]+');
			//_l(key);
			//_l('/^'+regex_key+'$/');
			// check regex and find match
			var routeReg = new RegExp(`^${regex_key}$`,'gi'); 
			//_l(routeReg);
			var matched = val.match(routeReg);
			if(instance.debug) _l(matched);
			if(matched != null){
				//return key;//val.match(key);
				instance.state = instance.urlCallBacks[key];
				instance.state.slug = val;
				return true;
			}
		}
	} else {
		if(instance.debug) _l(instance.hashCallBacks);
		val = val.replace("#","");
		for (var key in instance.hashCallBacks) {
			// Convert wildcards to RegEx
			var regex_key = key.replace(/\//g, '\\\/').replace(':any', '[^/]+').replace(':num', '[0-9]+');
			//_l(val);
			//_l('/^'+regex_key+'$/');
			// check regex and find match
			var routeReg = new RegExp(`^${regex_key}$`,'gi'); 
			//_l(routeReg);
			var matched = val.match(routeReg);
			//_l('matched : '+matched);
			if(instance.debug) _l(matched);
			if(matched != null){
				//return key;//val.match(key);
				instance.state = instance.hashCallBacks[key];
				instance.state.hash = val;
				return true;
			}
		}
	}
	return false;
}


/*
References : 
1) https://en.wikipedia.org/wiki/Single-page_application
A single-page application (SPA) is a web application or web site that interacts with the user by dynamically rewriting the current page rather than loading entire new pages from a server. This approach avoids interruption of the user experience between successive pages, making the application behave more like a desktop application. In an SPA, either all necessary code – HTML, JavaScript, and CSS – is retrieved with a single page load,[1] or the appropriate resources are dynamically loaded and added to the page as necessary, usually in response to user actions. The page does not reload at any point in the process, nor does control transfer to another page, although the location hash or the HTML5 History API can be used to provide the perception and navigability of separate logical pages in the application.[2] Interaction with the single-page application often involves dynamic communication with the web server behind the scenes.

2) https://developer.mozilla.org/en-US/docs/Web/API/History_API
The DOM Window object provides access to the browser's session history (not to be confused for WebExtensions history) through the history object. It exposes useful methods and properties that let you navigate back and forth through the user's history. As of HTML5, they also let you manipulate the contents of the history stack.

3) https://stackoverflow.com/questions/3338642/updating-address-bar-with-new-url-without-hash-or-reloading-the-page

if (history.pushState) {
  window.history.pushState("object or string", "Title", "/new-url");
} else {
  document.location.href = "/new-url";
}

4) https://stackoverflow.com/questions/824349/how-do-i-modify-the-url-without-reloading-the-page


function processAjaxData(response, urlPath){
     document.getElementById("content").innerHTML = response.html;
     document.title = response.pageTitle;
     window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
 }
 window.onpopstate = function(e){
    if(e.state){
        document.getElementById("content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};

function goTo(page, title, url) {
  if ("undefined" !== typeof history.pushState) {
    history.pushState({page: page}, title, url);
  } else {
    window.location.assign(url);
  }
}

goTo("another page", "example", 'example.html');

That's the way Angular uses to do SPA according to hashtag...

Changing # is quite easy, doing like:

window.location.hash = "example";
And you can detect it like this:

window.onhashchange = function () {
  console.log("#changed", window.location.hash);
}

5) Route wildcard to regex conversion :
Use PHP CodeIgniter 3.0 system/core/route.php functionality.

*/