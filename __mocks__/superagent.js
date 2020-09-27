'use strict';

//mock for superagent - __mocks__/superagent.js

var mockDelay;
var mockError;
var mockResponse = {
  status() {
    return 200;
  },
  ok() {
    return true;
  },
  get: jest.fn(),
  toError: jest.fn()
};

var Request = {
  put() {
    return this;
  },
  del() {
    return this;
  },
  post() {
    return this;
  },
  get() {
    return this;
  },
  send() {
    return this;
  },
  query() {
    return this;
  },
  field() {
    return this;
  },
  set() {
    return this;
  },
  accept() {
    return this;
  },
  timeout() {
    return this;
  },
  end: jest.fn().mockImplementation(function(callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse);
      return;
    }

    callback(mockError, mockResponse);
  }),
  //expose helper methods for tests to set
  __setMockDelay(boolValue) {
    mockDelay = boolValue;
  },
  __setMockResponse(mockRes) {
    mockResponse = mockRes;
  },
  __setMockError(mockErr) {
    mockError = mockErr;
  },
  __reset() {
    this.__setMockResponse({
      status() {
        return 200;
      },
      ok() {
        return true;
      }
    });
    this.__setMockError(null);
    this.__setMockDelay(false);
  }
};

module.exports = Request;
