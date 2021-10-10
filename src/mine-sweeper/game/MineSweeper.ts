import { Cell, CellStatus, GameStatus, MineSweeperInterface } from './types'

export class MineSweeper implements MineSweeperInterface {

  private _rows: number
  private _cols: number
  private _status: GameStatus

  private _mineIndex: number[] // the indexes of mine. the index is calculated as row * cols + col
  private _mineCount: number[] // the number of surrounding mines (including the mine in itself )
  private _cells: CellStatus[]


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
        const isMine = this._mineIndex.includes(index)
        row.push({
          isMine: isMine,
          status: this._cells[index],
          mineCount: this._mineCount[index]
        })
      }

      result.push(row)
    }

    return result
  }


  constructor(rows: number, cols: number, mines: number) {
    this._rows = rows
    this._cols = cols
    this._status = 'init'

    this._mineIndex = initMines(rows, cols, mines)
    this._cells = new Array<CellStatus>(rows * cols).fill('init')
    this._mineCount = new Array<number>(this.rows * this.cols).fill(0)

    this.countMines()
  }

  public start() {
    if(this._status !== 'init') return
    
    this._status = 'running'
  }

  public reveal(row: number, col: number) {

    if(this.status !== 'running' || this.outRange(row, col)) return;

    const index = row * this.cols + col
    if(index < 0 || index >= this._cells.length) return

    const cell = this._cells[index]
    if(cell !== 'init') return

    // reveal all mines
    if(this._mineIndex.includes(index)) {
      this.revealMines()
      this._status = 'lost'
    }
    else {
      this.revealCell(row, col)
      
      // check if the player has won the game
      const solved = this._cells
        .filter((x, index) => !this._mineIndex.includes(index))
        .every(x => x === 'revealed')

      if(solved) {
        this.flagMines()
        this._status = 'won'
      }
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
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.cols; c++) {
        const index = r * this.cols + c
        if(this._mineIndex.includes(index)) {
          this._mineCount[index] += 1
  
          this.incrementMines(r - 1, c - 1)
          this.incrementMines(r - 1, c)
          this.incrementMines(r - 1, c + 1)
  
          this.incrementMines(r, c - 1)
          this.incrementMines(r, c + 1)
  
          this.incrementMines(r + 1, c - 1)
          this.incrementMines(r + 1, c)
          this.incrementMines(r + 1, c + 1)
        }
      }
    }  
  }

  private incrementMines(row: number, col: number) {
    if(this.outRange(row, col)) return
    this._mineCount[row * this.cols + col] += 1
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