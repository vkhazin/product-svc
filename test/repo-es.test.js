
'use strict';

const config 		    = require('config');
const logger            = require('../logger').create(config);
const db                = require('../repo-es').create(config, logger);
const assert		    = require('chai').assert

describe('repo-es', function() {
	describe('#create test data', function() {
		it('Should succeed', function(done) {
            const docs = [
                {
                    id: 1,
                    name: "Teapot"
                },
                {
                    id: 2,
                    name: "Coffeepot"
                }
            ];

            db.bulk(docs)
                .catch(e => {
                    throw e;
                })
                .done(() => {
                    done();
                })
		});
	});

	describe('#get list first set of data', function() {
		it('Should succeed', function(done) {

            //Giving es chance to finish indexing
            require('sleep').sleep(1)

            db.search(0,1)
                .then(docs => {                 
                    assert.equal(docs.length, 1, 'Expected length of 1');
                    assert.equal(docs[0].id, 1, 'Expected id of 1');
                })
                .catch(e => {
                    throw e;
                })
                .done(() => {
                    done();
                })
		});
	});

	describe('#get list second set of data', function() {
		it('Should succeed', function(done) {
            db.search(1,1)
                .then(docs => {                 
                    assert.equal(docs.length, 1, 'Expected length of 1');
                    assert.equal(docs[0].id, 2, 'Expected id of 2');
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

	describe('#delete test data', function() {
		it('Should succeed', function(done) {
            db.delete(1)
                .then(response => {                 
                    return db.delete(2);
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