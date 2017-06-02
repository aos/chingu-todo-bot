/**
 * Created by Vampiire on 6/1/17.
 */

// require the commands file which defines the commands the bot will accept from the user
const commands = require('./commands');

// require mongoose to enable interaction with mLab database
const mongoose = require('mongoose');

// connect mongoose to mLab database
// UN: chingu-todo, PW: todoBOT
mongoose.connect('mongodb://chingu-todo:todoBOT@ds161121.mlab.com:61121/todo-bot');

// create a schema for what is passed to the database
let listSchema = new mongoose.Schema({
    // either channel or user ID will replace the default _id created by the database
    _id: String,
    item: {
        id: Number,
        listItem: String,
        timestampCreated: {type: Date, default: Date.now()},
        completed: {type: Boolean, default: false},
        timestampCompleted: Date
    }
});


/*

PLAN:

1) check if a document exists for the given ID (user or channel) - if document exists proceed to 2)

1a) if document does not yet exist create it for that given user or channel ID

2)
    add: add a [list item] to that document
    delete: find the item based on its id [item.id] and remove it from the collection
    view: iterate through the documents in the collection and display each: "[item.timestampCreated] item.listItem if(item.completed){ [ item.timestampCompleted ] }
    done: find item based on its id [item.id] and edit item.completed to True

3) after each add / delete / done is complete callback view

 */




// create model that implements the list Schema
let list = mongoose.model('list', listSchema);


// // todoArray used for new todo lists DEPRACATED
//
// let todoArray = [];

module.exports = function(app) {

// Handle GET requests
    app.get('/', function (req, res) {
        handleQueries(req.query, res);
    });

// Handle POST requests
    app.post('/', function (req, res) {
        handleQueries(req.body, res);
    });

    function handleQueries(req, res) {
        // Validate slack app token
        if (req.token !== "nPJ9nsPaIBb9dv2MDtDRY7sL") {
            console.error("Invalid Token");
            return res.json({text: "Error: Invalid Token"});
        }

        // Get unix timestamp
        // let timestamp = Math.round(Date.now() / 1000.0);


        // check if a collection for that user / channel already exists


        if (req.text) {
            let text = req.text;
            let command = req.text.substring(0, text.indexOf(' '));
            let listItem = req.text.substring(text.indexOf(' ')+1);
            let user_id = req.user_id;
            let exists = false;
            // let users = text.match(/<@[A-Z0-9]*\|\w*>/g);


            if (command === 'add') {

                list.find({_id: user_id}, function(err, doc){
                    if(doc.length > 0){
                        // exists = true;
                        console.log('exists');
                        console.log(doc);

                        // modify doc add new item


                    }

                    else{
                        let newItem = list(
                            {_id: user_id,
                                item: {
                                    id: 1,
                                    listItem: listItem,
                                }
                            }

                        ).save(function(err){
                            if(err) throw err;
                            console.log('saved');
                        });
                    }

                    });

            }

            // Delete todo
            if (command === 'delete') {
                // Get todo
                let todo = listItem;
                // Delete from array
                commands.delete(todoArray, todo);
            }

            // Complete todo
            if (command === 'done') {
                let todo = listItem;
                let todoTS = timestamp;
                if (todo = Number(todo)) {
                    commands.done(todoArray, todo, todoTS)
                }
                else {
                    console.error("Not a valid number");
                    return res.json({text: "Error: Use `/todo done #` where `#` is todo number"});
                }
            }

            // Get list
            if (command === 'list') {
                // commands.view(todoArray);

                console.log('comman was list');

                list.find({}, function(err, docs) {
                    console.log(docs);
                });
            }

            let data = {
                response_type: 'ephemeral',
                attachments: [
                    {
                        title: "Todos",
                        text: "```" + /*commands.view(todoArray) + */"```",
                        mrkdwn_in: ["text"]
                    }
                ]
            };
            res.json(data);
        }
    }
};


