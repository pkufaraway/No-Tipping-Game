function Weight(player, weight, x, y) {
	this.x = x;
	this.y = y;
	this.originalX = x;
	this.originalY = y;
	this.player = player;
	this.weight = weight;
	this.draggable = true;
	if (player == 0 || player == 'player 1') {
		this.color = "red";
	} else if (player == 1 || player == 'player 2'){
		this.color = "blue";
	} else {
		this.color = "green";
	}
	this.radius = 8;
}

Weight.prototype.hitTest = function(hitX, hitY) {
	this.shapeX = this.x +15;
	this.shapeY = this.y;
	var dx = this.shapeX - hitX;
	var dy = this.shapeY - hitY;
	return (dx*dx + dy*dy < this.radius*this.radius)
}

Weight.prototype.drawToContext = function(ctx) {
	ctx.font = "20px Arial";
	ctx.fillStyle = this.color;
	ctx.fillText(this.weight, this.x, this.y);
}

Weight.prototype.setIndex = function(index) {
	this.index = index;
}