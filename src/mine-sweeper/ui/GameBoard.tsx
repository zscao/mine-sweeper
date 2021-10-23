import './GameBoard.css'

import { useEffect, useState, useCallback } from 'react'

import { MineSweeperInterface, Cell, GameStatus } from '../game/types'
import { MineSweeper } from '../game/MineSweeper'
import { GamePanel } from './GamePanel'
import { ControlPanel } from './ControlPanel'
import { useMouseHolding } from './useMouseHolding'
import { useTimeCounter } from './useTimeCounter'

export function GameBoard() {

  const [gameId, setGameId] = useState(0)
  const [game, setGame ] = useState<MineSweeperInterface>()
  const [cells, setCells] = useState<readonly Cell[][]>([])
  const [minesLeft, setMinesLeft] = useState<number>(0)
  const [width, setWidth] = useState(0)

  const { counter, start: startCounter, stop: stopCounter, reset: resetCounter } = useTimeCounter()

  const refreshGameStatus = useCallback(() => {
    if(!game) return

    setCells(game.cells)
    setMinesLeft(game.minesLeft)

    if(game.status !== 'running') stopCounter()

  }, [game, setCells, setMinesLeft, stopCounter])

  // reset game will be triggered by the increment of game id
  useEffect(() => {
    const game = new MineSweeper(16, 30, 99)
    //game.start()
    setGame(game)
    resetCounter()
  }, [gameId, resetCounter])

  // refresh game status when game is changed
  useEffect(() => {
    if(!game) return
    setWidth(game.cols * 26 + 6)
    
    refreshGameStatus()
  }, [game, setWidth, refreshGameStatus])

  const revealCell = (row: number, col: number) => {

    if(!game || !guardGameRunning()) return

    game.reveal(row, col)
    refreshGameStatus()
  }

  const revealSurroundings = (row: number, col: number) => {

    if(!game || !guardGameRunning()) return

    game.revealSurroundings(row, col)
    refreshGameStatus()
  }

  const flagCell = (row: number, col: number) => {
    if(!game || !guardGameRunning()) return

    game.flag(row, col)
    refreshGameStatus()
  }

  const guardGameRunning = (): boolean => {
    if(!game) return false

    if(game.status === 'init') {
      game.start()
      startCounter()
    }

    return game.status === 'running'
  }


  const {mouseHolding, setMouseHolding, handleMouseUp, handleMouseLeave, handleMouseEnter } = useMouseHolding()

  const handleMouseHoldingForCell = () => {
    if(!guardGameRunning()) return
    setMouseHolding('cell')
  }

  return (
    <div className="game-board" style={{width: width + 'px'}} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <ControlPanel 
        minesLeft={minesLeft} 
        timeUsed={counter}
        gameStatus={game?.status}
        mouseHolding={mouseHolding === 'status'} 
        onReset={() => setGameId(gameId + 1)} 
        onMouseHolding={() => setMouseHolding('status')} />

      <GamePanel cells={cells} 
        revealCell={revealCell} 
        revealSurroundings={revealSurroundings}
        flagCell={flagCell} 
        onMouseHolding={() => handleMouseHoldingForCell()} 
        mouseHolding={game?.status === 'running' && mouseHolding === 'cell'} />
    </div>
  )
}