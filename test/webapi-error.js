var WebApiError = require("../src/webapi-error"),
    should = require("should");

describe("Create Web Api Error", function() {

  it("should create error with message and status code", function() {
    var error = new WebApiError("Something has gone terribly wrong!", 500);
    ("Something has gone terribly wrong!").should.equal(error.message);
    (500).should.equal(error.statusCode);
  });

});