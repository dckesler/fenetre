[![https://travis-ci.org/dckesler/fenetre](https://travis-ci.org/dckesler/fenetre.svg?branch=master)](https://travis-ci.org/dckesler/fenetre)

fenetre is essentially a socket router. You set up route listeners with one or two callbacks. The first callback will define how the socket receives data. The second will define how the server receives data from the socket.

```javascript
import fenetre from "fenetre";
fenetre.init({port: 8335});
fenetre.at("/socket/test/:id", function(req){
  //This is the send data callback
  //This socket is considered read only
  this.send({message: "I work!"});
});
fenetre.at("/socket/test2/:id", function(req){
  //This is the send data callback
  this.send({message: "I'm the read callback"});
}, function(req){
  //This is the receiving data callback
  console.log("I received ", req.data, " from the browser");
});
fenetre.at("/socket/test3/:id", null, function(req){
  //This is the receiving data callback
  console.log("I'm a write only route.")
})
```
##Request object
Each call back inside of a `fenetre.at` will have a `request` parameter. The request parameter will have a `params` property and a `query` property. In the case of a write callback there will also be a `data` property that represents whatever the socket send to your server.

###Example
```javascript
/*If the following route received a socket at this address "ws://localhost:8335/socket/the/123?my=data"
And the same socket sent the string "test"
Then all of the contained comparative expression would be true */
fenetre.at("/socket/the/:test", function(req){
  req.params.test === 123;
  req.query.my === "data";
}, function(req){
  req.params.test === 123;
  req.query.my === "data";
  req.data === "test";
});
```
##Sending data
In each callback function whether sending data or receiving data the context (`this`) will always be the server-side socket that is sending or receiving the data. This is most important for sending back data as the `send` method is on `this`.

```javascript
fenetre.at("/socket/test", function(req){
  this.send("I got yer message");
});
```

##Route priority
Sometimes some routes will be very similar such as `"/test/example"` and `"/test/:id"`. In this case a request to `"ws://localhost:8335/test/example"` would prefer `"/test/example"` over `"/test/:id"`. Hard coded values are always matched over parameters.
More route complications are explained as such
```javascript
"/ptest/test/test" > "/ptest/:id/test" > "/ptest/:id/:sid" > "/:id/:sid/:ssid"
```
More hard matches are preferred over parameters, but really I'd hope you never need to know any of this.
