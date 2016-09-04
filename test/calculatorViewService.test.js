/* global expect, jasmine */

require('../app/js/app.js');

describe('myApp', function() {
    beforeEach(angular.mock.module('myApp'));
    beforeEach(angular.mock.module('ngRoute'));
    beforeEach(angular.mock.module('myApp.directives'));
    beforeEach(angular.mock.module('myApp.services'));
    beforeEach(angular.mock.module('myApp.controllers'));
    beforeEach(angular.mock.module('myApp.version'));
    beforeEach(angular.mock.module('myApp.calculatorView'));
    
    var cvService,
    $httpBackend,
    $rScope;

    beforeEach(inject(function(calculatorViewService,$rootScope,_$httpBackend_){
        cvService = calculatorViewService;
        $rScope = $rootScope;
        $httpBackend = _$httpBackend_;
        
        $httpBackend.when('GET', 'https://www.easysend.pl/api/calculator/countries')
        .respond([{"id":1,"name":"Polska","code":"PL","default_currency":{"id":1,"name":"PLN"},"dial_code":48,"is_preferred":true},{"id":2,"name":"Wielka Brytania","code":"GB","default_currency":{"id":3,"name":"GBP"},"dial_code":44,"is_preferred":true}]);
        
        $httpBackend.when('GET', 'https://www.easysend.pl/api/calculator/countries/1/destinations')
        .respond([{"id":1,"name":"Polska","code":"PL","default_currency":{"id":1,"name":"PLN"},"dial_code":48,"is_preferred":true},{"id":2,"name":"Wielka Brytania","code":"GB","default_currency":{"id":3,"name":"GBP"},"dial_code":44,"is_preferred":true},{"id":20,"name":"Niemcy","code":"DE","default_currency":{"id":2,"name":"EUR"},"dial_code":49,"is_preferred":true},{"id":3,"name":"Austria","code":"AT","default_currency":{"id":2,"name":"EUR"},"dial_code":43,"is_preferred":false},{"id":4,"name":"Belgia","code":"BE","default_currency":{"id":2,"name":"EUR"},"dial_code":32,"is_preferred":false},{"id":5,"name":"Bu\u0142garia","code":"BG","default_currency":{"id":6,"name":"BGN"},"dial_code":359,"is_preferred":false},{"id":6,"name":"Cypr","code":"CY","default_currency":{"id":2,"name":"EUR"},"dial_code":357,"is_preferred":false},{"id":7,"name":"Czechy","code":"CZ","default_currency":{"id":11,"name":"CZK"},"dial_code":420,"is_preferred":false},{"id":8,"name":"Dania","code":"DK","default_currency":{"id":2,"name":"EUR"},"dial_code":45,"is_preferred":false},{"id":9,"name":"Estonia","code":"EE","default_currency":{"id":2,"name":"EUR"},"dial_code":372,"is_preferred":false},{"id":10,"name":"Finladia","code":"FI","default_currency":{"id":2,"name":"EUR"},"dial_code":358,"is_preferred":false},{"id":11,"name":"Francja","code":"FR","default_currency":{"id":2,"name":"EUR"},"dial_code":33,"is_preferred":false},{"id":12,"name":"Grecja","code":"GR","default_currency":{"id":2,"name":"EUR"},"dial_code":30,"is_preferred":false},{"id":13,"name":"Hiszpania","code":"ES","default_currency":{"id":2,"name":"EUR"},"dial_code":34,"is_preferred":false},{"id":14,"name":"Holandia","code":"NL","default_currency":{"id":2,"name":"EUR"},"dial_code":31,"is_preferred":false},{"id":15,"name":"Irlandia","code":"IE","default_currency":{"id":2,"name":"EUR"},"dial_code":353,"is_preferred":false},{"id":16,"name":"Litwa","code":"LT","default_currency":{"id":2,"name":"EUR"},"dial_code":370,"is_preferred":false},{"id":17,"name":"Luksemburg","code":"LU","default_currency":{"id":2,"name":"EUR"},"dial_code":352,"is_preferred":false},{"id":18,"name":"\u0141otwa","code":"LV","default_currency":{"id":2,"name":"EUR"},"dial_code":371,"is_preferred":false},{"id":19,"name":"Malta","code":"MT","default_currency":{"id":2,"name":"EUR"},"dial_code":356,"is_preferred":false},{"id":21,"name":"Portugalia","code":"PT","default_currency":{"id":2,"name":"EUR"},"dial_code":351,"is_preferred":false},{"id":22,"name":"Rumunia","code":"RO","default_currency":{"id":5,"name":"RON"},"dial_code":40,"is_preferred":false},{"id":23,"name":"S\u0142owacja","code":"SK","default_currency":{"id":2,"name":"EUR"},"dial_code":421,"is_preferred":false},{"id":24,"name":"S\u0142owenia","code":"SI","default_currency":{"id":2,"name":"EUR"},"dial_code":386,"is_preferred":false},{"id":25,"name":"Szwecja","code":"SE","default_currency":{"id":10,"name":"SEK"},"dial_code":46,"is_preferred":false},{"id":26,"name":"W\u0119gry","code":"HU","default_currency":{"id":9,"name":"HUF"},"dial_code":36,"is_preferred":false},{"id":27,"name":"W\u0142ochy","code":"IT","default_currency":{"id":2,"name":"EUR"},"dial_code":39,"is_preferred":false},{"id":28,"name":"Szwajcaria","code":"CH","default_currency":{"id":4,"name":"CHF"},"dial_code":41,"is_preferred":false},{"id":29,"name":"Norwegia","code":"NO","default_currency":{"id":15,"name":"NOK"},"dial_code":47,"is_preferred":false},{"id":30,"name":"Chorwacja","code":"HR","default_currency":{"id":2,"name":"EUR"},"dial_code":385,"is_preferred":false}]);
        
        $httpBackend.when('GET', 'https://www.easysend.pl/api/calculator/currencies/1/1')
        .respond([{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":1,"name":"PLN"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":2,"name":"EUR"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":3,"name":"GBP"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":4,"name":"CHF"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":11,"name":"CZK"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":12,"name":"USD"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":15,"name":"NOK"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":10,"name":"SEK"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":6,"name":"BGN"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":9,"name":"HUF"},"super_fast_available":false},{"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":14,"name":"AUD"},"super_fast_available":false}]);
        $httpBackend.when('GET', 'https://www.easysend.pl/api/calculator/exchange-rate/GBP/PLN/100')
        .respond({"currency_in":{"id":3,"name":"GBP"},"currency_out":{"id":1,"name":"PLN"},"rate":5.1405,"is_inverse":false});
    }));
    
    describe('myApp.calculatorViewService',function(){
        it('should be defined',function(){
            expect(cvService).toBeDefined();
        });
        it('should have proper functions',function(){
            expect(cvService.getCountriesFrom).toBeDefined();
            expect(cvService.getCountriesTo).toBeDefined();
            expect(cvService.getCountriesPairCurrencies).toBeDefined();
            expect(cvService.getResult).toBeDefined();
            expect(cvService.sortCurrencies).toBeDefined();
        });
        describe('myApp.calculatorViewService.getCountriesFrom',function(){
            it('shouldnt return false',function(){
                cvService.getCountriesFrom().then(function(result){
                    expect(result).not.toBe(false);
                }); 
                $httpBackend.flush();
            });
            it('should return object with proper attributes',function(){
                cvService.getCountriesFrom().then(function(result){
                    // allCurrencies
                    expect(result.allCurrencies).toBeDefined();
                    // countriesFrom
                    expect(result.countriesFrom).toBeDefined();
                    expect(result.countriesFrom.length).toBeDefined();
                    expect(result.countriesFrom.length).toBeGreaterThan(0);
                    // countriesTo 
                    expect(result.countriesTo).toBeDefined();
                    expect(result.countriesTo.length).toBeDefined();
                    expect(result.countriesTo.length).toBeGreaterThan(0);
                    // selectedCurrencyIn
                    expect(result.selectedCurrencyIn).toBeDefined();
                    expect(result.selectedCurrencyIn).toEqual(jasmine.any(Number));
                    expect(result.selectedCurrencyIn).toBeGreaterThan(0);
                    // selectedCurrencyOut
                    expect(result.selectedCurrencyOut).toBeDefined();
                    expect(result.selectedCurrencyOut).toEqual(jasmine.any(Number));
                    expect(result.selectedCurrencyOut).toBeGreaterThan(0);
                    // selectedFromCountryId
                    expect(result.selectedFromCountryId).toBeDefined();
                    expect(result.selectedFromCountryId).toEqual(jasmine.any(Number));
                    expect(result.selectedFromCountryId).toBeGreaterThan(0);
                    // selectedToCountryId
                    expect(result.selectedToCountryId).toBeDefined();
                    expect(result.selectedToCountryId).toEqual(jasmine.any(Number));
                    expect(result.selectedToCountryId).toBeGreaterThan(0);
                    // selectedExchangeType
                    expect(result.selectedExchangeType).toBeDefined();
                    expect(result.selectedExchangeType).toEqual(jasmine.any(Number));
                    expect(result.selectedExchangeType).toBeLessThan(2);
                    expect(result.selectedExchangeType).toBeGreaterThan(-1);
                }); 
                $httpBackend.flush();
            });
        });
        describe('myApp.calculatorViewService.getCountriesTo',function(){
            it('shouldnt return false',function(){
                cvService.getCountriesTo(1,1).then(function(result){
                    expect(result).not.toBe(false);
                }); 
                $httpBackend.flush();
            });
            it('should return object with proper attributes',function(){
                cvService.getCountriesTo(1,1).then(function(result){
                    // allCurrencies
                    expect(result.allCurrencies).toBeDefined();
                    // countriesTo 
                    expect(result.countriesTo).toBeDefined();
                    expect(result.countriesTo.length).toBeDefined();
                    expect(result.countriesTo.length).toBeGreaterThan(0);
                    // selectedCurrencyIn
                    expect(result.selectedCurrencyIn).toBeDefined();
                    expect(result.selectedCurrencyIn).toEqual(jasmine.any(Number));
                    expect(result.selectedCurrencyIn).toBeGreaterThan(0);
                    // selectedCurrencyOut
                    expect(result.selectedCurrencyOut).toBeDefined();
                    expect(result.selectedCurrencyOut).toEqual(jasmine.any(Number));
                    expect(result.selectedCurrencyOut).toBeGreaterThan(0);
                    // selectedToCountryId
                    expect(result.selectedToCountryId).toBeDefined();
                    expect(result.selectedToCountryId).toEqual(jasmine.any(Number));
                    expect(result.selectedToCountryId).toBeGreaterThan(0);
                    // selectedExchangeType
                    expect(result.selectedExchangeType).toBeDefined();
                    expect(result.selectedExchangeType).toEqual(jasmine.any(Number));
                    expect(result.selectedExchangeType).toBeLessThan(2);
                    expect(result.selectedExchangeType).toBeGreaterThan(-1);
                }); 
                $httpBackend.flush();
            });
        });
        describe('myApp.calculatorViewService.getCountriesPairCurrencies',function(){
            it('shouldnt return false',function(){
                cvService.getCountriesPairCurrencies(1,1,{
                    fromId : 1,
                    toId : 1
                }).then(function(result){
                    expect(result).not.toBe(false);
                }); 
                $httpBackend.flush();
            });
            it('should return object with proper attributes',function(){
                cvService.getCountriesPairCurrencies(1,1,{
                    fromId : 1,
                    toId : 1
                }).then(function(result){
                    // allCurrencies
                    expect(result.allCurrencies).toBeDefined();
                    // selectedCurrencyIn
                    expect(result.selectedCurrencyIn).toBeDefined();
                    expect(result.selectedCurrencyIn).toEqual(jasmine.any(Number));
                    expect(result.selectedCurrencyIn).toBeGreaterThan(0);
                    // selectedCurrencyOut
                    expect(result.selectedCurrencyOut).toBeDefined();
                    expect(result.selectedCurrencyOut).toEqual(jasmine.any(Number));
                    expect(result.selectedCurrencyOut).toBeGreaterThan(0);
                    // selectedExchangeType
                    expect(result.selectedExchangeType).toBeDefined();
                    expect(result.selectedExchangeType).toEqual(jasmine.any(Number));
                    expect(result.selectedExchangeType).toBeLessThan(2);
                    expect(result.selectedExchangeType).toBeGreaterThan(-1);
                }); 
                $httpBackend.flush();
            });
        });
        describe('myApp.calculatorViewService.getResult',function(){
            it('shouldnt return false',function(){
                cvService.getResult('GBP',"PLN",100).then(function(result){
                    expect(result).not.toBe(false);
                }); 
                $httpBackend.flush();
            });
            it('should return object with proper attributes',function(){
                cvService.getResult('GBP',"PLN",100).then(function(result){
                    expect(result.currency_in).toBeDefined();
                    expect(result.currency_out).toBeDefined();
                    expect(result.is_inverse).toBeDefined();
                    expect(result.rate).toBeDefined();
                }); 
                $httpBackend.flush();
            });
        });
    });
});