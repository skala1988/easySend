/* global angular */

angular.module('myApp.directives', [])
    .directive('ngModelOnblur', require('./directives/ngModelOnblurDir'))
    .directive('ngValueCurrency', require('./directives/ngValueCurrencyDir'));