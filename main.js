var game;
jQuery(document).ready(function () {
	'use strict';
	game = new TippingGame();
	game.setupGame();
	game.doTurn();
})
