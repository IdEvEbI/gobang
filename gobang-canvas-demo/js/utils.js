/**
 * 棋盘类
 */
class Board {
  constructor(canvasId) {
    this.count = 15                                   // 棋盘格子数
    this.canvas = document.getElementById(canvasId)   // 棋盘画布
    this.width = this.canvas.clientWidth              // 棋盘宽度
    this.height = this.canvas.clientHeight            // 棋盘高度
    this.cellWidth = this.width / this.count          // 格子宽度
    this.cellHeight = this.height / this.count        // 格子高度

    this.startX = this.cellWidth * 0.5                // 水平起始坐标
    this.startY = this.cellHeight * 0.5               // 垂直起始坐标

    this.strokeColor = '#ccc'                         // 棋盘线条颜色
    this.fillColor = '#333'                           // 棋盘标注点填充颜色
  }

  /**
   * 将棋盘坐标[0~14]转换为画布坐标
   *
   * @param {*} x
   * @param {*} y
   */
  point(x, y) {
    return {
      x: this.startX + x * this.cellWidth,
      y: this.startY + y * this.cellHeight
    }
  }

  /**
   * 绘制棋盘线条
   *
   * @param {*} ctx
   */
  drawBoardLines(ctx) {
    ctx.strokeColor = this.strokeColor

    for (let i = 0; i < this.count; i++) {
      // 水平线
      let horStart = this.point(0, i)
      let horEnd = this.point(this.count - 1, i)

      ctx.moveTo(horStart.x, horStart.y)
      ctx.lineTo(horEnd.x, horEnd.y)

      // 垂直线
      let verStart = this.point(i, 0)
      let verEnd = this.point(i, this.count - 1)

      ctx.moveTo(verStart.x, verStart.y)
      ctx.lineTo(verEnd.x, verEnd.y)
    }

    ctx.stroke()
  }

  /**
   * 绘制棋盘标记点
   *
   * @param {*} ctx
   */
  drawMarkPoints(ctx) {
    [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]].forEach(e => {
      let markPoint = this.point(e[0], e[1])

      ctx.rect(markPoint.x - 3, markPoint.y - 3, 6, 6)
    })

    ctx.fillColor = this.fillColor
    ctx.fill()
  }

  /**
   * 绘制棋盘
   */
  drawBoard() {
    let ctx = this.canvas.getContext('2d')

    this.drawBoardLines(ctx)
    this.drawMarkPoints(ctx)
  }
}

export default { board: new Board('gobang') }
