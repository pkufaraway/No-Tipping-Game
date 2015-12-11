'use strict';
// configure the board
var board_weight = 3;
var weights = 5;
var size = 20;
var player1 = 'Daniel';
var player2 = 'AI';
var blocks = [];
var draggable_weights = [];
var recycles = [];
var phase = 1;
var c = document.getElementById("interface");
// c.addEventListener("mousedown", mouseDownListener, false);
jQuery(c).mousedown(function (event) {
	mouseDownListener(event);
});
var ctx = c.getContext("2d");


var x_size = 25;
var y_size = 25;
var mid_x = c.width/2;
var mid_y = c.height/2 + y_size;
var start_point = mid_x - (size/2) * x_size;
var end_point = mid_x + (size/2) * x_size;
var mouseX = 0;
var mouseY = 0;
var dragging, dragIndex, blockIndex, dragHoldX,dragHoldY, targetX, targetY, timer;
// start working on phase 2
var phase1_countdown = weights * 2;
var phase2_countdown = weights;
// initialize blocks and weights
initializeBlocks();
initializeWeights();
initializeRecycle();
drawScreen();

// player logics
var turn = 'player 1'

function mouseDownListener(evt) {
	var i;
	dragging = false;
	// get mouse positions mouseX, mouseY
	// var bRect = c.getBoundingClientRect();
	// mouseX = (evt.clientX - bRect.left)*(c.width/bRect.width);
	// mouseY = (evt.clientY - bRect.top)*(c.height/bRect.height);
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	// see if weight or block are touched
	if (phase == 1) {
		for (i = 0; i < draggable_weights.length; i ++) {
			if (draggable_weights[i].hitTest(mouseX, mouseY)) {
				if (turn == draggable_weights[i].player
					&& draggable_weights[i].draggable) {
					dragging = true;
					dragIndex = i;
				} else {
					dragIndex = -1;
				}
			}
		}
	} else {
		for (i = 0; i < blocks.length; i ++) {
			if (blocks[i].hitTest(mouseX, mouseY) && blocks[i].weight != null) {
				console.log('hit');
				if (turn == 'player 1') {
					console.log('hit player 1');
					dragging = true;
					blockIndex = i;
					console.log(blocks[i].weight.index);
					dragIndex = blocks[i].weight.index;
					console.log(dragIndex);
				} else {
					console.log('does this happen');
					if (phase2_countdown == 0) {
						console.log('count down = 0');
						dragging = true;
						blockIndex = i;
						dragIndex = blocks[i].weight.index;
					} else if (blocks[i].weight.player == turn) {
						console.log('same player');
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
		console.log(dragIndex);
	}
	// also remember the block
	// for (i = 0; i < blocks.length; i ++) {
	// 	if (blocks[i].hitTest(mouseX, mouseY)) {
	// 		blocks[i].highlight();
	// 	}
	// }
	// 
	// test recycle
	// add drag functionality
	if (dragging) {
		// console.log("this is dragging");
		c.addEventListener("mousemove", mouseMoveListener, false);
		dragHoldX = mouseX - draggable_weights[dragIndex].x;
		dragHoldY = mouseY - draggable_weights[dragIndex].y;
		targetX = mouseX - dragHoldX;
		targetY = mouseY - dragHoldY;
		timer = setInterval(onTimerTick, 1000/30);
	}
	c.removeEventListener("mousedown", mouseDownListener, false);
	c.addEventListener("mouseup", mouseUpListener, false);
	if (evt.preventDefault) {
		evt.preventDefault();
	} //standard
	else if (evt.returnValue) {
		evt.returnValue = false;
	} //older IE
	return false;
}

function mouseUpListener(evt) {
	c.addEventListener("mousedown", mouseDownListener, false);
	c.removeEventListener("mouseup", mouseUpListener, false);
	if (dragging) {
		dragging = false;
		c.removeEventListener("mousemove", mouseMoveListener, false);
	}
	// check to see if the position dropped is valid
	if (phase == 1) {
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
				phase1_countdown --;
				draggable_weights[dragIndex].draggable = false;
				if (turn == 'player 1') {
					turn = 'player 2';
				} else {
					turn = 'player 1';
				}
				if (game_over()) {
					alert(turn + ' wins');
				}
				if (phase1_countdown == 0) {
					// alert('phase 2 baby');
					phase = 2;
					for (var i = 0; i < blocks.length; i ++) {
						if (blocks[i].weight != null) {
							blocks[i].weight.draggable = true;
							blocks[i].weight.originalX = blocks[i].weight.x;
							blocks[i].weight.originalY = blocks[i].weight.y;
						}
					}
				}
				if (turn == 'player 1') {
					if (player1 == 'AI' && !game_over()) {
						makeAIMove(phase, 'player 1');
						turn = 'player 2';
					} 
				} else {
					if (player2 == 'AI' && !game_over()) {
						makeAIMove(phase, 'player 2');
						turn = 'player 1';
					}
				}
				if (phase1_countdown == 0) {
					// alert('phase 2 baby');
					phase = 2;
					for (var i = 0; i < blocks.length; i ++) {
						if (blocks[i].weight != null) {
							blocks[i].weight.draggable = true;
							blocks[i].weight.originalX = blocks[i].weight.x;
							blocks[i].weight.originalY = blocks[i].weight.y;
						}
					}
				}
				return;
			}
		}
		if (draggable_weights[dragIndex].draggable) {
			draggable_weights[dragIndex].x = draggable_weights[dragIndex].originalX;
			draggable_weights[dragIndex].y = draggable_weights[dragIndex].originalY;
		}
	} else {
		// phase 2;
		for (var i = 0; i < recycles.length; i ++) {
			if (recycles[i].hitTest(mouseX, mouseY) && recycles[i].player == turn) {
				draggable_weights[dragIndex].x = recycles[i].x;
				draggable_weights[dragIndex].y = recycles[i].y;
				blocks[blockIndex].weight = null;
				if (draggable_weights[dragIndex].player == 'player 2') {
					phase2_countdown --;
				}
				draggable_weights[dragIndex].draggable = false;
				if (turn == 'player 1') {
					turn = 'player 2';
				} else {
					turn = 'player 1';
				}
				if (game_over()) {
					alert(turn + ' wins');
				}
				if (turn == 'player 1') {
					if (player1 == 'AI' && !game_over()) {
						makeAIMove(phase, 'player 1');
						turn = 'player 2';
					} 
				} else {
					if (player2 == 'AI' && !game_over()) {
						makeAIMove(phase, 'player 2');
						turn = 'player 1';
					}
				}
				console.log('did we complete this');
				return;
			}
		}
		if (draggable_weights[dragIndex].draggable) {
			draggable_weights[dragIndex].x = draggable_weights[dragIndex].originalX;
			draggable_weights[dragIndex].y = draggable_weights[dragIndex].originalY;
		}
	}
}

function makeAIMove(phase, player) {
	if (phase == 1) {
		phase1_countdown --;
		for (var i = 0; i < blocks.length; i ++) {
			if (blocks[i].weight == null) {
				for (var j = 0; j < draggable_weights.length; j ++) {
					if (draggable_weights[j].player == player && draggable_weights[j].draggable) {
						blocks[i].weight = draggable_weights[j];
						if (!game_over()) {
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
	} else {
		if (player == 'player 1') {
			var losing_block = 0;
			for (var i = 0; i < blocks.length; i ++) {
				if(blocks[i].weight != null) {
					var temp = blocks[i].weight;
					losing_block = blocks[i];
					blocks[i].weight = null;
					if (!game_over()) {
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
			if (phase2_countdown == 0) {
				for (var i = 0; i < blocks.length; i ++) {
					if(blocks[i].weight != null) {
						var temp = blocks[i].weight;
						losing_block = blocks[i];
						blocks[i].weight = null;
						if (!game_over()) {
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
				phase2_countdown --;
				for (var i = 0; i < blocks.length; i ++) {
					if(blocks[i].weight != null && blocks[i].weight.player == player) {
						var temp = blocks[i].weight;
						losing_block = blocks[i];
						blocks[i].weight = null;
						if (!game_over()) {
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
}

function mouseMoveListener(evt) {
	// console.log(dragIndex)
	var posX;
	var posY;
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	posX = mouseX - dragHoldX;
	posY = mouseY - dragHoldY;
	targetX = posX;
	targetY = posY;
}

function onTimerTick() {
	if ((!dragging)) {
		// console.log(draggable_weights[dragIndex].x);
		// console.log(draggable_weights[dragIndex].y);
		mouseX = 0;
		mouseY = 0;
		clearInterval(timer);
	} else {
		draggable_weights[dragIndex].x = draggable_weights[dragIndex].x + 1 * (targetX - draggable_weights[dragIndex].x);
		draggable_weights[dragIndex].y = draggable_weights[dragIndex].y + 1 * (targetY - draggable_weights[dragIndex].y);
	}
	drawScreen();
	if (game_over()) {
		alert(turn + ' wins');
	}
}
function initializeBlocks() {
	var counter = -size/2;
	for (var i = start_point; i < end_point; i += x_size) {
		var b = new Block(i-(x_size/2), mid_y-50, x_size-1, y_size, counter);
		blocks.push(b);
		counter ++;
	}
	b = new Block(end_point-(x_size/2), mid_y-50, x_size-1, y_size, counter);
	blocks.push(b);
}

function initializeWeights() {
	var y = 30
	var weight = 1
	for (var i = 0; i < weights/5; i ++) {
		for (var j = start_point-x_size; j < start_point + 4*x_size; j += x_size) {
			if (weight <= weights) {
				var w = new Weight("player 1", weight, j, y);
				var index = draggable_weights.push(w)-1;
				draggable_weights[index].setIndex(index);
				weight ++;
			}
		}
		y += 25;
	}

	// draw the weights for player2
	y = 30;
	weight = 1;
	for (var i = 0; i < weights/5; i ++) {
		for (var j = end_point-x_size*4; j < end_point+x_size; j += x_size) {
			if (weight <= weights) {
				w = new Weight("player 2", weight, j, y);
				var index = draggable_weights.push(w)-1;
				draggable_weights[index].setIndex(index);
				weight ++;
			}
		}
		y += 25;
	}

	// draw the initial green weight on plank
	w = new Weight("player 0", 3, mid_x - 4 * x_size - 6, 195);
	draggable_weights.push(w);
	var index = draggable_weights.push(w)-1;
	draggable_weights[index].setIndex(index);
	// make sure that 3 is added to the block!!!
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].hitTest(w.x + 10, w.y)) {
			// console.log("this happend");
			blocks[i].insertWeight(w);
		}
	}
}

function initializeRecycle() {
	var recycle1 = new Recycle(start_point, mid_y + 90, 60, 60, 'player 1', ctx);
	var recycle2 = new Recycle(end_point - 2.5*x_size, mid_y + 90, 60, 60, 'player 2', ctx);
	recycles.push(recycle1);
	recycles.push(recycle2);
}
function drawStatic() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(start_point-x_size, mid_y-25, x_size-1, y_size);
	ctx.fillRect(end_point, mid_y-25, x_size-1, y_size);
	var counter = -size/2;
	// draw the board
	for (var i = start_point; i < end_point; i += x_size) {
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
}

function updateShapes() {
	var i;
	for (i = 0; i < recycles.length; i ++) {
		recycles[i].drawToContext(ctx);
	}
	for (i = 0; i < draggable_weights.length; i ++) {
		draggable_weights[i].drawToContext(ctx);
	}
	for (i = 0; i < blocks.length; i ++) {
		blocks[i].drawToContext(ctx);
	}
}

function drawScreen() {
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,c.width,c.height);
	drawStatic();
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].hitTest(mouseX, mouseY)) {
			blocks[i].highlight();
		}
	}
	updateShapes();
}

function game_over() {
	var left_torque = 0;
	var right_torque = 0;
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].weight != null) {
			console.log(blocks[i].index);
			console.log(blocks[i].weight.weight);
			left_torque -= (blocks[i].index + 3) * blocks[i].weight.weight;
			right_torque -= (blocks[i].index + 1) * blocks[i].weight.weight;
		}
	}
	// add information about the board weight, now let's do 3
	left_torque -= 3 * board_weight;
	right_torque -= board_weight;
	console.log(left_torque);
	console.log(right_torque);
	if (left_torque > 0 || right_torque < 0) {
		return true;
	}
	return false;
}