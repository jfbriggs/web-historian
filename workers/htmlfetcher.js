// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

module.exports = function() { // Grab list that's in sites.txt (readListOfUrls)
  console.log('WORKER STARTED');
  archive.readListOfUrls(function(err, urls) {
    // Iterate through list, seeing if each is in archive (isUrlArchived) 
    archive.downloadUrls(urls);
    console.log('Proceeding to download.');
    
  });

};