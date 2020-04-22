/* Javascript Framework */
- : JSF :: version 1.0.0 (Alpha) : -

OR,

- : JavaScript Frame : -
version 1.0.0(Alpha)

---- It is a micro framework written in Vanilla Javascript (Written Style : ECMAScript2015). Have bunch of cool stuffs likes: 
1. Bind event on window load or/and document state change. It's a nice concept globally acceptable, use for realtime application and SPA. Likely similar to jQuery 'on' event listner functionality. I call it as 'event listner' or 'dynamic'.

2. Generate css in less codeing. I call it 'variable CSS' or 'vCSS'.

3. Customise element action. I call it as 'element JS' or 'el'.

4. Hash Routing capability. I call it as 'route JS' or 'State'.
 
5. Hook functionality. I call it as 'hook JS' or 'HOOK'.

6. Modularity in functionality. I call it as 'module JS' or 'Module'.

7. Templating in UI. I call it as 'block JS' or 'Block'.

8. Model Class for data. I call it as 'data JS' or 'Data'.

9. Data Validation Class. I call it as 'input validate JS' or 'Validation'.

10. Has user defined help functions and custmize JS prototypes for premitive objects. I call it as 'Helper' and 'Prototype' respectively. 

Usage : 
--------
1. Use el(Id).on() for single document state event and callBack. Use el(Id).dynamic() for current and future document state event and callBack.
2. Write more compact css in less coding. This is a functional representation of css. ex. .mb10{ margin-bottom:10px;} .body{ _mb10() padding:0px; ... } etc. Funally use stylize() to inclide that in the document.
3. We can bind custom event action which defination written under module and we need to set that as an attribute with in the element of which we like to bind and set it with params/values. Generally we defined element with action in the module view section but we can also add them in dynamically create element as well, we just need to call  'el(Id).action({action_name});'. Set the custom action with in the view section. We use to write custom action as '<div  _{action_name}="param1,param2..."></div>'. We can add multiple action attributes with in a single element.
4. State.when(slug,callBack) -> use to register route in the system. State.goto(slug) -> use to redirect and run callBack.
5. We can run/call custom hook with in module. Hook.register() -> register any hook with callBack. Hook.call() -> run a hook.
6. First import module from location and then put that variable as a second parameter as an Array in event call back. This will make the module available inside of the event callBack. So we can use multiple modules with in single callBack. To add module customly or from within another module use Module.load([module_name]) to load a module and Module.get(module_name) to getb that module instance and then use the module.
7. In case of looping we can use Block.cycle() or to append/prepand we can use Block.append()/Block.prepand().
8. We use this class to save and get data. Data.data() -> to set the data param to insert/update. Data.save() -> save the data. Data.get(Id) -> get specific data.
9. Form validation function to validate user input. Validate.getFormData() -> to get form input. Validate.block() -> to set formBlock instance. Validate.setRules() -> to set validation rules. Validate.setErrorMessages() -> to set error messages. Validate.run() -> run form validation.
10. This 'helper function' will help to do regular work. rtrim() -> trim space from right side, ltrim() -> trim space from left side, collection() -> convert array like object to collection(array of objects) etc. 'predefined_object.prototype' function will help us to write code in more user readable format. [items].remove(key) -> delete array by key, [items]. removeItem(val) -> remove item by val etc.

Limitations : 
--------------
1. Try to write less code in the event-Listner/action-Listner callBack function to escape browser warnings and faster execution. We can use to bind one event and one listner per element without error. We can set dynamic or static event with the element.
2. Only class based css will be accepted. We will not have to write same properties more than once. We can define a class for each property or set of properties and then call that class under another class. Nested classes are also accepted.
3. We use ',' as a separator for action attribute parameters/values which may collapsed with text comma and will be treated as another parameter. - Will fix that in upcomming releases
4. We use hash as a application navigation or as redirection to different section. Framework will have option to redirect with 'push state'. - Will be available in upcomming releases
5. Final release - Done
6. To add new settings or custom module library or helper use webpack import function. - Will be easy in upcomming release 
7. Currently we can use a template once or we can not reassign template variable more than once. And to do that we need to reassign the template where we need that. - 
8. For data class current database is 'localStorage'. - Driver feature will be available in upcomming releases
9. Only 'required' validation is there. - Will add custom validation functions and rules in future release
10. Very propular functions are included. - Will add more in future release
