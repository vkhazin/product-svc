
'use strict';

const config 		    = require('config');
const logger            = require('../logger').create(config);
const db                = require('./repo-es.mock').create(config, logger);
const assert		    = require('chai').assert

describe('core', function() {
	describe('#get list first set of data', function() {
		it('Should succeed', function(done) {
            db.search()
                .then(docs => {
                    assert.isAbove(docs.length, 0, 'Expected length of more than 0');
                })
                .catch(e => {
                    throw e;
                })
                .done(() => {
                    done();
                })
		});
	});

	describe('#get one ', function() {
		it('Should succeed', function(done) {
            db.get(1)
                .then(doc => {                 
                    assert.equal(doc.id, 1, 'Expected id of 1');
                })
                .catch(e => {
                    throw e;
                })
                .done(() => {
                    done();
                })
		});
	});   
});