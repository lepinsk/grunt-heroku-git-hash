// grunt-heroku-git-hash
// tasks/heroku_git_hash.js
//
// Copyright (c) 2015 Julian Lepinski
// Licensed under the MIT license.

var yaml = require("js-yaml");
var fs   = require("fs");

module.exports = function(grunt) {
	grunt.registerTask('heroku-git-hash', "Retrive the current Git hash on a Heroku deploy", function(){

		try {

			// born too late to explore the earth
			// born too soon to explore the galaxy
			// born just in time to BROWSE DANK FILESYSTEMS
			var filePath = "/app/tmp/push_metadata.yml";

			var pushMetadata = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
			var hashLong = pushMetadata.source_blob.version;
			grunt.config.set("githash", hashLong);

		} catch (e) {

			grunt.fail.warn("heroku-git-hash; error parsing yaml: " + e);

		}
	});
};
