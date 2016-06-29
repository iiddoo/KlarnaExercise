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

### plugins
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

App structure
----

```
project
│   README.md
│   file001.txt    
│
└───folder1
    │   file011.txt
    │   file012.txt
    │
    ├───subfolder1
    │   │   file111.txt
    │   │   file112.txt
    │   │   ...
    │
    └───folder2
    │   file021.txt
    │   file022.txt
```

Thank you
----

**Ido Lev**
