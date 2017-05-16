'use strict';
// Declare modules
const express = require('express');
const bodyParser = require('body-parser');
const commands = require('./commands');

// Instantiate express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Start server
const server = app.listen(3000, () => {
  console.log('Express server listening on port %d...', server.address().port);
});

var todoArray = [];

// Handle GET requests
app.get('/', function(req, res) {
  handleQueries(req.query, res);
});
// Handle POST requests
app.post('/', function(req, res) {
  handleQueries(req.body, res);
});

function handleQueries(req, res) {
  let timestamp = Math.round(new Date().getTime()/1000.0);

  if (req.text) {
    let text = req.text;
    let user_id = req.user_id;
    if (text.includes("add")) {
      // Get todo
      var todo = text.substring(4);
      // Add to array
      commands.add(todoArray, todo)
      console.log(todoArray);
    }
    if (text.includes("delete")) {
      // Get todo
      var todo = text.substring(7);
      // Delete from array
      commands.delete(todoArray, todo);
      console.log(todoArray);
    }
    let users = text.match(/<@[A-Z0-9]*\|\w*>/g);
    let data = {
      response_type: 'ephemeral',
      text: `Todos:\n${todoArray[0]}`
    };
    res.json(data);
  }
}
