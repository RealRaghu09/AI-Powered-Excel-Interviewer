from flask import Flask, request, jsonify
from flask_cors import CORS
from Model.Model import MyModel

app = Flask(__name__)
CORS(app)

# Single global model instance (no sessions)
llm = MyModel()

@app.route('/home')
def home():
    response = {
        "response": "Hello AI Agent",
        "message": "Home Page"
    }
    return jsonify(response)


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


if __name__ == '__main__':
    app.run(debug=True)
