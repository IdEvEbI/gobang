import utils from './utils.js'

function clickBoard(e) {
  board.drawChessAtOffset(e.offsetX, e.offsetY)

  board.dada.switchPlayer()
}

let board = new utils.Board('gobang')
board.drawBoard()

board.canvas.addEventListener('click', clickBoard)