const connection = require('../config/connection.js');
const conditional = require('../public/assets/js/helper/orm/conditional.js');
const set = require('../public/assets/js/helper/orm/set.js');
const colValGenerator = require('../public/assets/js/helper/orm/colValGenerator.js');

var orm = {
  createTable: function(tableName, rules, cb) {
    //ex: CREATE TABLE 123_chat(...rules with comma between each rule...);
    let query = 'CREATE TABLE ' + tableName + '(';
    query += rules.toString();
    query += ');';
    connection.query(query, function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  },
  selectAll: function(table, cb) {
    //ex: SELECT * FROM users
    let query = 'SELECT * FROM ??;';

    connection.query(query, [table], function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  },
  selectAllParam: function(table, where, cb) {
    //ex: SELECT * FROM users WHERE userId = 10 AND username = ricky;
    let query = 'SELECT * FROM ??';
    let values = [table];
    let conditionalObj = conditional(where);
    query += ' ' + conditionalObj.whereQuery + ';';
    values = values.concat(conditionalObj.whereValues);
    connection.query(query, values, function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  },
  insertOneWithoutParams: function(table, colValue, cb) {
    //ex: INSERT INTO users(col1, col2, col3) VALUES(val1, val2, val3)
    let query = 'INSERT INTO ??';
    let values = [table];
    let valuesColVal = Object.values(colValue);
    query += colValGenerator(colValue) + ';';
    values = values.concat(valuesColVal);
    connection.query(query, values, function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  },
  selectMultipleAllParamWithOrder: function(tables, wheres, orderBy, cb) {
    //ex: SELECT * FROM 123_chat WHERE roomId = 212 UNION
    //    SELECT * FROM 222_chat WHERE roomId = 212 UNION
    //    SELECT * FROM 387_chat WHERE roomId = 212 ORDERY BY time
    let query = '';
    let values = [];
    for (let i = 0; i < tables.length; i++) {
      query += 'SELECT * FROM ??';
      const conditionalObj = conditional(wheres[tables[i]]);

      values.push(tables[i]);
      values = values.concat(conditionalObj.whereValues);
      query += ' ' + conditionalObj.whereQuery + ' ';
      if (i != tables.length - 1) {
        query += 'UNION ';
      }
    }
    query += ' ORDER BY ??';
    values.push(orderBy);

    connection.query(query, values, function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  },
  updateSingleRow: function(table, sett, where, cb) {
    let query = 'UPDATE ?? ';
    let values = [table];

    const setObj = set(sett);
    const conditionalObj = conditional(where);
    query += setObj.setQuery + ' ';
    query += conditionalObj.whereQuery;
    console.log(values);
    console.log(setObj.setValues);
    console.log(conditionalObj.whereValues);
    values = values.concat(setObj.setValues, conditionalObj.whereValues);
    query += ';';
    console.log(query);
    console.log(values);
    console.log(values.length);
    connection.query(query, values, function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  },
  //modify below and change to update
  insertOneWithParams: function(table, colValue, where, cb) {
    let query = 'INSERT INTO ??';

    let values = [table];
    var valuesColVal = Object.values(colValue);
    query += colValGenerator(colValue);
    query += ' ';
    let conditionalObj = conditional(where);
    query += conditionalObj.whereQuery;

    values = values.concat(valuesColVal, conditionalObj.whereValues);

    connection.query(query, function(err, result) {
      if (err) {
        throw err;
      }
      cb(err, result);
    });
  }
};
module.exports = orm;
