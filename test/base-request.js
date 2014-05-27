var Request = require("../src/base-request"),
    should = require("should");

describe("Create Requests", function() {

  it("Should create host, port, and scheme", function() {
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .build();

    request.getHost().should.equal("such.api.wow");
    request.getPort().should.equal(1337);
    request.getScheme().should.equal("http");
  });

  it("Should add query parameters", function() {
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .withQueryParameters({
        "oneParameter" : 1,
        "anotherParameter" : true,
        "thirdParameter" : "hello"
      })
      .build();

    request.getQueryParameters().oneParameter.should.equal(1);
    request.getQueryParameters().anotherParameter.should.equal(true);
    request.getQueryParameters().thirdParameter.should.equal("hello");
  });

  it("Should add body parameters", function() {
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .withBodyParameters({
        "one" : 1,
        "two" : true,
        "three" : "world"
      })
      .build();

    request.getBodyParameters().one.should.equal(1);
    request.getBodyParameters().two.should.equal(true);
    request.getBodyParameters().three.should.equal("world");
  });

  it("Should add header parameters", function() {
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withScheme("http")
      .withHeaders({
        "Authorization" : "Basic WOOP",
        "Content-Type" : "application/lol"
      })
      .build();

    request.getHeaders().Authorization.should.equal("Basic WOOP");
    request.getHeaders()["Content-Type"].should.equal("application/lol");
  });

  it("Should add path", function() {
    var request = Request.builder()
      .withHost("such.api.wow")
      .withPort(1337)
      .withPath("/v1/users/meriosweg")
      .build();

    request.getPath().should.equal("/v1/users/meriosweg");
  });

  it("Should build URI", function() {
    var request = Request.builder()
      .withHost("such.api.wow")
      .withScheme("https")
      .withPort(1337)
      .withPath("/v1/users/meriosweg")
      .build();

    request.getURI().should.equal("https://such.api.wow:1337/v1/users/meriosweg");
  });

});