'use strict';
exports.create =  function (config, logger, db) {

    return (function () {
        return {
            getList: function (offSet, size) {
                return db.search(offSet, size);
            },
            getDetails: function (id) {
                return db.get(id);
            }
        };
    }());
};
