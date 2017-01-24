exports.create =  function (config, logger, db) {

    return (function () {
        return {
            getList: function (offSet, size) {
                return [];
            },
            getDetails: function (id) {
                return {};
            }
        };
    }());
};
