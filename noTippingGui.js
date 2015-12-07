'use strict';
var easeAmount = 1;
// configure the board
var weights = 10;
var numShapes = 10;
var size = 20;
var c = document.getElementById("myCanvas");
c.addEventListener("mousedown", mouseDownListener, false);
var ctx = c.getContext("2d");
var x_size = 25;
var y_size = 25;
var mid_x = c.width/2;
var mid_y = c.height/2 + y_size;
var start_point = mid_x - (size/2) * x_size;
var end_point = mid_x + (size/2) * x_size;
var blocks = [];
var draggable_weights = [];
var mouseX = 0;
var mouseY = 0;
var dragging, dragIndex, dragHoldX,dragHoldY, targetX, targetY, timer;
// initialize blocks and weights
initializeBlocks();
initializeWeights();
drawScreen();

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
	for (i = 0; i < draggable_weights.length; i ++) {
		if (draggable_weights[i].hitTest(mouseX, mouseY)) {
			dragging = true;
			dragIndex = i;
		}
	}
	// for (i = 0; i < blocks.length; i ++) {
	// 	if (blocks[i].hitTest(mouseX, mouseY)) {
	// 		blocks[i].highlight();
	// 	}
	// }
	// add drag functionality
	if (dragging) {
		console.log("this is dragging");
		window.addEventListener("mousemove", mouseMoveListener, false);
		dragHoldX = mouseX - draggable_weights[dragIndex].x;
		dragHoldY = mouseY - draggable_weights[dragIndex].y;
		targetX = mouseX - dragHoldX;
		targetY = mouseY - dragHoldY;
		timer = setInterval(onTimerTick, 1000/30);
	}
	c.removeEventListener("mousedown", mouseDownListener, false);
	window.addEventListener("mouseup", mouseUpListener, false);
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
	window.removeEventListener("mouseup", mouseUpListener, false);
	if (dragging) {
		dragging = false;
		window.removeEventListener("mousemove", mouseMoveListener, false);
	}
	// check to see if the position dropped is valid
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].hitTest(mouseX, mouseY)) {
			console.log(draggable_weights[dragIndex].weight/10);
			if (draggable_weights[dragIndex].weight / 10 < 1) {
				draggable_weights[dragIndex].x = blocks[i].x + 6.5;
				draggable_weights[dragIndex].y = blocks[i].y + 20;
			} else {
				draggable_weights[dragIndex].x = blocks[i].x;
				draggable_weights[dragIndex].y = blocks[i].y + 20;
			}
			blocks[i].insertWeight(draggable_weights[dragIndex]);
			return;
		}
	}
	draggable_weights[dragIndex].x = draggable_weights[dragIndex].originalX;
	draggable_weights[dragIndex].y = draggable_weights[dragIndex].originalY;
}

function mouseMoveListener(evt) {
	console.log(dragIndex)
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
		console.log(draggable_weights[dragIndex].x);
		console.log(draggable_weights[dragIndex].y);
		clearInterval(timer);
	} else {
		draggable_weights[dragIndex].x = draggable_weights[dragIndex].x + easeAmount * (targetX - draggable_weights[dragIndex].x);
		draggable_weights[dragIndex].y = draggable_weights[dragIndex].y + easeAmount * (targetY - draggable_weights[dragIndex].y);
	}
	drawScreen();
}
function initializeBlocks() {
	var counter = -size/2;
	for (var i = start_point; i < end_point; i += x_size) {
		var b = new Block(i-(x_size/2), mid_y-50, x_size-1, y_size, counter);
		blocks.push(b);
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
				draggable_weights.push(w);
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
				draggable_weights.push(w);
				weight ++;
			}
		}
		y += 25;
	}

	// draw the initial green weight on plank
	w = new Weight("player 0", 3, mid_x - 4 * x_size - 6, 195);
	draggable_weights.push(w);
	// make sure that 3 is added to the block!!!
	for (var i = 0; i < blocks.length; i ++) {
		if (blocks[i].hitTest(w.x + 10, w.y)) {
			console.log("this happend");
			blocks[i].insertWeight(w);
		}
	}
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