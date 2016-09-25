<?php
include 'Player.php';
class Board{
    private $player;
    private $maxWeight;
    public $boardState;
    private $boardLength;
    public $currentState;
    public $currentTurn;
    private $boardWeight;
    private $currentPut;
    public $gameOver;

    public function isGameOver(){
        $leftTorque = 0;
        $rightTorque = 0;
        for ($i = -$this->boardLength; $i <= $this->boardLength; $i++) {
            $leftTorque += ($i + 3) * $this->boardState[$i];
            $rightTorque += ($i + 1) * $this->boardState[$i];
        }
	    // add information about the board weight, now let's do 3
        $leftTorque += 3 * $this->boardWeight;
	    $rightTorque += 1 * $this->boardWeight;
        return $leftTorque < 0 || $rightTorque >0;
    }

    function generateSendingString(){
        if($this->currentState == "place"){
            $s = "1";
        }
        else{
            $s = "2";
        }

        for($i = -$this->boardLength; $i <= $this->boardLength; $i++){
            $s = $s." ".$this->boardState[$i];
        }

        if($this->gameOver){
            $s = $s." 1";
        }
        else {
            $s = $s . " 0";
        }
	echo "Current Board:".substr($s, 1 , -1)."\n";
        return $s;
    }

    public function setGameOver($gameOverReason){
        $this->gameOver = true;
        if($this -> currentTurn == 1){
            echo "Player 2 wins \n";
            echo $gameOverReason;
        }
        else{
            echo "Player 1 wins \n";
            echo $gameOverReason;
        }
    }

    public function move($weight, $position){
        if($position < -$this->boardLength || $position > $this->boardLength || $this->boardState[$position] != 0){
            $this->setGameOver("Wrong position from player $this->currentTurn\n");
        }
        else if(!$this->player[$this->currentTurn]->WeightState[$weight]){
            $this->setGameOver("Wrong weight from player $this->currentTurn\n");

        }
        else{
            $this->boardState[$position] = $weight;
            $this->player[$this->currentTurn]->WeightState[$weight] = false;
            if($this->isGameOver()){
                $this->setGameOver("Tipping by player $this->currentTurn\n");
            }
            else {
                echo "Player $this->currentTurn put $weight on $position, still balance\n";
                $this->currentPut++;
                if($this->currentPut == $this->boardLength * 2 + 1 || $this->currentPut == 2 * $this->maxWeight){
                    $this->currentState = "remove";
                    echo "It's remove stage now\n";
                }
                $this->currentTurn = 3 - $this->currentTurn;
            }
        }
    }

    public function remove($position){
        if($position < -$this->boardLength || $position > $this->boardLength || $this->boardState[$position] == 0){
            $this->setGameOver("Wrong position from player $this->currentTurn\n");
        }

        else{
            $weight = $this->boardState[$position];
            $this->boardState[$position] = 0;
            if($this->isGameOver()){
                $this->setGameOver("Tipping by player $this->currentTurn\n");
            }
            else {
                echo "Player $this->currentTurn remove $weight on $position, still balance\n";
                $this->currentTurn = 3 - $this->currentTurn;
            }
        }
    }

    public function updateTime($turn, $time){
        $this->player[$turn]->timeLeft -= ($time * 1e-6);
        echo "Player ".$turn." has ".$this->player[$turn]->timeLeft."s left\n";
    }

    function __construct($boardLength, $numberOfWeight, $boardWeight){
        if($boardLength <= 3 || $numberOfWeight <=0){
            throw new Exception("Not proper initialization parameter $boardLength $numberOfWeight");
        }
        $this->gameOver = false;
        $this->currentPut = 0;
        $this->currentState = "place";
        $this->currentTurn = 1;
        $this->boardWeight = $boardWeight;
        $this->maxWeight = $numberOfWeight;
        $this->boardLength = $boardLength;
        for($i = -$this->boardLength; $i <= $this->boardLength; $i++){
            $this->boardState[$i] = 0;
        }
        $this->player[1] = new Player($numberOfWeight);
        $this->player[2] = new Player($numberOfWeight);
        $this->boardState[-4] = 3;

    }
}
