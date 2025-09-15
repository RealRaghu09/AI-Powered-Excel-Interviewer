import React, { useState, useEffect } from 'react'
import Loading from './Loading'
import { Download, RotateCcw, BarChart3, Clock, CheckCircle, TrendingUp, Award } from 'lucide-react'
import { getSummary } from '../services/api'
import './SummaryScreen.css'

const SummaryScreen = ({ userInfo, interviewData, onRestart }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Prefer summary passed from App (collected once when interview ends)
    if (interviewData?.summary) {
      setSummary(interviewData.summary)
      setIsLoading(false)
      return
    }
    loadSummary()
  }, [])

  const loadSummary = async () => {
    try {
      const summaryData = await getSummary()
      setSummary(summaryData)
      setError(null)
    } catch (err) {
      console.error('Error loading summary:', err)
      setError('Failed to load summary. Please ensure the interview has started and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading message="Loading Interview Summary..." />
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
  const apiScore = typeof summary?.overall_score === 'number' ? summary.overall_score : null
  const displayScore = apiScore !== null ? apiScore : score
  const scoreColor = displayScore > 50 ? '#10b981' : '#ef4444'
  const PerformanceIcon = displayScore > 50 ? Award : Clock

  const hasApiSummary = summary && !summary.error
  const recommendation = (summary && summary.recommendation) || 'Follow-up'

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
              <PerformanceIcon size={24} color={scoreColor} />
            </div>
            <div className="score-details">
              <div className="score-number" data-color={scoreColor}>
                {displayScore}%
              </div>
              <div className="score-label">{displayScore > 50 ? 'Proceed' : 'Needs Improvement'}</div>
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
                <div className="stat-value">{summary?.questions_answered  || 0}</div>
                <div className="stat-label">Questions Answered</div>
              </div>
            </div>
            <div className="stat-card">
              <BarChart3 size={20} />
              <div>
                <div className="stat-value">{summary?.questions_asked || 0}</div>
                <div className="stat-label">Total Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="detailed-summary">
          <h2>Interview Summary</h2>
          <div className="summary-content">
            {error && (
              <div className="summary-text">
                <p>{error}</p>
              </div>
            )}

            {!error && hasApiSummary && (
              <div className="api-summary-container">
                <div className="outcome-banner" data-recommendation={recommendation}>
                  <div className="outcome-title">{performance.level}</div>
                  <span className={`recommendation-badge ${recommendation.replace(/\s+/g, '-').toLowerCase()}`}>
                    {recommendation}
                  </span>
                </div>

                <div className="mini-stats">
                  <div className="mini-stat">
                    <div className="mini-stat-label">Questions Answered</div>
                    <div className="mini-stat-value">{summary?.questions_answered ?? (interviewData?.answers?.length || 0)}</div>
                  </div>
                  <div className="mini-stat">
                    <div className="mini-stat-label">Total Questions</div>
                    <div className="mini-stat-value">{summary?.questions_asked ?? (interviewData?.questions?.length || 0)}</div>
                  </div>
                </div>

                <div className="api-summary-grid">
                  <div className="api-summary-card">
                    <span className="label">Overall Score </span>
                    <span className="value">{summary.overall_score}</span>
                  </div>
                  <div className="api-summary-card">
                    <span className="label">Recommendation </span>
                    <span className="value">{summary.recommendation}</span>
                  </div>
                </div>

                {Array.isArray(summary.key_themes) && summary.key_themes.length > 0 && (
                  <div className="api-summary-section">
                    <h3>Key Themes</h3>
                    <ul className="bulleted">
                      {summary.key_themes.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(summary.strengths) && summary.strengths.length > 0 && (
                  <div className="api-summary-section">
                    <h3>Strengths</h3>
                    <ul className="bulleted">
                      {summary.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(summary.weaknesses) && summary.weaknesses.length > 0 && (
                  <div className="api-summary-section">
                    <h3>Weaknesses</h3>
                    <ul className="bulleted">
                      {summary.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.topic_breakdown && (
                  <div className="api-summary-section">
                    <h3>Topic Breakdown</h3>
                    <div className="topic-grid">
                      {Object.entries(summary.topic_breakdown).map(([k, v]) => (
                        <div key={k} className="topic-item">
                          <span className="topic-label">{k.replace(/_/g, ' ')}</span>
                          <span className="topic-value">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {summary.summary && (
                  <div className="api-summary-section">
                    <h3>Summary</h3>
                    <div className="summary-text">{summary.summary}</div>
                  </div>
                )}

                
              </div>
            )}

            {!error && !hasApiSummary && (
              <div className="summary-text">
                <p>Great job completing the Excel interview! You answered {interviewData?.answers?.length || 0} out of {interviewData?.questions?.length || 0} questions.</p>
                <p>Your performance shows {performance.level.toLowerCase()} understanding of Excel concepts. Keep practicing to improve your skills!</p>
              </div>
            )}
          </div>
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
          <a 
            href="/sales_data.csv"
            download
            className="btn btn-secondary"
          >
            <Download size={20} />
            Download Data
          </a>
        </div>
      </div>

      
    </div>
  )
}

export default SummaryScreen
