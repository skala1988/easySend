(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./controllers":2,"./directives":4,"./services":7}],2:[function(require,module,exports){
/* global angular */

angular.module('myApp.controllers', [])
    .controller('calculatorCtrl', require('./controllers/calculatorCtrl'));
},{"./controllers/calculatorCtrl":3}],3:[function(require,module,exports){
/* global module, _ */

(function () {
    'use strict';
    
    module.exports = function($scope,calculatorViewService) {
        // scope init settings
        var defaultSettings = {
            initCountryFrom : 'GB',
            initCountryTo : 'PL',
            initCurrencyAmmount : 100,
            initCurrencyFrom : 3,
            initCurrencyTo : 1
        };
        // scope var declarations
        _.extend($scope,{
            currencyAmmount : defaultSettings.initCurrencyAmmount,
            allCurrencies : {},
            result : 0,
            countriesFrom : [],
            countriesTo : [],
            selectedCurrencyIn : undefined,
            selectedCurrencyOut : undefined,
            selectedFromCountryId : undefined,
            selectedToCountryId : undefined,
            selectedExchangeType : 0,
            rate : 1
        });
        // 
        var updateScope = function(data){
            if(data!==false){
                 _.extend($scope,data);
                var currencyIn = $scope.getCurrencyIn();
                var currencyOut = $scope.getCurrencyOut();
                
                if(currencyIn!==false && currencyOut!==false){
                    calculatorViewService.getResult(currencyIn.name,currencyOut.name,$scope.currencyAmmount).then(function(res){
                        if(res!==false){
                            var rate;
                            if(res.is_inverse===true){
                                $scope.result = ($scope.currencyAmmount/res.rate).toFixed(2);
                                rate = (1/res.rate).toFixed(3);
                            }else{
                                $scope.result = ($scope.currencyAmmount * res.rate).toFixed(2);
                                rate = (res.rate).toFixed(3);
                            }
                            $scope.rate = rate;
                        }else{
                            // brak wszystkich wymaganych danych (waluta 'in' lub 'out' lub ilosc)
                            alert('Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie później'); 
                            location.reload();
                        }
                    });
                }
            }else{
                // brak wszystkich wymaganych danych (kraj 'z' oraz 'do', waluta 'in' oraz 'out')
                alert('Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie później'); 
                location.reload();
            }
        };
        var getSelectedCountry = function(type){
            var countries,
                search;
            if(type==='from'){
                countries = $scope.countriesFrom;
                search = $scope.selectedFromCountryId;
            }
            if(type==='to'){
                countries = $scope.countriesTo;
                search = $scope.selectedToCountryId;
            }
            var country = _.findWhere(countries,{
                id : search
            });
            return country;
        };
        // render helper functions 
        $scope.getCurrencyOut = function(){
            var res = false;
            var inCurrency = $scope.allCurrencies[$scope.selectedCurrencyIn];
            if(inCurrency){
                res = _.findWhere(inCurrency.outArr,{
                    id : $scope.selectedCurrencyOut
                });
            }
            return res;
        };
        $scope.getCurrencyIn = function(){
            var currency = $scope.allCurrencies[$scope.selectedCurrencyIn];
            if(currency){
                return currency.in;
            }else{
                return false;
            }
        };
        $scope.getExchangeType = function(){
            var currencyOut = $scope.getCurrencyOut();
            return (currencyOut && currencyOut.super_fast_available===true) ? 1 : 0;
        };
        $scope.changeExchangeType = function(type){
            var maxExchangeType = $scope.getExchangeType();
            if(type<=maxExchangeType){
                $scope.selectedExchangeType = type;
            }
        };
        $scope.recalculate = function(selectIndex){
            switch(selectIndex){
                case 'countryFrom' : {
                    $scope.selectedCurrencyIn = getSelectedCountry('from').default_currency.id;
                    calculatorViewService.getCountriesTo($scope.selectedFromCountryId,$scope.selectedCurrencyIn).then(function(res){
                        updateScope(res);
                    });
                    break;
                }
                case 'countryTo' : {
                    calculatorViewService.getCountriesPairCurrencies($scope.selectedFromCountryId,$scope.selectedToCountryId,{
                        fromId : getSelectedCountry('from').default_currency.id,
                        toId : getSelectedCountry('to').default_currency.id
                    }).then(function(res){
                        updateScope(res);
                    });
                    break;
                }
                default : {
                    updateScope({});
                }
            }
        };
        // initialize scope vars
        $scope.init = function(){
            calculatorViewService.getCountriesFrom(defaultSettings).then(function(res){
                updateScope(res);
            });
        };
    };
})();
},{}],4:[function(require,module,exports){
/* global angular */

angular.module('myApp.directives', [])
    .directive('ngModelOnblur', require('./directives/ngModelOnblurDir'))
    .directive('ngValueCurrency', require('./directives/ngValueCurrencyDir'));
},{"./directives/ngModelOnblurDir":5,"./directives/ngValueCurrencyDir":6}],5:[function(require,module,exports){
/* global module, _ */

(function () {
    'use strict';
    
    module.exports = function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1, // needed for angular 1.2.x
            link: function(scope, elm, attr, ngModelCtrl) {
                if (attr.type === 'radio' || attr.type === 'checkbox') return;

                elm.unbind('input').unbind('keydown').unbind('change');
                elm.bind('change', function() {
                    if(elm.val()===''){
                        elm.val('0');
                    }
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(elm.val());
                    });         
                });
            }
        };
    };
})();
},{}],6:[function(require,module,exports){
/* global module, _ */

(function () {
    'use strict';
    // script from https://github.com/adamalbrecht/angular-currency-mask
    // further edited by me
    module.exports = function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                var numberWithCommas = function(value, addExtraZero) {
                    if (addExtraZero === undefined){
                        addExtraZero = false;
                    } 
                    value = value.toString();
                    value = value.replace(/[\.]/g, ",");
                    value = value.replace(/[^0-9\,]/g, "");
                    var countComma = (value.match(/,/g) || []).length;
                    if(countComma>1){
                        var parts2 = value.split(',');
                        value = parts2.slice(0,-1).join('') + ',' + parts2.slice(-1);
                    }
                    var parts = value.split(',');
                    parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$& ");
                    if (parts[1] && parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                    }
                    if (addExtraZero && parts[1] && (parts[1].length === 1)) {
                        parts[1] = parts[1] + "0";
                    }
                    return parts.join(",");
                };
                var applyFormatting = function() {
                    var value = element.val();
                    var original = value;
                    if (!value || value.length === 0) { 
                        return;
                    }
                    value = numberWithCommas(value);
                    if (value !== original) {
                        element.val(value);
                        element.triggerHandler('input');
                    }
                };
                element.bind('keyup', function(e) {
                    var keycode = e.keyCode;
                    var isTextInputKey = 
                        (keycode > 47 && keycode < 58)   || // number keys
                        (keycode === 32 || keycode === 8)    || // spacebar or backspace
                        (keycode > 64 && keycode < 91)   || // letter keys
                        (keycode > 95 && keycode < 112)  || // numpad keys
                        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                        (keycode > 218 && keycode < 223);   // [\]' (in order)
                    if (isTextInputKey) {
                        applyFormatting();
                    }
                });
                ngModelController.$parsers.push(function(value) {
                    if (!value || value.length === 0) {
                        return value;
                    }
                    value = value.toString();
                    value = value.replace(/[^0-9\,]/g, "");
                    value = value.replace(/[\,]/g, ".");
                    return value;
                });
                ngModelController.$formatters.push(function(value) {
                    if (!value || value.length === 0) {
                        return value;
                    }
                    value = numberWithCommas(value, true);
                    return value;
                });
            }
        };
    };
})();
},{}],7:[function(require,module,exports){
/* global angular */

angular.module('myApp.services', [])
    .factory('calculatorViewService', require('./services/calculatorViewService'))
    .factory('httpService', require('./services/httpService'))
    .factory('loadingService', require('./services/loadingService'));
},{"./services/calculatorViewService":8,"./services/httpService":9,"./services/loadingService":10}],8:[function(require,module,exports){
/* global module, _ */

(function () {
    'use strict';
    
    module.exports = function(httpService) {
        var service = {
            getCountriesFrom : function(initData){
                var self = this;
                var promise = $.Deferred();
                
                httpService.post('countries').then(function(resultFrom){
                    var countryFrom = false;
                    if(initData && initData.initCountryFrom){
                        countryFrom = _.findWhere(resultFrom,{
                            code : initData.initCountryFrom
                        });
                    }

                    if(!countryFrom && resultFrom.length>0){
                        countryFrom = resultFrom[0];
                    }
                    if(countryFrom){
                        var currencyFromId = (initData && initData.initCurrencyFrom) ? initData.initCurrencyFrom : countryFrom.default_currency.id;
                        self.getCountriesTo(countryFrom.id,currencyFromId,initData).then(function(dominoEffectResult){
                            if(dominoEffectResult===false){
                                promise.resolve(false);
                            }else{
                                promise.resolve(_.extend(dominoEffectResult,{
                                    selectedFromCountryId : countryFrom.id,
                                    countriesFrom : resultFrom,
                                    selectedExchangeType : 0
                                }));
                            }
                        });
                    }else{
                        promise.resolve(false);
                    }
                });
                
                return promise;
            },
            getCountriesTo : function(countryFromId,currencyFromId,initData){
                var promise = $.Deferred();
                var self = this;

                httpService.post("countries/"+countryFromId+"/destinations").then(function(resultTo){
                    var countryTo = false;
                    if(initData && initData.initCountryTo){
                        countryTo = _.findWhere(resultTo,{
                            code : initData.initCountryTo
                        });
                    }
                    if(!countryTo && resultTo.length>0){
                        countryTo = resultTo[0];
                    }
                    if(countryTo){
                        var preferredCurrencies = {
                            fromId : currencyFromId,
                            toId : (initData && initData.initCurrencyTo) ? initData.initCurrencyTo : countryTo.default_currency.id
                        };
                        self.getCountriesPairCurrencies(countryFromId,countryTo.id,preferredCurrencies).then(function(dominoEffectResult){
                            if(dominoEffectResult===false){
                                promise.resolve(false);
                            }else{
                                promise.resolve(_.extend(dominoEffectResult,{
                                    selectedToCountryId : countryTo.id,
                                    countriesTo : resultTo,
                                    selectedExchangeType : 0
                                }));
                            }
                        });
                    }else{
                        promise.resolve(false);
                    }
                });
                
                return promise;
            },
            getCountriesPairCurrencies : function(countryFromId,countryToId,preferredCurrencies){
                var promise = $.Deferred();
                var self = this;

                httpService.post("currencies/"+countryFromId+"/"+countryToId).then(function(currencies){
                    if(currencies.length===0){
                        promise.resolve(false);
                    }else{
                        var selectedCurrencyIn,
                            selectedCurrencyOut;
                        var sortedCurrencies = self.sortCurrencies(currencies);
                        
                        if(!sortedCurrencies[preferredCurrencies.fromId]){
                            selectedCurrencyIn = parseInt(Object.keys(sortedCurrencies)[0]);
                        }else{
                            selectedCurrencyIn = parseInt(preferredCurrencies.fromId);
                        }
                        var findCurrencyOut = _.findWhere(sortedCurrencies[selectedCurrencyIn].outArr,{
                            id : preferredCurrencies.toId
                        });
                        if(!findCurrencyOut){
                            var c_array = sortedCurrencies[selectedCurrencyIn].outArr;
                            selectedCurrencyOut = c_array[Object.keys(c_array)[0]].id;
                        }else{
                            selectedCurrencyOut = preferredCurrencies.toId;
                        }
                        promise.resolve({
                            allCurrencies : sortedCurrencies,
                            selectedCurrencyIn : selectedCurrencyIn,
                            selectedCurrencyOut : selectedCurrencyOut,
                            selectedExchangeType : 0
                        });
                    }
                });
                
                return promise;
            },
            getResult : function(currencyIn,currencyOut,amount){
                var promise = $.Deferred();
                if(amount!==''){
                    httpService.post("exchange-rate/"+currencyIn+"/"+currencyOut+"/"+amount).then(function(result){
                        promise.resolve(result);
                    });
                }else{
                    return 0;
                }
                
                return promise;
            },
            sortCurrencies : function(currencies){
                var resCurrencies = {};
                _.each(currencies,function(currency){
                    var idIn = currency.currency_in.id;
                    if(!resCurrencies[idIn]){
                        resCurrencies[idIn]=[];
                        resCurrencies[idIn]={
                            outArr : [],
                            in : currency.currency_in
                        };
                    }
                    resCurrencies[idIn].outArr.push(_.extend(currency.currency_out,{
                        super_fast_available : currency.super_fast_available
                    }));
                });
                return resCurrencies;
            }
        };
        return service;
    };
})();
},{}],9:[function(require,module,exports){
/* global module */

(function () {
    'use strict';
    
    module.exports = function($http,loadingService) {
        var service = {
            post : function(method){
                var promise = $.Deferred();
                loadingService.show();

                $http({
                    method: 'GET',
                    url: 'https://www.easysend.pl/api/calculator/'+method,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        accept : "application/json, text/plain, */*",
                        "Access-Control-Allow-Origin" : "*"
                    }
                })
                .success(function() {
                    loadingService.hide();
                })
                .error(function() {
                    alert('Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie później'); 
                    location.reload();
                    loadingService.hide();
                })
                .then(function (data) { 
                    promise.resolve(data.data);
                }, function () {
                    promise.resolve(false);
                });

                return promise;
            }
        };
        return service;
    };
})();
},{}],10:[function(require,module,exports){
/* global module, _ */

(function () {
    'use strict';
    
    module.exports = function() {
        var skewCount = 0,
            loadersCount = 0;
        var rotate = function (degree) {
            $('.page-loader-wrapper').find('img').css('transform','rotate('+degree+'deg)');
            $('.page-loader-wrapper').find('img').css('-moz-transform','rotate('+degree+'deg)');
            $('.page-loader-wrapper').find('img').css('-ms-transform','rotate('+degree+'deg)');
            $('.page-loader-wrapper').find('img').css('-o-transform','rotate('+degree+'deg)');
            $('.page-loader-wrapper').find('img').css('-webkit-transform','rotate('+degree+'deg)');
        };
        $('.page-loader-wrapper').css('display','none');
        // rotate it
        setInterval(function(){
            if(skewCount%64===0){
                skewCount = 0;
            }
            rotate((skewCount % 64) * 5.625);
            skewCount++;
        },25);

        var service = {
            show : function(){
                loadersCount++;
                if(loadersCount===1){
                    $('.page-loader-wrapper').css('display','block');
                }
            },
            hide : function(){
                if(loadersCount>0){
                    loadersCount--;
                    if(loadersCount===0){
                        $('.page-loader-wrapper').css('display','none');
                    }
                }
            }
        };
        return service;
    };
})();
},{}]},{},[1]);
