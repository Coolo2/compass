var express = require('express'),
    router = express.Router();

router
   // Add a binding for '/tests/automated/'
  .get('/', function(){
    // render the /tests/automated view
  })

module.exports = router;