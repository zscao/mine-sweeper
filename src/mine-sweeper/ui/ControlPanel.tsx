import './ControlPanel.css'

import React, { useState } from 'react'
import { GameStatus } from '../game/types'

type ControlPanelProps = {
  gameStatus?: GameStatus;
  timeUsed: number;
  minesLeft: number;
  onReset: () => void;
  onMouseHolding: () => void;
  mouseHolding: boolean;
}


export function ControlPanel({minesLeft, timeUsed, mouseHolding, gameStatus, onReset, onMouseHolding}: ControlPanelProps) {

  const [ mouseIn, setMouseIn ] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    // The game is not reset immediately when the left button is pressed.
    // A holding status is shown instead.
    if(e.button === 0) {
      onMouseHolding()
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // reset the game when mouse up
    if(mouseHolding && e.button === 0) {
      onReset()
    }
  }

  if(minesLeft > 999) minesLeft = 999
  if(minesLeft < -99) minesLeft = minesLeft % 100

  if(timeUsed > 999) timeUsed = 999

  return (
    <div className='control-panel'>
      <div className="counter">{zeroPad(minesLeft, 3)}</div>
      <div className={"game-status" + (mouseIn && mouseHolding ? ' holding' : '')}
        onMouseUp={handleMouseUp} 
        onMouseDown={handleMouseDown}
        onMouseOut={() => setMouseIn(false)}
        onMouseEnter={() => setMouseIn(true)}
      >{getGamsStatusSymbal(gameStatus)}</div>
      <div className="counter">{zeroPad(timeUsed, 3)}</div>
    </div>
  )
}

function zeroPad(value: number, size: number): string {

  const sign = value < 0 ? '-' : ''
  value = value < 0 ? -1 * value : value
  size = size - sign.length  

  const zeros = size - value.toString().length + 1
  return sign + Array(+(zeros > 0 && zeros)).join('0') + value
}

function getGamsStatusSymbal(status?: GameStatus): string {
  switch(status) {
    case 'init': return '🙂'
    case 'running': return '🙂'
    case 'lost': return '🤕'
    case 'won': return '😀'
    default: return '🙂'
  }
}