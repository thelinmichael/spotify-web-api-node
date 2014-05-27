var restler = require('restler');

var HttpManager = {};

HttpManager.get = function(request, callback) {
  'use strict';

  var options = {};
  if (request.getQueryParameters()) {
    options.query = request.getQueryParameters();
  }

  restler.get(request.getURI(), options)
    .on('complete', callback);
};

module.exports = HttpManager;