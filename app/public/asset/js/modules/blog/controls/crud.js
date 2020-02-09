/*blogControl Javascript File*/
import {_l,_e,_w,_i} from '../../../lib/console';
var instance = false;
export function CRUD(){
	if(instance) return instance;
	instance = this;

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
		SCOPE.model = new this._Data('form');
		var archives = SCOPE.model.getAll();
		
		/* blog from block object */
		var blogFormBlock = new SCOPE._Block('#blogFormBlock');
		var blogListBlock = new SCOPE._Block('#blogListBlock');

		/* form block */
		blogFormBlock.empty();
		blogFormBlock.templateRaw(SCOPE._View['blog_form_template']);
		blogFormBlock.render();

		/* list all posted blog from local storage */
		blogListBlock.empty();
		blogListBlock.templateRaw(SCOPE._View['blog_list_template']); //'#_blank_blog_row_template'
		
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
					SCOPE._Route.goto(route); //, ele
					//HashRoute.goto(route, ele);
				}
			});
			SCOPE._el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
				var ele = SCOPE._el(ele).get();
				//var el = ev.target; 
				if(ele.hasAttribute('_redirect')){
					var route = ele.getAttribute('_redirect');
					SCOPE._Route.goto(route); //, ele
					//HashRoute.goto(route, ele);
				}
			});
		});

		/* listen to form submit event */
		SCOPE._el("[name=blog_form2]").on("submit", function(ev, sel, parent_sel){
			/* prevant default action */
			ev.preventDefault();
			ev.stopPropagation();

			var formValidation = new SCOPE._Validation('[name=blog_form2]');
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
			blogFormBlock.templateRaw(SCOPE._View['blog_form_template']);
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
					/* save in local storage */
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
							blogListBlock.templateRaw(SCOPE._View['blog_list_template']); //'#_blank_blog_row_template'
							blogListBlock.assign('edit_blog_btn','editBlogBtn'+LastSaveId);
							blogListBlock.assign('edit_link','/blog/edit/'+LastSaveId);
							blogListBlock.assign('delete_blog_btn','deleteBlogBtn'+LastSaveId);
							blogListBlock.assign('delete_link','/blog/delete/'+LastSaveId);
							blogListBlock.assign('img','<img alt="image" class="img-thumbnail" src="'+formSubmitData['file']+'" />');
							blogListBlock.append(formSubmitData, function(blockEl){
								/* after append listen to click action */
								SCOPE._el(blockEl).find('.editBtn').on('click', function(ev, ele, parent){
									var ele = SCOPE._el(ele).get();
									//var el = ev.target; 
									if(ele.hasAttribute('_redirect')){
										var route = ele.getAttribute('_redirect');
										SCOPE._Route.goto(route); //, ele
										//HashRoute.goto(route, ele);
									}
								});
								SCOPE._el(blockEl).find('.deleteBtn').on('click', function(ev, ele, parent){
									var ele = SCOPE._el(ele).get();
									//var el = ev.target; 
									if(ele.hasAttribute('_redirect')){
										var route = ele.getAttribute('_redirect');
										SCOPE._Route.goto(route); //, ele
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
		SCOPE._el(".custom-file-input", "[name^=blog_form]").dynamic('change', function(ev, el, parent){ 
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

	CRUD.prototype.edit = function(){
		alert("edit ");
	}

	CRUD.prototype.delete = function(){
		alert("delete ");
		/* copy controller instance(SCOPE) */
		var SCOPE = this;
		//console.log(this.route);
		SCOPE._Route.goto('/blogs');
	}
}

/* abstruction(method/action) : Private */

