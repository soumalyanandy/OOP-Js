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
		SCOPE._File.addJS(['public/jquery/jquery.js']);
		SCOPE._File.addJS(['public/bootstrap/js/bootstrap.js']);
		SCOPE._File.addCSS(['public/bootstrap/css/bootstrap.css']);
		
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

		/*
			Note : For each document state change previous document will be expired and we can not able 
			to access elements and their functionalities. Only document object will be accessable in any state. 
			So to keep up-to-date our view and other functionality we need to create instances for each of 
			the festures. Ex. Block, Validation etc which are depends on elements.
		*/

		/* 
			listen to form submit event dynamically,
			this event will call by detecting the current state  
		*/
		//SCOPE._el("[name=blog_form]").get().setAttribute("id","blogSubmitForm");
		SCOPE._el("[id=blogFormBlockForm]").dynamic("submit", function(ev, sel, parent_sel){
			// prevant default action 
			ev.preventDefault();
			ev.stopPropagation();
			SCOPE._el(sel).find("button[type=submit]").get().setAttribute("disabled",true);

			// Create validation object from form element
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

			/* 
			* create form block with template, we need to create same block for each display/change because,
			* variables are replace with values one time. If we use the same view another time then 
			* we will not able to set any values inside of that view. That will be a static view. 
			*/
			var formBlock = new SCOPE._Block('#blogFormBlock', ['row']);
			formBlock.templateRaw(SCOPE.views['blog_form_template']);
			//formBlock.dynamic_event(true);
			formValidation.block(formBlock);
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
				SCOPE._el(formEle).find("button[type=submit]").get().removeAttribute("disabled");
				// check for validation 
				if(isInvalid){
					// set Block template 
					formBlock.assign('form-alert-msg-class', 'alert-danger');
					formBlock.assign('form-alert-msg-display','show'); 
					formBlock.empty(); 
					
					formBlock.render(false, function(blockEle){ 
						// callback function scope will not detect formEle variable return undefined. 
						// Because during render time document state again changed. 
						/* blog list */
						_blogList(SCOPE);
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
						/*var getLastBlog = BlogModel.get(LastSaveId);
						var output = '';
						for (var property in getLastBlog) {
						output += property + ': ' + getLastBlog[property]+'; ';
						}
						_l(output);*/
						formBlock.empty(); 
						formBlock.assign('form-alert-msg','Blog post successfull.');
						formBlock.assign('form-alert-msg-class','alert-success');
						formBlock.assign('form-alert-msg-display','show');
						formBlock.render(false, function(){ 
							/* blog list */
							_blogList(SCOPE);

							/* list Block object */
							/*var blogListBlock = new SCOPE._Block('#blogListBlock');
							blogListBlock.templateRaw(SCOPE.views['blog_list_template']); //'#_blank_blog_row_template'
							blogListBlock.assign('edit_blog_btn','editBlogBtn'+LastSaveId);
							blogListBlock.assign('edit_link','/blog/edit/'+LastSaveId);
							blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+LastSaveId);
							blogListBlock.assign('delete_link_with_msg', ["Do you really wish to delete?", "/blog/delete/"+LastSaveId]); 
							blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+formSubmitData['file']+'" />');
							blogListBlock.append(formSubmitData, function(blockEl){
								// after append listen to click action 
								SCOPE._el(blockEl).find('.editBtn').on('click', function(ev, ele, parent){
									SCOPE._el(ele).action('redirect');
									
								});
								SCOPE._el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
									SCOPE._el(ele).action('confirm_redirect');
									
								});
							});*/
						});
					} else {
						formBlock.empty(); 
						formBlock.assign('form-alert-msg-class', 'alert-danger');
						formBlock.assign('form-alert-msg-display','show');
						formBlock.assign('form-alert-msg','Blog save unsuccessful !');
						formBlock.render(false, function(){ 
							/* blog list */
							_blogList(SCOPE);
						});
					}
				}
				//blogListBlock.dump();
			});
		});

		/* catch dynamic change */
		SCOPE._el(".custom-file-input").dynamic('change', function(ev, sel, parent_sel){ 
			//_l(sel);
			//_l(parent);
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
		SCOPE._File.addJS(['public/jquery/jquery.js']);
		SCOPE._File.addJS(['public/bootstrap/js/bootstrap.js']);
		SCOPE._File.addCSS(['public/bootstrap/css/bootstrap.css']);
		
		/* blog from block object */
		var blogFormBlock = new SCOPE._Block('#editBlogBlock', ['row', 'col-sm-12']);

		/* form block */
		// register hook in render
		// IF THERE ARE OTHER REPLACEMENTS OF HTML INSIDE THE SAME BLOCK THEN
		// USE DYNAMIC EVENT LISTNER FOR BLOCK MIDDLEWARE/BLOCK FLOW HOOK
		blogFormBlock.hook_reg({
			'after-render-before-callback' : function(){ 
				SCOPE._el("[name=blog_form]")
					.create("button","Back","btn_back","btn_back",["btn btn-info float-right"],[],[
						{key : 'type', val: 'button'}
					])
					.dynamic("click", function(ev, ele, parent){
						State.goto("/blogs");
					});
			}
		});
		
		blogFormBlock.empty();
		blogFormBlock.templateRaw(SCOPE.views['blog_form_template']);
		blogFormBlock.assign('form-alert-msg-display','d-none');
		blogFormBlock.render();
		
		/* blog list */
		_blogList(SCOPE);
		
		
		/* Change form ID */
		SCOPE._el("[name=blog_form]").get().setAttribute("id","blogUpdateForm");
		var formEle = SCOPE._el("[id=blogUpdateForm]","#editBlogBlock").get();

		//_l("sibling elements :::::::::::::::::::::::::::::::::::::::::");
		//_l(SCOPE._el("[id=blogUpdateForm]","#editBlogBlock").nextSiblings().filter('h2'));
		/* SCOPE._el("[id=blogUpdateForm]","#editBlogBlock").siblings().filter(function(ele){
			return (ele.tagName.toLowerCase() == "h2")?true:false;
		}).on("click", function(){
			alert("hi");
		}); */
		//_exit(formEle); 
		//_l("parent elements :::::::::::::::::::::::::::::::::::::::::");
		/* _l(SCOPE._el("[id=blogUpdateForm]","#editBlogBlock").parent().filter(function(item){
			return item.id == ""?true:false;
		}).getAll()); */
		//_l(SCOPE._el("[id=blogUpdateForm] #btn_back","#editBlogBlock").hasChild());

		/* set form data */
		formEle.elements.namedItem("title").value = saveFormData['title'];
		formEle.elements.namedItem("category").value = saveFormData['category'];
		formEle.elements.namedItem("file").previousElementSibling.value = saveFormData['file_path'];
		formEle.elements.namedItem("file").value = saveFormData['file'];
		formEle.elements.namedItem("desc").value = saveFormData['desc'];
		
		if(/data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(formEle.elements["file"].value)){
			var hid_file = formEle.querySelector("input[type=hidden][name=file]");
			hid_file.previousElementSibling.innerText = saveFormData['file_path'];
			hid_file.value = saveFormData['file'];
			var img = document.createElement("IMG");
			img.src = saveFormData['file'];
			img.style.width = '100%';
			hid_file.closest(".row").previousElementSibling.classList.remove('d-none');
			hid_file.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
			hid_file.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
		}

		/* ------------------------ catch dynamic change to elements -------------------------- */

		/* listen to form submit event */
		SCOPE._el("[id=blogUpdateForm]").dynamic("submit", function(ev, sel, parent_sel){ 
			// prevant default action 
			ev.preventDefault();
			ev.stopPropagation();
			SCOPE._el(sel).find("button[type=submit]").get().setAttribute("disabled",true);

			// Create validation object from form element
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
			
			/* 
			* create form block with template, we need to create same block for each display/change because,
			* variables are replace with values one time. If we use the same view another time then 
			* we will not able to set any values inside of that view. That will be a static view. 
			*/
			var formBlock = new SCOPE._Block('#editBlogBlock', ['row', 'col-sm-12']);
			formBlock.templateRaw(SCOPE.views['blog_form_template']);
			//formBlock.dynamic_event(true);
			formValidation.block(formBlock);
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
				SCOPE._el(formEle).find("button[type=submit]").get().removeAttribute("disabled");
				// register hook in render
				// IF THERE ARE OTHER REPLACEMENTS OF HTML INSIDE THE SAME BLOCK THEN
				// USE DYNAMIC EVENT LISTNER FOR BLOCK MIDDLEWARE/BLOCK FLOW HOOK
				formBlock.hook_reg({
					'after-render-before-callback' : function(){ 
						// generate back to blog list redirect button
						SCOPE._el("[name=blog_form]")
							.create("button","Back","btn_back","btn_back",["btn btn-info float-right"],[],[
								{key : 'type', val: 'button'}
							])
							.dynamic("click", function(ev, ele, parent){
								State.goto("/blogs");
							}); 
							
						// generate form alert close function 
						SCOPE._el("#alert").create(
							"button", 
							'<span aria-hidden="true">×</span>',
							"form_alert_close",
							"form_alert_close",
							['close'],
							[], 
							[
								{key : 'type', val : "button"},
								//{key : "data-dismiss", val : "alert"},
								//{key : "aria-label", val : "Close"}
							]
						).dynamic("click", function(ev, el_sel, parent_sel){ _l(parent_sel);
							SCOPE._el("#alert").delete();
						});
					}
				});
				// check for validation 
				if(isInvalid){
					// set Block template 
					formBlock.assign('form-alert-msg-class', 'alert-danger');
					formBlock.assign('form-alert-msg-display','show'); 
					formBlock.empty(); 
					
					formBlock.render(false, function(blockEle){ 
						// callback function scope will not detect formEle variable return undefined. 
						// Because during render time document state again changed. 
						/* blog list */
						_blogList(SCOPE);
						var formEle = SCOPE._el(blockEle).find("FORM").get();

						/* Change form ID */
						formEle.setAttribute("id","blogUpdateForm");
						
						/* 
							Must refresh event listner to set controls with 
							modified elements(if any changes happend after Block render) 
							in the document.
						*/
						// for multiple changes
						//SCOPE._el().refreshAllListeners();
						SCOPE._el(blockEle).find("FORM").refreshListeners();
						
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
					BlogModel.unique_id = form_id.replace('form','');
					BlogModel.delete();
					BlogModel.data(formSubmitData);
					var LastSaveId = BlogModel.save();
					/* checked if saved ! */
					if(LastSaveId){
						/*var getLastBlog = BlogModel.get(LastSaveId);
						var output = '';
						for (var property in getLastBlog) {
						output += property + ': ' + getLastBlog[property]+'; ';
						}
						_l(output);*/
						
						formBlock.assign('form-alert-msg','Blog update successfull.');
						formBlock.assign('form-alert-msg-class','alert-success');
						formBlock.assign('form-alert-msg-display','show');
						formBlock.empty(); 
						formBlock.render(false, function(blockEle){ 
							/* blog list */
							_blogList(SCOPE);
							var formEle = SCOPE._el(blockEle).find("FORM").get();

							/* Change form ID */
							formEle.setAttribute("id","blogUpdateForm");

							/* 
								Must refresh event listner to set controls with 
								modified elements in the document.
							*/
							// for multiple changes
							//SCOPE._el().refreshAllListeners();
							SCOPE._el(blockEle).find("FORM").refreshListeners();

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
						formBlock.empty(); 
						formBlock.assign('form-alert-msg-class', 'alert-danger');
						formBlock.assign('form-alert-msg-display','show');
						formBlock.assign('form-alert-msg','Blog update unsuccessful !');
						formBlock.render(false, function(blockEle){ 
							/* blog list */
							_blogList(SCOPE);
							var formEle = SCOPE._el(blockEle).find("FORM").get();
							/* Change form ID */
							formEle.setAttribute("id","blogUpdateForm");
							/* 
								Must refresh event listner to set controls with 
								modified elements in the document.
							*/
							// for multiple changes
							//SCOPE._el().refreshAllListeners();
							SCOPE._el(blockEle).find("FORM").refreshListeners();

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
					}
				}
				//blogListBlock.dump();
			});
		});

		/* image change event */
		SCOPE._el(".custom-file-input", "#editBlogBlock [id=blogUpdateForm]").dynamic('change', function(ev, el, parent){ 
			//_l(el);
			//_l(parent);
			//SCOPE._el(el).get().nextSibling.nextSibling.innerText = SCOPE._el(el).get().value;
			if(SCOPE._el(el).get().files.item(0) != null){
				SCOPE._el(el).get().nextElementSibling.innerText = SCOPE._el(el).get().value;
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
		var auth = _do_action(SCOPE, 'authentication', true);
		if(auth){
			//var BlogModel = new SCOPE._Data('form');
			this.model.unique_id = form_id.replace('form','');
			this.model.delete();
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
	
	if(!archives.isEmpty()){
		/* Register a hook in cycle */
		blogListBlock.hook_reg({
			'before-append-in-cycle' : function(val, next){ 
				blogListBlock.assign('edit_blog_btn','editBlogBtn'+val['_key']);
				blogListBlock.assign('edit_link','/blog/edit/'+val['_key']);
				blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+val['_key']);
				blogListBlock.assign('delete_link_with_msg', ["Do you really wish to delete?", "/blog/delete/"+val['_key']]); 
				blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+val['file']+'" />');
				if(next) next(this);
			}
		});
		/* Register a middleware in cycle */
		/* blogListBlock.middleware('before-append-in-cycle', function(val, next){ 
			blogListBlock.assign('edit_blog_btn','editBlogBtn'+val['_key']);
			blogListBlock.assign('edit_link','/blog/edit/'+val['_key']);
			blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+val['_key']);
			blogListBlock.assign('delete_link_with_msg', ["Do you really wish to delete?", "/blog/delete/"+val['_key']]); 
			blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+val['file']+'" />');
			if(next) next(this);
		}); */
	
		/* manage event into the block */
		blogListBlock.cycle(archives, function(blockEl){
			/* After listing blog, listen to click function */
			SCOPE._el(blockEl).find('.editBtn').on('click', function(ev, ele, parent){
				SCOPE._el(ele).action('redirect');
			});
			SCOPE._el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
				SCOPE._el(ele).action('confirm_redirect');
			}); 
		});
	} else {
		blogListBlock.write(
			'No records found !', 
			'No_Records', 
			['row alert alert-info'], 
			[
				{'key' : 'height', 'val':'50px'}, 
				{'key' : 'width', 'val':'95%'},
				{'key' : 'position', 'val':'absolute'},
				{'key' : 'top', 'val':'25%'},
			]
		);
	}
}

