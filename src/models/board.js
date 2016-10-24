const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const boardSchema = new Schema({
  boardData : { type : Array , "default" : [] }
});

mongoose.model('Board', boardSchema, 'boards');
