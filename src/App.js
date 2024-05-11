
import { useState } from 'react';

import logo from './logo.svg';
import './App.css';

function LiveSquare(row, col, handlePlay) {
    return <button className="square live" onClick={() => handlePlay(row, col)}></button>;
}

function EatenSquare(row, col) {
    return <button className="square eaten"></button>;
}

function Grid({ numRows, numCols, handlePlay, board }) {
	return (
	<>
		{Array(numRows).fill(1).map((i, row) => <div className="board-row">
				{Array(numCols).fill(1).map((i, col) => {
					if (board[row][col]) {
						return LiveSquare(row, col, handlePlay);
					} else {
						return EatenSquare(row, col);
					}
				})}
			</div>
		)}
	</>
	);
}

function App() {
	var numRows = 15;
	var numCols = 3;
	
	const [board, setBoard] = useState(Array(numRows).fill(Array(numCols).fill(true)));
	
	function handlePlay(row, col) {
		var newBoard = [];
		for (var i = 0; i < board.length; i++) {
			newBoard.push(board[i].slice());
		}
		
		for (var i = row; i >= 0; i--) {
			for (var j = col; j < numCols; j++) {
				newBoard[i][j] = false;
			}
		}
		setBoard(newBoard);
	}
	
	function restart() {
		setBoard(Array(numRows).fill(Array(numCols).fill(true)));
	}
	
	return (
		<>
			<div className="board">
				<Grid numRows={numRows} numCols={numCols} handlePlay={handlePlay} board={board} />
			</div>
			<br />
			<button onClick={restart}>Reset</button>
		</>
	);
}

export default App;
