'use strict';

var superagent = require('superagent'),
  { TimeoutError, 
    WebapiError, 
    WebapiRegularError, 
    WebapiAuthenticationError,
    WebapiPlayerError 
  } =  require('./response-error');

var HttpManager = {};

/* Create superagent options from the base request */
var _getParametersFromRequest = function(request) {
  var options = {};

  if (request.getQueryParameters()) {
    options.query = request.getQueryParameters();
  }

  if (request.getHeaders() && request.getHeaders()['Content-Type'] === 'application/json') {
    options.data = JSON.stringify(request.getBodyParameters());
  } else if (request.getBodyParameters()) {
    options.data = request.getBodyParameters();
  }

  if (request.getHeaders()) {
    options.headers = request.getHeaders();
  }
  return options;
};

var _toError = function(response) {
  if (typeof response.body === 'object' && response.body.error && typeof response.body.error === 'object' && response.body.error.reason) {
    return new WebapiPlayerError(response.body, response.headers, response.statusCode);
  }

  if (typeof response.body === 'object' && response.body.error && typeof response.body.error === 'object') {
    return new WebapiRegularError(response.body, response.headers, response.statusCode);
  }

  if (typeof response.body === 'object' && response.body.error && typeof response.body.error === 'string') {
    return new WebapiAuthenticationError(response.body, response.headers, response.statusCode);
  }
  
  /* Other type of error, or unhandled Web API error format */
  return new WebapiError(response.body, response.headers, response.statusCode, response.body);
};

/* Make the request to the Web API */
HttpManager._makeRequest = function(method, options, uri, callback) {
  var req = method.bind(superagent)(uri);

  if (options.query) {
    req.query(options.query);
  }

  if (options.headers) {
    req.set(options.headers);
  }

  if (options.data) {
    req.send(options.data);
  }

  req.end(function(err, response) {
    if (err) {
      if (err.timeout) {
        return callback(new TimeoutError());
      } else {
        return callback(_toError(err.response));
      }
    }

    return callback(null, {
      body: response.body,
      headers: response.headers,
      statusCode: response.statusCode
    });
  });
};

/**
 * Make a HTTP GET request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.get = function(request, callback) {
  var options = _getParametersFromRequest(request);
  var method = superagent.get;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

/**
 * Make a HTTP POST request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.post = function(request, callback) {
  var options = _getParametersFromRequest(request);
  var method = superagent.post;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

/**
 * Make a HTTP DELETE request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.del = function(request, callback) {
  var options = _getParametersFromRequest(request);
  var method = superagent.del;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

/**
 * Make a HTTP PUT request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.put = function(request, callback) {
  var options = _getParametersFromRequest(request);
  var method = superagent.put;

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

module.exports = HttpManager;