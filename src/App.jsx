import React from 'react';
import { useState } from 'react';

const TURNS = {
  X: "x",
  O: "o",
};

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`;
  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

const COMBO_WINNER = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, actBoard] = useState(() => {
    const safeGameLocalStorage = window.localStorage.getItem('board');
    return safeGameLocalStorage
      ? JSON.parse(safeGameLocalStorage)
      : Array(9).fill(null);
  });

  const [turn, actTurn] = useState(() => {
    const safeTurnLocalStorage = window.localStorage.getItem('turn');
    return safeTurnLocalStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const checkWinner = (boardCheck) => {
    for (const combo of COMBO_WINNER) {
      const [a, b, c] = combo;
      if (
        boardCheck[a] &&
        boardCheck[a] === boardCheck[b] &&
        boardCheck[b] === boardCheck[c]
      ) {
        return boardCheck[a];
      }
    }
    return null;
  };
  //reseteo los estados para que el juego vuelva a renderizarse
  const newtGame = () => {
    actBoard(Array(9).fill(null));
    actTurn(TURNS.X);
    setWinner(null);
    //cuando reseteo el juego tmb el local storage
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
  };

  const checkFinishGame = (newSquare) => {
    return newSquare.every((square) => square !== null);
  };

  const updateBoard = (index) => {
    //no quiero actualizar la pos si ya tiene algo
    if (board[index] || winner) return;
    //actualizo tablero
    const newSquare = [...board];
    newSquare[index] = turn;
    actBoard(newSquare);

    //cambio el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    actTurn(newTurn);

    //voy a dejar cargada la partida hasta que haya un ganador

    window.localStorage.setItem("board", JSON.stringify(newSquare));
    //tambien el turno
    window.localStorage.setItem("turn", newTurn);

    //reviso si hay ganador
    const newWinner = checkWinner(newSquare);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkFinishGame(newSquare)) {
      setWinner(false);
    }
  };

  return (
    <main className='board'>
      <h1>Tres en Raya</h1>
      <button onClick={newtGame}>Reiniciar partida</button>
      <section className='game'>
        {board.map((_cell, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner !== null && (
        <section className='winner'>
          <div className='text'>
            <h3>{winner === false ? 'Empate' : 'Ganador:'}</h3>
            <div className="win">{winner && <Square>{winner}</Square>}</div>
            <footer>
              <button onClick={newtGame}>Volver a jugar</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;


