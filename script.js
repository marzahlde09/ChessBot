var board;
initializeNewBoard();

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
		hasMoved = false;
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
		hasMoved = false;
	}
}

// returns a 2D array of legal chess moves
// where the piece is the starting point and
// the 2D array contains [row, col] of possible
// ending points
function findLegalMoves(piece){
	switch(typeof piece){
		case 'P':
			return findPawnMoves(piece);
			break;
		case 'R':
			return findRookMoves(piece);
			break;
		case 'Kn':
			return findKnightMoves(piece);
			break;
		case 'B':
			return findBishopMoves(piece);
			break;
		case 'Q':
			return findQueenMoves(piece);
			break;
		case 'Ki':
			return findKingMoves(piece);
			break;
		default:
			console.log('typeof not working as expected');
	}
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
			moves.push([row - 1][col]);
		}
		if(row == 6
		&& board[row - 1][col] == 'empty'
		&& board[row - 2][col] == 'empty'){
			moves.push([row - 2][col]);
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
			moves.push([row + 1][col]);
		}
		if(row == 1
		&& board[row + 1][col] == 'empty'
		&& board[row + 2][col] == 'empty'){
			moves.push([row + 2][col]);
		}
	}
	let index = 0;
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(color)){
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
		else if(board[i][col].color != this.color){
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
		else if(board[i][col].color != this.color){
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
		else if(board[row][i].color != this.color){
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
		else if(board[row][i].color != this.color){
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
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(color)){
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
		&& (board[row + 1][col + 2] == 'empty' || board[row + 1][col + 2].color != this.color)){
			moves.push(row + 1, col + 2);
		}
		if(row - 1 >= 0
		&& (board[row - 1][col + 2] == 'empty' || board[row - 1][col + 2].color != this.color)){
			possibleMoves.push(row - 1, col + 2);
		}
	}
	if(col - 2 >= 0){
		if(row + 1 < 8
		&& (board[row + 1][col - 2] == 'empty' || board[row + 1][col - 2].color != this.color)){
			moves.push(row + 1, col - 2);
		}
		if(row - 1 >= 0
		&& (board[row - 1][col - 2] == 'empty' || board[row - 1][col - 2].color != this.color)){
			possibleMoves.push(row - 1, col - 2);
		}
	}
	if(row - 2 >= 0){
		if(col + 1 < 8
		&& (board[row - 2][col + 1] == 'empty' || board[row - 2][col + 1].color != this.color)){
			moves.push(row - 2, col + 1);
		}
		if(col - 1 >= 0
		&& (board[row - 2][col - 1] == 'empty' || board[row - 2][col - 1].color != this.color)){
			possibleMoves.push(row - 2, col - 1);
		}
	}
	if(row + 2 < 8){
		if(col + 1 < 8
		&& (board[row + 2][col + 1] == 'empty' || board[row + 2][col + 1].color != this.color)){
			moves.push(row + 2, col + 1);
		}
		if(col - 1 >= 0
		&& (board[row + 2][col - 1] == 'empty' || board[row + 2][col - 1].color != this.color)){
			possibleMoves.push(row + 2, col - 1);
		}
	}
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(color)){
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
	for(let i = row + 1, let j = col + 1; i < 8 && j < 8; i++, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row + 1, let j = col - 1; i < 8 && j >= 0; i++, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, let j = col - 1; i >= 0 && j >= 0; i--, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, let j = col + 1; i >= 0 && j < 8; i--, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(color)){
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
	for(let i = row + 1, let j = col + 1; i < 8 && j < 8; i++, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row + 1, let j = col - 1; i < 8 && j >= 0; i++, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, let j = col - 1; i >= 0 && j >= 0; i--, j--){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
			moves.push([i, j]);
			break;
		}
		else{
			break;
		}
	}
	for(let i = row - 1, let j = col + 1; i >= 0 && j < 8; i--, j++){
		if(board[i][j] == 'empty'){
			moves.push([i, j]);
		}
		else if(board[i][j].color != this.color){
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
		else if(board[i][col].color != this.color){
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
		else if(board[i][col].color != this.color){
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
		else if(board[row][i].color != this.color){
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
		else if(board[row][i].color != this.color){
			moves.push([row, i]);
			break;
		}
		else{
			break;
		}
	}
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(color)){
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
	&& (board[row + 1][col + 1] == 'empty' || board[row + 1][col + 1].color != this.color)){
		moves.add([row + 1, col + 1]);
	}
	if(row + 1 < 8
	&& col - 1 >= 0
	&& (board[row + 1][col - 1] == 'empty' || board[row + 1][col - 1].color != this.color)){
		moves.add([row + 1, col - 1]);
	}
	if(row - 1 >= 0
	&& col - 1 >= 0
	&& (board[row - 1][col - 1] == 'empty' || board[row - 1][col - 1].color != this.color)){
		moves.add([row - 1, col - 1]);
	}
	if(row - 1 >= 0
	&& col + 1 < 8
	&& (board[row - 1][col + 1] == 'empty' || board[row - 1][col + 1].color != this.color)){
		moves.add([row - 1, col + 1]);
	}
	if(row + 1 < 8
	&& (board[row + 1][col] == 'empty' || board[row + 1][col].color != this.color)){
		moves.add([row + 1][col]);
	}
	if(row - 1 >= 0
	&& (board[row - 1][col] == 'empty' || board[row - 1][col].color != this.color)){
		moves.add([row - 1][col]);
	}
	if(col + 1 < 8
	&& (board[row][col + 1] == 'empty' || board[row][col + 1].color != this.color)){
		moves.add([row][col + 1]);
	}
	if(col - 1 >= 0
	&& (board[row][col - 1] == 'empty' || board[row][col - 1].color != this.color)){
		moves.add([row][col - 1]);
	}
	while(index < moves.length){
		let tempBoard = copyBoard();
		tempBoard[moves[index][0]][moves[index][1]] = new P(moves[index][0],moves[index][1],color);
		tempBoard[row][col] = 'empty';
		if(inCheck(color)){
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
function inCheck(color){
	let row = -1;
	let col = -1;
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			if(typeof board[i][j] == 'Ki' && board[i][j].color == color){
				row = i;
				col = j;
			}
		}
	}
	//check as if pawn
	if(color == 'w'){
		if(row - 1 >= 0
		&& col - 1 >= 0
		&& typeof board[row - 1][col - 1] == 'P'
		&& board[row - 1][col - 1].color == 'b'){
			return true;
		}
		if(row - 1 >= 0
		&& col + 1 < 8
		&& typeof board[row - 1][col + 1] == 'P'
		&& board[row - 1][col + 1].color == 'b'){
			return true;
		}
	}
	else{
		if(row + 1 < 8
		&& col - 1 >= 0
		&& typeof board[row + 1][col - 1] == 'P'
		&& board[row + 1][col - 1].color == 'w'){
			return true;
		}
		if(row + 1 < 8
		&& col + 1 < 8
		&& typeof board[row + 1][col + 1] == 'P'
		&& board[row + 1][col + 1].color == 'w'){
			return true;
		}
	}
	//check as if rook
	for(let i = row + 1; i < 8; i++){
		if((typeof board[i][col] == 'R' || typeof board[i][col] == 'Q')
		&& board[i][col].color != color){
			return true;
		}
		else if(typeof board[i][col] != 'empty'){
			break;
		}
	}
	for(let i = row - 1; i >= 0; i--){
		if((typeof board[i][col] == 'R' || typeof board[i][col] == 'Q')
		&& board[i][col].color != color){
			return true;
		}
		else if(typeof board[i][col] != 'empty'){
			break;
		}
	}
	for(let i = col + 1; i < 8; i++){
		if((typeof board[row][i] == 'R' || typeof board[row][i] == 'Q')
		&& board[row][i].color != color){
			return true;
		}
		else if(typeof board[row][i] != 'empty'){
			break;
		}
	}
	for(let i = col - 1; i >= 0; i--){
		if((typeof board[row][i] == 'R' || typeof board[row][i] == 'Q')
		&& board[row][i].color != color){
			return true;
		}
		else if(typeof board[row][i] != 'empty'){
			break;
		}
	}
	//check as if Knight
	if(col + 2 < 8){
		if(row + 1 < 8
		&& typeof board[row + 1][col + 2] == 'Kn'
		&& board[row + 1][col + 2].color != color){
			return true;
		}
		if(row - 1 >= 0
		&& typeof board[row - 1][col + 2] == 'Kn'
		&& board[row - 1][col + 2].color != color){
			return true;
		}
	}
	if(col - 2 >= 0){
		if(row + 1 < 8
		&& typeof board[row + 1][col - 2] == 'Kn'
		&& board[row + 1][col - 2].color != color){
			return true;
		}
		if(row - 1 >= 0
		&& typeof board[row - 1][col - 2] == 'Kn'
		&& board[row - 1][col - 2].color != color){
			return true;
		}
	}
	if(row + 2 < 8){
		if(col + 1 < 8
		&& typeof board[row + 2][col + 1] == 'Kn'
		&& board[row + 2][col + 1].color != color){
			return true;
		}
		if(col - 1 >= 0
		&& typeof board[row + 2][col - 1] == 'Kn'
		&& board[row + 2][col - 1].color != color){
			return true;
		}
	}
	if(row - 2 >= 0){
		if(col + 1 < 8
		&& typeof board[row - 2][col + 1] == 'Kn'
		&& board[row - 2][col + 1].color != color){
			return true;
		}
		if(col - 1 >= 0
		&& typeof board[row - 2][col - 1] == 'Kn'
		&& board[row - 2][col - 1].color != color){
			return true;
		}
	}
	//check as if Bishop
	for(let i = row + 1, let j = col + 1; i < 8 && j < 8; i++, j++){
		if((typeof board[i][j] == 'B' || typeof board[i][j] == 'Q')
		&& board[i][j].color != color){
			return true;
		}
		else if(typeof board[i][j] != 'empty'){
			break;
		}
	}
	for(let i = row + 1, let j = col - 1; i < 8 && j >= 0; i++, j--){
		if((typeof board[i][j] == 'B' || typeof board[i][j] == 'Q')
		&& board[i][j].color != color){
			return true;
		}
		else if(typeof board[i][j] != 'empty'){
			break;
		}
	}
	for(let i = row - 1, let j = col - 1; i >= 0 && j >= 0; i--, j--){
		if((typeof board[i][j] == 'B' || typeof board[i][j] == 'Q')
		&& board[i][j].color != color){
			return true;
		}
		else if(typeof board[i][j] != 'empty'){
			break;
		}
	}
	for(let i = row - 1, let j = col + 1; i >= 0 && j < 8; i--, j++){
		if((typeof board[i][j] == 'B' || typeof board[i][j] == 'Q')
		&& board[i][j].color != color){
			return true;
		}
		else if(typeof board[i][j] != 'empty'){
			break;
		}
	}
	//Queen is handled by rook and Bishop
	//Check as if king
	if(row + 1 < 8
	&& col + 1 < 8
	&& typeof board[row + 1][col + 1] == 'Ki'){
		return true;
	}
	if(row + 1 < 8
	&& col - 1 >= 0
	&& typeof board[row + 1][col - 1] == 'Ki'){
		return true;
	}
	if(row - 1 >= 0
	&& col - 1 >= 0
	&& typeof board[row - 1][col - 1] == 'Ki'){
		return true;
	}
	if(row - 1 >= 0
	&& col + 1 < 8
	&& typeof board[row - 1][col + 1] == 'Ki'){
		return true;
	}
	if(row + 1 < 8
	&& typeof board[row + 1][col] == 'Ki'){
		return true;
	}
	if(row - 1 >= 0
	&& typeof board[row - 1][col] == 'Ki'){
		return true;
	}
	if(col + 1 < 8
	&& typeof board[row][col + 1] == 'Ki'){
		return true;
	}
	if(col - 1 >= 0
	&& typeof board[row][col - 1] == 'Ki'){
		return true;
	}
	//at this point, we can assume the king is not in check
	return false;
};
	
		
		