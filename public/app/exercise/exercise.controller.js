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
    vm.url='http://klarnaexercise.herokuapp.com/search/';
    vm.page = 0;
    vm.queryObject={};
    vm.fetching = false;
    
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
                case (!isNaN(query[i]) && query[i] <= vm.ageMax && query[i] > 0 && !vm.queryObject.age):
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

    // get results for query
    vm.getResult = function() {
        vm.searchResult=[];
        vm.errorMessage='';
        vm.page = 0;
        vm.total=false;
        var parsed = vm.parseQuery(vm.query);
        var request = {query:vm.validateQuery(parsed),currentPage:vm.page};
        // post query to server
        if(parsed && request.query){
            vm.loading=true;
            $http({
                method: 'POST',
                url:vm.url,
                data: request
            }).success(function(response){
                vm.searchResult = response.searchResult;
                    vm.total = response.total;
                    // no results
                    if (vm.searchResult.length === 0) {
                        vm.errorMessage = 'No results, please review your search or try a different one';
                    }
                vm.loading=false;
            })
            // handle error response
                .error(function (response) {
                    vm.loading=false;
                    vm.errorMessage=response;
                });
        }
    };

    // fetch more items
    vm.getMore = function() {
        // check if paging is needed
        if(vm.searchResult.length > 0 && vm.searchResult.length < vm.total) {
            vm.errorMessage='';
            vm.page++;
            var request = {query:vm.queryObject,currentPage:vm.page};
            vm.fetching = true;
            $http({
                method: 'POST',
                url:vm.url,
                data: request
            }).success(function(response){
                var items = response.searchResult;
                vm.fetching = false;
                // append the items to the list
                vm.searchResult = vm.searchResult.concat(items);
            })
            // handle error response
                .error(function (response) {
                    vm.fetching = false;
                    vm.errorMessage=response;
                });
        }
    };

}
