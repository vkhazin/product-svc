/*********************************************************************************
Dependencies
**********************************************************************************/
var restify 	    = require('restify');
var config 		    = require('config');
var promise         = require('bluebird');
var logger          = require('./logger').create(config);
var core            = require('./core').create(config, logger);
/*********************************************************************************/

/**********************************************************************************
Configuration
**********************************************************************************/
var appInfo 		= require('./package.json');
var port 			= process.env.PORT || 3000;
var server 			= restify.createServer();
/*********************************************************************************/

/**********************************************************************************
Constants
**********************************************************************************/
var routePrefix                     = '/v1';
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
server.get({path: routePrefix + '/echo', flags: 'i'}, echo);
server.get({path: routePrefix, flags: 'i'}, echo);
server.get({path: '/', flags: 'i'}, echo);
server.get({path: '/echo', flags: 'i'}, echo);

function echo(req, res, next) {
    var info = {
        name: appInfo.name,
        version: appInfo.version,
        description: appInfo.description,
        author: appInfo.author,
        node: process.version
    };
    res.send(info);
    next();
}    

//Demo end-point
server.get({path: routePrefix + '/helloWorld', flags: 'i'}, helloWorld);
server.get({path: routePrefix + '/helloWorld/:name', flags: 'i'}, helloWorld);

function helloWorld(req, res, next) {

    someModule.helloWorld(req.params.name)
        .then(function(result) {
            //status: 200, body: json
            res.send(result);     
        })
        .catch(function(err) {           
            //log raw error
            logger.error(err);
            //JSON.stringify unfortunately may fail when error has circular references
            res.send(new restify.errors.InternalServerError(JSON.stringify(err)));
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