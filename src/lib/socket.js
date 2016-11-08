const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

require('../models/board.js');
require('../models/user.js');
const db = require('../lib/mongo.js');
const ObjectId = require('mongoose').Types.ObjectId;
const Board = db.model('Board');
const User = db.model('User');

module.exports = (io) => {

  io.on('connection', function (socket) {

    socket.on('signup', async (user) => {
      const isUserExist = await User.findOne({username: user.username});
      if (isUserExist) {
        socket.emit('signupError', 'User with such username already exist');
      } else {
        const newUser = new User(user);
        const savedUser = await newUser.save();
        socket.emit('logged', savedUser);
      }
    })

    socket.on('login', async (data) => {
      try {
        const user =  await User.findOne({username: data.username, password: data.password});
        if (user) {
          socket.emit('logged', user);
        } else {
          socket.emit('loginError', 'Wrong username or password');
        }

      } catch(err) {
        socket.emit('loginError', err);
      }
    })

    socket.on('getBoardList', async (user) => {
      try {
        const publicBoards =  await Board.find({ restriction: "public" }, { name: 1 });
        const privatBoards =  await Board.find({ users: user._id }, { name: 1 });
        socket.emit('boardList', {public: publicBoards, private: privatBoards});
      } catch(err) {
        socket.emit('error', err);
      }
    })

    socket.on('addBoard', async (board, user_ID) => {
      try {
        const newBoard = new Board (board);
        await newBoard.save();
        socket.join(board._id);
        socket.emit('boardData', board);
      } catch(err) {
        socket.emit('error', err);
      }
    })

    socket.on('getBoard', async (boardID) => {
      try {
        socket.join(boardID);
        const board = await Board.findOne({_id : boardID});
        socket.emit('boardData', board);
      } catch(err) {
        socket.emit('error', err);
      }
    })

    socket.on('updateBoard', async (board) => {
      try {
        await Board.update({ _id: new ObjectId(board._id) }, board, {upsert:true});
        io.to(board._id).emit('boardData', board);
      } catch(err) {
        socket.emit('error', err);
      }
    })

    socket.on('deleteBoard', async (boardID, userID) => {
      try {
        const result = await Board.remove({ _id: boardID });
        io.to(boardID).emit('boardData', result);
        const publicBoards =  await Board.find({ restriction: "public" }, { name: 1 });
        const privatBoards =  await Board.find({ users: userID }, { name: 1 });
        socket.emit('boardList', {public: publicBoards, private: privatBoards});
      } catch(err) {
        socket.emit('error', err);
      }
    })

  });
}
