var restler = require('restler');

var HttpManager = {};

var _getParametersFromRequest = function(request) {
  'use strict';

  var options = {};

  if (request.getQueryParameters()) {
    options.query = request.getQueryParameters();
  }

  if (request.getBodyParameters()) {
    options.data = request.getBodyParameters();
  }

  if (request.getHeaders()) {
    options.headers = request.getHeaders();
  }

  return options;
};

var _makeRequest = function(method, options, uri, callback) {
  'use strict';

  method(uri, options)
    .on('success', function(data, response) {
      callback(null, data);
    })
    .on('fail', function(data, response) {
      callback(data);
    })
    .on('error', function(err, response) {
      callback(err);
    })
    .on('timeout', function(ms) {
      callback(new Error('Timeout'));
    });
};


HttpManager.get = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.get;

  _makeRequest(method, options, request.getURI(), callback);
};

HttpManager.post = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.post;

  _makeRequest(method, options, request.getURI(), callback);
};

module.exports = HttpManager;