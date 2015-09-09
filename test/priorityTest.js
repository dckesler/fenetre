import should from "should";
import sinon from "sinon";
import WebSocket from "ws";

var wss = WebSocket.Server;

import fenetre from "./../lib/fenetre.js";
import urlHandler from "./../lib/urlHandler.js";

var check;
fenetre.at("/ptest/:id/:id", function(){check = 1}); /*Least priority*/
fenetre.at("/ptest/test/:id", function(){check = 2});
fenetre.at("/ptest/:id/test", function(){check = 3});
fenetre.at("/ptest/test/test", function(){check = 4}); /*Highest priority*/

it("/ptest/test/test > /ptest/:id/test", function(done){
  urlHandler.ats = [];
  fenetre.at("/ptest/:id/:sid", function(){
    throw new Error("Priority 1 was greater than 4");
  });
  fenetre.at("/ptest/test/:sid", function(){
    throw new Error("Priority 2 was greater than 4");
  });
  fenetre.at("/ptest/:id/test", function(){
    throw new Error("Priority 3 was greater than 4");
  });
  fenetre.at("/ptest/test/test", function(){
    done();
  });
  urlHandler.checkAts("/ptest/test/test", {});
})

it("/ptest/:id/test > /ptest/test/:sid", function(done){
  urlHandler.ats = [];
  fenetre.at("/ptest/:id/:sid", function(){
    throw new Error("Priority 1 was greater than 3");
  }); /*Least priority*/
  fenetre.at("/ptest/test/:sid", function(){
    throw new Error("Priority 2 was greater than 3");
  });
  fenetre.at("/ptest/:id/test", function(){
    done();
  });
  fenetre.at("/ptest/test/test", function(){
    throw new Error("Priority 4 should not have run.");
  });
  urlHandler.checkAts("/ptest/123/test", {});
})

it("/ptest/test/:id > /ptest/:id/:sid", function(done){
  urlHandler.ats = [];
  fenetre.at("/ptest/:id/:sid", function(){
    throw new Error("Priority 1 was greater than 2");
  }); /*Least priority*/
  fenetre.at("/ptest/test/:sid", function(){
    done();
  });
  fenetre.at("/ptest/:id/test", function(){
    throw new Error("Priority 2 should not have run.");
  });
  fenetre.at("/ptest/test/test", function(){
    throw new Error("Priority 4 should not have run.");
  });
  urlHandler.checkAts("/ptest/test/123", {});
})

it("Should run /ptest/:id/:sid", function(){
  urlHandler.ats = [];
})
