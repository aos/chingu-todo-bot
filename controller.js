/**
 * Created by Vampiire on 6/1/17.

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

// require the commands file which defines the commands the bot will accept from the user
const commands = require('./commands');

// require mongoose to enable interaction with mLab database
const mongoose = require('mongoose');

// connect mongoose to mLab database
mongoose.connect('mongodb://chingu-todo:todoBOT@ds161121.mlab.com:61121/todo-bot');

// create a schema for the items in the list array (format for each todo item)

let itemsSchema = new mongoose.Schema({

    _id: {type: Number, default: 0},
    listItem: String,
    timestampCreated: {type: Date, default: Date.now()},
    completed: {type: Boolean, default: false},
    timestampCompleted: Date

});

// create a schema for each document in the collection. each document (containing the todo list array)
// is unique to the slack user who calls it. their slack id replaces the default _id passed by mongoDB

let listSchema = new mongoose.Schema({
    _id: String,
    list: [itemsSchema]
});


// create model that implements the list Schema
let list = mongoose.model('list', listSchema);


// export the controller back to app.js
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


        if (req.text) {

        // pull the request sent from slack to the bot. extract the text, and slack user ID
        // the text will contain both the command (followed by a space) and the string associated with the command
        // (after the space) as seen by the substrings
            let text = req.text,
                user_id = req.user_id,
                command = req.text.substring(0, text.indexOf(' ')),
                listItem = req.text.substring(text.indexOf(' ')+1);

            switch(command){
                case 'add':
                    // search for the slack user's list based on their slack ID
                    list.find({_id: user_id}, function(err, doc){

                        // if the user already has a list then push the "added" item into that list and save to the database
                        if(doc.length > 0){
                            let length = doc[0].list.length;
                            // modify doc add new item

                            doc[0].list.push({_id: length, listItem : listItem});

                            doc[0].save(function(err){
                                if(err) throw err;
                                console.log('new item added to an existing todo list document array');
                            });
                        }

                        // if the user does not already have a list in the collection then create one and pass their slack ID
                        // as well as their list item as the first element in the list array
                        else{

                            list.create({
                                _id: user_id,
                                list: [
                                    { _id: 0, listItem : listItem }
                                ]
                            }, function(err){
                                if(err) throw err;
                                console.log('added a new slack user todo list document into the collection');

                            });
                        }

                    });
                    break;
                case 'view':
                     break;
                case 'complete':
                    break;
                case 'delete':
                    break;
            }



            // if (command === 'add') {
            //
            //
            // }
            //
            // // Delete a list item
            // if (command === 'delete') {
            //
            // }
            //
            // // Complete a list item
            // if (command === 'complete') {
            //
            // }
            //
            // // View the entire list
            // if (command === 'view') {
            //
            // }

        // return a view back to slack to display to the user
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


