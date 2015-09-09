[![https://travis-ci.org/dckesler/docks](https://travis-ci.org/dckesler/docks.svg?branch=master)](https://travis-ci.org/dckesler/docks)

docks is essentially a socket router. You set up route listeners with one or two callbacks. The first callback will define how the socket receives data. The second will define how the server receives data from the socket.

```javascript
import docks from "docks";
docks.init({port: 8335});
docks.at("/socket/test/:id", function(req){
  //I'm a read only socket
  this.send({message: "I work!"});
});
docks.at("/socket/test2/:id", function(req){
  this.send({message: "I'm the read callback"});
}, function(data){
  console.log("I received ", data, " from the browser");
});
docks.at("/socket/test3/:id", null, function(data){
  console.log("I'm a write only route.")
})
```
