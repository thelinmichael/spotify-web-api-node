function WebapiError(message, statusCode) {
  'use strict';

  this.name = 'WebapiError';
  this.message = (message || '');
  this.statusCode = statusCode;
}

WebapiError.prototype = Error.prototype;

module.exports = WebapiError;