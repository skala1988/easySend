/* global angular */

angular.module('myApp.services', [])
    .factory('calculatorViewService', require('./services/calculatorViewService'))
    .factory('httpService', require('./services/httpService'))
    .factory('loadingService', require('./services/loadingService'));