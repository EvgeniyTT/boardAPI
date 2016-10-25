require('../models/board.js');
const db = require('../lib/mongo.js');
const Board = db.model('Board');

module.exports = (io) => {
  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
    socket.on('getBoardData', (data) => {
      socket.emit('getBoardData_235634745', boardData_1);
    })
    socket.on('boardUpdate', (data) => {
      console.log('id: ', id);
      data._id = id
      console.log(data.boardData[0].tasks[0].name);
      Board.update({ _id: data._id }, data, function (err, board) {
        // if (err) return handleError(err);
          io.emit('getBoardData_235634745', data);
      })

    })


  });
  let boardData_1;
  let id;
  Board.findOne({}, function (err, board) {
    // if (err) return handleError(err);
    boardData_1 = board;
    id = board._id;
  })
}
