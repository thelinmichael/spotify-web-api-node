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

var _getErrorObject = function(defaultMessage, err) {
  'use strict';
  var errorObject;
  if (typeof err.error === 'object' && typeof err.error.message === 'string') {
    errorObject = new Error(err.error.message);
  } else {
    errorObject = new Error(defaultMessage + '. JSON has unexpected format ' + JSON.stringify(err));
  }
  return errorObject;
};

HttpManager._makeRequest = function(method, options, uri, callback) {
  'use strict';

  method(uri, options)
    .on('success', function(data, response) {
      callback(null, data);
    })
    .on('fail', function(err, response) {
      if (err) {
        var errorObject = _getErrorObject('Request failed', err);
        callback(errorObject);
      } else {
        callback(new Error('Request failed'));
      }
    })
    .on('error', function(err, response) {
      if (err) {
        var errorObject = _getErrorObject('Request error', err);
        callback(errorObject);
      } else {
        callback(new Error('Request error'));
      }
    })
    .on('timeout', function(ms) {
      callback(new Error('Request timed out (' + ms + ')'));
    });
};

HttpManager.get = function(request, callback) {
  'use strict';
  var options = _getParametersFromRequest(request);
  var method = restler.get;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

HttpManager.post = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.post;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

HttpManager.del = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.del;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

HttpManager.put = function(request, callback) {
  'use strict';

  var options = _getParametersFromRequest(request);
  var method = restler.put;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

module.exports = HttpManager;
