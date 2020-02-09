/* Bootstrap Javascript File (Front Controller) */

/* include libraries */
import {_l,_e,_w,_i} from './lib/console';
import {el} from './lib/element';
import {Block} from './lib/block';
import {Validation} from './lib/validation';
import {Data} from './lib/data';
import {Route} from './lib/route';

/* include controllers */
import {Blog} from './controller/blog';

/* Load route */
var URLRoute = new Route('url', true);
//var HashRoute = new Route('hash');

/* Load controller */
var blogControl = new Blog();

/* assign resources to blog controller */
blogControl.route = URLRoute;
//blogControl._Data = Data;
//blogControl._Block = Block;
//blogControl._Validation = Validation;
//blogControl._el = el;

window.addEventListener("load", function(){
	_l("window load");
	/* Routes */
	URLRoute.when('/edit/(:any)',function(el){
		//alert("edit "+el.id);
		blogControl.edit(el);
	});
	URLRoute.when('/delete/(:any)',function(el){
		//alert("delete "+el.id);
		blogControl.delete(el);
		//URLRoute.goto('/');
	});
	URLRoute.listen();

	/* Routes */
	/*HashRoute.when('/edit/(:any)',function(el){
		alert("edit "+el.id);
	});
	HashRoute.when('/delete/(:any)',function(el){
		alert("delete "+el.id);
		HashRoute.goto('/');
	});
	HashRoute.listen();*/

	
	//blogControl.Data = Data;

	//blogControl.list();

	/* Load database */
	var BlogModel = new Data('form');
	var archives = BlogModel.getAll();
	
	/* blog from block object */
	var blogFormBlock = new Block('#blogFormBlock');
	var blogListBlock = new Block('#blog_list');
	
	/* list all posted blog from local storage */
	blogListBlock.template('#_blank_blog_row_template');
	
	/*for (var key in archives) {
		if (archives.hasOwnProperty(key)) {
			archive = JSON.parse(archives[key]);
			blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+archive['file']+'" />');
			blogListBlock.append(archive, false, false);
		}
	}*/

	/* Register a hook in cycle */
	blogListBlock.hook_reg({
		'before-append-in-cycle' : function(val){ 
			blogListBlock.assign('edit_blog_btn','editBlogBtn'+val['_key']);
			blogListBlock.assign('edit_link','/edit/'+val['_key']);
			blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+val['_key']);
			blogListBlock.assign('delete_link','/delete/'+val['_key']);
			blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+val['file']+'" />');
		}
	}); 
	/*blogListBlock.hook_reg({
		'after-render' : function(val){
			
		}
	});*/
	/* manage event into the block */
	blogListBlock.cycle(archives, function(blockEl){
		// After listing blog, listen to click function 
		el(blockEl).find('.editBtn').on('click', function(ev, ele, parent){
			var ele = el(ele).get();
			//var el = ev.target; 
			if(ele.hasAttribute('_href')){
				var route = ele.getAttribute('_href');
				URLRoute.goto(route, ele);
				//HashRoute.goto(route, ele);
			}
		});
		el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
			var ele = el(ele).get();
			//var el = ev.target; 
			if(ele.hasAttribute('_href')){
				var route = ele.getAttribute('_href');
				URLRoute.goto(route, ele);
				//HashRoute.goto(route, ele);
			}
		});
	}); 
	

	/* listen to form submit event */
	document.forms["blog_form2"].addEventListener("submit", function(e){
		/* prevant default action */
		e.preventDefault();
		e.stopPropagation();
		
		var formValidation = new Validation('[name=blog_form2]');
		formValidation.getFormData(function(formData,formEle){ 
			/* 
				if concat '#valid' with any of the fields 
				then that field will not get validated.
			*/
			formData['title'] = formEle.elements["title"].value.trim();
			formData['category'] = formEle.elements["category"].options[formEle.elements["category"].selectedIndex].value.trim();
			formData['file'] = formEle.elements["file"].value.trim();
			formData['file_path#valid'] = formEle.elements["file"].previousElementSibling.innerText;
			formData['desc'] = formEle.elements["desc"].value.trim();
		});
		/* form data */
		/*var formSubmitData = {};
		formSubmitData['title'] = FORM.elements["title"].value.trim();
		formSubmitData['category'] = FORM.elements["category"].value.trim();
		formSubmitData['file'] = FORM.elements["file"].value.trim();
		formSubmitData['desc'] = FORM.elements["desc"].value.trim();*/
		//formValidation.formData(formSubmitData);
		formValidation.block(blogFormBlock);
		formValidation.setRules(['required']);
		formValidation.setErrorMessages({
			'title' : {
				'required' : 'Please enter blog title.'
			},
			'category' : {
				'required' : 'Please enter blog category.'
			},
			'file' : {
				'required' : 'Please select any image.'
			},
			'desc' : {
				'required' : 'Please enter blog description.'
			},
		});
		
		formValidation.run(function(isInvalid, formBlock, formSubmitData, formEle){ 
			/* check for validation */	
			if(isInvalid){
				formBlock.assign('form-alert-msg-class', 'alert-danger');
				formBlock.assign('form-alert-msg-display','show');
				formBlock.render();
				
				/* set data */
				formEle.elements.namedItem("title").value = formSubmitData['title'];
				formEle.elements.namedItem("category").value = formSubmitData['category'];
				formEle.elements.namedItem("file").previousElementSibling.value = formSubmitData['file_path'];
				formEle.elements.namedItem("file").value = formSubmitData['file'];
				formEle.elements.namedItem("desc").value = formSubmitData['desc'];
				
				if(/data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(formEle.elements["file"].value)){
		         	var hid_file = formEle.querySelector("input[type=hidden][name=file]");
		         	hid_file.previousElementSibling.innerText = formSubmitData['file_path'];
		         	hid_file.value = formSubmitData['file'];
		         	var img = document.createElement("IMG");
		         	img.src = formSubmitData['file'];
		      		img.style.width = '100%';
		      		hid_file.closest(".row").previousElementSibling.classList.remove('d-none');
		      		hid_file.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
		      		hid_file.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
				}
			} else {
				formBlock.assign('form-alert-msg-class','');
				formBlock.assign('form-alert-msg-display','');
			
				/* save in local storage */
				var BlogModel = new Data('form');
				BlogModel.data(formSubmitData);
				var LastSaveId = BlogModel.save();
				if(LastSaveId){
					var getLastBlog = BlogModel.get(LastSaveId);
					var output = '';
					for (var property in getLastBlog) {
					output += property + ': ' + getLastBlog[property]+'; ';
					}
					_l(output);
					formBlock.assign('form-alert-msg','Blog post successfull.');
					formBlock.assign('form-alert-msg-class','alert-success');
					formBlock.assign('form-alert-msg-display','show');
					formBlock.render(false, function(){ 
						blogListBlock.template('#_blank_blog_row_template');
						blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+formSubmitData['file']+'" />');
						blogListBlock.append(formSubmitData);
					});
				} else {
					formBlock.assign('form-alert-msg-class', 'alert-danger');
					formBlock.assign('form-alert-msg-display','show');
					formBlock.assign('form-alert-msg','Blog save unsuccessful !');
					return false;
				}
			}
			//blogListBlock.dump();
		});
	});
	
	/* file upload */
	/* document.forms["blog_form2"].elements["photo"].addEventListener("change", function(e){
		_l(this.value);
		this.nextSibling.nextSibling.innerText = this.value;
		_l(this.files.item(0));
		var THIS = this;
		var fileReader = new FileReader();
      	fileReader.onloadend = function() {
         	//_l(fileReader.result);
         	THIS.closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
         	var img = document.createElement("IMG");
         	img.src = fileReader.result;
         	//_l(THIS.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
      		img.style.width = '100%';
      		THIS.closest(".row").previousElementSibling.classList.remove('d-none')
      		THIS.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
      		THIS.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
      		//img.onload = function(){
      			//this.src = fileReader.result;
      		//}
      	}
      	fileReader.readAsDataURL(this.files.item(0));
	}); */
	/*var x = Array.prototype.slice.call(document.querySelectorAll("[name=blog_form]"));
	_l(x);
	x.forEach(function(el){
		_l(Array.prototype.slice.call(el.querySelectorAll("#photo")));
	})*/
	//_l(Array.prototype.slice.call(x.querySelectorAll("#photo")));

	/*el("[name^=blog_form]").dynamic(function(ev, sl, el){
		_l(sl+" modified !");
		el("#photo",sl).on('change', function(ev, sl, el){
			_l(sl+" changed !");
			_l(el.value);
		    el.nextSibling.nextSibling.innerText = el.value;
		    _l(el.files.item(0));
		});
	});*/
	
	el(".custom-file-input", "[name^=blog_form]").dynamic('change', function(ev, el, parent){ 
		//el(el).get().nextSibling.nextSibling.innerText = el(el).get().value;
		if(el(el).get().files.item(0) != null){
			el(el).get().nextSibling.nextSibling.innerText = el(el).get().value;
			var fileReader = new FileReader();
			fileReader.onloadend = function() {
				el(el).get().closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
				var img = document.createElement("IMG");
				img.src = fileReader.result;
				//_l(el.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
				img.style.width = '100%';
				el(el).get().closest(".row").previousElementSibling.classList.remove('d-none')
				el(el).get().closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
				el(el).get().closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
				//img.onload = function(){
					//this.src = fileReader.result;
				//}
			}
			fileReader.readAsDataURL(el(el).get().files.item(0));
		}
	});

	//document.forms["blog_form2"].addEventListener('DOMSubtreeModified', function(event) {
		//_l("Form loaded....");
		//_l(document.forms["blog_form"].querySelector("#photo"));
		/* if(document.forms["blog_form2"].querySelector("#photo")){
			document.forms["blog_form2"].querySelector("#photo").addEventListener("change", function(e){
				_l(this.value);
				this.nextSibling.nextSibling.innerText = this.value;
				_l(this.files.item(0));
				var THIS = this;
				var fileReader = new FileReader();
		      	fileReader.onloadend = function() {
		         	//_l(fileReader.result);
		         	THIS.closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
		         	var img = document.createElement("IMG");
		         	img.src = fileReader.result;
		         	//_l(THIS.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
		      		img.style.width = '100%';
		      		THIS.closest(".row").previousElementSibling.classList.remove('d-none')
		      		THIS.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
		      		THIS.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
		      	}
		      	fileReader.readAsDataURL(this.files.item(0));
			});
		} */
		
		// file upload 
		/*document.forms["blog_form"].elements["photo"].addEventListener("change", function(e){
			_l(this.value);
			this.nextSibling.nextSibling.innerText = this.value;
			_l(this.files.item(0));
			var THIS = this;
			var fileReader = new FileReader();
	      	fileReader.onloadend = function() {
	         	//_l(fileReader.result);
	         	THIS.closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
	         	var img = document.createElement("IMG");
	         	img.src = fileReader.result;
	         	//_l(THIS.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
	      		img.style.width = '100%';
	      		THIS.closest(".row").previousElementSibling.classList.remove('d-none')
	      		THIS.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
	      		THIS.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
	      	}
	      	fileReader.readAsDataURL(this.files.item(0));
		});*/
	//});

	/*document.forms["blog_form"].addEventListener('readystatechange', event => {
		_l(event.target.readyState);
		// Different states of readiness 
		switch (event.target.readyState) {
		  case "loading":
		    _l('The '+event.target.name+' is still loading.');
		    break;
		  case "interactive":
		    _l('The '+event.target.name+' has finished loading. We can now access the elements.');
		    // But sub-resources such as images, stylesheets and frames are still loading.
		    //var span = document.createElement("span");
		    //span.textContent = "A <span> element.";
		    //document.body.appendChild(span);
		    break;
		  case "complete":
		    _l('The '+event.target.name+' is fully loaded.');
		    //_l("The first CSS rule is: " + document.styleSheets[0].cssRules[0].cssText);
		    break;
		}
	});*/
});

/* function goto(url){
			URLRoute.goto(url);
		} */