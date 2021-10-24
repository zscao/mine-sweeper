
// init: the initial status
// flagged: the cell is mark as a mine
// revealed: the cell is revealed
// trigger: the cell is a mine and been triggered
export type CellStatus  = 'init' | 'flagged' | 'revealed' | 'triggered'

export type Cell = {
  isMine: boolean;
  status: CellStatus;
  mineCount: number;  // the number of surrounding mines (including the mine in itself)
}

export type GameStatus = 'init' | 'running' | 'won' | 'lost'

export interface MineSweeperInterface {
  get status(): GameStatus

  get rows(): number
  get cols(): number
  get minesLeft(): number

  get cells(): readonly Cell[][]

  start(row: number, col: number): void;
  reveal(row: number, col: number): void
  revealSurroundings(row: number, col: number): void
  flag(row: number, col: number): void
}