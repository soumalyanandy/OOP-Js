/* Route.js */
//var instance = false;
export function Route(type){
	//if(instance) return instance;
	//instance = this;
	this.types = ['hash', 'url'];
	this.urls = [];
	this.urlCallBacks = {};
	this.hashes = [];
	this.hashCallBacks = {};
	this.type = 'url';
	this.state = false;

	if(this.types.indexOf(type.toLowerCase()) !== -1){
		this.type = type;
	}

	/* properties */
	Route.prototype.constructor = function(){
		if(this.type == 'url'){
			window.onpopstate = function(e){
			    if(e.state){
			    	this.state = e.state;
			    	_l(e.state);
			    	e.state.callBack.apply({},[]);
			        //document.getElementById("content").innerHTML = e.state.html;
			        //document.title = e.state.pageTitle;
			    } else this.state = false;
			};
		} else {
			window.onhashchange = function () {
			  	console.log("#changed", window.location.hash);
			  	this.hashCallBacks[window.location.hash].callBack.apply({},[]);
			}
		}
	}

	Route.prototype.push = function(val){
		if(this.type == 'url' && this.urls.indexOf(val) === -1) this.urls.push(val);
		else if(this.type == 'hash' && this.hashes.indexOf(val) === -1) this.hashes.push(val);
	}

	Route.prototype.when = function(val, callBack, title=""){
		this.push(val);
		if(this.type == 'url'){
			url = val;
			val = val.replace("/","").replace("?","");
			this.urlCallBacks[val] = {
				title : (title != "")?title:val,
				callBack : callBack,
				url : url
			};	
		} else {
			this.hashCallBacks[val] = {
				title : (title != "")?title:val.replace("/","").replace("?",""),
				callBack : callBack,
				hash : val
			};
		}
	}

	Route.prototype.goTo= function(val){
		var state = (this.type == 'url')?this.urlCallBacks[val]:this.hashCallBacks[val];
		document.title = state.title;
		if(this.type == 'url'){
			if ("undefined" !== typeof history.pushState) {
			    window.history.pushState({ callBack : state.callBack }, state.title, state.url);
		  	} else {
		  		alert("Your browser does not support history.pushState ! Can not run callback.");
			    window.location.assign(state.url);
		  	}
	  	} else {
	  		window.location.hash = state.hash;
	  	}
	}
}

/*
var URLRoute = new Route('url')
URLRoute.goTo('/url1',function(){
	
});


Resources : 
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

*/