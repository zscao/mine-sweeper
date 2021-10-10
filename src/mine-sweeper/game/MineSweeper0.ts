type GameStatus = 'started' | 'succeeded' | 'failed'
type CellStatus = 'init' | 'flag' | 'show'

export interface Cell {
  status: CellStatus;
  isMine: boolean;
  mineCount: number;
}

export class MineSweeper {

  private _status: GameStatus;
  private _cells: Cell[][];

  public get status(): string {
    return this._status
  }

  public get cols(): number {
    return this._cells[0].length
  }

  public get rows(): number {
    return this._cells.length
  }

  public get cells(): Cell[][] {
    return this._cells
  }

  constructor(rows: number, cols: number, totalMine: number) {
    this._cells = initCells(rows, cols, totalMine)
    this._status = 'started'
  }

  public reveal(row: number, col: number) {

    if(this.status !== 'started') return;

    if(row < 0 || col < 0 || row >= this.rows || col >= this.cols) return

    const cell = this._cells[row][col]
    if(cell.status !== 'init') return

    // reveal all mines
    if(cell.isMine) {
      this.revealMine(row, col)
      this._status = 'failed'
    }
    else {
      this.revealCell(row, col)
    }

    this._cells = [...this.cells]
  }

  public flag(row: number, col: number) {
    if(row < 0 || col < 0 || row >= this.rows || col >= this.cols) return
        
    const cell = this._cells[row][col]
    if(cell.status === 'show') return

    if(cell.status === 'init') {
      cell.status = 'flag'
    }
    else if(cell.status === 'flag') {
      cell.status = 'init'
    }

    this._cells = [...this.cells]

  }

  private revealMine(row: number, col: number) {
    if(row < 0 || col < 0 || row >= this.rows || col >= this.cols) return

    for(let row = 0; row < this.rows; row++) {
      for(let col = 0; col < this.cols; col++) {
        const cell = this._cells[row][col]
        if(cell.isMine) cell.status = 'show'
      }
    }
    
  }

  private revealCell(row: number, col: number) {
    this._cells = revealCell(row, col, this._cells)
  }
}


function initCells(rows: number, cols: number, mines: number): Cell[][] {

  const cells: Cell[][] = [];
  for(let row = 0; row < rows; row++) {
    const row: Cell[] = []
    for(let col = 0; col < cols; col++) {
      row.push({
        status: 'init',
        mineCount: 0,
        isMine: false
      })
    }
    cells.push(row)
  }
    
  while(mines > 0) {    
    const row = getRandomInt(rows)
    const col = getRandomInt(cols)

    if(!cells[row][col].isMine) {
      mines --
      cells[row][col].isMine = true
      cells[row][col].mineCount = 1

      // update mine count for other cells
      countMines(row-1, col-1, cells)
      countMines(row-1, col, cells)
      countMines(row-1, col+1, cells)
      countMines(row, col-1, cells)
      countMines(row, col+1, cells)
      countMines(row+1, col-1, cells)
      countMines(row+1, col, cells)
      countMines(row+1, col+1, cells)
    }
  }  
  
  return cells;
}

function countMines(row: number, col: number, cells: Cell[][]) {
  
  if(row < 0 || col < 0) return

  const height = cells.length
  if(row >= height) return

  const width = cells[row].length
  if(col >= width) return

  const cell = cells[row][col]
  
  cell.mineCount += 1
}

function revealCell(row: number, col: number, cells: Cell[][]): Cell[][] {
  if(row < 0 || col < 0) return cells

  const height = cells.length
  if(row >= height) return cells

  const width = cells[row].length
  if(col >= width) return cells

  const cell = cells[row][col]
  if(cell.status === 'init') {
    cell.status = 'show'

    // reveal other surrounding cells
    if(cell.mineCount === 0) {
      revealCell(row-1, col-1, cells)
      revealCell(row-1, col, cells)
      revealCell(row-1, col+1, cells)
      revealCell(row, col-1, cells)
      revealCell(row, col+1, cells)
      revealCell(row+1, col-1, cells)
      revealCell(row+1, col, cells)
      revealCell(row+1, col+1, cells)
    }
  }

  return cells
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}