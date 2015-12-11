var dragging, dragIndex, blockIndex, dragHoldX, dragHoldY, targetX, targetY, timer;
var mouseX = 0;
var mouseY = 0;
var x_size = 25;
var y_size = 25;
var mid_x, mid_y, start_point, end_point;

function TippingGame(options) {
	'use strict';
	var settings = jQuery.extend(true, 
	{
		board_weight: 3,
		board_size: 20,
		weights: 5,
		player1: "Daniel",
		player2: "AI",
	}, options);

	var game = this;
	// all the necessary data structures/var to store info for the game
	this.board_weight = settings.board_weight;
	this.board_size = settings.board_size;
	this.weights = settings.weights;
	this.phase = 1;
	this.draggable_weights = [];
	this.blocks = []
	this.recycles = []
	// player 1 starts first
	this.turn_player = this.player1;
	// set up canvas attachment
	this.c = document.getElementById('interface');
	this.ctx = this.c.getContext('2d');
	mid_x = this.c.width/2;
	mid_y = this.c.height/2 + y_size;
	start_point = mid_x - (this.board_size/2) * x_size;
	end_point = mid_x + (this.board_size/2) * x_size;
};

TippingGame.prototype.setupGame = function() {
	'use strict';
	// ------------------------INITIALIZE BLOCKS---------------------------------
	var counter = -this.board_size/2;
	for (var i = start_point; i < end_point; i += x_size) {
		var b = new Block(i-(x_size/2), mid_y-50, x_size-1, y_size, counter);
		this.blocks.push(b);
		counter ++;
	}
	b = new Block(end_point-(x_size/2), mid_y-50, x_size-1, y_size, counter);
	this.blocks.push(b);
	// ------------------------INITIALIZE BLOCKS---------------------------------
	
	// ------------------------INITIALIZE WEIGHTS--------------------------------
	// player 1 weights
	var y = 30
	var weight = 1
	for (var i = 0; i < this.weights/5; i ++) {
		for (var j = start_point-x_size; j < start_point + 4*x_size; j += x_size) {
			if (weight <= this.weights) {
				var w = new Weight("player 1", weight, j, y);
				var index = this.draggable_weights.push(w)-1;
				this.draggable_weights[index].setIndex(index);
				weight ++;
			}
		}
		y += 25;
	}
	// player 2 weights
	y = 30;
	weight = 1;
	for (var i = 0; i < this.weights/5; i ++) {
		for (var j = end_point-x_size*4; j < end_point+x_size; j += x_size) {
			if (weight <= this.weights) {
				w = new Weight("player 2", weight, j, y);
				var index = this.draggable_weights.push(w)-1;
				this.draggable_weights[index].setIndex(index);
				weight ++;
			}
		}
		y += 25;
	}
	// initial green weight
	w = new Weight("player 0", 3, mid_x - 4 * x_size - 6, 195);
	this.draggable_weights.push(w);
	var index = this.draggable_weights.push(w)-1;
	this.draggable_weights[index].setIndex(index);
	// make sure that 3 is added to the block!!!
	for (var i = 0; i < this.blocks.length; i ++) {
		if (this.blocks[i].hitTest(w.x + 10, w.y)) {
			// console.log("this happend");
			this.blocks[i].insertWeight(w);
		}
	}
	// ------------------------INITIALIZE WEIGHTS--------------------------------

	// ------------------------INITIALIZE RECYCLES-------------------------------
	var recycle1 = new Recycle(start_point, mid_y + 90, 60, 60, 'player 1', this.ctx);
	var recycle2 = new Recycle(end_point - 2.5*x_size, mid_y + 90, 60, 60, 'player 2', this.ctx);
	this.recycles.push(recycle1);
	this.recycles.push(recycle2);
	// ------------------------INITIALIZE RECYCLES-------------------------------
	
	this.drawScreen();
};

TippingGame.prototype.drawScreen = function() {
	'use strict';
	var ctx = this.ctx;
	var i;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, this.c.width, this.c.height);

	// DRAW STATIC PORTION
	ctx.fillStyle = "#000000";
	ctx.fillRect(start_point-x_size, mid_y-25, x_size-1, y_size);
	ctx.fillRect(end_point, mid_y-25, x_size-1, y_size);
	var counter = -this.board_size/2;

	// draw the board
	for (i = start_point; i < end_point; i += x_size) {
		ctx.fillRect(i, mid_y-25, x_size-1, y_size);
		ctx.fillText(counter, i-5, mid_y+(y_size/2));
		counter ++;
	}
	ctx.fillText(counter, end_point-5, mid_y+(y_size/2));

	// draw the triangles
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(mid_x - 3 * x_size - 15, mid_y + (y_size/2) + 10)
	ctx.lineTo(mid_x - 3 * x_size + 15, mid_y + (y_size/2) + 10)
	ctx.lineTo(mid_x - 3 * x_size, mid_y)
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	ctx.moveTo(mid_x - 1 * x_size - 15, mid_y + (y_size/2) + 10)
	ctx.lineTo(mid_x - 1 * x_size + 15, mid_y + (y_size/2) + 10)
	ctx.lineTo(mid_x - 1 * x_size, mid_y)
	ctx.closePath();
	ctx.stroke();
	ctx.fill();	

	// highlight for possible drop
	for (i = 0; i < this.blocks.length; i ++) {
		if (this.blocks[i].hitTest(mouseX, mouseY)) {
			this.blocks[i].highlight();
		}
	}

	// DRAW DYNAMIC PORTION
	for (i = 0; i < this.recycles.length; i ++) {
		this.recycles[i].drawToContext(ctx);
	}
	for (i = 0; i < this.draggable_weights.length; i ++) {
		this.draggable_weights[i].drawToContext(ctx);
	}
	for (i = 0; i < this.blocks.length; i ++) {
		this.blocks[i].drawToContext(ctx);
	}
}
TippingGame.prototype.turn = function() {
	'use strict';
	if (!this.validMove()) {
		return false;
	}
	if (this.gameOver()) {
		this.switchPlayer();
		alert(this.turn_player + ' win.');
	} else {
		this.switchPlayer();
		if (this.bothWeightsEmpty() && this.phase == "adding") {
			this.phase = "removing";
		}
	}
}

// if the move is valid, the move will be made

TippingGame.prototype.gameOver = function() {
	'use strict';
}

TippingGame.prototype.switchPlayer = function() {
	'use strict';
	if (this.turn_player == this.player1) {
		this.turn_player = this.player2;
	} else {
		this.turn_player = this.player1;
	}
}

TippingGame.prototype.bothWeightsEmpty = function() {
	'use strict';
	for (i = 0; i < this.weights; i += 1) {
		if (this.player1_weights[i].isEmpty() || 
			this.player2_weights[i].isEmpty()) {
			return false;
		}
	}
	return true;
}

TippingGame.prototype.setSize = function() {
	'use strict';
	var min = 200,
		max = jQuery(window).width() - 100,
		size = jQuery(window).height() - 225;
	// Responsive details
	  if (jQuery(window).width() < 980) { size -= 10; }
	  // Restrict sizes to the extremes
	  if (size < min) { size = min; } else if (size > max) { size = max; }
	  // Resize the canvas
	  jQuery('figure').width(size + 60);
	  this.canvas.width = size;
	  this.canvas.height = size;
	  // Resize the player's captions
	  jQuery('#players').css({'width': size, 'height': size});
}