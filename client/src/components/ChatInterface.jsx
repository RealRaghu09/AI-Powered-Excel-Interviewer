import React, { useState, useEffect, useRef } from 'react'
import { Send, Download, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getRandomQuestion, generateQuestion, evaluateAnswer } from '../services/api'
import './ChatInterface.css'

const ChatInterface = ({ userInfo, interviewData, setInterviewData, onEndInterview }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [questionNumber, setQuestionNumber] = useState(1)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadFirstQuestion()
  }, [])

  const loadFirstQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await getRandomQuestion()
      if (response.status === 'success') {
        const question = response.question
        setCurrentQuestion(question)
        setMessages([{
          id: 1,
          type: 'question',
          content: question.question,
          metadata: {
            difficulty: question.difficulty,
            category: question.category,
            dataContext: question.data_context
          },
          timestamp: new Date()
        }])
        setInterviewData(prev => ({
          ...prev,
          questions: [...(prev.questions || []), question]
        }))
      }
    } catch (error) {
      console.error('Error loading question:', error)
      setMessages([{
        id: 1,
        type: 'error',
        content: 'Failed to load question. Please try again.',
        timestamp: new Date()
      }])
    }
    setIsLoading(false)
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return

    const answerMessage = {
      id: messages.length + 1,
      type: 'user-answer',
      content: userAnswer,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, answerMessage])
    setInterviewData(prev => ({
      ...prev,
      answers: [...(prev.answers || []), {
        question: currentQuestion,
        answer: userAnswer,
        timestamp: new Date()
      }]
    }))

    setIsLoading(true)
    setUserAnswer('')

    try {
      // Evaluate the answer
      const evaluation = await evaluateAnswer(currentQuestion.question, userAnswer)
      
      const evaluationMessage = {
        id: messages.length + 2,
        type: 'evaluation',
        content: evaluation.evaluation || evaluation.message,
        metadata: {
          status: evaluation.status,
          report: evaluation.report
        },
        timestamp: new Date()
      }

      setMessages(prev => [...prev, evaluationMessage])

      // Load next question after a delay
      setTimeout(() => {
        loadNextQuestion()
      }, 2000)

    } catch (error) {
      console.error('Error evaluating answer:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'error',
        content: 'Failed to evaluate answer. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
    setIsLoading(false)
  }

  const loadNextQuestion = async () => {
    setIsLoading(true)
    try {
      // Generate question based on user's experience level
      const difficulty = userInfo?.experience || 'Beginner'
      const response = await generateQuestion(difficulty)
      
      if (response.status === 'success') {
        const question = response.question
        setCurrentQuestion(question)
        setQuestionNumber(prev => prev + 1)
        
        const questionMessage = {
          id: messages.length + 3,
          type: 'question',
          content: question.question,
          metadata: {
            difficulty: question.difficulty,
            category: question.category,
            dataContext: question.data_context,
            questionNumber: questionNumber + 1
          },
          timestamp: new Date()
        }

        setMessages(prev => [...prev, questionMessage])
        setInterviewData(prev => ({
          ...prev,
          questions: [...(prev.questions || []), question]
        }))
      }
    } catch (error) {
      console.error('Error loading next question:', error)
      const errorMessage = {
        id: messages.length + 3,
        type: 'error',
        content: 'Failed to load next question. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitAnswer()
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'question':
        return <CheckCircle size={16} className="text-blue-400" />
      case 'user-answer':
        return <Send size={16} className="text-green-400" />
      case 'evaluation':
        return <CheckCircle size={16} className="text-orange-400" />
      case 'error':
        return <XCircle size={16} className="text-red-400" />
      default:
        return <Clock size={16} className="text-gray-400" />
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-container">
        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-header">
                  <div className="message-icon">
                    {getMessageIcon(message.type)}
                  </div>
                  <div className="message-meta">
                    <span className="message-type">
                      {message.type === 'question' && 'Question'}
                      {message.type === 'user-answer' && 'Your Answer'}
                      {message.type === 'evaluation' && 'AI Evaluation'}
                      {message.type === 'error' && 'Error'}
                    </span>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="message-content">
                  {message.content}
                </div>

                {message.metadata && (
                  <div className="message-metadata">
                    {message.metadata.difficulty && (
                      <span className="badge difficulty">
                        {message.metadata.difficulty}
                      </span>
                    )}
                    {message.metadata.category && (
                      <span className="badge category">
                        {message.metadata.category}
                      </span>
                    )}
                    {message.metadata.dataContext && (
                      <span className="badge context">
                        {message.metadata.dataContext}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="message loading">
                <div className="message-header">
                  <div className="message-icon">
                    <div className="spinner" />
                  </div>
                  <span className="message-type">AI is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your Excel formula or explanation here..."
              className="answer-input"
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || isLoading}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="input-actions">
            <button
              onClick={loadNextQuestion}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              <RotateCcw size={16} />
              Skip Question
            </button>
            
            <button
              onClick={() => window.open('/api/start', '_blank')}
              className="btn btn-secondary"
            >
              <Download size={16} />
              Download Data
            </button>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default ChatInterface
