# 🔗 Backend-Frontend Integration Guide

This guide will help you properly integrate and test the AI Excel Agent backend with the frontend.

## 🚀 Quick Start

### 1. Start Backend
```bash
# Option 1: Use the startup script
./start_backend.sh

# Option 2: Manual start
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Start Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Test Integration
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 🧪 Testing Endpoints

### Test All Backend Endpoints
```bash
cd backend
python test_endpoints.py
```

### Test Individual Endpoints
```bash
# Health check
curl http://localhost:5000/

# Get random question
curl http://localhost:5000/questions/random

# Generate question by difficulty
curl http://localhost:5000/questions/generate/Beginner

# Evaluate answer
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Calculate total sales for East region", "answer": "=SUMIF(B:B,\"East\",G:G)"}'
```

## 🔧 Backend Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/` | Health check | `{"message": "Hello, World!"}` |
| GET | `/questions` | Get all questions | `{"status": "success", "questions": [...]}` |
| GET | `/questions/random` | Get random question | `{"status": "success", "question": {...}}` |
| GET | `/questions/generate/<difficulty>` | Generate question | `{"status": "success", "question": {...}}` |
| POST | `/ask` | Evaluate answer | `{"status": "success", "evaluation": "...", "report": "..."}` |
| GET | `/data/summary` | Get data summary | `{"status": "success", "summary": {...}}` |
| GET | `/summary` | Get interview summary | `{"status": "success", "summary": "...", "data_insights": {...}}` |
| POST | `/questions/refresh` | Refresh questions | `{"status": "success", "message": "..."}` |
| GET | `/start` | Download data file | CSV file download |

## 🎯 Frontend API Integration

The frontend uses these API functions in `client/src/services/api.js`:

```javascript
// Get random question
const question = await getRandomQuestion()

// Generate question by difficulty
const question = await generateQuestion('Beginner')

// Evaluate answer
const result = await evaluateAnswer(question, answer)

// Get data summary
const summary = await getDataSummary()
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to load question" Error
**Cause**: Backend not running or CORS issues
**Solution**:
```bash
# Check if backend is running
curl http://localhost:5000/

# If not running, start it
cd backend && python app.py
```

#### 2. CORS Errors
**Cause**: Cross-origin requests blocked
**Solution**: Backend has CORS headers configured, but if issues persist:
```bash
# Check browser console for specific CORS errors
# Backend should return proper CORS headers
```

#### 3. Google API Key Issues
**Cause**: Missing or invalid Google API key
**Solution**:
```bash
# Create .env file in backend directory
echo "GOOGLE_API_KEY=your_api_key_here" > backend/.env
```

#### 4. Data File Missing
**Cause**: sales_data.csv not found
**Solution**:
```bash
# Check if file exists
ls backend/data/sales_data.csv

# If missing, the app will use fallback questions
```

### Debug Steps

1. **Check Backend Logs**
   ```bash
   cd backend
   python app.py
   # Look for error messages in console
   ```

2. **Test Backend Directly**
   ```bash
   cd backend
   python test_endpoints.py
   ```

3. **Check Frontend Console**
   - Open browser dev tools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed API calls

4. **Verify Ports**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000
   - Make sure no other services are using these ports

## 📊 Expected Behavior

### Successful Integration
1. **Backend starts** without errors
2. **Frontend loads** at http://localhost:3000
3. **Welcome screen** displays properly
4. **Questions load** when starting interview
5. **Answers are evaluated** (with or without AI)
6. **Summary is generated** at the end

### Fallback Mode
If Google API key is not configured:
- Questions still load (from question bank)
- Answers are received but not AI-evaluated
- Summary is generated with basic information
- All core functionality works

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && python app.py`
2. **Start Frontend**: `cd client && npm run dev`
3. **Make Changes**: Edit code in either backend or frontend
4. **Test Changes**: Refresh browser or restart servers as needed
5. **Debug Issues**: Use browser dev tools and backend logs

## 📝 API Response Examples

### Successful Question Response
```json
{
  "status": "success",
  "question": {
    "id": "q1",
    "question": "Calculate the total sales for the East region.",
    "expected_answer": "=SUMIF(B:B,\"East\",G:G)",
    "difficulty": "Beginner",
    "category": "SUMIF",
    "data_context": "Region: East"
  }
}
```

### Successful Evaluation Response
```json
{
  "status": "success",
  "evaluation": "Your answer is correct! SUMIF is the right function...",
  "report": "Detailed feedback and suggestions...",
  "question": "Calculate the total sales for the East region.",
  "answer": "=SUMIF(B:B,\"East\",G:G)"
}
```

## 🎉 Success Indicators

- ✅ Backend responds to health check
- ✅ Questions load in frontend
- ✅ Chat interface works
- ✅ Answers can be submitted
- ✅ Summary screen displays
- ✅ No console errors
- ✅ Smooth user experience

If all these work, your integration is successful! 🚀
