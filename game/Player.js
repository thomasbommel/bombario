

Player = function(param){
	var self = Entity(param);
	self.number = ""+Math.floor(10*Math.random());
	self.username = param.username;
	self.pressingRight=false;
	self.pressingLeft=false;
	self.pressingUp=false;
	self.pressingDown=false;
	self.pressingAttack=false;
	self.mouseAngle=0;
	self.maxSpd=10;
	self.hp = 10;
	self.hpMax = 10;
	self.score = 0;	 
	self.direction = "right";
	
	var super_update = self.update;
	self.update = function(){
		self.updateSpd();
		super_update();
		
		if(self.pressingAttack){
			Bullet({ 
				parent:self.id,
				x:self.x,
				y:self.y,
				angle:self.mouseAngle,
				map:self.map,
			});
		}
	}
	
	self.updateSpd= function(){
		if(self.pressingRight){
			 self.spdX = self.maxSpd;	
		}
		else if(self.pressingLeft){
			self.spdX = -self.maxSpd;
		} 
		else{
			self.spdX=0;
		}
		
		if(self.pressingUp){
			self.spdY = -self.maxSpd;
		} 
		else if(self.pressingDown){ 
			self.spdY = self.maxSpd;
		}
		else{
			self.spdY=0;
		}
	}
	
	self.getInitPack = function(){ 
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			number:self.number,
			hp:self.hp,
			hpMax:self.hpMax,
			score:self.score,
			map:self.map,
		}
	}
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
			score:self.score,
			map:self.map,
		}
	} 
	
	Player.list[self.id] = self;
 	initPack.player.push(self.getInitPack());
	return self;
}

global.Player.list={};

Player.onConnect = function(socket,username){
	var map = 'forest';
	if(Math.random()<0.5){
		map = 'field';
	}
	var player = Player({
		id:socket.id,
		map:map, 
		username:username,
	});
		
	socket.on('keyPress',function(data){
		if(data.inputId === 'left'){
			player.pressingLeft = data.state;
			//console.log("l")
		}else if(data.inputId === 'right'){
			player.pressingRight = data.state;
			//console.log("r")
		}else if(data.inputId === 'up'){
			player.pressingUp = data.state;
			//console.log("u")
		}else if(data.inputId === 'down'){
			player.pressingDown = data.state;
			//console.log("d")
		}else if(data.inputId === 'attack'){
			player.pressingAttack = data.state;
			//console.log("attack")
		}else if(data.inputId === 'mouseAngle'){
			player.mouseAngle = data.state;
			//console.log("mouseAngle") 
		}
	});  
	
	socket.on('changeMap',function(){
		if(player.map === 'field') 
			player.map = 'forest';
		else 
			player.map='field'; 
	});
	
	socket.on('sendMsgToServer',function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat',player.username+': '+data);
		}	
	}); 
	
	socket.on('sendPmToServer',function(data){ // data:{username,message} 
		var recipientSocket = null;
		
		for(var i in Player.list){
			if(Player.list[i].username === data.username){
				recipientSocket = SOCKET_LIST[i];	
				break;
			}
		}
		if(recipientSocket === null){
			socket.emit('addToChat','The player '+data.username+' is not online.');
		}else{ // player is the sender
			recipientSocket.emit('addToChat','From '+player.username+': '+data.message);
			socket.emit('addToChat','To '+data.username+': '+data.message);
		}	
	});  
	
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(), 
		bullet:Bullet.getAllInitPack(),
	});	
	
}

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list){
		players.push(Player.list[i].getInitPack());
	}
	return players;
}


Player.onDisconnect = function(socket){
	for(var i in Player.list){
			if(Player.list[i].id === socket.id){
				console.log('Client disconnected {username:'+Player.list[i].username+"}");
			}
		}
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
} 

Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());
	}
	return pack;
}









