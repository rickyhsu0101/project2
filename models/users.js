const orm = require("../config/orm.js");
var users = {
    addUser: function (keyValues, cb) {
        orm.insertOneWithoutParams("users", keyValues, function (result) {
            cb(result);
        });
    },
    selectUser: function (id, cb) {
        let where = {
            userId: id
        };
        orm.selectAllParam("users", where, function (result) {
            cb(result);
        });
    }
};

module.exports = users;