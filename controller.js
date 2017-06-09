const mongoose = require('mongoose');
const express = require('express');
const request = require('request');

// require dotenv to protect login credentials for the database
require('dotenv').config({path: 'private.env'});

// call the private .env file for the route to the database used on line 23
const ROUTE = process.env.ROUTE;

// Using routes instead of passing in app as a function, prevented some errors
const router = module.exports = express.Router();


// Use ES6 Promises to silence deprecation warning
mongoose.Promise = global.Promise;

// database queries function
const dbQuery = require('./dbQuery');

// helper function to validate token
const helper = require('./helpers');

// deployment
mongoose.connect(ROUTE);

mongoose.connection.once('open', () => {
  console.log('Connected to DB.');
})
.on('error', function(err) {
  console.log('Connection error:', err);
});

// Slack button
router.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html')
});

router.get('/css.css', )

// Redirect URL
router.get('/auth/redirect', (req, res) => {
    const options = {
        uri: 'https://slack.com/api/oauth.access?code='
            +req.query.code+
            '&client_id='+process.env.CLIENT_ID+
            '&client_secret='+process.env.CLIENT_SECRET+
            '&redirect_uri='+process.env.REDIRECT_URI,
        method: 'GET'
    };
    request(options, (error, response, body) => {
        const JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok) {
            console.log(JSONresponse);
            res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
        } 
        else {
            console.log(JSONresponse);
            res.send("Success!")
        }
    })
});

// request made by user clicking button in interactive message
router.post('/command', function(req, res){

    let payload = JSON.parse(req.body.payload),
        token = payload.token,
        ID,
        command,
        index;

    // validates the slack bot token passed by the user
    if (helper.validate(token)){
        // parse the payload and extract the ID, command, and index
        ID = payload.user.id;
        command = payload.actions[0].name;
        index = payload.actions[0].selected_options[0].value;

        // call a database query
        dbQuery(ID, command, index).then(function(data){
            res.json(data);
        });
    }
    else {
        res.json('Invalid Slack Bot token');
    }
});

// Handle POST requests
router.post('/', function(req, res) {

    let body = req.body,
        rawText = body.text,
        token = body.token,
        ID = body.user_id,
        command,
        text;

    if (helper.validate(token)) {

        if (~rawText.indexOf(' ')) {
            // Get command and list text
            command = rawText.substring(0, rawText.indexOf(' '));
            text = rawText.substring(rawText.indexOf(' ') + 1);
        }
        else {
            command = rawText;
        }

        // call a database query
        dbQuery(ID, command, text).then(function(data){
            res.json(data);
        });
    }
    else {
        res.json('Invalid Slack Bot token');
    }
});