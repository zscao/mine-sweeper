import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimeCounter() {

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
  }, [intervalRef])

  const start = useCallback(() => {
    if(intervalRef.current) window.clearInterval(intervalRef.current)

    let c = 1
    setCounter(c)

    intervalRef.current = window.setInterval(() => {
      setCounter(++c)
    }, 1000)
  }, [setCounter, intervalRef])

  const stop = useCallback(() => {
    if(intervalRef.current) window.clearInterval(intervalRef.current)
  }, [intervalRef])

  return {
    counter,
    start, 
    stop,
    reset,
  }

}