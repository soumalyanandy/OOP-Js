/* File JS [Include File] */
import {_l,_e,_w,_i} from './console';

function file(debug = false){
    this.paths = [];
    this.isLoaded = false;
    this.debug = debug;
    this.loaded = [];

    file.prototype.add = function(src, type = null){ 
        if(type == null) throw new Error("Please provide file type");
        if(!this.paths.hasItem(src)){
            this.paths.push({
                src : src,
                type : type
            });
            if(this.debug) _l("File add from : "+src);
        }
    }

    file.prototype.addIMG = function(src_arr = [], seclector = 'body'){
        var FILE_SCOPE = this;
        var time = new Date().getTime();
        (function(){ 
			src_arr.forEach(function(src) {
                if(!FILE_SCOPE.loaded.hasItem(src)){
                    FILE_SCOPE.loaded.push(src);
                    if(FILE_SCOPE.debug) _l("IMG file add from : "+src+" in html.");
                    var image = document.createElement('img');
                    image.src = src;
                    image.async = false;
                    image.alt = src;
                    image.id = 'f_'+time;
                    seclector.parentNode.insertBefore(image, seclector);
                }
			});
		})();
    }

    file.prototype.addJS = function(src_arr = []){
        var FILE_SCOPE = this;
        var url = ""; //location.protocol+"//"+location.hostname+location.pathname;
        var time = new Date().getTime();
        (function(){ 
			src_arr.forEach(function(src) {
                if(!FILE_SCOPE.loaded.hasItem(src)){
                    FILE_SCOPE.loaded.push(src);
                    if(FILE_SCOPE.debug) _l("JS file add from : "+src+" in html.");
                    var script = document.createElement('script');
                    script.src = url+src;
                    script.async = false;
                    script.type = 'text/javascript';
                    script.id = 'f_'+time;
                    document.querySelector("head").appendChild(script);
                }
			});
		})();
    }

    file.prototype.addCSS = function(src_arr = []){
        var FILE_SCOPE = this;
        var url = ""; //location.protocol+"//"+location.hostname+location.pathname;
        var time = new Date().getTime();
        (function(){ 
			src_arr.forEach(function(src) {
                if(!FILE_SCOPE.loaded.hasItem(src)){
                    FILE_SCOPE.loaded.push(src);
                    if(FILE_SCOPE.debug) _l("CSS file add from : "+src+" in html.");
                    var link = document.createElement('link');
                    link.href = url+src;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.id = 'f_'+time;
                    //link.media = "screen,print";
                    document.querySelector("head").appendChild(link);
                }
			});
		})();
    }

    file.prototype.putInHTML = function(section = 'body'){
        if(this.debug) _l("File insert section set to : "+section+" in html.");
        this.section = section;
    }

    file.prototype.load = function(evt){ 
        if(this.debug) _l("File load ..."); 
        this.put();
    }

    file.prototype.put = function(){ 
        var resource = '';
        if(this.debug) _l(this.paths);
        if(this.debug) _l(this.paths.print());
        var FILE_SCOPE = this;
        var url = "";//location.protocol+"//"+location.hostname+location.pathname;
        var time = new Date().getTime();
        this.paths.forEach(function(obj, i){
            if(this.debug) _l("path : "+url+obj.src);
            if(!FILE_SCOPE.loaded.hasItem(obj.src)){
                FILE_SCOPE.loaded.push(obj.src);
                switch(obj.type.toUpperCase()){
                    case "JS":
                        resource = document.createElement('script');
                        resource.src = url+obj.src;
                        resource.async = false;
                        resource.type = 'text/javascript';
                        resource.id = 'f_'+time;
                    break;
                    case "CSS":
                        resource = document.createElement('link');
                        resource.href = url+obj.src;
                        resource.rel = 'stylesheet';
                        resource.type= 'text/css';
                        resource.id = 'f_'+time;
                        //resource.media = "screen,print";
                    break;
                }
                switch(FILE_SCOPE.section.toUpperCase()){
                    case "HEAD" : 
                        if(this.debug) _l("append to head");
                        document.querySelector("head").appendChild(resource);
                    break;
                    case "BODY" : 
                        if(this.debug) _l("append to body");
                        document.querySelector("body").appendChild(resource);
                    break;
                }
            }
        });
    }

    file.prototype.unload = function(){
        var FILE_SCOPE = this;
        document.querySelectorAll("[id^=f_]").toArray().forEach(function(ele, key){
            var src = ele.getAttribute("type") == "text/css"?ele.getAttribute("href"):ele.getAttribute("src");
            if(FILE_SCOPE.loaded.hasItem(src)){
                FILE_SCOPE.loaded.removeItem(src);
                if(FILE_SCOPE.debug) _l("File : "+src+" has been removed from html.");
            }
            ele.remove();
        });
    }

    file.prototype.dump = function(){
        _l("DUMP FILES --------------------->");
        _l(this.paths);
    }
}

export var File = new file();