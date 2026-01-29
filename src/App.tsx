import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Set target date (30 days from now)
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="time-unit">
      <div className="time-value">{String(value).padStart(2, '0')}</div>
      <div className="time-label">{label}</div>
    </div>
  )

  return (
    <div className="coming-soon-container">
      <div className="background-grid"></div>
      <div className="content">
        <div className="glitch-wrapper">
          <h1 className="glitch" data-text="COMING SOON">
            COMING SOON
          </h1>
        </div>
        <p className="subtitle">The Last Code Bender</p>
        <p className="description">Something amazing is on the way. Stay tuned!</p>
        
        <div className="timer-container">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <div className="separator">:</div>
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <div className="separator">:</div>
          <TimeUnit value={timeLeft.minutes} label="MINUTES" />
          <div className="separator">:</div>
          <TimeUnit value={timeLeft.seconds} label="SECONDS" />
        </div>

        <div className="tech-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
      </div>
    </div>
  )
}

export default App

