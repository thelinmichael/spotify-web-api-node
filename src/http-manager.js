'use strict';

var superagent = require('superagent'),
  WebApiError = require('./webapi-error');

var HttpManager = {};


/* Simple delay function using promises */
const _timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* Create superagent options from the base request */
var _getParametersFromRequest = function(request) {
  var options = {};

  if (request.getQueryParameters()) {
    options.query = request.getQueryParameters();
  }

  if (
    request.getHeaders() &&
    request.getHeaders()['Content-Type'] === 'application/json'
  ) {
    options.data = JSON.stringify(request.getBodyParameters());
  } else if (request.getBodyParameters()) {
    options.data = request.getBodyParameters();
  }

  if (request.getHeaders()) {
    options.headers = request.getHeaders();
  }
  return options;
};

/* Create an error object from an error returned from the Web API */
var _getErrorObject = function(defaultMessage, err) {
  var errorObject;
  if (typeof err.error === 'object' && typeof err.error.message === 'string') {
    // Web API Error format
    errorObject = new WebApiError(err.error.message, err.error.status, err.headers);
  } else if (typeof err.error === 'string') {
    // Authorization Error format
    /* jshint ignore:start */
    errorObject = new WebApiError(err.error + ': ' + err['error_description'], null,  err.headers);
    /* jshint ignore:end */
  } else if (typeof err === 'string') {
    // Serialized JSON error
    try {
      var parsedError = JSON.parse(err);
      errorObject = new WebApiError(
        parsedError.error.message,
        parsedError.error.status,
        parsedError.headers,
      );
    } catch (err) {
      // Error not JSON formatted
    }



  }

  if (!errorObject) {
    // Unexpected format
    errorObject = new WebApiError(defaultMessage + ': ' + JSON.stringify(err));
  }

  return errorObject;
};

/* Make the request to the Web API */
HttpManager._makeRequest = function(method, options, uri, callback) {
  var req = method.bind(superagent)(uri);

  if (options.query) {
    req.query(options.query);
  }

  if (
    options.data &&
    (!options.headers || options.headers['Content-Type'] !== 'application/json')
  ) {
    req.type('form');
    req.send(options.data);
  } else if (options.data) {
    req.send(options.data);
  }

  if (options.headers) {
    req.set(options.headers);
  }

  req.end(function(err, response) {

    if (response.statusCode === 429) {

      setTimeout(() => {
        return HttpManager._makeRequest(method, options, uri, callback);
      }, response.headers['retry-after'] * 1000)

    } else if (err) {

      var errorObject = _getErrorObject('Request error', {
        error: err,
        headers: (response != null && typeof response != 'undefined' && typeof response.headers != 'undefined') ? response.headers : null
      });
      return callback(errorObject);

    } else {

      return callback(null, {
        body: response.body,
        headers: response.headers,
        statusCode: response.statusCode
      });

    }
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
