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
  // Get unix timestamp
  let timestamp = Math.round(Date.now()/1000.0);

  if (req.text) {

    let text = req.text;
    let user_id = req.user_id;
    let users = text.match(/<@[A-Z0-9]*\|\w*>/g);

    if (text.includes("add")) {
      // Get todo
      var todo = text.substring(4);
      todo += ` <!date^${timestamp}^({date_pretty} @ {time}|May>)`
      // Add to array
      commands.add(todoArray, todo)
    }

    if (text.includes("delete")) {
      // Get todo
      var todo = text.substring(7);
      // Delete from array
      commands.delete(todoArray, todo);
    }

    if (text.includes("list")) {
      // List todos
      commands.view(todoArray);
    }

    let data = {
      response_type: 'ephemeral',
      text: "*Todos*",
      attachments: [
        {
          text: commands.view(todoArray)
        }
      ]
    };
    res.json(data);
  }
}
