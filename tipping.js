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
		player1: "",
		player2: "",
	}, options);

	var game = this;
	// all the necessary data structures/var to store info for the game
	this.settings = settings;
	this.board_weight = settings.board_weight;
	this.board_size = settings.board_size;
	this.weights = settings.weights;
	this.phase = 1;
	this.draggable_weights = [];
	this.blocks = [];
	this.recycles = [];
	this.players = [];
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
	// ------------------------INITIALIZE PLAYERS--------------------------------
	if (this.settings.player1 == "") {
		// this is an AI
		this.players.push(new AI("AI_1", this.weights, 0, this.board_weight, 0));
	} else {
		this.players.push(new User(this.settings.player1, this.weights, 0, this.board_weight, 0));
	}
	if (this.settings.player2 == "") {
		// this is an AI
		this.players.push(new AI("AI_2", this.weights, 1, this.board_weight, 0));
	} else {
		this.players.push(new User(this.settings.player2, this.weights, 1, this.board_weight, 0));
	}
	// ------------------------INITIALIZE PLAYERS--------------------------------
	
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
				var w = new Weight(this.players[0].index, weight, j, y);
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
				w = new Weight(this.players[1].index, weight, j, y);
				var index = this.draggable_weights.push(w)-1;
				this.draggable_weights[index].setIndex(index);
				weight ++;
			}
		}
		y += 25;
	}
	// initial green weight
	w = new Weight(2, 3, mid_x - 4 * x_size - 6, 195);
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
	var recycle1 = new Recycle(start_point, mid_y + 90, 60, 60, this.players[0].name, this.ctx);
	var recycle2 = new Recycle(end_point - 2.5*x_size, mid_y + 90, 60, 60, this.players[1].name, this.ctx);
	this.recycles.push(recycle1);
	this.recycles.push(recycle2);
	// ------------------------INITIALIZE RECYCLES-------------------------------
	
	this.drawScreen();
};

TippingGame.prototype.startGame = function() {
	'use strict';
	// let player 1 start first
	var count = 0;
	var index = 0;
	var current_player = this.players[index];
	while (!current_player.gameOver(this.blocks)) {
		if (current_player.phase == 0) {
			current_player.placeWeight(this.blocks, this.draggable_weights);
		} else {
			console.log("does this happen");
			current_player.removeWeight(this.blocks, this.recycles, this.draggable_weights);
		}
		index = (index + 1) % 2;
		current_player = this.players[index];
		this.drawScreen();
	}
	alert(current_player.name + ' wins');
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