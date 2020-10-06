/* Timeout */
class NamedError extends Error {
  get name() {
    return this.constructor.name;
  }  
}

class TimeoutError extends NamedError {
  constructor() {
    const message = 'A timeout occurred while communicating with Spotify\'s Web API.';
    super(message);
  }

}

/* Web API Parent and fallback error */
class WebapiError extends NamedError {
  constructor(body, headers, statusCode, message) {
    super(message);
    this.body = body;
    this.headers = headers;
    this.statusCode = statusCode;
  }

}

/** 
 * Regular Error
 * { status : <integer>, message : <string> }
 */
class WebapiRegularError extends WebapiError {
  constructor(body, headers, statusCode) {
    const message = 'An error occurred while communicating with Spotify\'s Web API.\n' +
    'Details: ' + body.error.message + '.';

    super(body, headers, statusCode, message);
  }
}

/**
 * Authentication Error 
 * { error : <string>, error_description : <string> }
 */
class WebapiAuthenticationError extends WebapiError {
  constructor(body, headers, statusCode) {
    const message = 'An authentication error occurred while communicating with Spotify\'s Web API.\n' +
    'Details: ' + body.error + (body.error_description ? ' ' + body.error_description + '.' : '.');

    super(body, headers, statusCode, message);
  }
}

/**
 * Player Error 
 * { status : <integer>, message : <string>, reason : <string> }
 */
class WebapiPlayerError extends WebapiError {
  constructor(body, headers, statusCode) {
    const message = 'An error occurred while communicating with Spotify\'s Web API.\n' +
    'Details: ' + body.error.message + (body.error.reason ? ' ' + body.error.reason + '.' : '.');

    super(body, headers, statusCode, message);
  }
}

module.exports = { WebapiError, TimeoutError, WebapiRegularError, WebapiAuthenticationError, WebapiPlayerError };