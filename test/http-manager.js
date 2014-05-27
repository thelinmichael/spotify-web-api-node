var HttpManager = require("../src/http-manager"),
    WebApiRequest = require("../src/webapi-request"),
    should = require("should");

describe("Make requests", function() {

  it("should make get request by using the request object", function(done) {

    var request = WebApiRequest.builder()
        .withPath("/v1/search")
        .withQueryParameters({
          q : "overwerk",
          type : "album",
          limit : 1,
          offset: 2
        })
        .build();

    HttpManager.get(request, function(result, response) {
      should.exist(response);
      should.exist(result);
      done();
    });

  });

});