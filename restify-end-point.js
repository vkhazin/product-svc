'use strict';
/*********************************************************************************
Dependencies
**********************************************************************************/
const util              = require('util');
const restify 	        = require('restify');
const promise           = require('bluebird');
const config 		    = require('config');
const logger            = require('./logger').create(config);
const db                = require('./repo-es').create(config, logger);
const core              = require('./core').create(config, logger, db);
/*********************************************************************************/

/**********************************************************************************
Configuration
**********************************************************************************/
const appInfo 		    = require('./package.json');
const port 			    = process.env.PORT || 3000;
const server 			= restify.createServer();
/*********************************************************************************/

/**********************************************************************************
Setup
**********************************************************************************/
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.opts(/.*/, function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    res.send(200);
    return next();
});
server.use(restify.gzipResponse());

/**********************************************************************************
End-points
**********************************************************************************/
//Echo
server.get({path: '/echo', flags: 'i'}, echo);
function echo(req, res, next) {
    const info = {
        name: appInfo.name,
        version: appInfo.version,
        description: appInfo.description,
        author: appInfo.author,
        node: process.version
    };
    res.send(info);
    next();
}    

//List
server.get({path: '/products', flags: 'i'}, getList);
function getList(req, res, next) {
    return core.getList(req.params.from, req.params.size)
        .then(function(list) {
            //status: 200, body: json
            res.send(list);     
        })
        .catch(function(err) {           
            //log raw error
            logger.error(err);
            //Response with 500 error
            res.send(new restify.errors.InternalServerError(util.inspect(err)));
        })
        .done(function(){
            //processing has finished
            next();
        });
};

//Single
server.get({path: '/products/:id', flags: 'i'}, get);
function get(req, res, next) {
    return core.getDetails(req.params.id)
        .then(function(doc) {
            //status: 200, body: json
            res.send(doc);     
        })
        .catch(function(err) {
            if (err.status === 404) {
                res.send(new restify.errors.NotFoundError('Sorry could find product with id: ' + req.params.id));
            }  else {
                //log raw error
                logger.error(err);
                //Response with 500 error
                res.send(new restify.errors.InternalServerError(util.inspect(err)));
            }
        })
        .done(function(){
            //processing has finished
            next();
        });
};
/*********************************************************************************/


/**********************************************************************************
Start the server
**********************************************************************************/
server.listen(port, function() {
	var msg = 'Starting service using port \'{port}\' and environment \'{environment}\''
				.replace('{port}', port)
				.replace('{environment}', process.env.NODE_ENV)
	logger.log(msg);
});
/********************************************************************************/