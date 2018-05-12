// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================
var express = require('express');
var bodyParser = require('body-parser');

//Note that the mysql dependency handled in the database layer

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

//Static directory to serve css etc
app.use(express.static('public'));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================
//var routes = require('./controllers/signup_controller.js');
//app.use(routes);

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8082;

app.listen(PORT, function() {
  console.log('App listening on PORT: ' + PORT);
});
