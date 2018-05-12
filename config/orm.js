const connection = require("./connection.js");
const conditional = require("./helper/conditional.js");
const colValGenerator = require("./helper/colValGenerator.js");

var orm = {
    selectAll: function (table, cb) {
        let query = "SELECT * FROM ??;";


        connection.query(query, [table], function (err, result) {
            if (err) {
                throw err;
            }
            cb(result);
        });

    },
    selectAllParam: function (table, where, cb) {
        let query = "SELECT * FROM ??";
        let values = [table];

        let conditionalObj = conditional(where);
        values = values.concat(conditionalObj.whereValues);
        query += " " + conditionalObj.whereQuery;

        connection.query(query, values, function (err, result) {
            if (err) {
                throw err;
            }
            cb(result);
        });

    },
    insertOneWithoutParams: function (table, colValue, cb) {
        let query = "INSERT INTO ??";

        let values = [table];
        var valuesColVal = Object.values(colValue);
        query += colValGenerator(colValue);

        values = values.concat(valuesColVal);
        connection.query(query, function (err, result) {
            if (err) {
                throw err;
            }
            cb(result);
        });
    },
    insertOneWithParams: function (table, colValue, where, cb) {
        let query = "INSERT INTO ??";

        let values = [table];
        var valuesColVal = Object.values(colValue);
        query += colValGenerator(colValue);
        query += " ";
        let conditionalObj = conditional(where);
        query += conditionalObj.whereQuery;

        values = values.concat(valuesColVal, conditionalObj.whereValues);


        connection.query(query, function (err, result) {
            if (err) {
                throw err;
            }
            cb(result);
        });

    }
};
module.exports = orm;