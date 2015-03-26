# grunt-heroku-git-hash

A Grunt plugin to retrieve the current Git hash value during a Heroku build.

## Getting Started

This plugin has no configuration options, and contains a single task: ```heroku-git-hash```. When run, the task retrieves and sets the current deploy's hash value under the ```githash``` config property. **grunt-heroku-git-hash** throws a warning (which will halt Grunt) if it is unable to parse the git hash value.

##### Why?

Grunt can be used to automate post-install processes – for example, following a deploy to Heroku, you may wish to minify your hosted javascript files and upload the minification map files to some secure location. In any case, you may find it useful to have available your deploy's Git hash (perhaps to file your uploaded map files, or to make available inside your application's environment), however Heroku doesn't make this valuable accessible during the slug building process or to the running slug. **grunt-heroku-git-hash** extracts this value from the environment and makes it available to other Grunt tasks.

##### N.B., tho:

* This plugin is meant for use *on Heroku, during the build process* and will not retrieve a hash on your local machine. If you're looking for that, might I suggest [grunt-githash](https://www.npmjs.com/package/grunt-githash).
* This plugin has been tested on Heroku's ```cedar-10``` (now-deprecated) and ```cedar-14``` stacks with success on both. There's a [known issue](#known-issues) where this plugin won't work on some deploys, which is under investigation.

### Usage Examples

#### A trivial example 

Here we make use of **grunt-heroku-git-hash** to retrieve the Git hash of a deploy and print it to the console.

**Gruntfile.js:**
```js
module.exports = function(grunt) {
  
  // a simple task that prints our hash to the grunt log, and thus to the build log
  // grunt-heroku-git-hash takes no configuration options

  grunt.registerTask("printHash", "Print our Git hash to console" , function(){
    var gitHash = grunt.config.get('githash');
    grunt.log.writeln("Git hash: " + gitHash);
  });

  grunt.loadNpmTasks("grunt-heroku-git-hash"); //don't forget this

  // run the heroku-git-hash task to populate the githash config value
  grunt.registerTask('default', ['heroku-git-hash', 'printHash']);

};
```

#### A more reasonable example

Here we'll use **grunt-heroku-git-hash** to write the current deploy's Git hash into the banner at the top of our uglified JS.

**Gruntfile.js:**
```js
module.exports = function(grunt) {

  // we'll configure uglify to turn every *.js file in static/js into a .min.js file
  // with a banner at the top of each that will have the package name,
  // and the project's current Git version

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '// <%= pkg.name %>, version: <%= githash %> \n'
      },
      build: {
        files: [{
            expand: true,
            src: '*.js',
            dest: 'static/js',
            cwd: 'static/js',
            ext: '.min.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks("grunt-heroku-git-hash"); //don't forget this
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // run the heroku-git-hash task to populate the githash config value
  grunt.registerTask('default', ['heroku-git-hash', 'uglify']);

};
```

## Known Issues

* [#1](https://github.com/lepinsk/grunt-heroku-git-hash/issues/1) **hash unavailable on some heroku deploys**: in certain cases, heroku's ```push_metadata.yml``` is missing the field that this plugin uses to lookup the hash value. **grunt-heroku-git-hash** will throw an error informing you if this is the case.

## Release History

* **v1.0.2** – March 26, 2015; revising documented issue, improving error messages in that case
* **v1.0.1** – March 25, 2015; documenting an issue on cedar-10
* **v1.0.0** – March 25, 2015; first public release
* **v0.9.9** – March 25, 2015; preparing for release.

## License

**grunt-heroku-git-hash** is MIT-Licensed. For more info, see the LICENSE file at the root of this project.
