var connect = require('connect');
var serveStatic = require('serve-static');
var port = process.env.PORT || 8080;
console.log("the port is " + port);
connect().use(serveStatic(__dirname)).listen(port);
