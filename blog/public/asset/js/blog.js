/* Blog Javascript File */
import {_l,_e,_w,_i} from './lib/console';
import {Element} from './lib/element';
import {Block} from './lib/block';
import {Validation} from './lib/validation';
import {Data} from './lib/data';

window.addEventListener("load", function(){
	_l("window load");
	/* Load database */
	var Blog = new Data('form');
	var archives = Blog.getAll();
	
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
			blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+val['file']+'" />');
		}
	});
	
	blogListBlock.cycle(archives);
	

	/* listen to form submit event */
	document.forms["blog_form2"].addEventListener("submit", function(e){
		/* prevant default action */
		e.preventDefault();
		e.stopPropagation();
		
		var formValidation = new Validation('[name=blog_form2]');
		formValidation.getFormData(function(formData,formEle){ 
			formData['title'] = formEle.elements["title"].value.trim();
			formData['category'] = formEle.elements["category"].options[formEle.elements["category"].selectedIndex].value.trim();
			formData['file'] = formEle.elements["file"].value.trim();
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
				/* set data */
				formEle.elements["title"].value = formSubmitData['title'];
				formEle.elements["category"].value = formSubmitData['category'];
				formEle.elements["file"].value = formSubmitData['file'];
				formEle.elements["desc"].value = formSubmitData['desc'];
				if(/data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(formEle.elements["file"])){
					_l("image");
					//var fileReader = new FileReader();
			      	//fileReader.onloadend = function() {
			         	//_l(fileReader.result);
			         	formEle.closest(".custom-file").querySelector("input[type=hidden]").value = formSubmitData['file'];
			         	var img = document.createElement("IMG");
			         	img.src = formSubmitData['file'];
			         	//_l(formEle.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
			      		img.style.width = '100%';
			      		formEle.closest(".row").previousElementSibling.classList.remove('d-none');
			      		formEle.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
			      		formEle.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
			      	//}
			      	//fileReader.readAsDataURL(formSubmitData['file']);
				}
				formBlock.render();
			} else {
				formBlock.assign('form-alert-msg-class','');
				formBlock.assign('form-alert-msg-display','');
			
				/* save in local storage */
				var Blog = new Data('form');
				Blog.data(formSubmitData);
				var LastSaveId = Blog.save();
				if(LastSaveId){
					var getLastBlog = Blog.get(LastSaveId);
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

	/*Element("[name^=blog_form]").dynamic(function(ev, sl, el){
		_l(sl+" modified !");
		Element("#photo",sl).on('change', function(ev, sl, el){
			_l(sl+" changed !");
			_l(el.value);
		    el.nextSibling.nextSibling.innerText = el.value;
		    _l(el.files.item(0));
		});
	});*/

	Element("#photo", "[name^=blog_form]").on('change', function(ev, sl, el, parent){
		_l(sl+" changed !");
		_l(el.value);
		el.nextSibling.nextSibling.innerText = el.value;
		_l(el.files.item(0));
	
		var fileReader = new FileReader();
      	fileReader.onloadend = function() {
			el.closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
			var img = document.createElement("IMG");
			img.src = fileReader.result;
			//_l(el.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
			 img.style.width = '100%';
			 el.closest(".row").previousElementSibling.classList.remove('d-none')
			 el.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
			 el.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
			 //img.onload = function(){
				 //this.src = fileReader.result;
			 //}
		}
		fileReader.readAsDataURL(el.files.item(0));
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
