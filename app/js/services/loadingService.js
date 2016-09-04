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