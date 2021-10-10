import React from 'react'
import { Cell } from '../game/types'
import './GameCell.css'

type GameCellProps = {
  cell: Cell;
  holding: boolean;
  onLeftButtonDown: () => void;
  onLeftButtonUp: () => void;
  onRightButtonDown: () => void;
  onRightButtonUp: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function GameCell({cell, holding, ...events}: GameCellProps, ) {

  let mineClass = 'mine-box-inner'
  let symbal = ''

  if(cell.status === 'init') {
    mineClass += holding ? ' holding' : ' init'
  }
  if(cell.status === 'flagged') {
    mineClass += ' flagged'
    symbal = '?'
  }
  else if(cell.status === 'revealed') {
    mineClass += ' revealed'
    if(!cell.isMine) {
      mineClass += ' cell-' + cell.mineCount
      symbal = cell.mineCount > 0 ? `${cell.mineCount}` : ''
    }
    else {
      mineClass += ' cell-mine'
      symbal = '⬤' 
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    //console.log('mouse down: ', e)
    
    // right button click
    if(e.button === 0) {
      events.onLeftButtonDown()
    }
    else if(e.button === 2) {
      events.onRightButtonDown()
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    //console.log('mouse up: ', e)

    // left button
    if(e.button === 0) {
      events.onLeftButtonUp()
    }
    else if(e.button === 2) {
      events.onRightButtonUp()
    }
  }


  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('mouse over: ', e)
    events.onMouseEnter()
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('mouse out: ', e)
    events.onMouseLeave()
  }
  
  return (
    <div className="mine-box"
      onContextMenu={e => e.preventDefault()}
      onMouseDown={handleMouseDown} 
      onMouseUp={handleMouseUp} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <div className={mineClass}>{symbal}</div>
    </div>
  )
}