/* global angular */

(function () {
    'use strict';
 
    angular.module('myApp.calculatorView', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/calculatorView', {
                templateUrl: 'templates/calculatorTemplate.html',
                controller: 'calculatorCtrl'
            });
        }]);
})();