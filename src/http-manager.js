'use strict';

var {
  TimeoutError,
  WebapiError,
  WebapiRegularError,
  WebapiAuthenticationError,
  WebapiPlayerError
} = require('./response-error');

var HttpManager = {};

/* Create superagent options from the base request */
var _getParametersFromRequest = function (request) {
  var options = {};

  if (request.getQueryParameters()) {
    options.query = new URLSearchParams(
      request.getQueryParameters()
    ).toString();
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

  if (request.getTimeout()) {
    options.timeout = request.getTimeout();
  }

  return options;
};

/**
 * @param {Response} response
 */
var _toError = async function (response) {
  const body = await response.json();

  if (
    typeof body === 'object' &&
    typeof body.error === 'object' &&
    typeof body.error.reason === 'string'
  ) {
    return new WebapiPlayerError(body, response.headers, response.status);
  }

  if (typeof body === 'object' && typeof body.error === 'object') {
    return new WebapiRegularError(body, response.headers, response.status);
  }

  if (typeof body === 'object' && typeof body.error === 'string') {
    return new WebapiAuthenticationError(
      body,
      response.headers,
      response.status
    );
  }

  /* Other type of error, or unhandled Web API error format */
  return new WebapiError(body, response.headers, response.status, body);
};

/* Make the request to the Web API */
HttpManager._makeRequest = function (method, options, uri, callback) {
  const headers = new Headers(options.headers || {});
  let serializationMethod = JSON.stringify;

  if (headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
    serializationMethod = d => new URLSearchParams(d);
  }

  const controller = new AbortController();
  let timeoutId;

  if (options.timeout) {
    setTimeout(() => {
      controller.abort();
    }, options.timeout);
  }

  let body = options.data;

  if (body && typeof body !== 'string') {
    body = serializationMethod(body);
  }

  fetch(uri + (options.query ? '?' + options.query : ''), {
    method,
    headers,
    body,
    signal: controller.signal
  })
    .then(async resp => {
      clearTimeout(timeoutId);

      if (!resp.ok) {
        return callback(await _toError(resp));
      }

      return callback(null, {
        body: await resp.json().catch(() => null),
        headers: resp.headers,
        statusCode: resp.status
      });
    })
    .catch(err => {
      if (controller.signal.aborted) {
        return callback(
          new TimeoutError(`request took longer than ${options.timeout}ms`)
        );
      }

      return callback(err);
    });
};

/**
 * Make a HTTP GET request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.get = function (request, callback) {
  var options = _getParametersFromRequest(request);
  var method = 'GET';

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

/**
 * Make a HTTP POST request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.post = function (request, callback) {
  var options = _getParametersFromRequest(request);
  var method = 'POST';

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

/**
 * Make a HTTP DELETE request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.del = function (request, callback) {
  var options = _getParametersFromRequest(request);
  var method = 'DELETE';

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

/**
 * Make a HTTP PUT request.
 * @param {BaseRequest} The request.
 * @param {Function} The callback function.
 */
HttpManager.put = function (request, callback) {
  var options = _getParametersFromRequest(request);
  var method = 'PUT';

  HttpManager._makeRequest(method, options, request.getURI(), callback);
};

module.exports = HttpManager;
