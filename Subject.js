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
	console.log("placeWeight yo");
	jQuery(game.c).mousedown(function(event) {
		// console.log(this);
		// console.log("Mouse donw")
		var i;
		dragging = false;
		mouseX = event.clientX;
		mouseY = event.clientY;
		// see if any draggable weight is touched
		for (i = 0; i < draggable_weights.length; i ++) {
			if (draggable_weights[i].hitTest(mouseX, mouseY)) {
				if (this.index == draggable_weights[i].player
					&& draggable_weights[i].draggable) {
					dragging = true;
					dragIndex = i;
				} else {
					dragIndex = -1;
				}
			}
		}
		// get the dragging motion here
		if (dragging) {
			jQuery(game.c).mousemove(function(event) {
				var posX;
				var posY;
				mouseX = event.clientX;
				mouseY = event.clientY;
				posX = mouseX - dragHoldX;
				posY = mouseY - dragHoldY;
				targetX = posX;
				targetY = posY;
			}.bind(this));
			dragHoldX = mouseX - draggable_weights[dragIndex].x;
			dragHoldY = mouseY - draggable_weights[dragIndex].y;
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			timer = setInterval(game.onTimerTick, 1000/30);
		}
		jQuery(game.c).unbind("mousedown");
		jQuery(game.c).mouseup(function(event) {
			jQuery(game.c).unbind("mouseup");
			if (dragging) {
				dragging = false;
				jQuery(game.c).unbind("mousemove");
			}
			for (var i = 0; i < blocks.length; i ++) {
				if (blocks[i].hitTest(mouseX, mouseY) && blocks[i].weight == null) {
					// console.log(draggable_weights[dragIndex].weight/10);
					if (draggable_weights[dragIndex].weight / 10 < 1) {
						draggable_weights[dragIndex].x = blocks[i].x + 6.5;
						draggable_weights[dragIndex].y = blocks[i].y + 20;
					} else {
						draggable_weights[dragIndex].x = blocks[i].x;
						draggable_weights[dragIndex].y = blocks[i].y + 20;
					}
					blocks[i].insertWeight(draggable_weights[dragIndex]);
					draggable_weights[dragIndex].draggable = false;
					this.phase1_weights --;
					if (this.phase1_weights == 0) {
						if (this.index == 1) {
							// if we are player 2, then there's no more blocks to move
							// on to the board, so we reset
							for (var i = 0; i < blocks.length; i ++) {
								if (blocks[i].weight != null) {
									blocks[i].weight.draggable = true;
									blocks[i].weight.originalX = blocks[i].weight.x;
									blocks[i].weight.originalY = blocks[i].weight.y;
								}
							}
						}
						this.phase = 1;
					}
					game.turn = (game.turn + 1) % 2;
					jQuery(game.c).unbind();
					game.doTurn();
				}
			}
			if (!dragIndex || dragIndex == -1) {
				jQuery(game.c).unbind();
				this.placeWeight(blocks, draggable_weights);
			}
			else(draggable_weights[dragIndex].draggable) {
				draggable_weights[dragIndex].x = draggable_weights[dragIndex].originalX;
				draggable_weights[dragIndex].y = draggable_weights[dragIndex].originalY;
				jQuery(game.c).unbind();
				this.placeWeight(blocks, draggable_weights);
			}
		}.bind(this));
		if (event.preventDefault) {
			event.preventDefault();
		} //standard
		else if (event.returnValue) {
			event.returnValue = false;
		} //older IE
	}.bind(this));
}

