# Hands-on Exercise #
You are required to document, design and write a product micro-service. The product micro-service must provide the following API calls;
- List of products
- Product details

The service must use a persistence layer. You can use any language/tooling for writing and documenting the API.
Micro-service Concerns
Please provide details around how you will handle the following concerns.
- Versioning
- Self-Discovery
- Security

Deployment
With CI/CD in mind please provide output of your code so I can so I can;
- Deploy it
- Upgrade it
- Call it externally (from a channel) vs. internally (from another micro-service)
The only requirement is that I should be able to deploy it on premise and in the cloud.

# Implementation #

* Micro-service has been implemented using restify framework and node.js
* Persistency has been implemented using ElasticSearch to support possible future need to search for products by keywords
* Taking in perspective a possible high traffic, maybe add a [cache micro-service](https://github.com/vkhazin/CacheService) between end-point and ElasticSearch to reduce number of calls to ElasticSearch using from/size query parameters as cache key

# API Documentation #

* [Restful API has beed documented using swagger](./doc/swagger.yml)
* Swagger documentation can be visualized using Swagger [online editor](http://editor.swagger.io/#/), choose File->Import File to open swagger.yml

# Deployment #

* On premises use [pm2](http://pm2.keymetrics.io/) to run the restify-end-point.js
* On the cloud Aws Elastic BeansTalk, RedHat OpenShift, Heroku, and MS Azure - package.json has been configured to launch restify-end-point.js
* To reduce hosting expenses AWS Lambda with Api-Gateway and Azure Functions with Http Trigger can be used with an addition of a thin wrapper module to route calls into core.js
* ElasticSearch back-end automation is a bit tricky: on premises a separate installation process will be required, on AWS and on Azure ElasticSearch can be used as a service, additionally third party hosted ElasticSearch can be used, such as Elastic Cloud, QBox, bonsai.io, and quite a few more.
* It is feasible to pursue multi-repository and geo distributed data [approach](https://www.linkedin.com/pulse/dude-where-my-data-vlad-khazin?trk=mp-reader-card)

# Versioning #

* On premises deploy new versions under different port/host with version number incorporated into dns name, e.g. product-svc-v1.acme.com
* On cloud use different hosts and load-balancers
* On server-less platform a new host will be used to host new version
* Data model backward compatibility will need to be taken in consideration

# Security #

* Service to be deployed over https to ensure confidentiality of the channel
* Calls to service can be authorized using a fixed shared secret to be passed as an http header
* Calls can be alternatively authorized using JWT infrastructure 
* A custom separate service for authentication and identity management could be used similar to [StateService](https://github.com/vkhazin/StateService) used previously on two projects

# Self-Discovery #

* Have not come across ready-to-use service/software that I liked yet
* Possible third party candidates: etcd and consul.io
* A robust self-discovery design could be addressed using separate [micro-services registry](https://www.linkedin.com/pulse/micro-service-registry-vlad-khazin?trk=mp-reader-card)

# Configuration #

* Configuration settings are located in single file ./config/default.json and can be dynamically provisioned using ZooKeeper or alike
* An indirection was previously implemented on another project to fetch configuration data periodically from AWS S3 bucket to allow just in time configuration changes.
* AWS, Azure, Heroku, and other platforms also support storing so-called environment variables to separate code from configuration with a built-in-support

# Continuous Deployment and Integration

* Due to shortage of time not all ideas have been implemented, below are things that would have done should I have 40 hours available to finish the assignment
* Create a process to load data from existing product catalog data source, expectation there is one since the micro-service did not list all of CRUD, just read-only operations. 
* [Travis-CI](https://travis-ci.org/) and [Circle-CI](https://circleci.com/) can be configured to run unit tests as configured in package.json on every code push
* [CodeShip](https://codeship.com/) can be used to automate continuous integration testing and deployment
* [DeployBot](https://deploybot.com/) have been previously used to demo deployment from git repo on commit directly to AWS Elastic BeansTalk and to Heroku.
* [Teraform](https://www.terraform.io/) was used on the last project to create ElasticSearch instances for new environments

# Usage #

* In my mind there is no more internal calls vs. external calls - all calls mush be authorized by the service itself rather than relying of network protection
* Security options outlined above should address the internal and external calls alike
* Installing ElasticSearch locally: easiest option using docker and the [official image](https://hub.docker.com/_/elasticsearch/)
* Calling the service for integration purposes can be done using JMeter, Postman, and simple curl, e.g.
```
1. start the service by running "node restify-end-point.js" from terminal window in the project folder
2. run "curl 'http://localhost:3000/echo'" to test connectivity
```

# Operations #

* Given time for a typical micro-service of about a week or two
* I would have configured loggly.com or alike module to ship logs to centralized location
* I would configure datadog.com to collect real time host statistics
* Elastic Search automated snap-shots for backup purposes also would be part of the deliverable