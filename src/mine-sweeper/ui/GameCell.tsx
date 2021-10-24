import React, { useCallback, useRef } from 'react'
import { Cell } from '../game/types'
import './GameCell.css'

type GameCellProps = {
  cell: Cell;
  holding: boolean;
  onLeftButtonDown: () => void;
  onLeftButtonUp: () => void;
  onRightButtonDown: () => void;
  onRightButtonUp: () => void;
  onBothButtonDown: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function GameCell({cell, holding, ...events}: GameCellProps, ) {

  const postponeRef = useRef<number>()

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('mouse down: ', e)
    
    if(e.buttons === 3) {
      // both button
      window.clearTimeout(postponeRef.current)
      events.onBothButtonDown()
    }
    else if(e.button === 0) {
      // left button
      window.clearTimeout(postponeRef.current)
      postponeRef.current = window.setTimeout(() => {
        events.onLeftButtonDown()
      }, 30)
    }
    else if(e.button === 2) {
      // right button
      window.clearTimeout(postponeRef.current)
      postponeRef.current = window.setTimeout(() => {
        events.onRightButtonDown()
      }, 50)
    }
  }, [events])

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('mouse up: ', e)

    // left button
    if(e.button === 0) {
      events.onLeftButtonUp()
    }
    else if(e.button === 2) {
      events.onRightButtonUp()
    }
  }, [events])


  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('mouse over: ', e)
    events.onMouseEnter()
  }, [events])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('mouse out: ', e)
    events.onMouseLeave()
  }, [events])
  

  let mineClass = 'mine-box-inner'
  let symbal = ''

  if(cell.status === 'init') {
    mineClass += holding ? ' holding' : ' init'
  }
  if(cell.status === 'flagged') {
    mineClass += ' flagged'
    symbal = '🚩'
  }
  else if(cell.status === 'revealed' || cell.status === 'triggered') {
    mineClass += ' revealed'
    if(!cell.isMine) {
      mineClass += ' cell-' + cell.mineCount
      symbal = cell.mineCount > 0 ? `${cell.mineCount}` : ''
    }
    else {
      mineClass += ' cell-mine'
      symbal = '✸' 

      if(cell.status === 'triggered') {
        mineClass += ' trigger'
      }
    }
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