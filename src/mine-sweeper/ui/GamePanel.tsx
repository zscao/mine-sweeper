
import './GamePanel.css'

import { useState } from 'react'

import { Cell } from '../game/types'
import { GameCell } from './GameCell'

type GamePanelProps = {
  cells:readonly Cell[][];
  revealCell: (row: number, col: number) => void;
  flagCell: (row: number, col: number) => void;
  onMouseHolding: () => void;
  mouseHolding: boolean;
}

type Position = {
  row: number;
  col: number;
}

export function GamePanel({cells, mouseHolding, ...actions}: GamePanelProps) {

  const [heldCells, setHeldCells ] = useState<Position[]>([])

  const handleMouseEnterCell = (row: number, col: number) => {
    if(!mouseHolding) return
    setHeldCells([{row, col}])
  }

  const handleMouseLeaveCell = (row: number, col: number) => {
    if(!mouseHolding) return
    setHeldCells([])
  }

  const handleLeftButtonUp = (row: number, col: number) => {
    if(!mouseHolding) return
    actions.revealCell(row, col)
  }

  const handleLeftButtonDown = (cell: Cell, row: number, col: number) => {
    if(cell.status !== 'init') return
    setHeldCells([{row, col}])
    actions.onMouseHolding()
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
              onMouseEnter={() => handleMouseEnterCell(rowIndex, colIndex)}
              onMouseLeave={() => handleMouseLeaveCell(rowIndex, colIndex)}
            />
          )}
        </div>
      )}
    </div>
  )
}
