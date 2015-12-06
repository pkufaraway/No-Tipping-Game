function TippingGame(options) {
	'use strict';
	var settings = jQuery.extend(true, 
	{
		board_size: 16,
		weights: 5,
		player1: "player 1",
		player2: "player 2",
		support1: -3,
		support2: -1,
		initial_block: 3,
		intial_position: -4

	}, options);

	game = this;
	this.board_size = settings.board_size;
	this.weights = settings.weights;
	this.phase = "adding";
	this.player1 = settings.player1;
	this.player2 = settings.player2;
	this.player1_weights = [];
	this.player2_weights = [];
	// player 1 starts first
	this.turn_player = this.player1;

	// add the weights to each player
	for (i = 1; i <= this.weights; i += 1) {
		// add player 1
		player1_block = new Block(i);
		player1_block.insertWeight(new Weight(this.player1, i));
		this.player1_weights.push(player1_block);
		// add player 2
		player2_block = new Block(i);
		player2_block.insertWeight(new Weight(this.player2, i));
		this.player2_weights.push(player2_block);
	}

	// add board
	this.board = [] 
	for (i = 0; i < this.board_size; i += 1) {
		this.board.push(new Block(i-(this.board_size/2)));
	}
	this.canvas = document.getElementById('interface');
	this.ctx = this.canvas.getContext('2d');
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