const connection = require('./connection.js');
const conditional = require('./helper/conditional.js');
const colValGenerator = require('./helper/colValGenerator.js');

var orm = {
    createTable: function (tableName, rules, cb) {
        let query = "CREATE TABLE " + tableName + "(";
        query += rules.toString();
        query += ");";
        connection.query(query, function (err, result) {
            if (err) {
                throw err;
            }
            cb(err, result);
        });
    },
    selectAll: function (table, cb) {
        let query = "SELECT * FROM ??;";
        connection.query(query, [table], function (err, result) {
            if (err) {
                throw err;
            }
            cb(err, result);
        });

    connection.query(query, values, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  insertOneWithoutParams: function(table, colValue, cb) {
    let query = 'INSERT INTO ??';

    let values = [table];
    var valuesColVal = Object.values(colValue);
    query += colValGenerator(colValue);
    
        connection.query(query, values, function (err, result) {
            if (err) {
                throw err;
            }
            cb(err, result);
        });

    },
    selectMultipleAllParamWithOrder: function (tables, wheres, orderBy, cb) {
        query = "";
        values = [];
        for (let i = 0; i < tables.length; i++) {
            query += "SELECT * FROM ??";
            let conditionalObj = conditional(wheres[tables[i]]);

            values.push(tables[i]);
            values = values.concat(conditionalObj.whereValues);
            query += " " + conditionalObj.whereQuery + " ";
            if (i != tables.length - 1) {
                query += "UNION ";
            }
        }
        query += " ORDER BY ??";
        values.push(orderBy);
        connection.query(query, values, function (err, result) {
            if (err) {
                throw err;
            }
            cb(err, result);
        });
    },
    insertOneWithoutParams: function (table, colValue, cb) {
        let query = "INSERT INTO ??";

    values = values.concat(valuesColVal, conditionalObj.whereValues);

        values = values.concat(valuesColVal);
        query += ";";
        connection.query(query, values, function (err, result) {
            if (err) {
                throw err;
            }
            cb(err, result);
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
            cb(err, result);
        });

    }

};
module.exports = orm;
