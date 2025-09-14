import React, { useState, useEffect } from 'react'
import { MessageSquare, BarChart3, Home, User, Clock } from 'lucide-react'
import './NavBar.css'

const Navbar = ({ currentScreen, onNavigate, userInfo, interviewData }) => {
  const [duration, setDuration] = useState(null)

  // update timer every second
  useEffect(() => {
    let interval
    if (currentScreen === 'chat' && interviewData?.startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const start = new Date(interviewData.startTime)
        const diffSec = Math.floor((now - start) / 1000)

        const minutes = Math.floor(diffSec / 60)
        const seconds = diffSec % 60

        // format as mm:ss
        const formatted = `${String(minutes).padStart(2, '0')}:${String(
          seconds
        ).padStart(2, '0')}`

        setDuration(formatted)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentScreen, interviewData?.startTime])

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'welcome':
        return 'Welcome'
      case 'chat':
        return 'Interview Session'
      case 'summary':
        return 'Interview Summary'
      default:
        return 'AI Excel Agent'
    }
  }

  const getProgress = () => {
    if (currentScreen === 'chat' && interviewData?.questions?.length > 0) {
      return Math.round(
        ((interviewData.answers?.length || 0) / interviewData.questions.length) * 100
      )
    }
    return 0
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Title */}
        <div className="navbar-brand">
          <div className="logo">
            <BarChart3 size={24} />
          </div>
          <div className="brand-text">
            <h1>AI Excel Agent</h1>
            <span className="subtitle">{getScreenTitle()}</span>
          </div>
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="user-info">
            <User size={16} />
            <span>{userInfo.name}</span>
            {userInfo.role && <span className="role">{userInfo.role}</span>}
          </div>
        )}

        {/* Progress and Stats */}
        {currentScreen === 'chat' && (
          <div className="interview-stats">
            {duration && (
              <div className="stat">
                <Clock size={16} />
                <span>{duration}</span>
              </div>
            )}
            {interviewData?.questions?.length > 0 && (
              <div className="stat">
                <MessageSquare size={16} />
                <span>
                  {interviewData.answers?.length || 0}/{interviewData.questions.length}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="navbar-nav">
          {currentScreen !== 'welcome' && (
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('welcome')}
            >
              <Home size={16} />
              Home
            </button>
          )}

          {currentScreen === 'chat' && (
            <button
              className="btn btn-danger"
              onClick={() => onNavigate('summary')}
            >
              End Interview
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {currentScreen === 'chat' && interviewData?.questions?.length > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ '--progress-width': `${getProgress()}%` }}
            />
          </div>
          <span className="progress-text">{getProgress()}% Complete</span>
        </div>
      )}
    </nav>
  )
}

export default Navbar
