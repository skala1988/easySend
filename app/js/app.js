/* global angular */

(function () {
    'use strict';

    angular.module('myApp', [
      'ngRoute',
      'myApp.directives',
      'myApp.services',
      'myApp.controllers',
      'myApp.calculatorView',
      'myApp.version'
    ]).
    config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/calculatorView'});
    }]);
})();

require('./directives');
require('./services');
require('./controllers');