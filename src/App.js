
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
    const NUM_ROWS_BEGIN = 15;
    const NUM_COLS_BEGIN = 3;
	
    const [numRows, setNumRows] = useState(NUM_ROWS_BEGIN);
    const [rowInput, setRowInput] = useState("");
    const [numCols, setNumCols] = useState(NUM_COLS_BEGIN);
    const [colInput, setColInput] = useState("");
	const [board, setBoard] = useState(Array(NUM_ROWS_BEGIN).fill(Array(NUM_COLS_BEGIN).fill(true)));
	
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
	
	function restart(nr, nc) {
		setBoard(Array(nr).fill(Array(nc).fill(true)));
	}
	
    function changeBoardSize() {
        var newNumRows = parseInt(rowInput);
        var newNumCols = parseInt(colInput);
        if (!isNaN(newNumRows) && !isNaN(newNumCols)) {
            setNumRows(newNumRows);
            setNumCols(newNumCols);
            restart(newNumRows, newNumCols);
        }
    }
    
	return (
		<>
			<div className="board">
				<Grid numRows={numRows} numCols={numCols} handlePlay={handlePlay} board={board} />
			</div>
			<br />
			<button onClick={() => restart(numRows, numCols)}>Reset</button><br />
            <label for="fname">Number of Rows</label>&nbsp;&nbsp;
            <input type="text" id="num-rows" onInput={e => setRowInput(e.target.value)}></input>&nbsp;&nbsp;&nbsp;&nbsp;
            <label for="lname">Number of Columns</label>&nbsp;&nbsp;
            <input type="text" id="num-cols" onInput={e => setColInput(e.target.value)}></input><br /><br />
            <button onClick={changeBoardSize}>Change Board Size</button>
		</>
	);
}

export default App;
