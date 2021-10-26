import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimeCounter() {

  const [started, setStarted] = useState(false)
  const [counter, setCounter] = useState(0)
  const intervalRef = useRef<number>()

  useEffect(() => {
    return () => {
      if(intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  const reset = useCallback(() => {
    if(intervalRef.current) window.clearInterval(intervalRef.current)
    setCounter(0)
    setStarted(false)
  }, [intervalRef])

  const start = useCallback(() => {
    if(started) return
    setStarted(true)
    if(intervalRef.current) window.clearInterval(intervalRef.current)

    let c = 1
    setCounter(c)

    intervalRef.current = window.setInterval(() => {
      setCounter(++c)
    }, 1000)

  }, [started, intervalRef])

  const stop = useCallback(() => {
    if(intervalRef.current) window.clearInterval(intervalRef.current)
    setStarted(false)

  }, [intervalRef])

  return {
    counter,
    start, 
    stop,
    reset,
  }

}