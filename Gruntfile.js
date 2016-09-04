/* global module */

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        watch: {
            js : {
                files: ['app/js/**/*.js','!app/js/app_browserified.js'],
                tasks: ['jshint:all','browserify:app']
            },
            karma : {
                files: ['app/js/**/*.js','!app/js/app_browserified.js','test/**/*.js'],
                tasks: ['karma']
            }
        },
        jshint : {
            all : [
                'app/js/**/*.js',
                '!app/js/app_browserified.js'
            ]
        },
        browserify : {
            app : {
                src: 'app/js/app.js',
                dest: 'app/js/app_browserified.js'
            },
            test : {
                src: './test/**/*test.js',
                dest: './test_bundle/bundle.test.js'
            }
        },
        karma : {
            unit: {
                configFile:"karma.conf.js"
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');  
    
    grunt.registerTask('default', [
        "jshint:all",
        'browserify:app',
        "watch:js"
    ]);
    grunt.registerTask('karma_task', [
        "karma",
        "watch:karma"
    ]);
};
