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