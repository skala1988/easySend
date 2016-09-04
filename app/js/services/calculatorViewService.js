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