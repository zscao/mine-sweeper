
import './Main.css'

import React, { useState } from 'react'

import { GameBoard, GameMode } from "./ui/GameBoard";
import { GameModeOption } from './GameModeOption';

export function Main() {

  const [mode, setMode] = useState<GameMode>({name: 'expert', row: 16, col: 30, mines: 99})

  return (
    <div className="main-container">
      <div className="game-modes">
        <GameModeOption title="Beginner" size="(9×9)" active={mode.name === 'beginner'} onClick={() => setMode({name: 'beginner', row: 9, col: 9, mines: 10})} />
        <GameModeOption title="Intermediate" size="(16×16)" active={mode.name === 'intermediate'} onClick={() => setMode({name: 'intermediate', row: 16, col: 16, mines: 40})} />
        <GameModeOption title="Expert" size="(30×16)" active={mode.name === 'expert'} onClick={() => setMode({name: 'expert', row: 16, col: 30, mines: 99})} />
        {/* <GameModeCustom /> */}
      </div>
      <GameBoard mode={mode} />
    </div>
  )
}

