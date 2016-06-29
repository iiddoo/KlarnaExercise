// declare view controller
angular.module('exercise').controller('exerciseController', exerciseController);

// inject http for REST actions
exerciseController.$inject = ['$http'];

// controller function
function exerciseController($http) {
    var vm = this;

    vm.query='';
    vm.searchResult=[];
    vm.ageMax=120;
    vm.queryUrl='http://klarnaexercise.herokuapp.com:8080/search/';
    
    // parse query
    vm.parseQuery = function (query) {
        query=query.split(/[ ]+/);

        // check fields number
        if(query.length>3){
            vm.errorMessage='Too many query parameters, please consider query only by name, age and phone.';
            return false;
        }
        // check if empty
        else if(query[0]===''){
            vm.errorMessage='Please enter your query.';
            return false;
        }
        else return query;
    };

    // validate query
    vm.validateQuery = function (query) {
        vm.queryObject={name:false,age:false,phone:false};
        for(var i=0, len=query.length;i<len;i++){
            switch (true) {
                // name validate
                case (isNaN(query[i]) && new RegExp(/^[a-zA-Z\.]+$/).test(query[i]) && !vm.queryObject.name):
                    vm.queryObject.name = query[i].toLowerCase();
                    break;
                // age validate
                case (!isNaN(query[i]) && query[i] <= vm.ageMax && !vm.queryObject.age):
                    vm.queryObject.age = parseInt(query[i]);
                    break;
                // phone validate
                case (!isNaN(query[i]) && query[i] > vm.ageMax && !vm.queryObject.phone):
                    vm.queryObject.phone = query[i];
                    break;
                // query invalid
                default:
                    vm.errorMessage='Your query is invalid. Please consider query by name, age and phone.';
                    return false;
                    break;
            }
        }
        return vm.queryObject;
    };

    vm.getResult = function() {
        vm.searchResult=[];
        vm.errorMessage='';
        var parsed = vm.parseQuery(vm.query);
        var valid = vm.validateQuery(parsed);

        // post query to server
        if(parsed && valid){
            vm.loading=true;
            var url = vm.queryUrl;
            $http({
                method: 'POST',
                url:url,
                data: valid
            }).then(function(data){
                vm.searchResult =data.data;
                // no results
                if(vm.searchResult.length===0){
                    vm.errorMessage='No results, please review your search or try a different one';
                }
                vm.loading=false;
            });
        }
    };

}
