/*blogControl Javascript File*/
import {_l,_e,_w,_i,_exit} from '../../../lib/console';

//var instance = false;
export function CRUD(){
	//if(instance) return instance;
	//instance = this;

	this.model = null;
	/* property : Private */

	/* define property (setter/getter) : Public */
	/*Object.defineProperty(instance, "route", {
		set : function(route) { this.route = route; },
	  	get : function() { return this.route; }
	});

	Object.defineProperty(instance, "block", {
	  	set : function(block) { this.block = block; },
	  	get : function() { return this.block; }
	});*/


	/* (prototype)method/action : Public */
	CRUD.prototype.list = function(){
		/* copy controller instance(SCOPE) */
		var SCOPE = this;

        /* Load database */
		SCOPE.model = new SCOPE._Data('form');

		/* Load html resource Locally */
		SCOPE._File.addJS(['public/bootstrap/dist/js/bootstrap.js']);
		SCOPE._File.addCSS(['public/bootstrap/dist/css/bootstrap.css']);
		
		/* Load HTML resource Globally */
		//State.addFile('public/bootstrap/dist/js/bootstrap.js','js');
		//State.addFile('public/bootstrap/dist/css/bootstrap.css','css');
		//State.filePutInHTML("head");
		
		
		/* blog from Block object */
		var blogFormBlock = new SCOPE._Block('#blogFormBlock', ['row']);

		/* form block */
		blogFormBlock.empty();
		blogFormBlock.templateRaw(SCOPE.views['blog_form_template']);
		blogFormBlock.assign('form-alert-msg-display','d-none');
		blogFormBlock.render();

		/* blog list */
		_blogList(SCOPE);

		/* list Block object */
		//var blogListBlock = new SCOPE._Block('#blogListBlock');

		/* 
			listen to form submit event dynamically,
			this event will call by detecting the current state 
		*/
		//SCOPE._el("[name=blog_form]").get().setAttribute("id","blogSubmitForm");
		SCOPE._el("[id=blogFormBlockForm]").dynamic("submit", function(ev, sel, parent_sel){
			// prevant default action 
			ev.preventDefault();
			ev.stopPropagation();
			//SCOPE._el(sel).find("button[type=submit]").get().setAttribute("disabled",true);
			
			var formValidation = new SCOPE._Validation(sel);
			formValidation.getFormData(function(formData,formEle){ 
				//if concat '#valid' with any of the fields 
				//then that field will not get validated.
				formData['title'] = formEle.elements["title"].value.trim();
				formData['category'] = formEle.elements["category"].options[formEle.elements["category"].selectedIndex].value.trim();
				formData['file'] = formEle.elements["file"].value.trim();
				formData['file_path#valid'] = formEle.elements["file"].previousElementSibling.innerText;
				formData['desc'] = formEle.elements["desc"].value.trim();
			});

			// form block with template flag set to true
			//var formBlock = new SCOPE._Block('#blogFormBlock', ['row']);
			//formBlock.templateRaw(SCOPE.views['blog_form_template']);
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
				//SCOPE._el(formEle).find("button[type=submit]").get().setAttribute("disabled",false);
				// check for validation 
				if(isInvalid){
					// set Block template 
					formBlock.assign('form-alert-msg-class', 'alert-danger');
					formBlock.assign('form-alert-msg-display','show');
					formBlock.empty();
					formBlock.render(false, function(blockEle){ 
						// blog list 
						//_blogList(SCOPE);
						var formEle = SCOPE._el(blockEle).find("FORM").get();
						// set data 
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
					});
				} else {
					// save in local storage 
					var BlogModel = new SCOPE._Data('form');
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
							blogListBlock.templateRaw(SCOPE.views['blog_list_template']); //'#_blank_blog_row_template'
							blogListBlock.assign('edit_blog_btn','editBlogBtn'+LastSaveId);
							blogListBlock.assign('edit_link','/blog/edit/'+LastSaveId);
							blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+LastSaveId);
							blogListBlock.assign('delete_link','/blog/delete/'+LastSaveId);
							blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+formSubmitData['file']+'" />');
							blogListBlock.append(formSubmitData, function(blockEl){
								// after append listen to click action 
								SCOPE._el(blockEl).find('.editBtn').on('click', function(ev, ele, parent){
									var ele = SCOPE._el(ele).get();
									//var el = ev.target; 
									if(ele.hasAttribute('_redirect')){
										var route = ele.getAttribute('_redirect');
										State.goto(route); //, ele
										//HashRoute.goto(route, ele);
									}
								});
								SCOPE._el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
									var ele = SCOPE._el(ele).get();
									//var el = ev.target; 
									if(ele.hasAttribute('_redirect')){
										var route = ele.getAttribute('_redirect');
										State.goto(route); //, ele
										//HashRoute.goto(route, ele);
									}
								});
							});
						});
					} else {
						formBlock.assign('form-alert-msg-class', 'alert-danger');
						formBlock.assign('form-alert-msg-display','show');
						formBlock.assign('form-alert-msg','Blog save unsuccessful !');
						formBlock.render();
					}
				}
				//blogListBlock.dump();
			});
		});

		/* catch dynamic change */
		SCOPE._el(".custom-file-input").dynamic('change', function(ev, sel, parent_sel){ 
			_l(sel);
			_l(parent);
			//SCOPE._el(sel).get().nextSibling.nextSibling.innerText = SCOPE._el(sel).get().value;
			if(SCOPE._el(sel).get().files.item(0) != null){
				SCOPE._el(sel).get().nextSibling.nextSibling.innerText = SCOPE._el(sel).get().value;
				var fileReader = new FileReader();
				fileReader.onloadend = function() {
					SCOPE._el(sel).get().closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
					var img = document.createElement("IMG");
					img.src = fileReader.result;
					//_l(el.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
					img.style.width = '100%';
					SCOPE._el(sel).get().closest(".row").previousElementSibling.classList.remove('d-none')
					SCOPE._el(sel).get().closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
					SCOPE._el(sel).get().closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
					//img.onload = function(){
						//this.src = fileReader.result;
					//}
				}
				fileReader.readAsDataURL(SCOPE._el(sel).get().files.item(0));
			}
		});
	}

	CRUD.prototype.edit = function(slug, segments){
		/* copy controller instance(SCOPE) */
		var SCOPE = this;
		var form_id = segments[2];

		/* Authentication */
		var auth = _do_action(SCOPE, 'authentication', true);
		if(!auth){
			alert("Invalid Request.");
			State.goto('/blogs'); 
			return false;
		}

		/* Load database */
		SCOPE.model = new SCOPE._Data('form');
		var saveFormData = SCOPE.model.get(form_id);

		/* Load html resource at module call */
		SCOPE._File.addJS(['public/bootstrap/dist/js/bootstrap.js']);
		SCOPE._File.addCSS(['public/bootstrap/dist/css/bootstrap.css']);
		
		/* blog from block object */
		var blogFormBlock = new SCOPE._Block('#editBlogBlock', ['row']);

		/* form block */
		blogFormBlock.empty();
		blogFormBlock.templateRaw(SCOPE.views['blog_form_template']);
		blogFormBlock.assign('form-alert-msg-display','d-none');
		blogFormBlock.render();

		/* blog list */
		_blogList(SCOPE);

		/* set form data */
		SCOPE._el("[name=blog_form]").get().setAttribute("id","blogUpdateForm");
		var formEle = SCOPE._el("[id=blogUpdateForm]","#editBlogBlock").get();
		//_l("exit element :::::::::::::::::::::::::::::::::::::::::");
		//_exit(formEle); 
		formEle.elements.namedItem("title").value = saveFormData['title'];
		formEle.elements.namedItem("category").value = saveFormData['category'];
		formEle.elements.namedItem("file").previousElementSibling.value = saveFormData['file_path'];
		formEle.elements.namedItem("file").value = saveFormData['file'];
		formEle.elements.namedItem("desc").value = saveFormData['desc'];
		
		if(/data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(formEle.elements["file"].value)){
			var hid_file = formEle.querySelector("input[type=hidden][name=file]");
			hid_file.previousElementSibling.innerText = saveFormData['file_path'];
			hid_file.value = saveFormData['file'];
			var img = SCOPE._el("IMG", null, 'create');
			img.src = saveFormData['file'];
			img.style.width = '100%';
			hid_file.closest(".row").previousElementSibling.classList.remove('d-none');
			hid_file.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
			hid_file.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
		}

		/* ------------------------ catch dynamic change to elements -------------------------- */
		
		/* list Block object */
		//var blogListBlock = new SCOPE._Block('#editBlogBlock');

		/* listen to form submit event */
		SCOPE._el("[id=blogUpdateForm]","#editBlogBlock").dynamic("submit", function(ev, sel, parent_sel){
			/* prevant default action */
			ev.preventDefault();
			ev.stopPropagation();
			alert("hi");
			var formValidation = new SCOPE._Validation('[id=blogUpdateForm]');
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
			/* form block */
			blogFormBlock.empty();
			blogFormBlock.templateRaw(SCOPE.views['blog_form_template']);
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
				//formBlock.empty();
				//formBlock.templateRaw(SCOPE.views['blog_form_template']);
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
					/* save in local storage */
					var BlogModel = new SCOPE._Data('form');
					BlogModel.unique_id = form_id;
					BlogModel.delete();
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
							_blogList(SCOPE);
						});
					} else {
						//formBlock.empty();
						//formBlock.templateRaw(SCOPE.views['blog_form_template']);
						formBlock.assign('form-alert-msg-class', 'alert-danger');
						formBlock.assign('form-alert-msg-display','show');
						formBlock.assign('form-alert-msg','Blog save unsuccessful !');
						formBlock.render();
					}
				}
				//blogListBlock.dump();
			});
		});

		/* image change event */
		SCOPE._el(".custom-file-input", "#editBlogBlock [id=blogUpdateForm]").dynamic('change', function(ev, el, parent){ 
			_l(el);
			_l(parent);
			//SCOPE._el(el).get().nextSibling.nextSibling.innerText = SCOPE._el(el).get().value;
			if(SCOPE._el(el).get().files.item(0) != null){
				SCOPE._el(el).get().nextSibling.nextSibling.innerText = SCOPE._el(el).get().value;
				var fileReader = new FileReader();
				fileReader.onloadend = function() {
					SCOPE._el(el).get().closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
					var img = document.createElement("IMG");
					img.src = fileReader.result;
					//_l(el.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
					img.style.width = '100%';
					SCOPE._el(el).get().closest(".row").previousElementSibling.classList.remove('d-none')
					SCOPE._el(el).get().closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
					SCOPE._el(el).get().closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
					//img.onload = function(){
						//this.src = fileReader.result;
					//}
				}
				fileReader.readAsDataURL(SCOPE._el(el).get().files.item(0));
			}
		});
	}

	CRUD.prototype.delete = function(slug, segments){
		//alert("delete ");
		/* copy controller instance(SCOPE) */
		var SCOPE = this;
		var form_id = segments[2];

		/* Authentication */
		var auth = _do_action(SCOPE, 'authentication', false);
		if(auth){
			var BlogModel = new SCOPE._Data('form');
			BlogModel.unique_id = form_id;
			BlogModel.delete();
			//console.log(this.route);
			State.goto('/blogs');
		} else {	
			alert("Invalid Request.");
			State.goto('/blogs'); 
			return false;
		}
	}
}

