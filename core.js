const promise           = require('bluebird');

exports.create =  function (config, logger, db) {

    return (function () {
        return {
            getList: function (offSet, size) {
                return promise.resolve([]);
            },
            getDetails: function (id) {
                return promise.resolve({});
            }
        };
    }());
};
