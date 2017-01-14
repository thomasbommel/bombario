// Console input
var stdin = process.openStdin();

stdin.addListener("data", function (d) {
	console.log("you entered: [" +
		d.toString().trim() + "]");

	var input = d.toString().trim();

	if (input.length > 0) {
		console.log("--- ADMIN COMMAND ---");
		if (input.indexOf("logged") >= 0) {
			for (var i in Player.list) {
				console.log("-> " + Player.list[i].username + ", score: " + Player.list[i].score);
			}
		}

	}
	//	for(var i in Player.list){
	//		if(Player.list[i].username === input){
	//			console.log("catched")
	//			Player.list[i].score=Player.list[i].score+1;
	//		}
	//	}

});

