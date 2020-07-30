'use strict';

function WebapiError(message, statusCode, reason, headers) {
  this.name = 'WebapiError';
  this.message = message || '';
  this.statusCode = statusCode;
  if (reason) {
    this.reason = reason;
  }
  if (headers) {
    this.headers = headers;
  }
}

WebapiError.prototype = Error.prototype;

module.exports = WebapiError;
