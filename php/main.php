<?php
//ini_set('display_errors', 'On');
//ini_set('display_startup_errors', true);
//error_reporting(E_ALL);
include "GameController.php";
include "Board.php";
$myController = new GameController("localhost",50000);
$myGame = new Board(25,15,3);
$myController->createConnection();

while(!$myGame->gameOver){
    $myController->send($myGame->currentTurn, $myGame->generateSendingString());
    $time1 = microtime();
    $move = $myController->recv($myGame->currentTurn);
    $time2 = microtime();
    $myGame->updateTime($myGame->currentTurn, $time2 - $time1);
    $myMove = explode(" ", $move);
    if($myGame->currentState == "place") {
        $myGame->move($myMove[0], $myMove[1]);
    }
    else {
        $myGame->remove($myMove[0]);
    }
}
$myController->send(1, $myGame->generateSendingString());
$myController->send(2, $myGame->generateSendingString());
$myController->closeConnection();
