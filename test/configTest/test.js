const orm = require("../orm.js");

orm.selectAll("exampleTable", function (query, table) {
    console.log(query);
    console.log(table);
});
orm.selectAllParam("exampleTable", {
    hello: "why",
    second: "wefwf",
    another: "wwww",
    yo: 23
}, function (query, values) {
    console.log(query);
    console.log(values);
});
orm.insertOneWithParams("exampleTable", {
    hello: "why",
    second: "wefwf",
    another: "wwww",
    yo: 23
}, {
    id: 12
}, function (query, values) {
    console.log(query);
    console.log(values);
});