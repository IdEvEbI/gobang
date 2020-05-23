/**
 * 棋盘类
 */
class Board {
  constructor(canvasId) {
    console.assert(canvasId, 'canvase id is null.')

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

    this.chessSize = Math.floor(this.cellWidth * 0.5 - 2)   // 棋子大小
    this.dada = new gobangData(this.count)                      // 游戏数据
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
   * 将画布坐标转换成棋盘做坐标
   *
   * @param {*} offsetX
   * @param {*} offsetY
   */
  boardCoordinate(offsetX, offsetY) {
    return {
      x: Math.floor(offsetX / this.cellWidth),
      y: Math.floor(offsetY / this.cellHeight)
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

    // 绘制棋盘背景图片
    let img = new Image()
    img.src = '/images/bg.jpg'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, this.width, this.height)

      this.drawBoardLines(ctx)
      this.drawMarkPoints(ctx)
    }
  }

  /**
   * 在棋盘坐标位置绘制棋子
   *
   * @param {落子的棋盘坐标} coor
   */
  drawChess(coor) {
    let ctx = this.canvas.getContext('2d')

    let p = this.point(coor.x, coor.y)

    let grd = ctx.createRadialGradient(p.x + 2, p.y - 2, this.chessSize,
      p.x + 2, p.y - 2, 0);

    if (this.dada.isBlack) {
      grd.addColorStop(0, '#111')
      grd.addColorStop(1, '#666')
    } else {
      grd.addColorStop(0, '#ccc')
      grd.addColorStop(1, '#eee')
    }

    ctx.fillStyle = grd

    ctx.beginPath()
    ctx.arc(p.x, p.y, this.chessSize, 0, 2 * Math.PI)
    ctx.fill()
  }
}

/**
 * 游戏数据类
 */
class gobangData {

  constructor(count) {
    this.count = count                                // 棋盘格子数
    this.isBlack = true                               // 是否黑棋
    this.gameData = []                                // 游戏数据二维数组

    // 初始化棋盘数组
    for (let i = 0; i < this.count; i++) {
      this.gameData[i] = new Array(this.count).fill(0)
    }

    this.resetData()
  }

  /**
   * 交换玩家
   */
  switchPlayer() {
    this.isBlack = !this.isBlack
  }

  /**
   * 重置游戏数据
   */
  resetData() {
    for (let i = 0; i < this.count; i++) {
      this.gameData[i].fill(0)
    }
  }

  /**
   * 判断指定坐标位置是否已经落子
   *
   * @param {坐标位置 {x, y}} coor
   */
  hadStone(coor) {
    return this.gameData[coor.y][coor.x]
  }

  /**
   * 在指定坐标位置落子
   *
   * @param {坐标位置 {x, y}} coor
   */
  dropStone(coor) {
    this.gameData[coor.y][coor.x] = this.isBlack ? 1 : 2
  }
}

export default Board