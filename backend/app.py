from flask import Flask, request, jsonify
from flask_cors import CORS
from Model.Model import MyModel

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Single global model instance (no sessions)
llm = MyModel()

@app.route('/home')
def home():
    response = {
        "response": "Hello AI Agent",
        "message": "Home Page"
    }
    return jsonify(response)

'''
{
"question": "question and answer evalution"
}
'''
@app.route('/ask', methods=['POST'])
def ask_question():
    """
    User sends an answer or greeting. 
    Agent responds with next step/question.
    """
    try:
        data = request.get_json()
        user_input = data.get("question", "")

        response = llm.response(user_input)

        return jsonify({
            "response": response
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route('/summary', methods=['GET'])
def summary():
    """
    At the end, generate structured JSON summary.
    """
    try:
        result = llm.summary()
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
'''
{
    "candidate_id": "candidate_1",
    "key_themes": [
        "Data Aggregation",
        "Basic Formulas"
    ],
    "overall_score": 60.0,
    "recommendation": "Follow-up",
    "strengths": [
        "Familiarity with basic Excel functions"
    ],
    "summary": "The candidate demonstrated a basic understanding of the SUM function but struggled with data aggregation.  Further training is recommended on SUMIF and PivotTables.",
    "topic_breakdown": {
        "charts": 0.0,
        "data_cleaning": 0.0,
        "formulas": 2.0,
        "pivot_tables": 1.0
    },
    "weaknesses": [
        "Lack of proficiency in data aggregation techniques",
        "Insufficient explanation of methodology"
    ]
}
'''

if __name__ == '__main__':
    app.run(debug=True)
