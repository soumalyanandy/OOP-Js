/* Blog Javascript File */
window.addEventListener("load", function(){
	console.log("window load");
	/* blog from view object */
	var blogFormView = new Template('#blogFormView2');
	/* listen to form submit event */
	document.forms["blog_form2"].addEventListener("submit", function(e){
		/* prevant default action */
		e.preventDefault();
		e.stopPropagation();
		
		var formValidation = new FromValidation('[name=blog_form2]');
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
		formValidation.view(blogFormView);
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
		
		formValidation.run(function(isInvalid, formView, formSubmitData, formEle){ 
			/* check for validation */	
			if(isInvalid){
				formView.assign('form-alert-msg-class', 'alert-danger');
				formView.assign('form-alert-msg-display','show');
				formView.render();
				/* set data */
				formEle.elements["title"].value = formSubmitData['title'];
				formEle.elements["category"].value = formSubmitData['category'];
				formEle.elements["file"].value = formSubmitData['file'];
				formEle.elements["desc"].value = formSubmitData['desc'];
			} else {
				formView.assign('form-alert-msg-class','');
				formView.assign('form-alert-msg-display','');
			
				/* save in local storage */
				var time = new Date().getTime();
				localStorage.setItem("form"+time, JSON.stringify(formSubmitData));
				var object = JSON.parse(localStorage.getItem("form"+time));
				var output = '';
				for (var property in object) {
				  output += property + ': ' + object[property]+'; ';
				}
				console.log(output);
				formView.assign('form-alert-msg','Blog post successfull.');
				formView.assign('form-alert-msg-class','alert-success');
				formView.assign('form-alert-msg-display','show');
				formView.render();
			}
		});
	});
	
	/* file upload */
	document.forms["blog_form2"].elements["photo"].addEventListener("change", function(e){
		console.log(this.value);
		this.nextSibling.nextSibling.innerText = this.value;
		console.log(this.files.item(0));
		var THIS = this;
		var fileReader = new FileReader();
      	fileReader.onloadend = function() {
         	//console.log(fileReader.result);
         	THIS.closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
         	var img = document.createElement("IMG");
         	img.src = fileReader.result;
         	//console.log(THIS.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
      		img.style.width = '100%';
      		THIS.closest(".row").previousElementSibling.classList.remove('d-none')
      		THIS.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
      		THIS.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
      		/*img.onload = function(){
      			this.src = fileReader.result;
      		}*/
      	}
      	fileReader.readAsDataURL(this.files.item(0));
	});
	/*var x = Array.prototype.slice.call(document.querySelectorAll("[name=blog_form]"));
	console.log(x);
	x.forEach(function(el){
		console.log(Array.prototype.slice.call(el.querySelectorAll("#photo")));
	})*/
	//console.log(Array.prototype.slice.call(x.querySelectorAll("#photo")));

	JS("[name^=blog_form]").dynamic(function(ev, el){
		console.log(el+" modified !");
		JS("#photo",el).dynamic('change', function(ev, el){
			console.log(el+" changed !");
		});
	});

	//document.forms["blog_form"].addEventListener('DOMSubtreeModified', event => {
		//console.log("Form loaded....");
		//console.log(document.forms["blog_form"].querySelector("#photo"));
		/*if(document.forms["blog_form"].querySelector("#photo")){
			document.forms["blog_form"].querySelector("#photo").addEventListener("change", function(e){
				console.log("changed !");
			});
		}*/
		
		// file upload 
		/*document.forms["blog_form"].elements["photo"].addEventListener("change", function(e){
			console.log(this.value);
			this.nextSibling.nextSibling.innerText = this.value;
			console.log(this.files.item(0));
			var THIS = this;
			var fileReader = new FileReader();
	      	fileReader.onloadend = function() {
	         	//console.log(fileReader.result);
	         	THIS.closest(".custom-file").querySelector("input[type=hidden]").value = fileReader.result;
	         	var img = document.createElement("IMG");
	         	img.src = fileReader.result;
	         	//console.log(THIS.closest(".row").previousSibling.previousSibling.querySelector("#preview"));
	      		img.style.width = '100%';
	      		THIS.closest(".row").previousElementSibling.classList.remove('d-none')
	      		THIS.closest(".row").previousElementSibling.querySelector("#preview").innerHTML = "";
	      		THIS.closest(".row").previousElementSibling.querySelector("#preview").appendChild(img);
	      	}
	      	fileReader.readAsDataURL(this.files.item(0));
		});*/
	//});

	/*document.forms["blog_form"].addEventListener('readystatechange', event => {
		console.log(event.target.readyState);
		// Different states of readiness 
		switch (event.target.readyState) {
		  case "loading":
		    console.log('The '+event.target.name+' is still loading.');
		    break;
		  case "interactive":
		    console.log('The '+event.target.name+' has finished loading. We can now access the elements.');
		    // But sub-resources such as images, stylesheets and frames are still loading.
		    //var span = document.createElement("span");
		    //span.textContent = "A <span> element.";
		    //document.body.appendChild(span);
		    break;
		  case "complete":
		    console.log('The '+event.target.name+' is fully loaded.');
		    //console.log("The first CSS rule is: " + document.styleSheets[0].cssRules[0].cssText);
		    break;
		}
	});*/
});
