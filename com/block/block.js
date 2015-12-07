function Block(x, y, width, height, index) {
	this.index = index;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.radius = 8;
	this.weight = null;
}

Block.prototype.hitTest = function(hitX, hitY) {
	var shapeX = this.x + this.width;
	var shapeY = this.y + this.height/1.2;
	var dx = shapeX - hitX;
	var dy = shapeY - hitY;
	return (dx*dx + dy*dy < this.radius*this.radius);
}

Block.prototype.drawToContext = function(ctx) {
	ctx.font = "10px Arial";
	ctx.lineWidth = 0.1;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
}

Block.prototype.highlight = function() {
	ctx.fillStyle = "#ff6699";
	ctx.fillRect(this.x, this.y, this.width, this.height);
}

Block.prototype.insertWeight = function(weight) {
	this.weight = weight;
}