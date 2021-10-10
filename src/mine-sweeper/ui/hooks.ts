import { useState, useRef, useEffect } from 'react'

export function useMouseHolding() {
  const [ mouseHolding, setMouseHolding ] = useState('')
  const timeoutRef = useRef<number>()

  // clear up the timeout when the component is unmounted
  useEffect(() => {
    return () => {
      if(timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMouseUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()

    // clear the holding status
    setMouseHolding('')
  }

  const handleMouseLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()

    if(mouseHolding) {
      // The holding status is not cleared immediately when the mouse is leaving the board.
      // Instead, we wait for a while in case the mouse is accidentally moused out
      timeoutRef.current = window.setTimeout(() => {
  
        setMouseHolding('')
        timeoutRef.current = 0
      }, 500)
    }
  }

  const handleMouseEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()

    // clear up the timeout when mouse is back in time
    if(timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
  }

  return {
    mouseHolding,
    setMouseHolding,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter
  }
}