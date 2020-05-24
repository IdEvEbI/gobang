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
      p.x + 2, p.y - 2, 0)

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
    this.count = count                                    // 棋盘格子数
    this.isBlack = true                                   // 是否黑棋
    this.isGameOver = false                               // 游戏结束标记

    this.wins = []                                        // 赢法数组
    this.winsCount = this.initWins()                      // 初始化赢法，并返回赢法总数

    console.log(`[gobang]: 赢法数组初始化完毕，共有 ${this.winsCount} 种赢法。`)

    this.blackWins = new Array(this.winsCount).fill(0)    // 黑棋胜利统计数组
    this.whiteWins = new Array(this.winsCount).fill(0)    // 白棋胜利统计数组

    this.gameData = []                                    // 游戏数据二维数组

    // 初始化棋盘数组
    for (let i = 0; i < this.count; i++) {
      this.gameData[i] = new Array(this.count).fill(0)
    }

    this.resetData()
  }

  /**
   * 初始化赢法数组
   */
  initWins() {

    // 初始化赢法三维数组
    for (let y = 0; y < this.count; y++) {
      this.wins[y] = []
      for (let x = 0; x < this.count; x++) {
        this.wins[y][x] = []
      }
    }

    // 赢法计数
    let num = 0

    // 1. 横向赢法
    for (let y = 0; y < this.count; y++) {
      for (let x = 0; x < this.count - 4; x++) {
        for (let k = 0; k < 5; k++) {
          this.wins[y][x + k][num] = true
        }
        num++
      }
    }

    // 2. 纵向赢法
    for (let x = 0; x < this.count; x++) {
      for (let y = 0; y < this.count - 4; y++) {
        for (let k = 0; k < 5; k++) {
          this.wins[y + k][x][num] = true
        }
        num++
      }
    }

    // 3. 反斜线赢法
    for (let y = 0; y < this.count - 4; y++) {
      for (let x = 0; x < this.count - 4; x++) {
        for (let k = 0; k < 5; k++) {
          this.wins[y + k][x + k][num] = true
        }
        num++
      }
    }

    // 4. 斜线赢法
    for (let y = 0; y < this.count - 4; y++) {
      for (let x = this.count - 1; x > 3; x--) {
        for (let k = 0; k < 5; k++) {
          this.wins[y + k][x - k][num] = true
        }
        num++
      }
    }

    return num
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

    this.blackWins.fill(0)
    this.whiteWins.fill(0)
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

    // 遍历所有的赢法
    let current = this.isBlack ? this.blackWins : this.whiteWins
    let opponent = this.isBlack ? this.whiteWins : this.blackWins

    for (let i = 0; i < this.winsCount; i++) {
      if (this.wins[coor.y][coor.x][i]) {
        current[i]++
        opponent[i] = -1

        // 判断当前玩家的胜负
        if (current[i] === 5) {
          console.log(`${this.isBlack ? '黑棋' : '白棋'}胜利。`)

          this.isGameOver = true
        }
      }
    }
  }

  /**
   * 返回合适的落子坐标
   */
  findAICoor() {
    console.log(`${this.isBlack ? '黑棋' : '白棋'} 的 AI 正在思考落子位置……。`)

    // 1. 获得赢法数组
    let currentWins = this.isBlack ? this.blackWins : this.whiteWins
    let opponentWins = this.isBlack ? this.whiteWins : this.blackWins

    // 2. 初始化得分数组
    let currentScore = []
    let opponentScore = []

    for (let y = 0; y < this.count; y++) {
      currentScore[y] = new Array(this.count).fill(0)
      opponentScore[y] = new Array(this.count).fill(0)
    }

    let max = 0

    // 3. 遍历棋盘
    for (let y = 0; y < this.count; y++) {
      for (let x = 0; x < this.count; x++) {
        // 4. 如果该位置还没有落子，则计算该位置的分值权重
        if (this.gameData[y][x] === 0) {
          // 遍历所有的赢法数组
          for (let k = 0; k < this.winsCount; k++) {
            if (this.wins[y][x][k]) {
              // 计算对手分数
              if (opponentWins[k] === 1) {
                opponentScore[y][x] += 200
              } else if (opponentWins[k] === 2) {
                opponentScore[y][x] += 400
              } else if (opponentWins[k] === 3) {
                opponentScore[y][x] += 2000
              } else if (opponentWins[k] === 4) {
                opponentScore[y][x] += 10000
              }
              // 计算本方分数
              if (currentWins[k] === 1) {
                currentScore[y][x] += 220
              } else if (currentWins[k] === 2) {
                currentScore[y][x] += 420
              } else if (currentWins[k] === 3) {
                currentScore[y][x] += 2400
              } else if (currentWins[k] === 4) {
                currentScore[y][x] += 20000
              }
            }
          }

          // 记录最大值
          if (opponentScore[y][x] > max) {
            max = opponentScore[y][x]
          }
          if (currentScore[y][x] > max) {
            max = currentScore[y][x]
          }
        }
      }
    }

    console.assert(max > 0, '出错了。')

    let coors = this.findMaxCoors(opponentScore, currentScore, max)
    let r = Math.floor(Math.random() * (coors.length));
    console.log(`返回第 ${r} 个位置：${coors[r]} (${coors.length})`)
    return coors[r]
  }

  /**
   * 查找最大值的坐标数组
   *
   * @param {对手分数数组} opponentScore
   * @param {本方分数数组} currentScore
   * @param {最大值} max
   */
  findMaxCoors(opponentScore, currentScore, max) {
    let coors = []

    // 遍历棋盘
    for (let y = 0; y < this.count; y++) {
      for (let x = 0; x < this.count; x++) {
        if (opponentScore[y][x] === max) {
          coors.push({ x: x, y: y })
        }
        if (currentScore[y][x] === max) {
          coors.push({ x: x, y: y })
        }
      }
    }

    return coors
  }
}

export default Board
