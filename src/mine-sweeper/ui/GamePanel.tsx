
import './GamePanel.css'

import { useState } from 'react'

import { Cell } from '../game/types'
import { GameCell } from './GameCell'

type GamePanelProps = {
  cells:readonly Cell[][];
  revealCell: (row: number, col: number) => void;
  revealSurroundings: (row: number, col: number) => void;
  flagCell: (row: number, col: number) => void;
  onMouseHolding: (row: number, col: number) => void;
  mouseHolding: boolean;
}

type Position = {
  row: number;
  col: number;
}

export function GamePanel({cells, mouseHolding, ...actions}: GamePanelProps) {

  const [heldType, setHeldType] = useState('')
  const [heldCells, setHeldCells ] = useState<Position[]>([])

  const handleMouseEnterCell = (row: number, col: number) => {
    if(!mouseHolding) return
    
    if(heldType === 'single') {
      setHeldCells([{row, col}])
    }
    else if(heldType === 'multi') {
      setHeldCells(getSurroundingCells(row, col, cells))
    }
  }

  const handleMouseLeaveCell = (row: number, col: number) => {
    if(!mouseHolding) return
    setHeldCells([])
  }

  const handleLeftButtonUp = (row: number, col: number) => {

    if(!mouseHolding) return

    if(heldType === 'single') {
      actions.revealCell(row, col)
    }
    else if(heldType === 'multi') {
      actions.revealSurroundings(row, col)
    }
  }

  const handleLeftButtonDown = (cell: Cell, row: number, col: number) => {
    
    if(cell.status !== 'init') return

    setHeldType('single')
    setHeldCells([{row, col}])
    actions.onMouseHolding(row, col)
  }

  const handleBothButtonDown = (cell: Cell, row: number, col: number) => {
    setHeldType('multi')
    setHeldCells(getSurroundingCells(row, col, cells))
    actions.onMouseHolding(row, col)
  }


  return (
    <div className="game-panel">
      {cells.map((row, rowIndex) => 
        <div className="mine-row" key={rowIndex}>
          {row.map((cell, colIndex) => 
            <GameCell key={`${rowIndex}-${colIndex}`} 
              cell={cell} 
              holding={mouseHolding && !!(heldCells.find(x => x.row === rowIndex && x.col === colIndex))}
              onLeftButtonUp={() => handleLeftButtonUp(rowIndex, colIndex)} 
              onRightButtonDown={() => actions.flagCell(rowIndex, colIndex)}
              onLeftButtonDown={() => handleLeftButtonDown(cell, rowIndex, colIndex)}
              onRightButtonUp={() => {}} 
              onBothButtonDown={() => handleBothButtonDown(cell, rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnterCell(rowIndex, colIndex)}
              onMouseLeave={() => handleMouseLeaveCell(rowIndex, colIndex)}
            />
          )}
        </div>
      )}
    </div>
  )
}

function getSurroundingCells(row: number, col: number, cells: readonly Cell[][]): Position[] {
  const result: Position[] = []
  if(!isOutRange(row-1, col-1, cells)) result.push({row: row-1, col: col-1})
  if(!isOutRange(row-1, col, cells)) result.push({row: row-1, col})
  if(!isOutRange(row-1, col+1, cells)) result.push({row: row-1, col: col+1})

  if(!isOutRange(row, col-1, cells)) result.push({row, col: col-1})
  if(!isOutRange(row, col, cells)) result.push({row, col})
  if(!isOutRange(row, col+1, cells)) result.push({row, col: col+1})

  if(!isOutRange(row+1, col-1, cells)) result.push({row: row+1, col: col-1})
  if(!isOutRange(row+1, col, cells)) result.push({row: row+1, col})
  if(!isOutRange(row+1, col+1, cells)) result.push({row: row+1, col: col+1})
  
  return result
}

function isOutRange(row: number, col: number, cells: readonly Cell[][]) {
  if(row < 0 || col < 0 || row >= cells.length) return true;

  return col >= cells[row].length
}
