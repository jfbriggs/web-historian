var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var helpers = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  res.writeHeader(200, helpers.headers);

  // if index.html is being requested
  helpers.serveAssets(res, path.join(archive.paths.siteAssets, 'index.html'), function(data) {
    res.end(data);
  });

  // fs.readFile(path.join(archive.paths.siteAssets, 'index.html'), 'utf8', function(err, data) {
  //   if (err) {
  //     throw err;
  //   } else {
  //     res.end(data);
  //   }
  // });

  //res.end(archive.paths.list);
};
