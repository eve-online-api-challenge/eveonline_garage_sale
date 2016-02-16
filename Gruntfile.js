module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* Run two watch jobs at the same time */
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: ['apitask', 'watch:client']
      }
    },
    watch: {
      api:{ //Watch for API changes and restart server
        files: ['*.js',
                'api/**/*.js'],
        options: {
          spawn: false,
        },
        tasks: ['sync', 'express:dev:stop','express:dev'],
      },
      client:{ //Watch for Client changes and inject using browserSync
        files: ['public/**/*.js',
                'public/**/*.html', 'public/**/*.css'],
        options: {
          spawn: false,
        },
        tasks: ['sync'],
      },
    },
    copy: {
      main: {
        expand: true,
        flatten: false,
        src: ['public/**', 'api/**'],
        dest: 'build/',
      },
    },
    sync: {
      main: {
      files: [{
        src: [
          'public/**', 'api/**'
        ],
        dest: 'build',
      }],
      pretend: false,
      verbose: true
      }
    },
    browserSync: {
            dev: {
              bsFiles: {
                  src : [
                      'build/public/css/*.css',
                      'build/public/html/*.html',
                      'build/public/js/*.js',
                  ]
              },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './public',
                        index: 'html/index.html'
                    }
                }
            }
        },
    express: {
          options: {
            harmony: true,
          },
          dev: {
            options: {
              script: 'build/api/app.js'
            }
          },
        }
  });

  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.task.registerTask('apitask', 'livereload for express server', function(){
    grunt.task.run(['express:dev', 'watch:api']);
  });

  // Default task(s).
  grunt.registerTask('default', ['copy','browserSync','concurrent:dev']);

};
