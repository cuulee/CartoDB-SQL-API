require('../helper');

var _            = require('underscore')
    , ApikeyAuth = require('../../app/auth/apikey')
    , assert     = require('assert')
    ;

suite('has credentials', function() {

    var noCredentialsRequests = [
        {
            des: 'there is not api_key/map_key in the request query',
            req: {query:{}}
        },
        {
            des: 'api_key is undefined`ish in the request query',
            req: {query:{api_key:null}}
        },
        {
            des: 'map_key is undefined`ish in the request query',
            req: {query:{map_key:null}}
        },
        {
            des: 'there is not api_key/map_key in the request body',
            req: {query:{}, body:{}}
        },
        {
            des: 'api_key is undefined`ish in the request body',
            req: {query:{}, body:{api_key:null}}
        },
        {
            des: 'map_key is undefined`ish in the request body',
            req: {query:{}, body:{map_key:null}}
        }
    ];

    noCredentialsRequests.forEach(function(request) {
        test('has no credentials if ' + request.des, function() {
            testCredentials(request.req, false)
        });
    });

    var credentialsRequests = [
        {
            des: 'there is api_key in the request query',
            req: {query:{api_key: 'foo'}}
        },
        {
            des: 'there is api_key in the request query',
            req: {query:{map_key: 'foo'}}
        },
        {
            des: 'there is api_key in the request body',
            req: {query:{}, body:{api_key:'foo'}}
        },
        {
            des: 'there is map_key in the request body',
            req: {query:{}, body:{map_key:'foo'}}
        }
    ];

    credentialsRequests.forEach(function(request) {
        test('has credentials if ' + request.des, function() {
            testCredentials(request.req, true)
        });
    });

    function testCredentials(req, hasCredentials) {
        var apiKeyAuth = new ApikeyAuth(req);
        assert.equal(apiKeyAuth.hasCredentials(), hasCredentials);
    }

});

suite('verify credentials', function() {

    test('verifyCredentials callbacks with true value when request api_key is the same', function(done) {
        testVerifyCredentials({query:{api_key: 'foo'}}, {apiKey: 'foo'}, true, done);
    });

    test('verifyCredentials callbacks with true value when request api_key is different', function(done) {
        testVerifyCredentials({query:{api_key: 'foo'}}, {apiKey: 'bar'}, false, done);
    });

    function testVerifyCredentials(req, options, shouldBeValid, done) {
        var apiKeyAuth = new ApikeyAuth(req);
        apiKeyAuth.verifyCredentials(options, function(err, validCredentials) {
            assert.equal(validCredentials, shouldBeValid);
            done();
        });
    }

});
