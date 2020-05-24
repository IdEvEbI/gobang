import Board from './utils.js'

function clickBoard(e) {

  if (board.dada.isGameOver) {
    console.log('游戏已经结束。')
    return
  }

  dropStone(board.boardCoordinate(e.offsetX, e.offsetY))
}

/**
 * 在指定坐标位置落子
 *
 * @param {落子坐标} coor
 */
function dropStone(coor) {

  if (board.dada.hadStone(coor)) {
    console.log('此处已经有棋子，无法落子')
    return
  }

  board.drawChess(coor)
  board.dada.dropStone(coor)

  if (board.dada.isGameOver) {
    console.log('游戏结束')

    return
  }

  board.dada.switchPlayer()

  if (!board.dada.isBlack) {
    dropStone(board.dada.findAICoor())
  }

  console.log(board.dada)
}

let board = new Board('gobang')
board.drawBoard()

board.canvas.addEventListener('click', clickBoard)