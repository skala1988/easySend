//jshint strict: false
module.exports = function(config) {
  config.set({
        basePath: '',
        frameworks: ['browserify', 'jasmine'],
        files: [
            './app/components/jquery.js',
            './app/components/underscore.js',
            './app/bower_components/angular/angular.js',
            './app/bower_components/angular-mocks/angular-mocks.js',
            './app/bower_components/angular-route/angular-route.js',
            './app/components/version/version.js',
            './app/components/version/interpolate-filter.js',
            './app/components/version/version-directive.js',
            './app/js/views/calculatorView.js',
            './test/*.js'
        ],
        exclude: [
        ],
        preprocessors: {
            './test/*.js': ['browserify']
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        browserify: {
            debug: true
        },
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-bro'
        ],
        singleRun: true
  });
};
