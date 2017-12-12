const bodyParser     = require('body-parser');
const express        = require('express');
const app            = express();
const db             = require('./config/db');

var ObjectID = require('mongodb').ObjectID;
var jsonValidation = require("json-validation");
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

module.exports = function(app, db) {
  app.post('/notes', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').insert(note, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};
