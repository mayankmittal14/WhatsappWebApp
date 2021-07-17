import dotenv from "dotenv";
if(process.env.NODE_ENV !== "production"){
    dotenv.config();                                        //Loads the variables into the process.env
}

import express from 'express';
import mongoose from 'mongoose';
import Message from './models/dbMsgs.js';                   //messageSchema
import Room from './models/dbRooms.js';                     //roomSchema
import Pusher from 'pusher';                                //inform frontend whenever there is a change in the db(backend), make mongo a realtime db
import cors from 'cors';

const app = express();                                      //Creates an express application

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "ap2",
    useTLS: true
});

app.use(express.json());                                    //Middleware(parses incoming requests to JSON object)
app.use(cors());                                            //Middleware for Cross-origin resource sharing

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"))        //on signifies that the event will be called every time it occurred(on every request)
db.once("open", () => {                                                 //Event will be called only once (When the connection is opened)

    const msgCollection = db.collection('messages');                    //messages is a collection in the database(Message => messages)
    const roomCollection = db.collection('rooms');                      //rooms is a collection in the database(Room => rooms)

    //Change streams are realtime stream of any changes that occur in the database
    const msgchangeStream = msgCollection.watch();
    const roomchangeStream = roomCollection.watch();

    msgchangeStream.on("change", (change) => {                          //change contains the details of the change that occurs

        if(change.operationType === 'insert'){
            const msgDetails = change.fullDocument;
            pusher.trigger('messagesChannel', 'inserted', {             //'channel', 'event', (It'll inform the frontend by rerendering the process)
                roomId: msgDetails.roomId,
                name: msgDetails.name,
                message: msgDetails.message,
                timestamp: msgDetails.timestamp,
                received: msgDetails.received
            });
        }
        else{
            console.log('Error triggering Pusher');
        }
    });

    roomchangeStream.on("change", (change) => {                         //change contains the details of the change that occurs

        if(change.operationType === 'insert'){
            const roomDetails = change.fullDocument;
            pusher.trigger('roomsChannel', 'inserted', {                //'channel', 'event', (It'll inform the frontend by rerendering the process)
                name: roomDetails.name,
                image: roomDetails.image
            });
        }
        else{
            console.log('Error triggering Pusher');
        }
    });
});

//Home Page
app.get('/', (req, res) => {
    res.status(200).send('Welcome to WhatsApp Web!')
});

//To get back all the messages from the database
app.get('/messages/sync', (req, res) => {
    Message.find((err, data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);         //200 represents OK
        }
    })
});

//To get back all the rooms from the database
app.get('/rooms/sync', (req, res) => {
    Room.find((err, data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);         //200 represents OK
        }
    })
});

//To get back a room with a specific id from the database
app.get('/rooms/:id', (req, res) => {
    Room.findById(req.params.id)
        .then(room => {
            res.status(200).json({              //Sends a json response
                name: room.name,
                image: room.image
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

//Saving a message to the database
app.post('/messages/new', (req, res) => {
    const msg = req.body;

    Message.create(msg, (err, data) => {        //Equivalent to const x = new Message(msg); x.save(...);
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);         //201 represents creating data on the server
        }
    })
})

//Saving a room to the database
app.post('/rooms/new', (req, res) => {
    const room = req.body;

    Room.create(room, (err, data) => {          //Equivalent to const x = new Room(room); x.save(...);
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);         //201 represents creating data on the server
        }
    })
})

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})