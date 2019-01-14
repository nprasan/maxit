var gridHeight = 5;
var gridWidth = 5;
var points = [ 
	[0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0]
];

var player1 = {
	id: 1,
	name: "Player 1",
	icon: "far",
	row: 0,
	col: 0,
	score: 0,
	moves: 0
};

var player2 = {
	id: 2,
	name: "Player 2",
	icon: "fas",
	row: 0,
	col: 0,
	score: 0,
	moves: 0
};

var activePlayer;

function initializeGame() {
	
	// Initialize Game View
	$('#game').css('opacity', 1);
	if($('#status').hasClass('alert-warning'))
		$('#status').removeClass('alert-warning');
	$('#status').html('<span><strong>Current Turn : &nbsp<span id="player"></span></strong><br></span>');
	$('#score1').html('0');
	$('#score2').html('0');
	
	// Add click handlers
	$('button[id^="grid"]').click(function(event) {
		var buttonName = event.target.id;
		var buttonId = parseInt(buttonName.substring(4));
		checkMove(Math.floor(buttonId/10), buttonId%10); 
	});

	// Initialize Grid with random points ranging from 1 to 5
	var i, j;
	for(i = 1; i <= gridHeight; i++) {
		for(j = 1; j <= gridWidth; j++) {
			var randomPoint = Math.floor(Math.random()*5 + 1);
			points[i-1][j-1] = randomPoint;
			restoreGrid(i, j);
		}
	}
	
	// Initialize Player 1 in random position
	player1.score = 0;
	player1.moves = 0;
	player1.row = Math.floor(Math.random()*5 + 1);
	player1.col = Math.floor(Math.random()*5 + 1);
	setPlayerPosition(player1);
	
	// Initialize Player 2 in random position
	player2.score = 0;
	player2.moves = 0;
	do {
		player2.row = Math.floor(Math.random()*5 + 1);
		player2.col = Math.floor(Math.random()*5 + 1);
	}
	while(checkOccupied(player1, player2));	// Ensure P1 & P2 are not in same position
	setPlayerPosition(player2);
	
	setTurn(player1);
}

function checkOccupied(p1, p2) {
	if(p1.row == p2.row && p1.col == p2.col)
		return true;
	else
		return false;
}

// Sets the message indicating player turn and moves left
function setTurn(player) {
	$('#player').html('<i class="'+ player.icon + ' fa-user"></i> ' + player.name + ' - ' + (5-player.moves) + ' move(s) left');
	if(player.id == '1') {
		$('#status').removeClass('alert-danger');
		$('#status').addClass('alert-success');
	} 
	if(player.id == '2') {
		$('#status').removeClass('alert-success');
		$('#status').addClass('alert-danger');
	}
	activePlayer = player;
}

// Sets the players position on the grid
function setPlayerPosition(player) {
	var pos = $("#grid"+ player.row.toString() + player.col.toString());
	pos.html("<i class='"+ player.icon + " fa-user' id='play0" + player.id + "'></i>");
	pos.removeClass('btn-primary');
	if(player.id == '1') {
		pos.addClass('btn-success');
	}
	if(player.id == '2') {
		pos.addClass('btn-danger');
	}
}

// Restore the points value on the grid when player moves away
function restoreGrid(row, col) {
	var pos = $("#grid"+ row.toString() + col.toString());
	pos.html(points[row-1][col-1]);
	if(pos.hasClass('btn-success')) {
		pos.removeClass('btn-success');
	}
	if(pos.hasClass('btn-danger')) {
		pos.removeClass('btn-danger');
	}
	pos.addClass('btn-primary');
}

// Perform the player move
function doMove(row, col) {
	activePlayer.score += points[row-1][col-1];
	points[row-1][col-1] = 0;
	$("#score" + activePlayer.id.toString()).html(activePlayer.score);
	restoreGrid(activePlayer.row, activePlayer.col);
	
	activePlayer.row = row;
	activePlayer.col = col;
	setPlayerPosition(activePlayer);
	
	activePlayer.moves += 1;
	if(activePlayer.id == 2){
		if(activePlayer.moves == 5) {
			endGame();
		} else {
			activePlayer = player1;
			setTurn(activePlayer);
		}
	} else {
		activePlayer = player2;
		setTurn(activePlayer);
	}
	
}

// Checks if a move to (row, col) is valid
function checkMove(row, col) {
	if(row == 0){
		displayError();
	} else {
		if(Math.abs(activePlayer.row - row) <= 1 && Math.abs(activePlayer.col - col) <= 1) {
			if((player1.row == row && player1.col == col) || (player2.row == row && player2.col == col)) {
				displayError();
			} else {
				doMove(row, col);
			}
		} else {
			displayError();
		}
	}
}

// Evaluates winner
function endGame(){
	if($('#status').hasClass('alert-success'))
		$('#status').removeClass('alert-success');
	if($('#status').hasClass('alert-danger'))
		$('#status').removeClass('alert-danger');
	$('#status').addClass('alert-warning');

	if(player1.score > player2.score)
		$('#status').html('<strong>!! Player 1 Wins !!</strong>');
	else if(player1.score == player2.score)
		$('#status').html('<strong>The Game is Tied</strong>');
	else
		$('#status').html('<strong>!! Player 2 Wins !!</strong>');
	
	$('#game').css('opacity', 0.3);
	
	$('button[id^="grid"]').off();

}

$( document ).ready(function() {	
	initializeGame();
});

function displayError() {
	$("#error").show();
}	

function closeError() {
	$("#error").hide();
}