// Database
var isValidPassword = function(data, cb){
	db.account.find({account:data.username,password:data.password},function(err,res){
		if(res.length>0){
			cb(true);
		}else{
			cb(false);
		}
	});
}

var isUsernameTaken = function(data, cb){
		db.account.find({account:data.username},function(err,res){
		if(res.length>0){
			cb(true);
		}else{
			cb(false);
		}
	});
}

var addUser = function(data, cb){
	db.account.insert({account:data.username,password:data.password},function(err,res){
		cb();
	});
}