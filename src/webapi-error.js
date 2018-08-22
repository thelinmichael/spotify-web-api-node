'use strict';

function WebapiError(message, statusCode, headers) {
  this.name = 'WebapiError';
  this.message = message || '';
  this.statusCode = statusCode;
  this.headers = headers;
}

WebapiError.prototype = Error.prototype;

module.exports = WebapiError;
