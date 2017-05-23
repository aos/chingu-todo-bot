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
const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log(`listening on port: ${port}`);
});

let todoArray = [];

// Handle GET requests
app.get('/', function(req, res) {
  handleQueries(req.query, res);
});
// Handle POST requests
app.post('/', function(req, res) {
  handleQueries(req.body, res);
});

function handleQueries(req, res) {
  // Validate token
  if (req.token !== "nPJ9nsPaIBb9dv2MDtDRY7sL") {
    console.error("Invalid Token");
    return res.json({text: "Error: Invalid Token"});
  }

  // Get unix timestamp
  let timestamp = Math.round(Date.now()/1000.0);

  if (req.text) {
    let text = req.text;
    let user_id = req.user_id;
    let users = text.match(/<@[A-Z0-9]*\|\w*>/g);

    if (text.indexOf("add") == 0) {
      // Create todo object
      let todo = {
        text: text.substring(4),
        completed: false,
        time: timestamp,
        id: (todoArray.length == 0 ? 1 : (todoArray.length + 1))
      }

      todoArray.forEach(function(e){
          if(e.id === todo.id){
              todo.id = todo.id + Number(Math.random().toFixed(2));
          }
      });

      // Add to array
      commands.add(todoArray, todo);
    }

    if (text.indexOf("delete") == 0) {
      // Get todo
      let todo = text.substring(7);
      // Delete from array
      commands.delete(todoArray, todo);
    }

    if (text.indexOf("done") == 0) {
      let todo = text.substring(5);
      let todoTS = timestamp;
      if (todo = Number(todo)) {
        commands.done(todoArray, todo, todoTS)
      }
      else {
        console.error("Not a valid number");
        return res.json({text: "Error: Use `/test done #` where `#` is todo number"});
      }
    }

    if (text.indexOf("list") == 0) {
      // List todos
      commands.view(todoArray);
    }

    let data = {
      response_type: 'ephemeral',
      attachments: [
        {
          title: "Todos",
          text: "```" + commands.view(todoArray) + "```",
          mrkdwn_in: ["text"]
        }
      ]
    };
    res.json(data);
  }
}
