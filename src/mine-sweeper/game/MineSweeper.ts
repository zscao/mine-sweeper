import { Cell, CellStatus, GameStatus, MineSweeperInterface } from './types'

export class MineSweeper implements MineSweeperInterface {

  private _rows: number
  private _cols: number
  private _status: GameStatus

  private _mineIndex: number[] // the indexes of mine. the index is calculated as row * cols + col
  private _mineCount: number[] // the number of surrounding mines (including the mine in itself )
  private _cells: CellStatus[]

  private _firstClick = true

  public get rows(): number {
    return this._rows
  }

  public get cols(): number {
    return this._cols
  }

  public get status(): GameStatus {
    return this._status
  }

  public get minesLeft(): number {
    const total = this._mineIndex.length
    const flagged = this._cells.filter(c => c === 'flagged').length
    return  total - flagged
  }

  public get cells(): Cell[][] {
    const result: Cell[][] = []

    for(let r = 0; r < this.rows; r ++) {
      const row: Cell[] = []

      for(let c = 0; c < this.cols; c ++) {
          const index = r * this.cols + c
          row.push({
            isMine: this.isMine(index),
            status: this._cells[index],
            mineCount: this._mineCount[index]
          })
      }

      result.push(row)
    }

    return result
  }


  constructor(rows: number, cols: number, mines: number) {
    
    // adjust the number of mines in case it is given incorrect number
    if(mines >= rows * cols) mines = rows * cols - 1

    this._rows = rows
    this._cols = cols

    this._cells = new Array<CellStatus>(this.rows * this.cols).fill('init')
    this._mineCount = new Array<number>(this.rows * this.cols).fill(0)
    this._mineIndex = initMines(this.rows, this.cols, mines)
    
    this._status = 'running'
  }

  // start the game with a given cell so the player will not hit a mine in the first click
  public start(row: number, col: number) {

    this.countMines()

  }

  public reveal(row: number, col: number) {

    if(this.status !== 'running' || this.outRange(row, col)) return
    if(this.outRange(row, col)) return

    const index = row * this.cols + col

    const cell = this._cells[index]
    if(cell !== 'init') return


    if(this._firstClick) {
      if(this.isMine(index)) this.moveMine(index)
      this.countMines()

      this._firstClick = false
    }

    // reveal all mines
    if(this.isMine(index)) {
      this.revealMines()
      
      this._cells[index] = 'triggered'
      this._status = 'lost'
    }
    else {
      this.revealCell(row, col)
      
      // check if the player has won the game
      const solved = this._cells
        .filter((x, index) => !this.isMine(index))
        .every(x => x === 'revealed')

      if(solved) {
        this.flagMines()
        this._status = 'won'
      }
    }
  }

  public revealSurroundings(row: number, col: number) {

    if(this.status !== 'running' || this.outRange(row, col)) return;

    const index = row * this.cols + col

    const cell = this._cells[index]
    if(cell !== 'revealed') return

    // reveal surroundings only when the number of flagged mines matches the mine count in the cell
    let flagged = 0
    this.forSurroundings(row, col, (r, c) => {
      const i = r * this.cols + c
      if(this._cells[i] === 'flagged') flagged ++
    })

    if(this._mineCount[index] === flagged) {
      this.forSurroundings(row, col, (r, c) => {
        this.reveal(r, c)
      })
    }
  }


  public flag(row: number, col: number) {
    if(this.status !== 'running' || this.outRange(row, col)) return;

    const index = row * this.cols + col
        
    if(this._cells[index] === 'revealed') return

    if(this._cells[index] === 'init') {
      this._cells[index] = 'flagged'
    }
    else if(this._cells[index] === 'flagged') {
      this._cells[index] = 'init'
    }
  }

  private revealMines() {
    this._mineIndex.forEach(index => {
      this._cells[index] = 'revealed'
    })    
  }

  private flagMines() {
    this._mineIndex.forEach(index => {
      this._cells[index] = 'flagged'
    })    
  }

  private revealCell(row: number, col: number) {
    if(this.outRange(row, col)) return

    const index = row * this.cols + col
    if(this._cells[index] !== 'init') return
    
    this._cells[index] = 'revealed'

    if(this._mineCount[index] > 0) return

    // reveal other surrounding cells
    this.revealCell(row-1, col-1)
    this.revealCell(row-1, col)
    this.revealCell(row-1, col+1)
    this.revealCell(row, col-1)
    this.revealCell(row, col+1)
    this.revealCell(row+1, col-1)
    this.revealCell(row+1, col)
    this.revealCell(row+1, col+1)
  }

  private countMines() {
    for(let row = 0; row < this.rows; row++) {
      for(let col = 0; col < this.cols; col++) {
        const index = row * this.cols + col
        if(!this.isMine(index)) continue
        
        this._mineCount[index] += 1

        this.forSurroundings(row, col, (r, c) => {
          this._mineCount[r * this.cols + c] += 1
        })
      }
    }  
  }

  private moveMine(indexToMove: number) {

    const total = this._mineIndex.length

    // move the mine to next available place if the percentage of mines is more than 50
    if(total / this._cells.length > 0.5) {
      let index = indexToMove + 1
      while(true) {
        if(index >= this._cells.length) index = 0;
        if(!this.isMine(index)) {
          this._mineIndex = [index, ...this._mineIndex.filter(x => x !== indexToMove)]
          return
        }
        index++
      }
    }

    // move the mine to a random place
    while(true) {
      const index = getRandomInt(total)

      if(!this.isMine(index)) {
        this._mineIndex = [index, ...this._mineIndex.filter(x => x !== indexToMove)]
        return
      }
    }
  }


  // provide an iteration of the position (row & col) of surrounding cells
  private forSurroundings(row: number, col: number, callback: (r: number, c: number) => void) {
    if(!this.outRange(row - 1, col - 1)) callback(row-1, col-1)
    if(!this.outRange(row - 1, col)) callback(row-1, col)
    if(!this.outRange(row - 1, col + 1)) callback(row-1, col+1)

    if(!this.outRange(row, col - 1)) callback(row, col-1)
    if(!this.outRange(row, col + 1)) callback(row, col+1)

    if(!this.outRange(row + 1, col - 1)) callback(row+1, col-1)
    if(!this.outRange(row + 1, col)) callback(row+1, col)
    if(!this.outRange(row + 1, col + 1)) callback(row+1, col+1)
  }

  private isMine(index: number): boolean {
    return this._mineIndex.includes(index)
  }


  private outRange(row: number, col: number): boolean {
    return (row < 0 || col < 0 || row >= this.rows || col >= this.cols)
  }
}

export function initMines(rows: number, cols: number, mines: number): number[] {

  const total = rows * cols

  const result: number[] = []

  // init mines
  while(mines > 0) {
    const index = getRandomInt(total)

    if(!result.includes(index)) {
      mines --
      result.push(index)
    }
  }

  return result
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}