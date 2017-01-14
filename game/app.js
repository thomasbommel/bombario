//cd  C:\Program Files\MongoDB\Server\3.4\bin
//mongod --dbpath C:\Users\thoma\Desktop\game\data\db
// in a new cmd  
//mongo

//install profiler


process.on('uncaughtException', function(err){
	console.log("!-- AN EXCEPTION OCCURED --!");
	console.log(err);
});

global.DEBUG = true;

var mongojs=require("mongojs");
global.db = mongojs('localhost:27017/myGame',['account','progress']);


var express = require('express');
var app = express();
var serv = require('http').Server(app);
var profiler = require('v8-profiler');

var fs = require('fs'); 

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}
global.io=require('socket.io')(serv,{});
// include other files
include('Entity.js');
include('Player.js');
include('Bullet.js');
include('Database.js');
include('Socket.js');
include('Utils.js');


// some configuration
app.get('/',function(req,res){
	res.sendFile(__dirname+'/client/index.html');
});
app.use('/client',express.static(__dirname+'/client'));
serv.listen(443);
console.log("Server started.")


// global variables
global.SOCKET_LIST = {};
global.initPack={player:[],bullet:[]};
global.removePack={player:[],bullet:[]};



// main game
setInterval(function(){
	var pack = {
		player:Player.update(),
		bullet:Bullet.update(),
	}
	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init',initPack);
		socket.emit('update',pack);
		socket.emit('remove',removePack);
	}
	
	initPack.player = [];
    initPack.bullet = [];
    removePack.player = [];
    removePack.bullet = [];
	
},1000/25);


/*
// PROFILER
var profiler = require('v8-profiler');
var fs = require('fs');
var startProfiling = function(duration){
	profiler.startProfiling('1', true);
	setTimeout(function(){
		var profile1 = profiler.stopProfiling('1');
		
		profile1.export(function(error, result) {
			fs.writeFile('./profile.cpuprofile', result);
			profile1.delete();
			console.log("Profile saved.");
		});
	},duration);	
}
startProfiling(10000);
// END PROFILER 
*/

























