import { useState } from 'react'
import { Square } from './Square'
import { TURNS } from '../constants'
import { checkWinner, checkEndGame } from '../logic/board'
import { WinnerModal } from './WinnerModal'

import confetti from 'canvas-confetti'
import '../styles/index.css'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null) // null: no hay ganador, false: hay empate

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición si ya tiene algo
    if (board[index] || winner) return

    // Actulizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // Cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // Gurdar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', turn)

    // Revisar si hay un ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(() => { return newWinner })
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1>Ta Te Ti</h1>

      <section className='game'>
        {board.map((cell, index) => {
          console.log(cell)
          return (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
            >
              {cell}
            </Square>
          )
        })}
      </section>

      <button onClick={resetGame}>Reiniciar juego</button>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
