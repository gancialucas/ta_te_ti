import './App.css'

const TURNS = {
  X: 'x',
  O: 'o'
}

const Square = ({ children, updateBoard, index }) => {
  return (
    <div className='square'>
      {children}
    </div>
  )
}

function App() {
  const board = Array(9).fill(null)
  
  return (
    <main className='board'>
      <h1>Ta Te Ti</h1>
      <section className='game'>
        {board.map((cell, index) => {
          return (
            <Square
              key={index}
              index={index}
            />
          )
        })}
      </section>
    </main >
  )
}

export default App