/* Abstruction(method/action) : Private */
/* var hook_instance = false;
function _hooks(instance, hook = {}){
	if(!hook_instance) hook_instance = new instance._Hook(true);
	hook_instance.register("BLOG.CRUD", hook);
} */

function _do_action(instance, key, val = ''){ 
	//if(!hook_instance) hook_instance = new instance._Hook(true);
	//instance._Hook.dump();
	return instance._Hook.call("Blog.CRUD", key, val);
}

function _blogList(instance){
	/* copy controller instance(SCOPE) */
	var SCOPE = instance;

	/* Load database */
	var archives = SCOPE.model.getAll();

	/* list all posted blogs */
	var blogListBlock = new SCOPE._Block('#blogListBlock');
	blogListBlock.empty();
	blogListBlock.templateRaw(SCOPE.views['blog_list_template']); //'#_blank_blog_row_template'
	
	/* Register a hook in cycle */
	blogListBlock.hook_reg({
		'before-append-in-cycle' : function(val){ 
			blogListBlock.assign('edit_blog_btn','editBlogBtn'+val['_key']);
			blogListBlock.assign('edit_link','/blog/edit/'+val['_key']);
			blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+val['_key']);
			blogListBlock.assign('delete_link','/blog/delete/'+val['_key']);
			blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+val['file']+'" />');
		}
	});
	
	/* manage event into the block */
	blogListBlock.cycle(archives, function(blockEl){
		/* After listing blog, listen to click function */
		SCOPE._el(blockEl).find('.editBtn').on('click', function(ev, ele, parent){
			var ele = SCOPE._el(ele).get();
			//var el = ev.target; 
			if(ele.hasAttribute('_redirect')){
				var route = ele.getAttribute('_redirect');
				State.goto(route); //, ele
				//HashRoute.goto(route, ele);
			}
		});
		SCOPE._el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
			var ele = SCOPE._el(ele).get();
			//var el = ev.target; 
			if(ele.hasAttribute('_redirect')){
				var route = ele.getAttribute('_redirect');
				State.goto(route); //, ele
				//HashRoute.goto(route, ele);
			}
		}); 
	});
}

