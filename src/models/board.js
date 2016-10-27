const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const boardSchema = new Schema({
    name : String
  , data : { type : Array , "default" : [] }
});

mongoose.model('Board', boardSchema, 'boards');
