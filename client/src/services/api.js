import axios from 'axios'

const API_BASE_URL = '/api'
const API_BASE = "http://127.0.0.1:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Ask question API
export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_BASE}/ask`, {
      question: question
    })
    return response.data
  } catch (error) {
    console.error("Error asking question:", error)
    return { error: "Failed to ask question" }
  }
}

// API Functions
export const getQuestions = async () => {
  try {
    const response = await api.get('/questions')
    return response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

export const getRandomQuestion = async () => {
  try {
    const response = await api.get('/questions/random')
    return response.data
  } catch (error) {
    console.error('Error fetching random question:', error)
    
    // Fallback question if backend is not available
    if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
      return {
        status: 'success',
        question: {
          id: 'fallback_1',
          question: 'Calculate the total sales for the East region using the sales data.',
          expected_answer: '=SUMIF(B:B,"East",G:G)',
          difficulty: 'Beginner',
          category: 'SUMIF',
          data_context: 'Region: East'
        }
      }
    }
    
    throw error
  }
}

export const generateQuestion = async (difficulty) => {
  try {
    const response = await api.get(`/questions/generate/${difficulty}`)
    return response.data
  } catch (error) {
    console.error('Error generating question:', error)
    
    // Fallback questions if backend is not available
    if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
      const fallbackQuestions = {
        'Beginner': {
          id: 'fallback_beginner',
          question: 'Find the average unit cost for all Pencil sales.',
          expected_answer: '=AVERAGEIF(D:D,"Pencil",E:E)',
          difficulty: 'Beginner',
          category: 'AVERAGEIF',
          data_context: 'Item: Pencil'
        },
        'Intermediate': {
          id: 'fallback_intermediate',
          question: 'Calculate the total sales for Pencil in the Central region.',
          expected_answer: '=SUMIFS(G:G,D:D,"Pencil",B:B,"Central")',
          difficulty: 'Intermediate',
          category: 'SUMIFS',
          data_context: 'Item: Pencil, Region: Central'
        },
        'Advanced': {
          id: 'fallback_advanced',
          question: 'Find the sales representative with the highest total sales.',
          expected_answer: '=INDEX(C:C,MATCH(MAX(SUMIF(C:C,C:C,G:G)),SUMIF(C:C,C:C,G:G),0))',
          difficulty: 'Advanced',
          category: 'INDEX/MATCH/SUMIF',
          data_context: 'All representatives'
        }
      }
      
      return {
        status: 'success',
        question: fallbackQuestions[difficulty] || fallbackQuestions['Beginner']
      }
    }
    
    throw error
  }
}

export const evaluateAnswer = async (question, answer) => {
  try {
    const response = await api.post('/ask', {
      question,
      answer
    })
    return response.data
  } catch (error) {
    console.error('Error evaluating answer:', error)
    throw error
  }
}



export const getSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE}/summary`)
    return response.data
  } catch (error) {
    console.error("Error fetching summary:", error)
    throw error
  }
}

export const downloadData = async () => {
  try {
    const response = await api.get('/start', {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('Error downloading data:', error)
    throw error
  }
}

export default api