User.prototype.removeWeight = function(blocks, recycles, draggable_weights) {
	console.log("removeWeight yo");
	jQuery(game.c).mousedown(function(event) {
		var draggable_weights = game.draggable_weights;
		// console.log(this);
		// console.log(draggable_weights)
		var i;
		dragging = false;
		mouseX = event.clientX;
		mouseY = event.clientY;
		// see if any draggable weight is touched
		for (i = 0; i < blocks.length; i ++) {
			// console.log(blocks[i].hitTest(mouseX, mouseY));
			if (blocks[i].hitTest(mouseX, mouseY) && blocks[i].weight != null) {
				if (this.index == 0) {
					// console.log("true that");
					dragging = true;
					blockIndex = i;
					dragIndex = blocks[i].weight.index;
				} else {
					if (this.weights == 0) {
						dragging = true;
						blockIndex = i;
						dragIndex = blocks[i].weight.index;
					} else if (blocks[i].weight.player == turn) {
						dragging = true;
						blockIndex = i;
						dragIndex = blocks[i].weight.index;
					} else {
						blockIndex = -1;
						dragIndex = -1;
					}
				}
			}
		}
		// get the dragging motion here
		if (dragging) {
			jQuery(game.c).mousemove(function(event) {
				var posX;
				var posY;
				mouseX = event.clientX;
				mouseY = event.clientY;
				posX = mouseX - dragHoldX;
				posY = mouseY - dragHoldY;
				targetX = posX;
				targetY = posY;
			}.bind(this));
			dragHoldX = mouseX - draggable_weights[dragIndex].x;
			dragHoldY = mouseY - draggable_weights[dragIndex].y;
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			timer = setInterval(game.onTimerTick, 1000/30);
		}
		jQuery(game.c).unbind("mousedown");
		jQuery(game.c).mouseup(function(event) {
			jQuery(game.c).unbind("mouseup");
			if (dragging) {
				dragging = false;
				jQuery(game.c).unbind("mousemove");
			}

			for (var i = 0; i < recycles.length; i ++) {
				// console.log(mouseX);
				// console.log(mouseY);
				// console.log(recycles[i].x);
				// console.log(recycles[i].y);
				// console.log(recycles[i].hitTest(mouseX, mouseY));
				// console.log(recycles[i].player == this.index);
				if (recycles[i].hitTest(mouseX, mouseY) && recycles[i].player == this.index) {
					draggable_weights[dragIndex].x = recycles[i].x;
					draggable_weights[dragIndex].y = recycles[i].y;
					blocks[blockIndex].weight = null;
					if (draggable_weights[dragIndex].player == 1) {
						game.players[1].weights--;
					}
					draggable_weights[dragIndex].draggable = false;
					game.turn = (game.turn + 1) % 2;
					jQuery(game.c).unbind();
					game.doTurn();
				}
			}
			if (!dragIndex || dragIndex == -1) {
				this.removeWeight(blocks, draggable_weights);
			}
			if (draggable_weights[dragIndex].draggable) {
				draggable_weights[dragIndex].x = draggable_weights[dragIndex].originalX;
				draggable_weights[dragIndex].y = draggable_weights[dragIndex].originalY;
				jQuery(game.c).unbind();
				this.removeWeight(blocks, recycles, draggable_weights);
			}
		}.bind(this));
		if (event.preventDefault) {
			event.preventDefault();
		} //standard
		else if (event.returnValue) {
			event.returnValue = false;
		} //older IE
	}.bind(this));
}
// -------------------------USER-------------------------------------

// -------------------------AI---------------------------------------
function AI(name, weights, index, board_weight, phase) {
	Player.call(this, name, weights, index, board_weight, phase);
	this.phase1_weights = weights;
}

AI.prototype = Object.create(Player.prototype);

AI.prototype.placeWeight = function(blocks, draggable_weights) {
	outer_loop:
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
						break outer_loop;
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
		if (this.index == 1) {
			// if we are player 2, then there's no more blocks to move
			// on to the board, so we reset
			for (var i = 0; i < blocks.length; i ++) {
				if (blocks[i].weight != null) {
					blocks[i].weight.draggable = true;
					blocks[i].weight.originalX = blocks[i].weight.x;
					blocks[i].weight.originalY = blocks[i].weight.y;
				}
			}
		}
		this.phase = 1;
	}
	game.turn = (game.turn + 1) % 2;
	game.doTurn();
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
						blocks[i].weight = temp;
						break;
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
						blocks[i].weight = temp;
						break;
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
						blocks[i].weight = temp;
						break;
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
	game.turn = (game.turn + 1) % 2;
	game.doTurn();
}