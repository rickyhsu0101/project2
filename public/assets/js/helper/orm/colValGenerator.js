module.exports = function(colVal) {
  let keys = Object.keys(colVal);
  let num = keys.length;

  let colString = '(';

  let valueString = '(';
  for (let i = 0; i < num; i++) {
    colString += keys[i];
    valueString += '?';
    if (i != num - 1) {
      colString += ',';
      valueString += ',';
    } else {
      colString += ')';
      valueString += ')';
    }
  }
  return colString + ' VALUES' + valueString;
};
