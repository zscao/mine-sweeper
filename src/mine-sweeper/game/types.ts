
export type CellStatus  = 'init' | 'flagged' | 'revealed'

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

  reveal(row: number, col: number): void
  revealSurroundings(row: number, col: number): void
  flag(row: number, col: number): void
}