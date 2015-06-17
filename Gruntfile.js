'use strict';

module.exports = function(grunt){
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint:{
      all: ['lib/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false // Optionally suppress output to standard out (defaults to false)
        },
        src: ['test/**/*.js']
      }
    }

  });

  grunt.registerTask('default', 'jshint');
}
