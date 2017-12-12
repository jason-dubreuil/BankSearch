const bodyParser     = require('body-parser');
const express        = require('express');
const app            = express();

var ObjectID = require('mongodb').ObjectID;

var jsonValidation = require("json-validation");
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

module.exports = function(app, db) {
  app.get('/notes/:id', (req, res) => {

    const id = req.params.id;

    var myData = {
    "_id": "5a2b18e9df526590f87cf068",
    "text": "this is the title of the book",
    "title": "this is the body of the book"
    };

    var myDataSchema = {
          "$schema": "http://json-schema.org/draft-06/schema#",
          "title": "text",
          "description": "unique identifier fron mongodb",
          "type": "string",
          "properties": {
              "_id": {
                  "description": "The unique identifier for a product",
                  "type": "numeric"
              }
          },
          "required": ["_id"]
    };

    var addressSchema = {
      "id": "/SimpleAddress",
      "type": "object",
      "properties": {
        "lines": {
          "type": "array",
          "items": {"type": "string"}
        },
        "zip": {"type": "string"},
        "city": {"type": "string"},
        "country": {"type": "string"}
      },
      "required": ["country"]
    };



    var schema = {
      "id": "/SimplePerson",
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "address": {"$ref": "/SimpleAddress"},
        "votes": {"type": "integer", "minimum": 1}
      }
    };


    var p = {
      "name": "Barack Obama",
      "address": {
        "lines": [ "1600 Pennsylvania Avenue Northwest" ],
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
      },
      "votes": "lots"
    };


      var Validator = require('jsonschema').Validator;
      var v = new Validator();

    const details = { '_id': new ObjectID(id) };
    var valSchema = { "type": "string" };
    var stuffValidate = {"note": "blablabla" };
    console.log(stuffValidate);

    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
          var validate = require('jsonschema').validate;
          //console.log(validate(stuffValidate, valSchema));
          console.log(item);

          //v.addSchema(addressSchema, '/SimpleAddress');
          //console.log(v.validate(p, schema));

          ///v.addSchema(myDataSchema, '/text');
          console.log(v.validate(myData, myDataSchema));


          res.send(item);
      }
    });
  });

  app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.text, title: req.body.title };
    db.collection('notes').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      }
    });
  });
  app.delete('/notes/:id', (req, res) => {
     const id = req.params.id;
     const details = { '_id': new ObjectID(id) };
     db.collection('notes').remove(details, (err, item) => {
       if (err) {
         res.send({'error':'An error has occurred'});
       } else {
         res.send('Note ' + id + ' deleted!');
       }
     });
   });

  app.post('/notes', (req, res) => {
//req.body['okayAnimals[]']
console.log("body ------------------------------");
    console.log(req.body);
    console.log("body ------------------------------");
    const note = { text: req.body.text, title: req.body.title, name: { first: req.body.name.first, middle: req.body.name.middle, last: req.body.name.last } };
    console.log("note ------------------------------");
    ///var arrayVal = req.body.name.length;
    console.log(note);
    console.log("note ------------------------------");
    db.collection('notes').insert(note, (err, result) => {

      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(result.ops[0]);
      }

    });

  });

};
