var orm = require("../../models/orm.js");
/*
orm.insertOneWithoutParams("yolo", {
  hello: "asdfsa",
  dkd: 123,
  test: "hello"
}, function (err, result) {

});
*/
orm.selectAllParam("yolo", {
  hello: "asdfsa",
  dkd: 123,
  test: "hello"
}, function (err, result) {

});