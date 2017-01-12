var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var helpers = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  res.writeHeader(200, helpers.headers);
  console.log(req.url);
  console.log(req.method);
  var slicedUrl;

  
  if (req.method === 'POST') {
    var body = [];
    var slicedUrl;

    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      slicedUrl = body.slice(4);
      // Run function to add the url to sites.txt
      archive.addUrlToList(slicedUrl, function() {
        console.log('Added', slicedUrl, 'to be downloaded.');
        //SERVE UP LOADING PAGE
      });

      res.writeHeader(302, helpers.headers);
      res.end();
    });

    // archive.isUrlInList(body, function(err, exists) {
    //   if (!err && !exists) {
    // archive.addUrlToList(slicedUrl, function() {
    //   console.log('Added', slicedUrl, 'to be downloaded.');
    //   //SERVE UP LOADING PAGE
    // });
    //   } else if (!err && exists) {
    //     SERVE UP LOADING PAGE
    //   }
    // });
  }
  // INITIAL LOAD: INDEX.HTML IS BEING REQUESTED
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
