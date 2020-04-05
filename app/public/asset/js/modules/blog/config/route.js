/* Route defination file */
export var Route = {
    '/' : function(slug, segments){ 
        //_l('-----------------------------------------');
        //_l("STATE MODULES");//_l(State.modules);
        
        // Global call (no param)
        //State.modules.Blog.CRUD.list();
        
        // Local call (no param)
        this.module.CRUD.list();
    },
    '/blogs' : function(slug, segments){ 
        //_l('-----------------------------------------');
        //_l("STATE MODULES");//_l(State.modules);
        
        // Global call (no param)
        //State.modules.Blog.CRUD.list();
        
        // Local call (no param)
        this.module.CRUD.list();
    },
    '/blog/edit/(:any)' : function(slug, segments){ //el
        //_l("arguments");//_l(arguments);

        // Global call (with param)
        State.call_module_action('Blog.CRUD.edit', []); // -> catch as function param
        
        // Local call (with param)
        //this.module.CRUD.edit.apply({arguments}); // -> catch as function param
        
        // Regular call
        //this.module.CRUD.edit(slug); // -> catch as function param
    },
    '/blog/delete/(:any)' : function(slug, segments){ //el
        //alert("delete "+el.id);
        //State.goto('/');
        this.module.CRUD.delete(slug, segments);
    }
};