'use strict';
exports.create =  function (cnf, lgr) {

	const promise 		= require('bluebird');
	const config 	    = cnf;
	const logger 	    = lgr;

	return (function () {
	    return {
	        search: (from, size) => {
                return promise.resolve([
                        {
                            id: 1,
                            name: "Teapot"
                        },
                        {
                            id: 2,
                            name: "Coffeepot"
                        }
                    ]);
            },
            get: (id) => {
                return promise.resolve({
                        id: 1,
                        name: "Teapot"
                    });
            }            
	    };
	}());
};
