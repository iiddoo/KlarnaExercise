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
    vm.queryUrl='http://klarnaexercise.herokuapp.com/search/';
    vm.pagingUrl='http://klarnaexercise.herokuapp.com/page/';
    vm.page = 0;
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

    // get results for query
    vm.getResult = function() {
        vm.searchResult=[];
        vm.errorMessage='';
        vm.page = 0;
        vm.total=false;
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
                vm.searchResult =data.data.searchResult;
                vm.total=data.data.total;
                // no results
                if(vm.searchResult.length===0){
                    vm.errorMessage='No results, please review your search or try a different one';
                }
                vm.loading=false;
            });
        }
    };

    // fetch more items
    vm.getMore = function() {
        if(vm.searchResult.length>0) {
            vm.page++;
            vm.fetching = true;
            $http.get(vm.pagingUrl + vm.page).then(function (data) {
                var items = data.data;
                vm.fetching = false;
                // append the items to the list
                vm.searchResult = vm.searchResult.concat(items);
            });
        }
    };

}
