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