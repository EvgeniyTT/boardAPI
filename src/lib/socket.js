const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

require('../models/board.js');
require('../models/user.js');
const db = require('../lib/mongo.js');
const ObjectId = require('mongoose').Types.ObjectId;
const Board = db.model('Board');
const User = db.model('User');

const notATokenSectet = 'd3hA&bhYh2tn72bXvb'

function makeToken(user) {
  return jwt.sign(user, notATokenSectet, {
    expiresIn: '24h'
  });
}

module.exports = (io) => {

  io.on('connection', function (socket) {

    socket.on('signup', async (user) => {
      const isUserExist = await User.findOne({username: user.username});
      if (isUserExist) {
        socket.emit('signupError', 'User with such username already exist');
      } else {
        const newUser = new User(user);
        const savedUser = await newUser.save();
        let token = makeToken(user);
        socket.emit('logged', savedUser, token);
      }
    })

    socket.on('login', async (data) => {
      try {
        const user =  await User.findOne({username: data.username, password: data.password});
        if (user) {
          let token = makeToken(user);
          socket.emit('logged', user, token);
        } else {
          socket.emit('loginError', 'Wrong username or password');
        }
      } catch(err) {
        socket.emit('loginError', 'Some internal error occured, please contact support team.');
      }
    })

    socket.on('getBoardList', async (token) => {
      try {
        const decode = jwt.verify(token, notATokenSectet);
        const user = decode._doc;
        const publicBoards =  await Board.find({ restriction: "public" }, { name: 1 });
        const privatBoards =  await Board.find({ users: user._id }, { name: 1 });
        socket.emit('boardList', {public: publicBoards, private: privatBoards});
      } catch(err) {
        socket.emit('internalError', err);
      }
    })

    socket.on('addBoard', async (token, board) => {
      try {
        const decode = jwt.verify(token, notATokenSectet);
        const user = decode._doc;
        const newBoard = new Board (board);
        await newBoard.save();
        socket.join(board._id);
        socket.emit('boardData', board);
      } catch(err) {
        socket.emit('internalError', err);
      }
    })

    socket.on('getBoard', async (token, boardID) => {
      try {
        const decode = jwt.verify(token, notATokenSectet);
        const user = decode._doc;
        socket.join(boardID);
        const board = await Board.findOne({_id : boardID});
        socket.emit('boardData', board);
      } catch(err) {
        socket.emit('internalError', err);
      }
    })

    socket.on('updateBoard', async (token, board) => {
      try {
        const decode = jwt.verify(token, notATokenSectet);
        const user = decode._doc;
        await Board.update({ _id: new ObjectId(board._id) }, board, {upsert:true});
        io.to(board._id).emit('boardData', board);
      } catch(err) {
        socket.emit('internalError', err);
      }
    })

    socket.on('deleteBoard', async (token, boardID) => {
      try {
        const decode = jwt.verify(token, notATokenSectet);
        const user = decode._doc;
        const result = await Board.remove({ _id: boardID });
        io.to(boardID).emit('boardData', result);
        const publicBoards =  await Board.find({ restriction: "public" }, { name: 1 });
        const privatBoards =  await Board.find({ users: user._id }, { name: 1 });
        socket.emit('boardList', {public: publicBoards, private: privatBoards});
      } catch(err) {
        socket.emit('internalError', err);
      }
    })

  });
}
