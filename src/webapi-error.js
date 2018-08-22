'use strict';

function WebapiError(message, statusCode, request) {
  this.name = 'WebapiError';
  this.message = message || '';
  this.statusCode = statusCode;
  this.request = request || '';
}

WebapiError.prototype = Error.prototype;

module.exports = WebapiError;
