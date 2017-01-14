Bullet = function(param){
	var self = Entity(param);
	self.id = Math.random();
	self.spdX = Math.cos(param.angle/180*Math.PI)*10;
	self.spdY = Math.sin(param.angle/180*Math.PI)*10;
	self.parent = param.parent;
	self.angle = param.angle;
	
	self.timer = 0;
	self.toRemove=false;
	var super_update = self.update;
	self.update = function(){
		if(self.timer++>15) self.toRemove = true;
		super_update();
		 
		for(var i in Player.list){
			var p = Player.list[i];
			if(self.map===p.map && self.getDistance(p)<32 && self.parent !== p.id){
				// handle collision 
				p.hp -= 1;
			
				if(p.hp <= 0){
					var shooter = Player.list[self.parent];
					if(shooter){
						shooter.score += 1;
					} 
					p.hp = p.hpMax; 
					p.x = Math.random()*500;
					p.y = Math.random()*500;
				}
				self.toRemove = true;
			}
			
		} 
	}
	
	self.getInitPack = function(){
		return {
			id:self.id,
			map:self.map,
			x:self.x,
			y:self.y,
		}
	}
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
		}
	}
	
	Bullet.list[self.id] = self;
	initPack.bullet.push(self.getInitPack());

	return self;
}
Bullet.list = {};

Bullet.update = function(){
	var pack = [];
	for(var i in Bullet.list){
		var bullet = Bullet.list[i];
	
		bullet.update();
		
	if(bullet.toRemove){
		delete Bullet.list[i];
		removePack.bullet.push(bullet.id);
	}else 
		pack.push(bullet.getUpdatePack());
	}
	return pack;
}

Bullet.getAllInitPack = function(){
	var bullets = [];
	for(var i in Bullet.list){
		bullets.push(Bullet.list[i].getInitPack());
	}
	return bullets;
}
 