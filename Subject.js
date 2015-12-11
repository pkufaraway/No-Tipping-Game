function Player(name, weights, index, board_weight, phase) {
	this.name = name;
	this.weights = weights;  // used for phase 2 logic
	this.index = index;
	this.board_weight = board_weight;
	this.phase = phase;
}

Player.prototype.gameOver = function(blocks) {
	'use strict';
	var left_torque = 0;
	var right_torque = 0;
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].weight != null) {
			left_torque -= (blocks[i].index + 3) * blocks[i].weight.weight;
			right_torque -= (blocks[i].index + 1) * blocks[i].weight.weight;
		}
	}
	// add information about the board weight, now let's do 3
	left_torque -= 3 * this.board_weight;
	right_torque -= this.board_weight;
	if (left_torque > 0 || right_torque < 0) {
		return true;
	}
	return false;
}

// -------------------------USER-------------------------------------
function User(name, weights, index, board_weight, phase) {
	Player.call(this, name, weights, index, board_weight, phase);
	this.phase1_weights = weights;
}

User.prototype = Object.create(Player.prototype);

User.prototype.placeWeight = function(blocks, draggable_weights) {

}

User.prototype.removeWeight = function(blocks, recycles, draggable_weights) {

}
// -------------------------USER-------------------------------------

// -------------------------AI---------------------------------------
function AI(name, weights, index, board_weight, phase) {
	Player.call(this, name, weights, index, board_weight, phase);
	this.phase1_weights = weights;
}

AI.prototype = Object.create(Player.prototype);

AI.prototype.placeWeight = function(blocks, draggable_weights) {
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].weight == null) {
			for (var j = 0; j < draggable_weights.length; j ++) {
				if (draggable_weights[j].player == this.index && draggable_weights[j].draggable) {
					blocks[i].weight = draggable_weights[j];
					if (!this.gameOver(blocks)) {
						// select this weight
						draggable_weights[j].draggable = false;
						if (draggable_weights[j].weight / 10 < 1) {
							draggable_weights[j].x = blocks[i].x + 6.5;
							draggable_weights[j].y = blocks[i].y + 20;
						} else {
							draggable_weights[j].x = blocks[i].x;
							draggable_weights[j].y = blocks[i].y + 20;
						}
						return;
					} else {
						blocks[i].weight = null;
					}
				}
			}
		}
	}
	this.phase1_weights --;
	if (this.phase1_weights == 0) {
		this.phase = 1;
	}
}

AI.prototype.removeWeight = function(blocks, recycles, draggable_weights) {
	if (this.index == 0) {
			var losing_block = 0;
			for (var i = 0; i < blocks.length; i ++) {
				if(blocks[i].weight != null) {
					var temp = blocks[i].weight;
					losing_block = blocks[i];
					blocks[i].weight = null;
					if (!this.gameOver(blocks)) {
						// set it to the recycle
						temp.x = recycles[0].x;
						temp.y = recycles[0].y;
						return
					} else {
						blocks[i].weight = temp;
					}
				}
			}
			losing_block.weight.x = recycles[0].x;
			losing_block.weight.y = recycles[0].y;
			losing_block.weight = null;
	} else {
		var losing_block = 0;
		if (this.weights == 0) {
			for (var i = 0; i < blocks.length; i ++) {
				if(blocks[i].weight != null) {
					var temp = blocks[i].weight;
					losing_block = blocks[i];
					blocks[i].weight = null;
					if (!this.gameOver(blocks)) {
						// set it to the recycle
						temp.x = recycles[1].x;
						temp.y = recycles[1].y;
						return
					} else {
						blocks[i].weight = temp;
					}
				}
			}
		} else {
			this.weights --;
			for (var i = 0; i < blocks.length; i ++) {
				if(blocks[i].weight != null && blocks[i].weight.player == this.index) {
					var temp = blocks[i].weight;
					losing_block = blocks[i];
					blocks[i].weight = null;
					if (!this.gameOver(blocks)) {
						temp.x = recycles[1].x;
						temp.y = recycles[1].y;
						return 
					} else {
						blocks[i].weight = temp;
					}
				}
			}
		}
		losing_block.weight.x = recycles[1].x;
		losing_block.weight.y = recycles[1].y;
		losing_block.weight = null;
	}
}