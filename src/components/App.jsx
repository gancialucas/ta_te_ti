import { useState } from 'react'
import { Square } from './Square'
import { TURNS } from '../constants'
import { checkWinner, checkEndGame } from '../logic/board'
import { WinnerModal } from './WinnerModal'

import confetti from 'canvas-confetti'
import '../../public/styles/index.css'

export default function App() {
  /*
    Hacemos uso del primer hook -> useState()
      - El estado inicial toma dos posibles valores:
        1. El valor por default = Array(9).fill(null) --> Rellena un arreglo con nueve posiciones todas null
        2. El valor traido del localStorage
      - Dentro del hook usamos un arrow function para determinar cual será el valor del elemento 'board'
  */
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  /*
    Hacemos uso del segundo hook -> useState()
      - El estado inicial toma dos posibles valores:
        1. El valor por default = string --> trae como constante un objeto que contiene dos valores X, con el string 'x', y O, con el string 'o'.
        2. El string guardado en localStorage
      - Dentro del hook usamos un arrow function para determinar cual será el valor del elemento 'turn'
  */
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X // Si el valor de la izquierda es null o undefined, entonces retorna el valor de la derecha.
  })

  /*
    Hacemos uso del tercer hook -> useState()
      - El estado inicial toma un posibles valores:
        1. Nulo, donde:
          - null: no hay ganador.
          - false: hay empate.
  */
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición si ya tiene algo dentro del array ('x' u 'o') o si ya gano.
    if (board[index] || winner) return

    // Actulizar el tablero    
    const newBoard = [...board]
    // Asignamos a ese index la 'x' u 'o' dependiendo del turno en el que esté
    newBoard[index] = turn
    // Actualizamos el tablero con el nuevo array con el elemento de acuerdo al turno
    setBoard(newBoard)

    // Cambiar el turno
    // Si el elemento turno tiene el valor del 'x' entonces se cambia al valor de 'o' y se asigna a la var 'newTurn' que se setea en setTurn()
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // Gurdar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    // Revisar si hay un ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(() => { return newWinner }) // Queremos que se renderice cada vez que se hace click
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1>Ta Te Ti</h1>

      <section className='game'>
        {board.map((cell, index) =>
          <Square key={index} index={index} updateBoard={updateBoard}>{cell}</Square>
        )}
      </section>

      <button onClick={resetGame}>Reiniciar juego</button>

      <p>Turno de</p>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main >
  )
}