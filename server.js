// app bootstrap
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3333;
var path = require('path');
var fs = require('fs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
var people =[];

// server exception handle
process.on('uncaughtException', function (err) {
    console.dir(err);
});

// return main page to client
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

// get query object from client and return result
app.post('/search', function(request, response){
    var query = request.body;
    var searchResult=[];
    if(query){
        for (var i = 0, len = people.length; i < len; i++) {
            var match = isMatch(query, people[i]);
            if(match){
                searchResult.push(people[i]);
            }
        }
        response.send(searchResult);
    }
    else response.status(400).send("Oh uh, bad request. We received: " + query);
});

// check person match for query
var isMatch=function (query,person) {
    var match=true;
    if(query.name){
        match=(match && person.nameLower.includes(query.name));
    }
    if(query.phone){
        match=(match && person.phoneNumber.includes(query.phone));
    }
    if(query.age){
        match=(match && query.age===person.age);
    }
    return match;
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
