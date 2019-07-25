// implement your API here

//import express
const express = require('express');

//create an instance of express and assigne it to the server variable
const server = express();

//TO parse JSON in the POST
server.use(express.json());

//importing database
const db = require('./data/db.js');

//Creating new data
server.post('/api/users', (req, res) => {
  const newUser = req.body;
  //   console.log(newUser);
  if (newUser.name && newUser.bio) {
    db.insert(newUser).then(user => {
      res.status(201).json(user);
    });
  } else {
    db.insert().catch(
      res
        .status(400)
        .res.json({ errorMessage: 'Please provide name and bio for the user.' })
    );
  }
});

//Read from DB
server.get('/api/users', (req, res) => {
  db.find().then(person => res.status(200).json(person));
});

//setting port to start listening
server.listen(5000, () => console.log('API running on server 5000'));
