'use strict';
exports.create =  function (cnf, lgr) {

	const promise 		= require('bluebird');
	const elasticSearch	= null

	var config 	= cnf;
	var logger 	= lgr;

	var getClient = function() {
		if (!elasticSearch) {
			var elasticSearch = new require('elasticsearch').Client({
			  hosts: config.elasticSearch.urls
			});
			elasticSearch = promise.promisifyAll(elasticSearch);
			elasticSearch.indices = promise.promisifyAll(elasticSearch.indices);
		}
		return elasticSearch;
	}

	return (function () {
	    return {
	        search: (from, size) => {
                return getClient().searchAsync({
                    index: config.elasticSearch.indexName,
                    type: config.elasticSearch.typeName,
                    body: {
                        from: from || 0,
                        size: size || config.elasticSearch.defaultQuerySize,
                        sort: "id",
                        query: {
                            match_all: {}
                        }                        
                    }
                })
                .then(response => {
                    const docs = response.hits.hits.map(item => item._source);
                    return promise.resolve(docs);
                })
                .catch(e => {
                    logger.error(JSON.stringify(e));
                    return promise.reject(e);
                });
            },
            get: (id) => {
                return getClient().getAsync({
                    index: config.elasticSearch.indexName,
                    type: config.elasticSearch.typeName,
                    id: id
                })
                .then(result => {
                    return promise.resolve(result._source);
                })
                .catch(e => {
                    logger.error(JSON.stringify(e));
                    return promise.reject(e);
                });
            },
            //Used for testing purposes only
            bulk: docs => {
                const bulkBody = docs.map( doc => {
                    return [
                        {
                            index:  {
                                _index: config.elasticSearch.indexName,
                                _type: config.elasticSearch.typeName,
                                _id: doc.id
                            }
                        },
                        doc
                    ];
                 })
                 .reduce((a,b) => a.concat(b), []);

                return getClient().bulkAsync({
                        body: bulkBody
                    })
                    .catch(e => {
                        logger.error(e);
                        return promise.reject(e);
                    })
                    .then(response => {
                        if (response.errors == false) {
                            return promise.resolve(response)
                        } else {
                            return promise.reject(response)
                        }
                    });
            },
            //Used for testing purposes only
            delete: (id) => {
                return getClient().deleteAsync({
                    index: config.elasticSearch.indexName,
                    type: config.elasticSearch.typeName,
                    id: id
                })
                .catch(e => {
                    logger.error(JSON.stringify(e));
                    return promise.reject(e);
                });
            },            
	    };
	}());
};
