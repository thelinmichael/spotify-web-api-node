/**
 * Code retrieved from https://github.com/request/request/blob/master/lib/getProxyFromURI.js
 * and slightly modified to meet our needs.
 */
'use strict';

function formatHostname(hostname) {
  // canonicalize the hostname, so that 'oogle.com' won't match 'google.com'
  return hostname.replace(/^\.*/, '.').toLowerCase();
}

function parseNoProxyZone(zone) {
  zone = zone.trim().toLowerCase();

  var zoneParts = zone.split(':', 2);
  var zoneHost = formatHostname(zoneParts[0]);
  var zonePort = zoneParts[1];
  var hasPort = zone.indexOf(':') > -1;

  return { hostname: zoneHost, port: zonePort, hasPort: hasPort };
}

function uriInNoProxy(uri, noProxy) {
  var parsedUri = new URL(uri);
  var port = parsedUri.port || (parsedUri.protocol === 'https:' ? '443' : '80');
  var hostname = formatHostname(parsedUri.hostname);
  var noProxyList = noProxy.split(',');

  // iterate through the noProxyList until it finds a match.
  return noProxyList.map(parseNoProxyZone).some(function(noProxyZone) {
    var isMatchedAt = hostname.indexOf(noProxyZone.hostname);
    var hostnameMatched =
      isMatchedAt > -1 &&
      isMatchedAt === hostname.length - noProxyZone.hostname.length;

    if (noProxyZone.hasPort) {
      return port === noProxyZone.port && hostnameMatched;
    }

    return hostnameMatched;
  });
}

module.exports = {
  /**
   * Decide the proper request proxy to use based on the request URI object and the
   * environmental variables (NO_PROXY, HTTP_PROXY, etc.) respect NO_PROXY environment variables.
   * @param {String} uri Uri to analyse.
   * @returns {String|null} A proxy uri if matching criterias or null if don't.
   */
  getProxyFromURI: function(uri) {
    var noProxy = process.env.NO_PROXY || process.env.no_proxy || '';

    // if the noProxy is a wildcard then return null
    if (noProxy === '*') {
      return null;
    }

    // if the noProxy is not empty and the uri is found return null
    if (noProxy !== '' && uriInNoProxy(uri, noProxy)) {
      return null;
    }

    // Check for HTTP or HTTPS Proxy in environment Else default to null
    if (uri.match(/^http:/)) {
      return process.env.HTTP_PROXY || process.env.http_proxy || null;
    }

    if (uri.match(/^https:/)) {
      return (
        process.env.HTTPS_PROXY ||
        process.env.https_proxy ||
        process.env.HTTP_PROXY ||
        process.env.http_proxy ||
        null
      );
    }

    // if none of that works, return null
    // (What uri protocol are you using then?)

    return null;
  }
};
