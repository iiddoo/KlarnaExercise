# Klarna Exercise

Requirements specified in *instructions.html* document.

The app
----

  - **Query validation**
  - **Search for match**
  - **Return and view result to user**

##### Query validation

> Performed on client-side to avoid fault requests, 
  but should apply on server too for double check and security.

* Maximum 3 query fields.
* Age field is any number > 0 && < 120 (120 defined as maximum age).
* Phone field is any number >120.
* Name field is NaN and includes letters only.
* Query field can appear only once.
* Support case insensitive for *name* search.

##### Search for match

* Valid match only if all query fields found match in person properties.
* Person object expanded with additional fields for efficient compare.


##### Return and view result to user

* Loader animation while waiting for reply from server.
* Showing error message in case of long query or invalid characters.
* View results with detailed user query parsed to fields.
* Show the number of matching results.


### Technologies

Back-end written in [Node.js](https://nodejs.org/) and requires v4+ to run.

Front-end uses [AngularJS](https://angularjs.org/) framework v1.4.7.

### Plugins
```sh
body-parser
```
```sh
express
```
```sh
angular-resource
```
```sh
angular-ui-router
```
```sh
oclazyload
```

### App structure

```
Exercise
│   package.jason
│   readme.md
│   server.js
│
└───data
│    │   people.jason
│
└───node_modules
│    │   body-parser
│    │   express
│
└───public
    └───app
    │    └───exercise  
    │    │      │   exercise.controller.js
    │    │      │   exercise.view.html
    │    │   app.js
    └───components
    │     │   angular.min.js  
    │     │   angular-resource.min.js   
    │     │   angular-ui-router.min.js  
    │     │   ocLazyLoad.min.js
    └───style
    │     │   custom.css  
    │     │   klarna-ui-css-components.css   
    │
    │   index.html
    │   old_index.html


```
----
[Live preview](http://klarnaexercise.herokuapp.com/)
