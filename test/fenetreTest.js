process.env.NODE_ENV = "test";
import should from "should";
import sinon from "sinon";
import WebSocket from "ws";

var wss = WebSocket.Server;

import fenetre from "./../src/fenetre.js";
import urlHandler from "./../src/urlHandler.js";

fenetre.init(new wss({port: 8335}));
var runner = function(){
  this.send("banana");
}


//TODO Write tests for and make functionality for trying to write when a socket does not have write privileges.

describe("fenetre", function(){
  describe("Server side", function(){

    describe("Setting routes", function(){
      it("Should add 'at' object to urlHandler.ats", function(){
        fenetre.at("/test/:id", runner);
        fenetre.at("/test/:id/longer", runner);
        urlHandler.ats.should.containEql({0: "test", 1: ":id", cb: runner, wcb: undefined, length: 2});
        urlHandler.ats.should.containEql({0: "test", 1: ":id", 2:"longer", cb: runner, wcb: undefined, length: 3});
      })
      it("Should run the 'at' callback when a socket matches a route", function(done){
        var socket = new WebSocket("ws://localhost:8335/test/123");
        socket.on("message", function(){
          done();
        })
      })
      it("Shouldn't add an 'at' object if its url conflicts with an existing one", function(){
        var stay = urlHandler.ats.length;
        fenetre.at("/test/:id", function(){});
        fenetre.at("/test/:notokay", function(){});
        if(urlHandler.ats.length !== stay) throw new Error("Added routes when they weren't compatible");
      })
      it("Shouldn't add a route that has multiple parameters with the same name", function(){
        urlHandler.ats = [];
        fenetre.at("/test/:id/:id", function(){});
        if(urlHandler.ats.length) throw new Error("Added a route with multiple parameters with same name");
      })
      it("Should add a route with multiple hardcoded portions of the same name", function(){
        urlHandler.ats = [];
        fenetre.at("/test/test/test", function(){})
        if(!urlHandler.ats.length) throw new Error("Route with multiple same named portions was not added");
      })
    })

    describe("Handling connections", function(){
      it("Should add an active socket on connection", function(done){
        fenetre.at("/async/testing", function(){
          fenetre.activeSockets.should.containDeepOrdered([{upgradeReq: {url: "/async/testing"}}]);
          done();
        });
        var socket = new WebSocket("ws://localhost:8335/async/testing");
      })

      it("Shouldn't add an active socket for an unknown url", function(done){
        var socket = new WebSocket("ws://localhost:8335/wrongtest/123");
        socket.on("close", function(){
          fenetre.activeSockets.should.not.containDeepOrdered([{upgradeReq: {url: "/wrongtest/123"}}]);
          done();
        })
      })

      it("The request should have the correct param obj and query obj", function(done){
        fenetre.at("/param/:id/:sid/atest", function(req){
          req.params.should.eql({id: "123", sid: "456"});
          req.query.should.eql({test: "passes", test2: "passes"});
          done();
        })
        var socket = new WebSocket("ws://localhost:8335/param/123/456/atest?test=passes&test2=passes");
        socket.on("open", function(){

        })

      })
      it("Should call the write callback when a connection receives a write request if there is one", function(done){
        fenetre.at("/test/write", null, function(e){
          done();
        });
        var socket = new WebSocket("ws://localhost:8335/test/write");
        socket.on("open", function(){
          socket.send("My data");
        })
      })
    })
    describe("Matching priority", function(){
      require("./priorityTest.js");
    })
  })
})
