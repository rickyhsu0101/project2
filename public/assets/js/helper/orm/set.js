module.exports = function (set) {
  querySet = 'SET ';
  let keys = Object.keys(set);
  let values = Object.values(set);
  for (let i = 0; i < keys.length; i++) {
    querySet += keys[i] + '=? ';
    if (i != keys.length - 1) {
      queryWhere += ', ';
    }
  }
  return {
    setQuery: querySet,
    setValues: values
  };
};