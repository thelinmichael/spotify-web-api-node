var Request = function(builder) {
  'use strict';
  if (!builder) {
    throw new Error('No builder supplied to constructor');
  }

  this.host = builder.host;
  this.port = builder.port;
  this.scheme = builder.scheme;
  this.queryParameters = builder.queryParameters;
  this.bodyParameters = builder.bodyParameters;
  this.headers = builder.headers;
  this.path = builder.path;
};

Request.prototype.getHost = function() {
  'use strict';
  return this.host;
};

Request.prototype.getPort = function() {
  'use strict';
  return this.port;
};

Request.prototype.getScheme = function() {
  'use strict';
  return this.scheme;
};

Request.prototype.getPath = function() {
  'use strict';
  return this.path;
};

Request.prototype.getQueryParameters = function() {
  'use strict';
  return this.queryParameters;
};

Request.prototype.getBodyParameters = function() {
  'use strict';
  return this.bodyParameters;
};

Request.prototype.getHeaders = function() {
  'use strict';
  return this.headers;
};

Request.prototype.getURI = function() {
  'use strict';
  if (!this.scheme || !this.host || !this.port) {
    throw new Error('Missing components necessary to construct URI');
  }
  var uri = this.scheme + '://' + this.host + ':' + this.port;
  if (this.path) {
    uri += this.path;
  }
  return uri;
};

Request.prototype.addQueryParameters = function(queryParameters) {
  'use strict';
  if (!this.queryParameters) {
    this.queryParameters = queryParameters;
  } else {
    for (var key in queryParameters) {
      this.queryParameters[key] = queryParameters[key];
    }
  }
};

var Builder = function() {
  'use strict';
  var host, port, scheme, queryParameters, bodyParameters, headers;
};

Builder.prototype.withHost = function(host) {
  'use strict';
  this.host = host;
  return this;
};

Builder.prototype.withPort = function(port) {
  'use strict';
  this.port = port;
  return this;
};

Builder.prototype.withScheme = function(scheme) {
  'use strict';
  this.scheme = scheme;
  return this;
};

Builder.prototype.withQueryParameters = function(queryParameters) {
  'use strict';
  this.queryParameters = queryParameters;
  return this;
};

Builder.prototype.withPath = function(path) {
  'use strict';
  this.path = path;
  return this;
};

Builder.prototype.withBodyParameters = function(bodyParameters) {
  'use strict';
  this.bodyParameters = bodyParameters;
  return this;
};

Builder.prototype.withHeaders = function(headers) {
  'use strict';
  this.headers = headers;
  return this;
};

Builder.prototype.build = function() {
  'use strict';
  return new Request(this);
};

module.exports.builder = function() {
  'use strict';
  return new Builder();
};