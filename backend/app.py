from flask import Flask, send_file, request
import json, requests
import os
from routes.interview import ask, summary, get_question_bank

app = Flask(__name__)

# Enable CORS for all routes
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
@app.route('/')
def home():
    return json.dumps({
        "message": "Hello, World!"
    })
@app.route('/start')
def start():
    path = os.path.join('data', 'sales_data.csv')
    return send_file(path , as_attachment=True)
@app.route('/ask', methods=['POST']) #hints
def ask_route():
    try:
        data = request.get_json()
        if not data:
            return json.dumps({
                'status': 'error',
                'message': 'No JSON data provided'
            })
        
        if 'question' not in data or 'answer' not in data:
            return json.dumps({
                'status': 'error',
                'message': 'Missing question or answer in request'
            })
            
        if not data['question'] or not data['answer']:
            return json.dumps({
                'status': 'error',
                'message': 'Question and answer cannot be empty'
            })
            
        question, answer = data['question'], data['answer']
        response = ask(question, answer)
        return json.dumps(response)
        
    except Exception as e:
        return json.dumps({
            'status': 'error',
            'message': f"Error from interview: {e}"
        })

@app.route('/summary')
def summary_route():
    result = summary()
    return json.dumps(result)

@app.route('/questions')
def get_questions():
    """Get all available questions"""
    try:
        question_bank = get_question_bank()
        questions = question_bank.get_all_questions()
        return json.dumps({
            "status": "success",
            "questions": questions
        })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Error fetching questions: {e}"
        })

@app.route('/questions/<question_id>')
def get_question(question_id):
    """Get a specific question by ID"""
    try:
        question_bank = get_question_bank()
        question = question_bank.get_question(question_id)
        if question:
            return json.dumps({
                "status": "success",
                "question": question
            })
        else:
            return json.dumps({
                "status": "error",
                "message": "Question not found"
            })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Error fetching question: {e}"
        })

@app.route('/questions/random')
def get_random_question():
    """Get a random question"""
    try:
        question_bank = get_question_bank()
        question = question_bank.get_random_question()
        return json.dumps({
            "status": "success",
            "question": question
        })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Error fetching random question: {e}"
        })

@app.route('/questions/generate/<difficulty>')
def generate_question(difficulty):
    """Generate a new question based on difficulty level"""
    try:
        if difficulty not in ['Beginner', 'Intermediate', 'Advanced']:
            return json.dumps({
                "status": "error",
                "message": "Difficulty must be Beginner, Intermediate, or Advanced"
            })
        
        question_bank = get_question_bank()
        question = question_bank.generate_question_by_difficulty(difficulty)
        if question:
            return json.dumps({
                "status": "success",
                "question": question
            })
        else:
            return json.dumps({
                "status": "error",
                "message": "Failed to generate question"
            })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Error generating question: {e}"
        })

@app.route('/data/summary')
def get_data_summary():
    """Get a summary of the dataset"""
    try:
        question_bank = get_question_bank()
        summary = question_bank.get_data_summary()
        return json.dumps({
            "status": "success",
            "summary": summary
        })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Error fetching data summary: {e}"
        })

@app.route('/questions/refresh', methods=['POST'])
def refresh_questions():
    """Refresh questions based on current data"""
    try:
        question_bank = get_question_bank()
        question_bank.refresh_questions()
        return json.dumps({
            "status": "success",
            "message": "Questions refreshed successfully",
            "total_questions": len(question_bank.get_all_questions())
        })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Error refreshing questions: {e}"
        })

if __name__ == '__main__':
    app.run(debug=True)