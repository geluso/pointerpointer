require("../saves/chutes_and_ladders.js");
require("../saves/crosswalk.js");
require("../saves/plinko.js");

console.log(PLINKO.cursors.length);
console.log(CROSSWALK.cursors.length);
console.log(CHUTES_AND_LADDERS.cursors.length);

var host = 'localhost'
var port = 21017;
var database = 'pointerpointer'
var url = host + ":" + port + '/' + database
var collections = ["saves"]

db = require("mongojs").connect("pointerpointer");
saves = db.collection("saves");

saves.insert({name: "chutes and ladders", data: CHUTES_AND_LADDERS});
saves.insert({name: "plinko", data: PLINKO});
saves.insert({name: "crosswalk", data: CROSSWALK});

saves.find({}, function(err, saves) {
  for (var i = 0; i < saves.length; i++) {
    var save = saves[i];
    if (save.data) {
      console.log(save.name, save.data.cursors.length);
    } else {
      console.log(save.name);
    }
  }
});
