'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      all: {
        files: ['src/*.js', 'test/*.js'],
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
    }
  });
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('dev', ['simplemocha', 'watch']);
  grunt.registerTask('default', ['simplemocha']);
};
