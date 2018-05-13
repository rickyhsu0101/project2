// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================
var express = require('express');

// ==============================================================================
// EXPRESS CONFIGURATION
// Declares router and assigns it express instance
// ==============================================================================
var router = express.Router();
// Import the model (signup)  to use its database functions.

// ==============================================================================
// ROUTE CONFIGURATION
// ==============================================================================
// Create all our routes and set up logic within those routes where required.
router.get('/', function(req, res) {});

router.post('/api/login', function(req, res) {});

// Export routes for server.js to use.
module.exports = router;
