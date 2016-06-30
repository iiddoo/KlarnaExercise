
// define main module
var exercise = angular.module("exercise", [
    "ui.router",
    "oc.lazyLoad",
    'tagged.directives.infiniteScroll'
]);

/* Routing Pages */
exercise.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/exercise.view.html");

    $stateProvider
        .state('exercise', {
            url: "/exercise.view.html",
            templateUrl: "app/exercise/exercise.view.html",
            data: { pageTitle: 'Exercise' },
            controller: "exerciseController",
            controllerAs:"vm",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'exercise',
                        files: [
                            'app/exercise/exercise.controller.js'
                        ]
                    }]);
                }]
            }
        });
}]);
