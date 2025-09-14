import React, { useState } from 'react'
import { Play, Download, BarChart3, Users, Clock, Award } from 'lucide-react'
import './WelcomeScreen.css'

const WelcomeScreen = ({ onStartInterview }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Excel Analyst',
    experience: 'Beginner'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onStartInterview(formData)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-icon">
              <BarChart3 size={48} />
            </div>
            <h1>AI Excel Agent</h1>
            <p className="hero-subtitle">
              Master Excel skills through AI-powered interviews. Practice with real data scenarios and get instant feedback.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <Users size={24} />
            <h3>AI Interviewer</h3>
            <p>Intelligent AI evaluates your Excel formulas and provides detailed feedback</p>
          </div>
          <div className="feature-card">
            <BarChart3 size={24} />
            <h3>Real Data</h3>
            <p>Practice with actual sales data and realistic business scenarios</p>
          </div>
          <div className="feature-card">
            <Clock size={24} />
            <h3>Adaptive Questions</h3>
            <p>Questions adjust to your skill level from beginner to advanced</p>
          </div>
          <div className="feature-card">
            <Award size={24} />
            <h3>Instant Feedback</h3>
            <p>Get immediate evaluation and suggestions for improvement</p>
          </div>
        </div>

        {/* Interview Setup Form */}
        <div className="setup-section">
          <div className="setup-card">
            <h2>Start Your Interview</h2>
            <p>Fill in your details to begin the Excel skills assessment</p>
            
            <form onSubmit={handleSubmit} className="setup-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role/Position</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Excel Analyst">Excel Analyst</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Experience Level</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Beginner">Beginner (0-1 years)</option>
                  <option value="Intermediate">Intermediate (1-3 years)</option>
                  <option value="Advanced">Advanced (3+ years)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary start-btn">
                <Play size={20} />
                Start Interview
              </button>
            </form>
          </div>
        </div>

        {/* Download Data Section */}
        <div className="download-section">
          <div className="download-card">
            <Download size={24} />
            <div>
              <h3>Download Sample Data</h3>
              <p>Get the sales data file to practice offline</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => window.open('/api/start', '_blank')}
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default WelcomeScreen
