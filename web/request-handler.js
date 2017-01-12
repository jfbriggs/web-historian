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

  // Variables to determine which page will get served up in the end
  var directory = archive.paths.siteAssets;
  var pageToLoad = 'index.html';

  // HANDLING OF ANY POST REQUESTS (i.e. 'grab a web-page') VIA INPUT FIELD
  if (req.method === 'POST') {
    console.log('REQ METHOD IS POST');
    var body = [];
    var slicedUrl;

    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      console.log('body,  ', body);
      slicedUrl = body.slice(4);

      // archive.addUrlToList(slicedUrl, function() {  // Run function to add the url to sites.txt
      //   console.log('Added', slicedUrl, 'to be downloaded.');
      //   fs.readFile(archive.paths.list, 'utf8', function(err, data) {  // then read the sites.txt list...
      //     if (err) {
      //       throw err;
      //     } else {
      //       console.log(data);  // ...and console log what's in there
      //     }
      //   });
      // });


      // Run "isUrlInList" on url (slicedUrl)
      archive.isUrlInList(slicedUrl, function(err, exists) {
        if (err) {
          throw err;
        } else {
          // console.log('Does it exist?: ', exists);
          if (exists) { // if the URL exists
            archive.isUrlArchived(slicedUrl, function(err, isArchived) { // run 'isUrlArchived'
              if (err) {
                throw err;
              } else {
                if (isArchived) { // if the Url is archived
                  directory = archive.paths.archivedAssets;// set directory to archivedAssets, 
                  pageToLoad = slicedUrl; //and pageToLoad to slicedUrl
                } else { // otherwise...
                  pageToLoad = 'loading.html'; // set pageToLoad to loading.html
                }
              }
            });

          } else { // if the URL doesn't exist in the sites.txt list
            archive.addUrlToList(slicedUrl, function() {  // Run function to add the url to sites.txt
              console.log('Added', slicedUrl, 'to be downloaded.');
              fs.readFile(archive.paths.list, 'utf8', function(err, data) {  // then read the sites.txt list...
                if (err) {
                  throw err;
                } else {
                  console.log(data);  // ...and console log what's in there
                }
              });
            });
          }
        }
      });

      res.writeHeader(302, helpers.headers);
      helpers.serveAssets(res, path.join(directory, pageToLoad), function(data) {
        res.end(data);
      });
    });


  } else if (req.method === 'GET') {
  // INITIAL LOAD (GET REQUEST): INDEX.HTML IS BEING REQUESTED
    helpers.serveAssets(res, path.join(directory, pageToLoad), function(data) {
      res.end(data);
    });
  }


  // fs.readFile(path.join(archive.paths.siteAssets, 'index.html'), 'utf8', function(err, data) {
  //   if (err) {
  //     throw err;
  //   } else {
  //     res.end(data);
  //   }
  // });

  //res.end(archive.paths.list);
};
