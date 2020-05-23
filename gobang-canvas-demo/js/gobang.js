import Board from './utils.js'

function clickBoard(e) {

  let coor = board.boardCoordinate(e.offsetX, e.offsetY)

  if (board.dada.hadStone(coor)) {
    console.log('此处已经有棋子，无法落子');
    return
  }

  board.drawChess(coor)
  board.dada.dropStone(coor)
  board.dada.switchPlayer()

  console.log(board.dada)
}

let board = new Board('gobang')
board.drawBoard()

console.log(board.dada.gameData)

board.canvas.addEventListener('click', clickBoard)