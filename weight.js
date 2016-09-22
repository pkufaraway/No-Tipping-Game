// Weight class
function Weight(player, weight, x, y) {
	this.x = x;
	this.y = y;
	this.player = player;
	this.weight = weight;
	if (player == "player 1") {
		this.color = "red";
	} else {
		this.color = "blue";
	}
	this.radius = 2;
}

Weight.prototype.hitTest = functioN(hitX, hitY) {
	var dx = this.x - hitX;
	var dy = this.y - hitY;
	return (dx*dx + dy*dy < this.radius*this.radius)
}

Weight.prototype.drawToContext = function(ctx) {
	ctx.font = "20px Arial";
	ctx.fillStyle = this.color;
	ctx.fillText(this.weight, this.x, this.y);
}