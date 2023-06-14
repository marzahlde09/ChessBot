var board;
var turn;
var selectedPiece;
var movementOptions;

// returns a 2D array thats a copy of the current chess board
// for the sake of checking legal moves
function copyBoard(){
	let copy = [
		[, , , , , , , ],
		[, , , , , , , ],
		[, , , , , , , ],
		[, , , , , , , ],
		[, , , , , , , ],
		[, , , , , , , ],
		[, , , , , , , ],
		[, , , , , , , ]
	];
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			copy[i][j] = board[i][j];
		}
	}
	return copy;
}

// sets up a new chess board with black on rows 0-1 and white on rows 6-7
function initializeNewBoard(){
	board = [
		[new R(0,0,'b','l'), new Kn(0,1,'b'), new B(0,2,'b'), new Q(0,3,'b'), new Ki(0,4,'b'), new B(0,5,'b'), new Kn(0,6,'b'), new R(0,7,'b','s')],
		[new P(1,0,'b'), new P(1,1,'b'), new P(1,2,'b'), new P(1,3,'b'), new P(1,4,'b'), new P(1,5,'b'), new P(1,6,'b'), new P(1,7,'b'),],
		['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
		['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
		['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
		['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
		[new P(6,0,'w'), new P(6,1,'w'), new P(6,2,'w'), new P(6,3,'w'), new P(6,4,'w'), new P(6,5,'w'), new P(6,6,'w'), new P(6,7,'w'),],
		[new R(7,0,'w','l'), new Kn(7,1,'w'), new B(7,2,'w'), new Q(7,3,'w'), new Ki(7,4,'w'), new B(7,5,'w'), new Kn(7,6,'w'), new R(7,7,'w','s')]
	];
}

class P{
	constructor(row, col, color){
		this.row = row;
		this.col = col;
		// Color is 'b' for black or 'w' for white
		this.color = color;
	}
}

class R{
	constructor(row, col, color, side){
		this.row = row;
		this.col = col;
		this.color = color;
		// Knowing whether or not a rook has moved determines
		// eligibility for Castling
		this.hasMoved = false;
		// Side is 's' for short or 'l' for long for the sake of castling
		this.side = side;
	}
}

class Kn{
	constructor(row, col, color){
		this.row = row;
		this.col = col;
		this.color = color;
	}
}

class B{
	constructor(row, col, color){
		this.row = row;
		this.col = col;
		this.color = color;
	}
}

class Q{
	constructor(row, col, color){
		this.row = row;
		this.col = col;
		this.color = color;
	}
}

class Ki{
	constructor(row, col, color){
		this.row = row;
		this.col = col;
		this.color = color;
		this.hasMoved = false;
	}
}

// returns a 2D array of legal chess moves
// where the piece is the starting point and
// the 2D array contains [row, col] of possible
// ending points
function findLegalMoves(piece){
	if(piece instanceof P){
		return findPawnMoves(piece);
	}
	if(piece instanceof R){
		return findRookMoves(piece);
	}
	if(piece instanceof Kn){
		return findKnightMoves(piece);
	}
	if(piece instanceof B){
		return findBishopMoves(piece);
	}
	if(piece instanceof Q){
		return findQueenMoves(piece);
	}
	if(piece instanceof Ki){
		return findKingMoves(piece);
	}
}

// returns a 2D array of all legal chess moves for a given color
function findAllLegalMoves(color){
	let allMoves = [];
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[0].length; j++){
			if(typeof board[i][j] == 'object'
			&& board[i][j].color == color){
				let currentPieceMoves = findLegalMoves(board[i][j]);
				for(let k = 0; k < currentPieceMoves.length; k++){
					allMoves.push([currentPieceMoves[k][0],currentPieceMoves[k][1]]);
				}
			}
		}
	}
	return allMoves;
}
			
// Pawn movement rules:
// Typically move one space toward enemy side if unobstructed
// Can move two spaces if on starting file
// May only take diagonally forward
// May en passant if enemy pawn moves two spaces through a diagonally
function findPawnMoves(piece){
	let moves = [];
	let color = piece.color;
	let row = piece.row;
	let col = piece.col;
	if(color=='w'){
		if(col - 1 >= 0
		&& board[row - 1][col - 1] != 'empty'
		&& board[row - 1][col - 1].color == 'b'){
			moves.push([row - 1, col - 1]);
		}
		if(col + 1 < 8
		&& board[row - 1][col + 1] != 'empty'
		&& board[row - 1][col + 1].color== 'b'){
			moves.push([row - 1, col + 1]);
		}
		if(board[row - 1][col] == 'empty'){
			moves.push([row - 1, col]);
		}
		if(row == 6
		&& board[row - 1][col] == 'empty'
		&& board[row - 2][col] == 'empty'){
			moves.push([row - 2, col]);
		}
	}
	else{
		if(col - 1 >= 0
		&& board[row + 1][col - 1] != 'empty'
		&& board[row + 1][col - 1].color == 'w'){
			moves.push([row + 1, col - 1]);
		}
		if(col + 1 < 8
		&& board[row + 1][col + 1] != 'empty'
		&& board[row + 1][col + 1].color== 'w'){
			moves.push([row + 1, col + 1]);
		}
		if(board[row + 1][col] == 'empty'){
			moves.push([row + 1, col]);
		}
		if(row == 1
		&& board[row + 1][col] == 'empty'
		&& board[row + 2][col] == 'empty'){
			moves.push([row + 2, col]);
		}
	}
	let index = Number(0);
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(tempBoard, color)){
			moves.splice(index,1);
		}
		else{
			index++;
		}
	}
	return moves;
}

