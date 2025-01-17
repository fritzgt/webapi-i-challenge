// implement your API here

//import express
const express = require('express');

//create an instance of express and assigne it to the server variable
const server = express();

//TO parse JSON in the POST
server.use(express.json());

//importing database
const db = require('./data/db.js');

//1.Read from DB, GET request to /api/users
server.get('/api/users', (req, res) => {
  db.find()
    .then(person => res.status(200).json(person))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.', err })
    );
});

//2.Read from DB, GET request to /api/users/:id
server.get('/api/users/:id', (req, res) => {
  //by using curly braces we conver the string into a number
  const { id } = req.params;
  //   console.log('user id: ', id);
  db.findById(id)
    .then(person => {
      if (person) {
        res.status(200).json(person);
        //if the id is not found then return the message not found
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.', err })
    );
});

//3.Delete request

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  console.log('user id: ', id);
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err =>
      res.status(500).json({ error: 'The user could not be removed' })
    );
});

//4.Creating new data
server.post('/api/users', (req, res) => {
  const newUser = req.body;
  //   console.log(newUser);'
  const { name, bio } = newUser;
  db.insert(newUser)
    .then(user => {
      if (!name || !bio) {
        res.status(400).json({
          errorMessage: 'Please provide name and bio for the user.'
        });
      } else if (bio && name) {
        res.status(201).json({ user });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: 'There was an error while saving the user to the database'
      })
    );
});

//5.Updating PUT request to /api/users/:id
server.put('/api/users/:id', (req, res) => {
  //by using curly braces we conver the string into a number
  const { id } = req.params;
  const newUser = req.body;
  const { name, bio } = newUser;
  console.log('user bio: ', newUser.bio);
  db.update(id, newUser)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      } else if (!name || !bio) {
        res
          .status(400)
          .json({ message: 'Please provide name and bio for the user.' });
      } else if (user) {
        res.status(200).json({ newUser });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The users information could not be modified.', err })
    );
});

//setting port to start listening
server.listen(5000, () => console.log('API running on server 5000'));
