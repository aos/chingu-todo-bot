'use strict';
// Declare modules
const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller');

// Instantiate express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Start server
const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log(`listening on port: ${port}`);
});

// calls the controller
controller(app);


