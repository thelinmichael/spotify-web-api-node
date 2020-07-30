'use strict';

function WebapiError(message, statusCode, reason) {
  this.name = 'WebapiError';
  this.message = message || '';
  this.statusCode = statusCode;
  if (reason) {
    this.reason = reason;
  }
}

WebapiError.prototype = Error.prototype;

module.exports = WebapiError;
