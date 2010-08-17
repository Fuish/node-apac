var apac = require("../lib/apac"),
    vows = require("vows"),
    assert = require("assert"),
    http = require("http"),
    event = require('events');

// the basic setup
var OperationHelper = apac.OperationHelper;
var opHelper = new OperationHelper({
        awsId:     'test',
        awsSecret: 'test+test',
        assocId:   'test-01',
});

// some hand-rolled mocks
// need a good mock framework, like sinon or espionage
var request_emitter = new(event.EventEmitter),
    response_emitter = new(event.EventEmitter);

request_emitter.end = function() { return true };

response_emitter.setEncoding = function(something) {return true};
response_emitter.statusCode = 200

http.createClient = function(port, host) {
    return {
      request: function(it, doesnt, matter) {
          return request_emitter;
      }  
    };
}

// now for the tests!
vows.describe('OperationHelper execute').addBatch({
    'when getting results for the first time': {
        topic: function() {
            opHelper.execute('ItemSearch', {
                    'SearchIndex': 'Books',
                    'Keywords': 'harry potter',
                    'ResponseGroup': 'ItemAttributes,Offers'
            }, this.callback);
            
            // use the emitter to emit the appropriate events
            request_emitter.emit('response', response_emitter);
            response_emitter.emit('data', '<this><is><some>xml</some>you like?</is></this>');
            response_emitter.emit('end')
        },
        
        'works': function(error, result) {
            assert.isObject(state);
        },
        
        'has the right structure': function(error, result) {
            assertObject(state.this)
        }
    }
}).run();