import React, { useState, useEffect } from 'react'
import { Download, RotateCcw, BarChart3, Clock, CheckCircle, TrendingUp, Award } from 'lucide-react'
import { getInterviewSummary } from '../services/api'
import './SummaryScreen.css'

const SummaryScreen = ({ userInfo, interviewData, summary, onRestart }) => {
  const [detailedSummary, setDetailedSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!summary) {
      loadDetailedSummary()
    }
  }, [])

  const loadDetailedSummary = async () => {
    setIsLoading(true)
    try {
      const response = await getInterviewSummary()
      setDetailedSummary(response)
    } catch (error) {
      console.error('Error loading detailed summary:', error)
    }
    setIsLoading(false)
  }

  const getDuration = () => {
    if (interviewData?.startTime && interviewData?.endTime) {
      const start = new Date(interviewData.startTime)
      const end = new Date(interviewData.endTime)
      const diff = Math.floor((end - start) / 1000 / 60) // minutes
      return `${diff} minutes`
    }
    return 'N/A'
  }

  const getScore = () => {
    // Simple scoring based on number of questions answered
    const totalQuestions = interviewData?.questions?.length || 0
    const answeredQuestions = interviewData?.answers?.length || 0
    if (totalQuestions === 0) return 0
    return Math.round((answeredQuestions / totalQuestions) * 100)
  }

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#10b981', icon: Award }
    if (score >= 60) return { level: 'Good', color: '#3b82f6', icon: TrendingUp }
    if (score >= 40) return { level: 'Fair', color: '#f59e0b', icon: BarChart3 }
    return { level: 'Needs Improvement', color: '#ef4444', icon: Clock }
  }

  const score = getScore()
  const performance = getPerformanceLevel(score)
  const PerformanceIcon = performance.icon

  return (
    <div className="summary-screen">
      <div className="summary-container">
        {/* Header */}
        <div className="summary-header">
          <div className="header-content">
            <div className="header-icon">
              <BarChart3 size={32} />
            </div>
            <div>
              <h1>Interview Complete!</h1>
              <p>Here's your performance summary</p>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="performance-overview">
          <div className="score-card">
            <div className="score-circle">
              <PerformanceIcon size={24} color={performance.color} />
            </div>
            <div className="score-details">
              <div className="score-number" data-color={performance.color}>
                {score}%
              </div>
              <div className="score-label">{performance.level}</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <Clock size={20} />
              <div>
                <div className="stat-value">{getDuration()}</div>
                <div className="stat-label">Duration</div>
              </div>
            </div>
            <div className="stat-card">
              <CheckCircle size={20} />
              <div>
                <div className="stat-value">{interviewData?.answers?.length || 0}</div>
                <div className="stat-label">Questions Answered</div>
              </div>
            </div>
            <div className="stat-card">
              <BarChart3 size={20} />
              <div>
                <div className="stat-value">{interviewData?.questions?.length || 0}</div>
                <div className="stat-label">Total Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="detailed-summary">
          <h2>Interview Summary</h2>
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Generating detailed summary...</span>
            </div>
          ) : (
            <div className="summary-content">
              {detailedSummary?.summary ? (
                <div className="summary-text">
                  {detailedSummary.summary}
                </div>
              ) : (
                <div className="summary-text">
                  <p>Great job completing the Excel interview! You answered {interviewData?.answers?.length || 0} out of {interviewData?.questions?.length || 0} questions.</p>
                  <p>Your performance shows {performance.level.toLowerCase()} understanding of Excel concepts. Keep practicing to improve your skills!</p>
                </div>
              )}

              {detailedSummary?.data_insights && (
                <div className="data-insights">
                  <h3>Data Insights</h3>
                  <div className="insights-grid">
                    <div className="insight-item">
                      <span className="insight-label">Total Records:</span>
                      <span className="insight-value">{detailedSummary.data_insights.total_records}</span>
                    </div>
                    <div className="insight-item">
                      <span className="insight-label">Date Range:</span>
                      <span className="insight-value">{detailedSummary.data_insights.date_range}</span>
                    </div>
                    <div className="insight-item">
                      <span className="insight-label">Regions:</span>
                      <span className="insight-value">{detailedSummary.data_insights.regions?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question Review */}
        {interviewData?.answers && interviewData.answers.length > 0 && (
          <div className="question-review">
            <h2>Question Review</h2>
            <div className="questions-list">
              {interviewData.answers.map((item, index) => (
                <div key={index} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-difficulty">{item.question.difficulty}</span>
                  </div>
                  <div className="question-text">{item.question.question}</div>
                  <div className="answer-text">
                    <strong>Your Answer:</strong> {item.answer}
                  </div>
                  {item.question.expected_answer && (
                    <div className="expected-answer">
                      <strong>Expected:</strong> {item.question.expected_answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="summary-actions">
          <button onClick={onRestart} className="btn btn-primary">
            <RotateCcw size={20} />
            Start New Interview
          </button>
          <button 
            onClick={() => window.open('/api/start', '_blank')}
            className="btn btn-secondary"
          >
            <Download size={20} />
            Download Data
          </button>
        </div>
      </div>

      
    </div>
  )
}

export default SummaryScreen
