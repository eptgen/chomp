
import { useEffect, useState } from 'react';

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
    
function Name({ name }) {
    if (name != "") {
        return <p>Signed in as {name}</p>;
    } else {
        return <p>Not signed in</p>;
    }
}

function BoardId({ id }) {
    return <p>Game Id: {id}</p>;
}

var stateChecker = null;

function App() {
    const NUM_ROWS_BEGIN = 15;
    const NUM_COLS_BEGIN = 3;
	
    const [numRows, setNumRows] = useState(NUM_ROWS_BEGIN);
    const [rowInput, setRowInput] = useState("");
    const [numCols, setNumCols] = useState(NUM_COLS_BEGIN);
    const [colInput, setColInput] = useState("");
	const [board, setBoard] = useState(Array(NUM_ROWS_BEGIN).fill(Array(NUM_COLS_BEGIN).fill(true)));
	const [nameInput, setNameInput] = useState("");
    const [name, setName] = useState("");
    const [boardId, setBoardId] = useState("");
    const [boardIdInput, setBoardIdInput] = useState("");
    
    /*
    // the "single player" way to handle the game
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
    */
    
    function handlePlay(row, col) {
        var boardToPlay = parseInt(boardId);
        if (!isNaN(boardToPlay)) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "type": "player_clicked",
                "row": row,
                "col": col,
                "id": boardToPlay,
                "name": name
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://fz8cl5nzi9.execute-api.us-east-2.amazonaws.com/dev", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    return response.text();
                } else {
                    return "";
                }
            })
            .then(result => {
                var details = JSON.parse(result);
                // console.log(details);
                if (details.statusCode == 200) {
                    var resObj = JSON.parse(details["body"]);
                    setBoard(resObj["board"]);
                    var winner = resObj["winner"];
                    if (winner != 2) {
                        setBoardId("");
                    }
                }
            })
            .catch(error => console.log('error', error));
        }
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
    
    function startGame() {
        if (name != "") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "type": "new_game",
                "host": name,
                "num_rows": numRows,
                "num_cols": numCols,
                "settings_first": 0
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://fz8cl5nzi9.execute-api.us-east-2.amazonaws.com/dev", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    return response.text();
                } else {
                    alert("error: " + response.text());
                }
            })
            .then(result => {
                var details = JSON.parse(result);
                var idObj = JSON.parse(details["body"]);
                setBoardId(idObj["id"].toString());
            })
            .catch(error => console.log('error', error));
        }
    }
    
    function signIn() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "type": "sign_in",
            "name": nameInput
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://fz8cl5nzi9.execute-api.us-east-2.amazonaws.com/dev", requestOptions)
        .then(response => {
            if (response.status == 200) {
                setName(nameInput);
            } else {
                alert("error: " + response.text());
            }
        })
        .catch(error => console.log('error', error));
    }
    
    function joinGame() {
        var boardToJoin = parseInt(boardIdInput);
        if (!isNaN(boardToJoin)) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "type": "join_game",
                "id": boardToJoin,
                "guest": name
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://fz8cl5nzi9.execute-api.us-east-2.amazonaws.com/dev", requestOptions)
            .then(response => {
                if (response.status == 200) {
                    setBoardId(boardIdInput);
                } else {
                    alert("error: " + response.text());
                }
            })
            .catch(error => console.log('error', error));
        }
    }
    
    useEffect(() => {
        clearInterval(stateChecker);
        stateChecker = setInterval(() => {
            var boardToGet = parseInt(boardId);
            if (!isNaN(boardToGet)) {
                // console.log(boardToGet);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                var raw = JSON.stringify({
                    "type": "get_board_state",
                    "id": boardToGet
                });
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch("https://fz8cl5nzi9.execute-api.us-east-2.amazonaws.com/dev", requestOptions)
                .then(response => {
                    if (response.status == 200) {
                        return response.text();
                    } else {
                        alert("error: " + response.text());
                    }
                })
                .then(result => {
                    var details = JSON.parse(result);
                    // console.log(details["body"]);
                    var resObj = JSON.parse(details["body"]);
                    var newBoard = resObj["board"];
                    setBoard(newBoard);
                    setNumRows(newBoard.length);
                    setNumCols(newBoard[0].length);
                    var winner = resObj["winner"];
                    if (winner != 2) {
                        setBoardId("");
                    }
                })
                .catch(error => console.log('error', error));
            }
        }, 500);
    }, [boardId]);
    
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
            <button onClick={changeBoardSize}>Change Board Size</button><br />
            <button onClick={startGame}>Start Game</button><br /><br />
            <input type="text" id="join-game" onInput={e => setBoardIdInput(e.target.value)}></input>
            <button onClick={joinGame}>Join Game</button><br />
            <input type="text" id="sign-in" onInput={e => setNameInput(e.target.value)}></input>
            <button onClick={signIn}>Sign In</button><br />
            <Name name={name} />
            <BoardId id={boardId} />
		</>
	);
}

export default App;
