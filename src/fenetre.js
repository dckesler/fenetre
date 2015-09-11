"use strict";
import urlHandler from "./urlHandler";

const fenetre = {
  activeSockets: [],
  socketServer: {},
  init(socketServer){
    this.socketServer = socketServer;
    socketServer.on('connection', (socket)=>{
      this.newSocket(socket);
    });
  },
  fenetrify(socket){
    socket.url = socket.upgradeReq.url;
    socket.json = json;
    socket.on.call(this, "close", this.removeSocket.bind(this, socket.sid));
  },
  newSocket(socket){
    this.fenetrify(socket);
    for(var i = 0; i <= this.activeSockets.length; i++){
      if(!this.activeSockets[i]){
        socket.sid = i;
        this.activeSockets[i] = socket;
        break;
      }
    }
    return socketStatus.call( this, ...urlHandler.checkAts(socket.url, socket) );
  },
  removeSocket(sid){
    delete this.activeSocket[sid];
  },
  at(url, cb, wcb){
    urlHandler.addRoute(url, cb, wcb);
  }
};

export default fenetre;

function json(obj){
  var string = {data: obj, error: null}
  try {
    string = JSON.stringify(obj);
  } catch(e){
    string = obj;
  }
  this.send(string);
}

function socketStatus(socket, reqObj, status){
  if(!status){
    socket.close(1003, `No corresonding fenetre route for ${socket.upgradeReq.url}`);
    delete this.activeSockets[socket.sid];
  }
  if(status.write){
    socket.on("message", function(data){
      console.log(data);
      reqObj.data = data;
      status.write.call(socket, reqObj)
    });
  } else {
    socket.on("message", function(){
      socket.write({error: {type: "privileges", message: "This is a read only socket. It doesn't have write privileges."}});
    })
  }
}
