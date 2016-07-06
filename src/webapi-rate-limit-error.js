'use strict';

function WebapiRateLimitError(message, statusCode, retryAfter) {
  this.name = 'WebapiRateLimitError';
  this.message = (message || '');
  this.statusCode = statusCode;
  this.retryAfter = retryAfter;
}

WebapiRateLimitError.prototype = Error.prototype;

module.exports = WebapiRateLimitError;
