// app bootstrap
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var fs = require('fs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
var people =[];
var pageSize=20;
var ageMax=120;

// server exception handle
process.on('uncaughtException', function (err) {
    console.dir(err);
});

// return main page to client
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

// get query and paging from client and return page result
app.post('/search', function(request, response){
    var queryObject = request.body;
    if(isValid(queryObject)) {
        var start = queryObject.currentPage * pageSize;
        var searchResult = getResults(queryObject.query);
        var total = searchResult.length;
        var page = searchResult.splice(start, pageSize);
        response.send({searchResult: page, total: total});
    }
    // bad request handle
    else response.status(400).send("Oh uh, bad request. We received: " + queryObject);
});

// search people for person
var getResults = function (query) {
    var result=[];
    for (var i = 0, len = people.length; i < len; i++) {
        if(isMatch(query, people[i])){
            result.push(people[i]);
        }
    }
    return result;
};

// check if person match for query
var isMatch=function (query,person) {
    var match=true;
    // name match
    if(query.name){
        match=(match && person.nameLower.includes(query.name));
    }
    // phone match
    if(query.phone){
        match=(match && person.phoneNumber.includes(query.phone));
    }
    // age match
    if(query.age){
        match=(match && query.age===person.age);
    }
    return match;
};

// validate query
var isValid = function (queryObject) {
    var valid = false;
    if(queryObject.currentPage>=0 && queryObject.query){
        valid = true;
        var query = queryObject.query;
        // name validate
        if(query.name && isNaN(query.name) && new RegExp(/^[a-zA-Z\.]+$/).test(query.name)) {
            valid=(valid && true);
        }
        // age validate
        if(query.age && !isNaN(query.age) && query.age <= ageMax  && query.age > 0 ) {
            valid=(valid && true);
        }
        // phone validate
        if(query.phone && !isNaN(query.phone) && query.phone > ageMax) {
            valid=(valid && true);
        }
    }
    return valid;
};

// app initialization
var init = function () {

    // load people list from file
    var sourceFile = "./data/people.json";
    people = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

    // adjust person fields to enable matching
    for(var i=0,len=people.length;i<len;i++){

        // calculate age field from epoch seconds format
        var birthYear = new Date(people[i].birthday * 1000).getFullYear();
        var nowYear = new Date().getFullYear();
        people[i].age=nowYear-birthYear;

        // flat address object to string
        people[i].addressString = people[i].address.street + ', '+ people[i].address.city + ', '+ people[i].address.country +'.';

        // remove '-' character from phone to enable string match
        people[i].phoneNumber = people[i].phone.replace('-','');

        // lowercase name field to support case insensitive
        people[i].nameLower = people[i].name.toLowerCase();

    }

};

init();

// start server
app.listen(port);

console.log('listening on port: '+ port);
