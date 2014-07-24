var restler = require('restler');

var HttpManager = {};

var _getParametersFromRequest = function(request) {
  'use strict';

  var options = {};

  if (request.getQueryParameters()) {
    options.query = request.getQueryParameters();
  }

  if (request.getHeaders() &&
      request.getHeaders()['Content-Type'] === 'application/json') {
    options.data = JSON.stringify(request.getBodyParameters());
  } else if (request.getBodyParameters()) {
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
      if (data) {
        callback(data);
      } else {
        callback({
          error : 'request failed (' + response.statusCode + ')'
        });
      }
    })
    .on('error', function(err, response) {
      if (err) {
        callback(err);
      } else {
        callback({
          error : 'request error (' + response.statusCode + ')'
        });
      }
    })
    .on('timeout', function(ms) {
      callback({
        error : 'Request timed out (' + ms + ')'
      });
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

HttpManager.del = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.del;

  _makeRequest(method, options, request.getURI(), callback);
};

HttpManager.put = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.put;

  _makeRequest(method, options, request.getURI(), callback);
};

module.exports = HttpManager;