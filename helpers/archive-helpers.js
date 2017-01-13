var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var requestHandler = require('../web/request-handler');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var urls;
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    urls = data.toString().split('\n');
    callback(err, urls);
  });

};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(err, urls) {
    if (!err) {
      var exists = false;
      urls.forEach(function(item) {
        if (item === url) {
          exists = true;
        }
      });
      callback(err, exists);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if (err) {
      throw err;
    } else {
      callback();
      console.log('Added ' + url + ' to list!');
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(path.join(exports.paths.archivedSites, url), function(err, stats) {
    if (err) { 
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
};

exports.downloadUrls = function(urls) {
  console.log(urls);
  urls.forEach(function(url) {
    if (url !== '') {
      request('http://' + url).pipe(
        fs.createWriteStream(path.join(exports.paths.archivedSites, url))
      );
      console.log(url, 'saved to archive.');
    }
  });

};
