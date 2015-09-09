export default {
  ats: [],
  addRoute(url, cb, wcb){
    var urlArr = url.split("/").slice(1);

    //Make sure this is a valid connection;
    var match = checkCompatability(urlArr, this.ats);
    if(match){
      //Don't run warns in test environment
      if(process.env.NODE_ENV !== "test"){
        console.warn(match.msg);
      };
      return;
    }
    var urlObj = {cb: cb, wcb: wcb, length: urlArr.length};
    urlArr.forEach(function(item, index){
      urlObj[index] = item;
    });
    this.ats.push(urlObj);
  },
  checkAts(url, socket){
    //Take off query parameters
    var reqArr = url.split("?");
    reqArr[0] = reqArr[0].split("/").slice(1);
    var reqObj = {params: {}, query: {}};
    var cb;
    var wcb;
    reqObj.query = getQuery(reqArr[1]);
    var trackCompare = Infinity
    this.ats.forEach(function(obj){
      //Don't bother with comparing if they don't have the same lengths
      if(obj.length !== reqArr[0].length) return;

      //Check and see if this 'at' object matches the url on the socket.
      var compareObj = urlCompare(obj, reqArr[0]);
      if(compareObj.paramHits < trackCompare){
        cb = obj.cb;
        wcb = obj.wcb;
        reqObj.params = compareObj.params;
        trackCompare = compareObj.paramHits;
      }
    });

    //If there's callback wrap it into a web api to let the callstack clear before running it.
    cb && setTimeout(cb.bind(socket, reqObj));

    //Establish what kind of socket this is and return it to docks.js
    return getSocketStatus(socket, cb, wcb);
  }
};

function urlCompare(obj, arr){
  var returnObj = {paramHits: 0, params: {}};
  for(var key in obj){
    if(key == "cb" || key == "wcb") continue;
    if(obj[key][0] == ":" && arr[key]){
      returnObj.params[obj[key].replace(":", "")] = arr[key];
      returnObj.paramHits += (obj.length - key);
    }
    else if(obj[key] !== arr[key]){
      return false;
    }
  }
  return returnObj;
}

function getQuery(string){
  var queryObj = {};
  if(!string) return queryObj;
  var queryArr = string.split("&");
  queryArr.forEach(function(line){
    var arr = line.split("=");
    queryObj[arr[0]] = arr[1];
  });
  return queryObj;
}

function getSocketStatus(socket, cb, wcb){
  var statusArr = [socket];
  if(!cb && !wcb) statusArr.push(false)
  if(cb && wcb) statusArr.push({read: true, write: wcb})
  if(cb && !wcb) statusArr.push({read: true})
  if(!cb && wcb) statusArr.push({write: wcb})
  return statusArr;
}

function checkCompatability(url, ats){
  var match;
  if(!noSameParams(url)) return {error: "param duplicates", msg: "A route cannot have multiple parameters with the same name"};
  for(var i = 0; i < ats.length; i++){
    match = true;
    for(var j = 0; j < url.length; j++){
      if(notMatch(url[j], ats[i][j])){
        match = false;
        break;
      }
    }
    if(match && !ats[i][j]){
      return {error: "non-compatible routes", msg: `New route ${reUrl(url)} and existing route ${reUrl(ats[i])} are not compatible. The new route was not added`}
    }
  }
  return null;
}

function noSameParams(url){
  var urlObj = {};
  for(var i = 0; i < url.length; i++){
    if(urlObj[url[i]]) return false;
    else if(url[i][0] == ":") urlObj[url[i]] = true;
  };
  return true;
}

function reUrl(obj){
  var url = "";
  for(var i = 0; i < obj.length; i++){
    url += ("/" + obj[i]);
  }
  return url;
}

function notMatch(newb, oldbie){
  if(newb === oldbie) return false;
  if(newb[0] === ":" && oldbie[0] === ":") return false;
  return true;
}
