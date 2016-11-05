const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const boardSchema = new Schema({
    name : String
  , restriction: String
  , users: []
  , data : { type : Array , "default" : [] }
});

mongoose.model('Board', boardSchema, 'boards');
