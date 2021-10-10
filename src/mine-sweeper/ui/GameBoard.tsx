import './GameBoard.css'

import { useEffect, useState, useCallback } from 'react'

import { MineSweeperInterface, Cell, GameStatus } from '../game/types'
import { MineSweeper } from '../game/MineSweeper'
import { GamePanel } from './GamePanel'
import { ControlPanel } from './ControlPanel'
import { useMouseHolding } from './hooks'

export function GameBoard() {

  const [game, setGame ] = useState<MineSweeperInterface>()
  const [status, setStatus] = useState<GameStatus>()
  const [cells, setCells] = useState<readonly Cell[][]>([])
  const [minesLeft, setMinesLeft] = useState<number>(0)
  const [width, setWidth] = useState(0)

  const reset = useCallback(() => {
    const game = new MineSweeper(16, 30, 9)
    game.start()
    setGame(game)
  }, [setGame])

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    if(!game) return
    
    setStatus(game.status)
    setCells(game.cells)
    setMinesLeft(game.minesLeft)

    setWidth(game.cols * 26 + 6)
  }, [game, setCells, setWidth])

  const revealCell = (row: number, col: number) => {

    if(!game || status !== 'running') return

    game.reveal(row, col)

    //console.log('game: ', game)
    setStatus(game.status)
    setCells(game.cells)
    setMinesLeft(game.minesLeft)
  }

  const flagCell = (row: number, col: number) => {
    if(!game || status !== 'running') return

    game.flag(row, col)

    setStatus(game.status)
    setCells(game.cells)
    setMinesLeft(game.minesLeft)
  }

  const {mouseHolding, setMouseHolding, handleMouseUp, handleMouseLeave, handleMouseEnter } = useMouseHolding()

  const handleMouseHoldingForCell = () => {
    if(game?.status !== 'running') return
    setMouseHolding('cell')
  }

  return (
    <div className="game-board" style={{width: width + 'px'}} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <ControlPanel minesLeft={minesLeft} 
        gameStatus={game?.status}
        mouseHolding={mouseHolding === 'status'} 
        onReset={reset} 
        onMouseHolding={() => setMouseHolding('status')} />

      <GamePanel cells={cells} 
        revealCell={revealCell} 
        flagCell={flagCell} 
        onMouseHolding={() => handleMouseHoldingForCell()} 
        mouseHolding={game?.status === 'running' && mouseHolding === 'cell'} />
    </div>
  )
}