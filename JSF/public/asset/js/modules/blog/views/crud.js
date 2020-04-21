/* Control view defination file */
export var CRUD_VIEW = {
    'blog_form_template' : `
<div class="col-xs-12 col-md-6">
      <h2> Blog Form</h2>
      <!-- <form name="blog_form1" id="blogFormView1"></form> -->
      <form name="blog_form" id="blogFormBlockForm">
        <div id="alert" class="alert (form-alert-msg-class) alert-dismissible fade (form-alert-msg-display)" role="alert">
            (form-alert-msg)
            <!-- <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button> -->
        </div>
        <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">Title</label>
            <div class="col-sm-10">
            <input type="text" placeholder="Title" class="form-control" id="title" name="title"  />
            </div>
        </div>
        <div class="form-group row">
            <label for="category" class="col-sm-2 col-form-label">Category</label>
            <div class="col-sm-10">
                <select class="custom-select" name="category" id="category">
                <option value="">Select any</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="shopping">Shopping</option>
                <option value="book">Book</option>
                </select>
            </div>
        </div>
        <div class="form-group row d-none">
            <label for="preview" class="col-sm-2 col-form-label">Preview</label>
            <div class="col-sm-10">
                <div class="img-thumbnail" id="preview"></div>
            </div>
        </div>
        <div class="form-group row">
            <label for="photo" class="col-sm-2 col-form-label">Photo</label>
            <div class="col-sm-10">
                <div class="custom-file">
                <input type="file" class="custom-file-input" id="photo" name="photo">
                <label class="custom-file-label" id="file_label" for="photo">Choose file</label>
                <input type="hidden" name="file" id="file">
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label for="desc" class="col-sm-2 col-form-label">Description</label>
            <div class="col-sm-10">
            <textarea class="form-control" id="desc" name="desc" placeholder="About blog"></textarea>
            </div>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
    </form>
</div>
<div class="col-xs-12 col-md-6" id="blogListBlock" style="overflow-y: scroll; border: 1px black dotted; height : 425px">
      
</div>
    `,
    'blog_list_template' : `
        <div class="row">
            <div class="col-sm-6">
                (img)
            </div>
            <div class="col-sm-6">
                <h3>(title)</h3>
                <h5>(category)</h5>
                <p>(desc)</p>
            </div>
            <div class="col-sm-12 mt-3">
                <a _redirect="(edit_link)" id="(edit_blog_btn)" class="btn btn-info editBtn">Edit</a>
                <a _confirm_redirect="(delete_link_with_msg)" id="(delete_blog_btn)" class="btn btn-danger deleteBtn">Delete</a>
            </div>
        </div>
        <hr>
    `
}