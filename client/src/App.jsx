import React, { useState } from 'react'
import Navbar from './components/Navbar'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInterface from './components/ChatInterface'
import SummaryScreen from './components/SummaryScreen'
import { getDataSummary } from './services/api'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome') // welcome, chat, summary
  const [userInfo, setUserInfo] = useState(null)
  const [interviewData, setInterviewData] = useState({
    questions: [],
    answers: [],
    startTime: null,
    endTime: null
  })
  const [summary, setSummary] = useState(null)

  const startInterview = (userData) => {
    setUserInfo(userData)
    setInterviewData(prev => ({
      ...prev,
      startTime: new Date()
    }))
    setCurrentScreen('chat')
  }

  const endInterview = async () => {
    const endTime = new Date()
    setInterviewData(prev => ({
      ...prev,
      endTime
    }))
    
    try {
      // Get summary from backend
      const summaryData = await getDataSummary()
      setSummary(summaryData)
      setCurrentScreen('summary')
    } catch (error) {
      console.error('Error getting summary:', error)
      // Fallback to local summary
      setSummary({
        status: 'success',
        summary: {
          total_questions: interviewData.questions.length,
          duration: Math.round((endTime - interviewData.startTime) / 1000 / 60),
          user_name: userInfo?.name || 'Candidate'
        }
      })
      setCurrentScreen('summary')
    }
  }

  const restartInterview = () => {
    setCurrentScreen('welcome')
    setUserInfo(null)
    setInterviewData({
      questions: [],
      answers: [],
      startTime: null,
      endTime: null
    })
    setSummary(null)
  }

  const handleNavigate = (screen) => {
    if (screen === 'summary') {
      endInterview()
    } else {
      setCurrentScreen(screen)
    }
  }

  return (
    <div className="app">
      <Navbar 
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        userInfo={userInfo}
        interviewData={interviewData}
      />
      
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStartInterview={startInterview} />
      )}
      
      {currentScreen === 'chat' && (
        <ChatInterface
          userInfo={userInfo}
          interviewData={interviewData}
          setInterviewData={setInterviewData}
          onEndInterview={endInterview}
        />
      )}
      
      {currentScreen === 'summary' && (
        <SummaryScreen
          userInfo={userInfo}
          interviewData={interviewData}
          summary={summary}
          onRestart={restartInterview}
        />
      )}
    </div>
  )
}

export default App