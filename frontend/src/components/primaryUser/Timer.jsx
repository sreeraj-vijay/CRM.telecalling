// Timer.jsx
import React, { useState, useEffect, useRef } from "react"
import { formatTime } from "../../utils/timeUtils"

// Adjust the import path as needed

const Timer = ({ isRunning, startTime, onStop }) => {
  const [time, setTime] = useState(0)
  const wasRunning = useRef(isRunning)

  useEffect(() => {
    console.log("isrunnning", isRunning)
    console.log("starttime", startTime)
   
    let interval = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, startTime])

  useEffect(() => {
    if (wasRunning.current && !isRunning && startTime !== null) {
      console.log("time in useref", time)
      // Only call onStop when the timer transitions from running to stopped
      onStop(time)
    }
    wasRunning.current = isRunning
  }, [isRunning, onStop, startTime])

  return (
    <div className="flex container justify-center items-center">
      <p className="text-2xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Call Duration: {formatTime(time)}
      </p>
    </div>
  )
}

export default Timer
