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
      console.log('BOARD DATA WAS REQUESTED');
      console.log('boardData_1: ', boardData_1);
      socket.emit('getBoardData_235634745', boardData_1);
    })

    setInterval( function() {
      socket.emit('getBoardData_235634745', boardData_1);
    }, 1000)
  });
  let boardData_1;
  Board.findOne({}, function (err, board) {
    // if (err) return handleError(err);
    boardData_1 = board;
  })
}
