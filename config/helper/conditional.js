module.exports = function (where) {
    queryWhere = "WHERE ";
    let keys = Object.keys(where);
    let values = Object.values(where);
    for (let i = 0; i < keys.length; i++) {
        queryWhere += keys[i] + "=? ";
        if (i != keys.length - 1) {
            queryWhere += "AND ";
        }
    }
    return {
        whereQuery: queryWhere,
        whereValues: values
    };
};