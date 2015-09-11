"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var urlHandler = _interopRequire(require("./urlHandler"));

var fenetre = {
  activeSockets: [],
  socketServer: {},
  init: function init(socketServer) {
    var _this = this;

    this.socketServer = socketServer;
    socketServer.on("connection", function (socket) {
      _this.newSocket(socket);
    });
  },
  fenetrify: function fenetrify(socket) {
    socket.url = socket.upgradeReq.url;
    socket.json = json;
    socket.on.call(this, "close", this.removeSocket.bind(this, socket.sid));
  },
  newSocket: function newSocket(socket) {
    this.fenetrify(socket);
    for (var i = 0; i <= this.activeSockets.length; i++) {
      if (!this.activeSockets[i]) {
        socket.sid = i;
        this.activeSockets[i] = socket;
        break;
      }
    }
    return socketStatus.call.apply(socketStatus, [this].concat(_toConsumableArray(urlHandler.checkAts(socket.url, socket))));
  },
  removeSocket: function removeSocket(sid) {
    delete this.activeSocket[sid];
  },
  at: function at(url, cb, wcb) {
    urlHandler.addRoute(url, cb, wcb);
  }
};

module.exports = fenetre;

function json(obj) {
  var string = { data: obj, error: null };
  try {
    string = JSON.stringify(obj);
  } catch (e) {
    string = obj;
  }
  this.send(string);
}

function socketStatus(socket, reqObj, status) {
  if (!status) {
    socket.close(1003, "No corresonding fenetre route for " + socket.upgradeReq.url);
    delete this.activeSockets[socket.sid];
  }
  if (status.write) {
    socket.on("message", function (data) {
      console.log(data);
      reqObj.data = data;
      status.write.call(socket, reqObj);
    });
  } else {
    socket.on("message", function () {
      socket.write({ error: { type: "privileges", message: "This is a read only socket. It doesn't have write privileges." } });
    });
  }
}