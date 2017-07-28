var socketio = require('socket.io');
var io;
var guesNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};
var allRoom = [];

exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function(socket) {
    guesNumber = assignGuestName(socket, guesNumber, nickNames, namesUsed);
    joinRoom(socket, 'Lobby');
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);
    socket.on('rooms', function() {
      socket.emit('rooms', allRoom);
    });

    handleClientDisconnection(socket, nickNames, namesUsed);
  });
}

/*
 *分配用户昵称
 */
function assignGuestName(socket, guestNumber, nickNames, namesUserd) {
  var name = 'Guest' + guesNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

/*
 *进入聊天室
 */
function joinRoom(socket, room) {
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', { room: room });
  //向其它用户广播消息
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });
  if(allRoom.length > 0){
  	  allRoom.forEach(function(val) {
  	  if(val != room){
  		  allRoom.push(room);
  	  }
    });
  }else{
  	allRoom.push(room);
  }
  var usersInRoom = io.sockets.adapter.rooms[room];//获取当前聊天室都有谁
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index in usersInRoom.sockets) {
        usersInRoomSummary += ', ';
        usersInRoomSummary += nickNames[index];
    }
    usersInRoomSummary += '.';
    socket.emit('message', { text: usersInRoomSummary });
};
/*
 *处理昵称修改
 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) {
    if (name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with \"Guest\"'
      })
    } else {
      if (namesUsed.indexOf(name) == -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];

        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now know as ' + name + '.'
        })
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use'
        })
      }
    }
  })
}

/*
 *发送消息
 */
function handleMessageBroadcasting(socket) {
  socket.on('message', function(message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    })
  })
}

/*
 *创建房间
 */
function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  })
}

/*
 *用户断开连接
 */
function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  })
}