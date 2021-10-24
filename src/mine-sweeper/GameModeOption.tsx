import React, { useState } from 'react'


export function GameModeCustom() {

  const [width, setWidth] = useState(30)
  const [height, setHeight] = useState(20)
  const [mines, setMines] = useState(145)


  const handleWidthInput = (value: string) => {
    let w = parseInt(value)
    if(isNaN(w)) return

    if(w < 1) w = 1
    if(w > 40) w = 50
    setWidth(w)
    if(mines > w * height) setMines(w * height)
  }

  const handleHeightInput = (value: string) => {
    let h = parseInt(value)
    if(isNaN(h)) return

    if(h < 1) h = 1
    if(h > 40) h = 50
    setHeight(h)
    if(mines > h * width) setMines(h * width)
  }

  const handleMinesInput = (value: string) => {
    let m = parseInt(value)
    if(isNaN(m)) return

    if(m < 1) m = 1
    if(m > width * height) m = width * height
    setMines(m)
  }

  return (
    <div className={''} onClick={() => {}}>
      <div>Custom</div>
      <div>
        <form>
          <input type="number" placeholder="width" name="width" value={width} onChange={e => handleWidthInput(e.target.value)} />
          <input type="number" placeholder="height" name="height" value={height} onChange={e => handleHeightInput(e.target.value)} />
          <input type="number" placeholder="mines" name="mines" value={mines} onChange={e => handleMinesInput(e.target.value)} />
        </form>
      </div>
    </div>
  )
}


export type GameModeProps = {
  title: string;
  size: string;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function GameModeOption({title, size, active, onClick}: GameModeProps) {
  return (
    <div className={active ? 'active' : ''} onClick={active ? (() => {}) : onClick}>
      <div>{title}</div>
      <div>{size}</div>
    </div>
  )
}