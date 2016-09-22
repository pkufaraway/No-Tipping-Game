function Recycle(x, y, width, height, player, ctx) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.player = player;
	this.base_image = new Image();
	this.base_image.src = 'com/recycle/recycle.png';
	this.base_image.onload = function() {
		console.log(ctx);
		var oc = document.createElement('canvas'),
			octx = oc.getContext('2d');
		oc.width = this.base_image.width * 0.7;
		oc.height = this.base_image.height * 0.7;
		octx.drawImage(this.base_image, 0, 0, oc.width, oc.height)
		octx.drawImage(oc, 0, 0, oc.width, oc.height);
		console.log(c.width)
		console.log(c.height)
		ctx.drawImage(oc, this.x, this.y, oc.width * 0.5, oc.height * 0.5);
		// ctx.drawImage(this.base_image, this.x, this.y,
		// 	this.width, this.height);
	}.bind(this)
	this.radius = 30;
}

Recycle.prototype.drawToContext = function(ctx) {
	var oc = document.createElement('canvas'),
		octx = oc.getContext('2d');
	oc.width = this.base_image.width * 0.7;
	oc.height = this.base_image.height * 0.7;
	octx.drawImage(this.base_image, 0, 0, oc.width, oc.height)
	octx.drawImage(oc, 0, 0, oc.width, oc.height);
	console.log(c.width)
	console.log(c.height)
	ctx.drawImage(oc, this.x, this.y, oc.width * 0.5, oc.height * 0.5);
	// ctx.drawImage(this.base_image, this.x, this.y,
	// 	this.width, this.height);
}
Recycle.prototype.hitTest = function(hitX, hitY) {
	this.shapeX = this.x + 50;
	this.shapeY = this.y + 50;
	var dx = this.shapeX - hitX;
	var dy = this.shapeY - hitY;
	return (dx * dx + dy * dy < this.radius * this.radius)
}