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

11. Can use external resource js, css and image files into application by using File Class. I call it as 'File Js' or 'File'

Usage : 
--------
1. Use el(Id).on() for single document state event and callBack. Use el(Id).dynamic() for current and future document state event and callBack.
2. Write more compact css in less coding. This is a functional representation of css. ex. .mb10{ margin-bottom:10px;} .body{ _mb10() padding:0px; ... } etc. Funally use stylize() to inclide that in the document.
3. We can bind custom event action which defination written under module and we need to set that as an attribute with in the element of which we like to bind and set it with params/values. Generally we defined element with action in the module view section but we can also add them in dynamically create element as well, we just need to call  'el(Id).action({action_name});'. Set the custom action with in the view section. We use to write custom action as '<div  _{action_name}="param1,param2..."></div>'. We can add multiple action attributes with in a single element.
4. State.when(slug,callBack) -> use to register route in the system. State.goto(slug) -> use to redirect and run callBack.
5. We can run/call custom hook with in module. Hook.register() -> register any hook with callBack. Hook.call() -> run a hook.
6. First import module from location and then put that variable as a second parameter as an Array in event call back. This will make the module available inside of the event callBack. So we can use multiple modules with in single callBack. To add module customly or from within another module use Module.load([module_name]) to load a module and Module.get(module_name) to getb that module instance and then use the module.
7. In case of looping we can use Block.cycle() or to append/prepand we can use Block.append()/Block.prepand(). While calling hook under block use Block.reg_hook().
8. We use this class to save and get data. Data.data() -> to set the data param to insert/update. Data.save() -> save the data. Data.get(Id) -> get specific data.
9. Form validation function to validate user input. Validate.getFormData() -> to get form input. Validate.block() -> to set formBlock instance. Validate.setRules() -> to set validation rules. Validate.setErrorMessages() -> to set error messages. Validate.run() -> run form validation. If concat '#valid' with any of the fields inside of Validate.getFormData() then that field will not get validated.
10. This 'helper function' will help to do regular work. rtrim() -> trim space from right side, ltrim() -> trim space from left side, collection() -> convert array like object to collection(array of objects) etc. 'predefined_object.prototype' function will help us to write code in more user readable format. [items].remove(key) -> delete array by key, [items]. removeItem(val) -> remove item by val etc.
11. File.addJS() -> to load js file, File.addCSS() -> to load css file, File.addIMG() -> to load image file. All files are loaded at the time of module call from route. 

Limitations : 
--------------
1. Try to write less code in the event-Listner/action-Listner callBack function to escape browser warnings and faster execution. We can use to bind one event and one listner per element without error. We can set dynamic or static event with the element.
2. Only class based css will be accepted. We will not have to write same properties more than once. We can define a class for each property or set of properties and then call that class under another class. Nested classes are also accepted.
3. Must refresh event listners with el.refreshListeners() to set controls with modified elements(if any changes happend after Block render) in the document. We use ',' as a separator for action attribute parameters/values which may collapsed with text comma and will be treated as another parameter. - Will fix that in upcomming releases. 
4. We use hash as a application navigation or as redirection to different section. Framework will have option to redirect with 'push state'. - Will be available in upcomming releases
5. Final release - Done
6. To add new settings or custom module library or helper use webpack import function. - Will be easy in upcomming release 
7. Currently we can use a template once or we can not reassign template variable more than once. And to do that we need to reassign the template where we need that. We can use el.on() while bind and event but IF THERE ARE OTHER REPLACEMENTS OF HTML INSIDE THE SAME BLOCK THEN USE DYNAMIC EVENT LISTNER FOR BLOCK MIDDLEWARE/BLOCK FLOW HOOK. - More functionality will added in upcomming releases.
8. For data class current database is 'localStorage'. - Driver feature will be available in upcomming releases
9. Only 'required' validation is there. - Will add custom validation functions and rules in future release
10. Very propular functions are included. - Will add more in future release

Note :
------
1. If we create any element after render block and bind any event to it then we must need to remember that event will be keep binded for the current html. If we change any attribute of the element or we replace the element or any other html of element's parent then that element event will not work but keep as binded. Because previous document has been expired and previous event bind selector was not matched with any of the current element. Window Object always update itself with the current document state in real time. So we must keep track of any new changes into the document or area of the document. So to keep current functionality in working condition(after any html element attribute change or any other html change with in Block area) we need to rebind the old listeners with the new html elements. And after that we must call el().refreshAllListeners(). That function will rebind the elements with pre existing events and its listners. 

2. While bind event to any element one thing keep in mind that if html changes for that element or in the element's parent then we need to use dynamic() else if html will not changes before redirect we can use on().This methods actually registered events to the specific element. dynamic() will rebind function if the document state changes and on() bind function which can be use for current document state only.

3. If you change attributes of any element which had events binded to it then it will not work. Because if you change any attribute of an element then element state will changes and we need to rebind the pre existing events to the element to get the job done.We can do so by el(selector).refreshListeners(). eg. SCOPE._el(blockEle).find("FORM").refreshListeners();

Technologies: 
--------------
1. Webpack 4 (node 6.9)
2. ECMAScript2015
3. Object oriented programming in Singletone pattern with HMVC structure 

Webpack Start File : JSF/public/asset/js/app.js
---------------------
Webpack Output File : JSF/dist/main.js
---------------------

Fixation :
-----------
Date :  22/04/2020
1. Fix 404 error not display bug. 
2. Remove excess code.

Date : 30/04/2020
1. Fix the logic removeLastListeners and addExistsListeners functionality. From now it they will not keep track from on() events. on() events will only valid from current document state.

New Features : 
---------------
Date : 22/04/2020

1. Add element nested to another in chain. Class.Method -> Ele.create(). It will always append new element into parent element and return Element Object as value and change current target to new element. To get element reference we need to call Ele.get() after creation of the element. 
2. Delete element and respective event functionality.Class.Method -> Ele.delete(). It will delete target element and its related functionality.

Date : 27/04/2020

3. Add element traverse functions in Element Class. Class.Method -> Ele.parent/hasParent/child/hasChild/prevSiblings/nextSiblings/allSiblings().
4. Ele.filter() -> to filter element from a set of elements by selector string.
5. Add text/html under block dynamically. Class.Method -> Block.write(). We can append additional html or text into Block when we need by creating new Block Object with the specific Id and then use write(). It uses DIV element as a wrapper of the new text/html.

Date : 30/04/2020

6. Add new Class.Method -> el().refreshAllListeners() -> it will reset pre existing events with there respective listeners for all elements in the document, and el(selector).refreshListeners() -> it will reset the events with respective listeners to the specific element.