// Rook movement rules:
// Move vertically or horizontally if unobstructed
function findRookMoves(piece){
	let moves = [];
	let color = piece.color;
	let row = piece.row;
	let col = piece.col;
	for(let i = row + 1; i < 8; i++){
		if(board[i][col] == 'empty'){
			moves.push([i, col]);
		}
		else if(board[i][col].color != color){
			moves.push([i, col]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1; i >= 0; i--){
		if(board[i][col] == 'empty'){
			moves.push([i, col]);
		}
		else if(board[i][col].color != color){
			moves.push([i, col]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = col + 1; i < 8; i++){
		if(board[row][i] == 'empty'){
			moves.push([row, i]);
		}
		else if(board[row][i].color != color){
			moves.push([row, i]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = col - 1; i >= 0; i--){
		if(board[row][i] == 'empty'){
			moves.push([row, i]);
		}
		else if(board[row][i].color != color){
			moves.push([row, i]);
			break;
		}
		else{
			break;
		}
	}
	let index = 0;
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new R(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(tempBoard, color)){
			moves.splice(index,1);
		}
		else{
			index++;
		}
	}
	return moves;
}

// Knight movement rules:
// Move in an L-shape 2 vertically or horizontally, 1 in the other
function findKnightMoves(piece){
	let moves = [];
	let color = piece.color;
	let row = piece.row;
	let col = piece.col;
	if(col + 2 < 8){
		if(row + 1 < 8
		&& (board[row + 1][col + 2] == 'empty' || board[row + 1][col + 2].color != color)){
			moves.push([row + 1, col + 2]);
		}
		if(row - 1 >= 0
		&& (board[row - 1][col + 2] == 'empty' || board[row - 1][col + 2].color != color)){
			moves.push([row - 1, col + 2]);
		}
	}
	if(col - 2 >= 0){
		if(row + 1 < 8
		&& (board[row + 1][col - 2] == 'empty' || board[row + 1][col - 2].color != color)){
			moves.push([row + 1, col - 2]);
		}
		if(row - 1 >= 0
		&& (board[row - 1][col - 2] == 'empty' || board[row - 1][col - 2].color != color)){
			moves.push([row - 1, col - 2]);
		}
	}
	if(row - 2 >= 0){
		if(col + 1 < 8
		&& (board[row - 2][col + 1] == 'empty' || board[row - 2][col + 1].color != color)){
			moves.push([row - 2, col + 1]);
		}
		if(col - 1 >= 0
		&& (board[row - 2][col - 1] == 'empty' || board[row - 2][col - 1].color != color)){
			moves.push([row - 2, col - 1]);
		}
	}
	if(row + 2 < 8){
		if(col + 1 < 8
		&& (board[row + 2][col + 1] == 'empty' || board[row + 2][col + 1].color != color)){
			moves.push([row + 2, col + 1]);
		}
		if(col - 1 >= 0
		&& (board[row + 2][col - 1] == 'empty' || board[row + 2][col - 1].color != color)){
			moves.push([row + 2, col - 1]);
		}
	}
	let index = 0;
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new Kn(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(tempBoard, color)){
			moves.splice(index,1);
		}
		else{
			index++;
		}
	}
	return moves;
}

// Bishop movement rules:
// Move diagonally if unobstructed
function findBishopMoves(piece){
	let moves = [];
	let color = piece.color;
	let row = piece.row;
	let col = piece.col;
	for(let i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	let index = 0;
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new B(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(tempBoard, color)){
			moves.splice(index,1);
		}
		else{
			index++;
		}
	}
	return moves;
}
	
// Queen movement rules:
// Move vertically, horizontally, or diagonally if unobstructed
function findQueenMoves(piece){
	let moves = [];
	let color = piece.color;
	let row = piece.row;
	let col = piece.col;
	for(let i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row + 1; i < 8; i++){
		if(board[i][col] == 'empty'){
			moves.push([i, col]);
		}
		else if(board[i][col].color != color){
			moves.push([i, col]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1; i >= 0; i--){
		if(board[i][col] == 'empty'){
			moves.push([i, col]);
		}
		else if(board[i][col].color != color){
			moves.push([i, col]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = col + 1; i < 8; i++){
		if(board[row][i] == 'empty'){
			moves.push([row, i]);
		}
		else if(board[row][i].color != color){
			moves.push([row, i]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = col - 1; i >= 0; i--){
		if(board[row][i] == 'empty'){
			moves.push([row, i]);
		}
		else if(board[row][i].color != color){
			moves.push([row, i]);
			break;
		}
		else{
			break;
		}
	}
	let index = 0;
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new Q(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(tempBoard, color)){
			moves.splice(index,1);
		}
		else{
			index++;
		}
	}
	return moves;
}
	
// King movement rules:
// Move one space in any direction if unobstructed
// May castle if king and appropriate rook have not moved yet this game
// Castling may not occur if the king is in check or
// would move through check
// Castling moves the king two spaces, and places the
// appropriate rook on the opposite side of the king
function findKingMoves(piece){
	let moves = [];
	let color = piece.color;
	let row = piece.row;
	let col = piece.col;
	if(row + 1 < 8
	&& col + 1 < 8
	&& (board[row + 1][col + 1] == 'empty' || board[row + 1][col + 1].color != color)){
		moves.push([row + 1, col + 1]);
	}
	if(row + 1 < 8
	&& col - 1 >= 0
	&& (board[row + 1][col - 1] == 'empty' || board[row + 1][col - 1].color != color)){
		moves.push([row + 1, col - 1]);
	}
	if(row - 1 >= 0
	&& col - 1 >= 0
	&& (board[row - 1][col - 1] == 'empty' || board[row - 1][col - 1].color != color)){
		moves.push([row - 1, col - 1]);
	}
	if(row - 1 >= 0
	&& col + 1 < 8
	&& (board[row - 1][col + 1] == 'empty' || board[row - 1][col + 1].color != color)){
		moves.push([row - 1, col + 1]);
	}
	if(row + 1 < 8
	&& (board[row + 1][col] == 'empty' || board[row + 1][col].color != color)){
		moves.push([row + 1, col]);
	}
	if(row - 1 >= 0
	&& (board[row - 1][col] == 'empty' || board[row - 1][col].color != color)){
		moves.push([row - 1, col]);
	}
	if(col + 1 < 8
	&& (board[row][col + 1] == 'empty' || board[row][col + 1].color != color)){
		moves.push([row, col + 1]);
	}
	if(col - 1 >= 0
	&& (board[row][col - 1] == 'empty' || board[row][col - 1].color != color)){
		moves.push([row, col - 1]);
	}
	let index = 0;
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new Ki(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(tempBoard, color)){
			moves.splice(index,1);
		}
		else{
			index++;
		}
	}
	return moves;
}

// A check can be determined by assuming the king can move
// as each other piece
// If the king could take the piece it is pretending to be,
// then it is in check
function inCheck(boardToCheck, color){
	let row = -1;
	let col = -1;
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			if(boardToCheck[i][j] instanceof Ki && boardToCheck[i][j].color == color){
				row = i;
				col = j;
			}
		}
	}
	//check as if pawn
	if(color == 'w'){
		if(row - 1 >= 0
		&& col - 1 >= 0
		&& boardToCheck[row - 1][col - 1] instanceof P
		&& boardToCheck[row - 1][col - 1].color == 'b'){
			return true;
		}
		if(row - 1 >= 0
		&& col + 1 < 8
		&& boardToCheck[row - 1][col + 1] instanceof P
		&& boardToCheck[row - 1][col + 1].color == 'b'){
			return true;
		}
	}
	else{
		if(row + 1 < 8
		&& col - 1 >= 0
		&& boardToCheck[row + 1][col - 1] instanceof P
		&& boardToCheck[row + 1][col - 1].color == 'w'){
			return true;
		}
		if(row + 1 < 8
		&& col + 1 < 8
		&& boardToCheck[row + 1][col + 1] instanceof P
		&& boardToCheck[row + 1][col + 1].color == 'w'){
			return true;
		}
	}
	//check as if rook
	for(let i = row + 1; i < 8; i++){
		if((boardToCheck[i][col] instanceof R || boardToCheck[i][col] instanceof Q)
		&& boardToCheck[i][col].color != color){
			return true;
		}
		else if(typeof boardToCheck[i][col] == 'object'){
			break;
		}
	}
	for(let i = row - 1; i >= 0; i--){
		if((boardToCheck[i][col] instanceof R || boardToCheck[i][col] instanceof Q)
		&& boardToCheck[i][col].color != color){
			return true;
		}
		else if(typeof boardToCheck[i][col] == 'object'){
			break;
		}
	}
	for(let i = col + 1; i < 8; i++){
		if((boardToCheck[row][i] instanceof R || boardToCheck[row][i] instanceof Q)
		&& boardToCheck[row][i].color != color){
			return true;
		}
		else if(typeof boardToCheck[row][i] == 'object'){
			break;
		}
	}
	for(let i = col - 1; i >= 0; i--){
		if((boardToCheck[row][i] instanceof R || boardToCheck[row][i] instanceof Q)
		&& boardToCheck[row][i].color != color){
			return true;
		}
		else if(typeof boardToCheck[row][i] == 'object'){
			break;
		}
	}
	//check as if Knight
	if(col + 2 < 8){
		if(row + 1 < 8
		&& boardToCheck[row + 1][col + 2] instanceof Kn
		&& boardToCheck[row + 1][col + 2].color != color){
			return true;
		}
		if(row - 1 >= 0
		&& boardToCheck[row - 1][col + 2] instanceof Kn
		&& boardToCheck[row - 1][col + 2].color != color){
			return true;
		}
	}
	if(col - 2 >= 0){
		if(row + 1 < 8
		&& boardToCheck[row + 1][col - 2] instanceof Kn
		&& boardToCheck[row + 1][col - 2].color != color){
			return true;
		}
		if(row - 1 >= 0
		&& boardToCheck[row - 1][col - 2] instanceof Kn
		&& boardToCheck[row - 1][col - 2].color != color){
			return true;
		}
	}
	if(row + 2 < 8){
		if(col + 1 < 8
		&& boardToCheck[row + 2][col + 1] instanceof Kn
		&& boardToCheck[row + 2][col + 1].color != color){
			return true;
		}
		if(col - 1 >= 0
		&& boardToCheck[row + 2][col - 1] instanceof Kn
		&& boardToCheck[row + 2][col - 1].color != color){
			return true;
		}
	}
	if(row - 2 >= 0){
		if(col + 1 < 8
		&& boardToCheck[row - 2][col + 1] instanceof Kn
		&& boardToCheck[row - 2][col + 1].color != color){
			return true;
		}
		if(col - 1 >= 0
		&& boardToCheck[row - 2][col - 1] instanceof Kn
		&& boardToCheck[row - 2][col - 1].color != color){
			return true;
		}
	}
	//check as if Bishop
	for(let i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++){
		if((boardToCheck[i][j] instanceof B || boardToCheck[i][j] instanceof Q)
		&& boardToCheck[i][j].color != color){
			return true;
		}
		else if(typeof boardToCheck[i][j] == 'object'){
			break;
		}
	}
	for(let i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--){
		if((boardToCheck[i][j] instanceof B || boardToCheck[i][j] instanceof Q)
		&& boardToCheck[i][j].color != color){
			return true;
		}
		else if(typeof boardToCheck[i][j] == 'object'){
			break;
		}
	}
	for(let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--){
		if((boardToCheck[i][j] instanceof B || boardToCheck[i][j] instanceof Q)
		&& boardToCheck[i][j].color != color){
			return true;
		}
		else if(typeof boardToCheck[i][j] == 'object'){
			break;
		}
	}
	for(let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++){
		if((boardToCheck[i][j] instanceof B || boardToCheck[i][j] instanceof Q)
		&& boardToCheck[i][j].color != color){
			return true;
		}
		else if(typeof boardToCheck[i][j] == 'object'){
			break;
		}
	}
	//Queen is handled by rook and Bishop
	//Check as if king
	if(row + 1 < 8
	&& col + 1 < 8
	&& boardToCheck[row + 1][col + 1] instanceof Ki){
		return true;
	}
	if(row + 1 < 8
	&& col - 1 >= 0
	&& boardToCheck[row + 1][col - 1] instanceof Ki){
		return true;
	}
	if(row - 1 >= 0
	&& col - 1 >= 0
	&& boardToCheck[row - 1][col - 1] instanceof Ki){
		return true;
	}
	if(row - 1 >= 0
	&& col + 1 < 8
	&& boardToCheck[row - 1][col + 1] instanceof Ki){
		return true;
	}
	if(row + 1 < 8
	&& boardToCheck[row + 1][col] instanceof Ki){
		return true;
	}
	if(row - 1 >= 0
	&& boardToCheck[row - 1][col] instanceof Ki){
		return true;
	}
	if(col + 1 < 8
	&& boardToCheck[row][col + 1] instanceof Ki){
		return true;
	}
	if(col - 1 >= 0
	&& boardToCheck[row][col - 1] instanceof Ki){
		return true;
	}
	//at this point, we can assume the king is not in check
	return false;
};

// Initializes board and adds images and background colors to
// appropriate html cells
function startGame(){
	initializeNewBoard();
	turn = 'w';
	drawBoard();
}

function drawBoard(){
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[0].length; j++){
			if((i + j) % 2 == 0){
				document.getElementById(String(i)+String(j)).bgColor = "LightGray";
			}
			else{
				document.getElementById(String(i)+String(j)).bgColor = "White";
			}
			if(typeof board[i][j] == 'object' && board[i][j].color == 'w'){
				if(board[i][j] instanceof P){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/white_pawn.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof R){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/white_rook.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof Kn){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/white_knight.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof B){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/white_bishop.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof Q){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/white_queen.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof Ki){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/white_king.png" style="height: 40px"/>';
				}
			}
			else if(typeof board[i][j] == 'object' && board[i][j].color == 'b'){
				if(board[i][j] instanceof P){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/black_pawn.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof R){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/black_rook.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof Kn){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/black_knight.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof B){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/black_bishop.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof Q){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/black_queen.png" style="height: 40px"/>';
				}
				if(board[i][j] instanceof Ki){
					document.getElementById(String(i)+String(j)).innerHTML = '<img src="content/black_king.png" style="height: 40px"/>';
				}
			}
			else{
				document.getElementById(String(i)+String(j)).innerHTML = '';
			}
		}
	}
}
	
	
function spaceClicked(){
	let id = event.target.id;
	if(id == ''){
		id = event.target.parentElement.id;
	}
	let row = Math.trunc(Number(id) / 10);
	let col = Number(id) % 10;
	if(selectedPiece == null)
	{
		if(typeof board[row][col] == 'object'
		&& board[row][col].color == turn){
			selectedPiece = board[row][col];
			movementOptions = findLegalMoves(selectedPiece);
			if(movementOptions.length == 0){
				selectedPiece = null;
				return;
			}
			for(let i = 0; i < movementOptions.length; i++){
				if((movementOptions[i][0] + movementOptions[i][1]) % 2 == 0){
					document.getElementById(String(movementOptions[i][0])+String(movementOptions[i][1])).bgColor = "DarkGreen";
				}
				else{
					document.getElementById(String(movementOptions[i][0])+String(movementOptions[i][1])).bgColor = "Chartreuse";
				}
			}
		}
	}
	else if(selectedPiece != null){
		for(let i = 0; i < movementOptions.length; i++){
			if(row == movementOptions[i][0] && col == movementOptions[i][1]){
				movePiece(selectedPiece, row, col);
				if(turn == 'w'){
					turn = 'b';
				}
				else{
					turn = 'w';
				}
				return;
			}
		}
		selectedPiece = null;
		movementOptions = null;
		drawBoard();
	}
}
	
function movePiece(piece, targetRow, targetCol){
	let startRow = piece.row;
	let startCol = piece.col;
	let color = piece.color;
	board[targetRow][targetCol] = piece;
	board[startRow][startCol] = 'empty';
	piece.row = targetRow;
	piece.col = targetCol;
	selectedPiece = null;
	movementOptions = null;
	drawBoard();
	if(color == 'w'){
		if(inCheck(board, 'b')
		&& findAllLegalMoves('b').length > 0){
			document.getElementById('check_alert').innerHTML = 'Black is in check!';
		}
		else if(inCheck(board, 'b')){
			document.getElementById('check_alert').innerHTML = 'Black is in checkmate!  White wins!';
		}
		else{
			document.getElementById('check_alert').innerHTML = '';
		}
	}
	else{
		if(inCheck(board, 'w')
		&& findAllLegalMoves('w').length > 0){
			document.getElementById('check_alert').innerHTML = 'White is in check!';
		}
		else if(inCheck(board, 'w')){
			document.getElementById('check_alert').innerHTML = 'White is in checkmate!  Black wins!';
		}
		else{
			document.getElementById('check_alert').innerHTML = '';
		}
	}
}