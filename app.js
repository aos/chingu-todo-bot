// Hello!
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = app.listen(3000, () => {
  console.log('Express server listening on port %d...', server.address().port);});

app.post('/', (req, res) => {
  let text = req.body.text;
  let user_id = req.body.user_id;
  let users = text.match(/<@[A-Z0-9]*\|\w*>/g);
  console.log(user_id, text);
  let data = {
    response_type: 'in_channel',
    text: `<@${user_id}> would like to talk. <!date^${timestamp}^ Posted on {date_num} at {time}|Posted in May>`
  };
  res.json(data);
});

var timestamp = Math.round(new Date().getTime()/1000.0);