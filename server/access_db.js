var http = require('http');
var url = require('url');
var querystring = require('querystring');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    var parse = url.parse(req.url);
    var pathname = url.parse(req.url).pathname;
    var queryString = querystring.parse(url.parse(req.url).query);

    if (pathname == "/getSave") {
      if (queryString && queryString.name) {
        getSave(queryString.name, res);
      }
    } else if (pathname == "/getSaves") {
      getSaves(res);
    }
    res.end("nothing");
}).listen(1337, '127.0.0.1');

db = require("mongojs").connect("pointerpointer");
saves = db.collection("saves");

function getSaves(res) {
  saves.find({}, {name: 1}, function(err, saves) {
    if (err) {
      res.end("error");
    }
    var json = JSON.stringify(saves);
    res.end(json);
  });
}

function getSave(name, res) {
  saves.find({name: name}, function(err, saves) {
    if (err) {
      res.end("error");
    }
    for (var i = 0; i < saves.length; i++) {
      var save = saves[i];
      if (save.data) {
        var json = JSON.stringify(save);
        res.end(json);
      }
    }
  });
}
