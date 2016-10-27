require('../models/board.js');
const db = require('../lib/mongo.js');
const ObjectId = require('mongoose').Types.ObjectId;
const Board = db.model('Board');

module.exports = (io) => {
  io.on('connection', function (socket) {

    socket.on('getBoards', (data) => {
      //data should contain userID so we can find user boards
      Board.find({}, {name: 1}, function (err, boards) {
        // if (err) return handleError(err);
        socket.emit('boardList', boards);
      })
    })

    socket.on('addBoard', (boardName) => {
      const newBoard = new Board ({
        name : boardName
      , data : []
      })

      newBoard.save(newBoard, function (err, board) {
        if (err) {console.log("ERROR!!!!!!!!!!!! : ", err)}; //need to handle errors
        Board.find({}, {name: 1}, function (err, boards) {
          // if (err) return handleError(err);
          io.emit('boardList', boards);
        })
        socket.join(board._id);
        socket.emit('getBoardData', board);
      })
    })

    socket.on('getBoardData', (boardID) => {
      socket.join(boardID);
      Board.findOne({_id : boardID}, function (err, board) {
        if (err) {console.log("ERROR!!!!!!!!!!!! : ", err)}; //need to handle errors
        socket.emit('getBoardData', board);
      })
    })

    socket.on('boardUpdate', (board) => {
      Board.update({ _id: new ObjectId(board._id) }, board, {upsert:true}, function (err, doc) {
        if (err) {console.log("ERROR!!!!!!!!!!!! : ", err)}; //need to handle errors
        io.to(board._id).emit('getBoardData', board);
      })
    })

    socket.on('deleteBoard', (boardID) => {
      Board.remove({ _id: boardID }, function (err, result) {
        if (err) {console.log("ERROR!!!!!!!!!!!! : ", err)}; //need to handle errors
        io.to(boardID).emit('getBoardData', result); // !!!!!!!! need to handle waht to send if board is removed !!!!!!
        Board.find({}, {name: 1}, function (err, boards) {
          // if (err) return handleError(err);
          io.emit('boardList', boards);
        })
      })
    })

  });
}
