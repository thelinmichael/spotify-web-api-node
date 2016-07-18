'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporterOutput: ''
      }
    },
    watch: {
      all: {
        files: [
          'src/*.js',
          'test/*.js'
        ],
        tasks: ['default']
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: ['test/*.js']
      }
    },
  });
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('dev', ['jshint','simplemocha','watch']);
  grunt.registerTask('default', ['jshint','simplemocha']);
};
