import { WINNER_COMBOS } from "../constants"

export const checkWinner = (boardToCheck) => {
    // revisamos todas las combinaciones ganadores para ver si X u O ganó 
    for (const combo of WINNER_COMBOS) {
        // Se realiza un destructuring        
        const [a, b, c] = combo

        if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
            return boardToCheck[a]
        }
    }
    return null
}

export const checkEndGame = (newBoard) => {
    // Revisamos si hay un empate
    // Si no hay mas espacios vacios el el tablero
    return newBoard.every((square) => square !== null)
}
