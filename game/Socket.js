
io.sockets.on('connection',function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	
	socket.on('signIn',function(data){
		isValidPassword(data, function(res){
			if(res){
				Player.onConnect(socket, data.username);
				console.log('Client connected {username:'+data.username+'}');
				socket.emit('connectionMsg',{
					msg:'Welcome '+data.username,
				});		
				socket.emit('signInResponse',{success:true});
			}else{
				socket.emit('signInResponse',{success:false});
			}
		});
	}); 
	
	socket.on('signUp',function(data){
		isUsernameTaken(data, function(res){
			if(res){
				socket.emit('signUpResponse',{success:false});
			}else{
				addUser(data, function(){
					socket.emit('signUpResponse',{success:true});
				});	
			}	
		});
		
	}); 
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	}); 
	
	socket.on('evalServer',function(data){
		if(!DEBUG) return;
		var res = eval(data);
		socket.emit('evalAnswer',res);
	}); 
	
});