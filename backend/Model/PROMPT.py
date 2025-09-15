import pandas as pd

# Load sample data
df = pd.read_csv('data/sales_data.csv')

system_prompt = f"""
You are an AI Excel Interviewer Agent.

## Role
- Act as a professional interviewer assessing candidates on Microsoft Excel skills.
- Behave like a senior analyst: clear, structured, supportive but strict in evaluation.
- start increasing the level from easy , medium , hard , expect ...
## Interview Flow
1. Introduce yourself as the "Excel Interviewer".
2. Ask one question at a time based on the sales_data.csv provided.
3. Wait for the candidate’s response before proceeding.
4. Evaluate each response in detail.
5. After all questions, generate a structured performance summary.

## Evaluation Criteria
- Correctness of formulas or concepts.
- Use of appropriate Excel functions (VLOOKUP, INDEX-MATCH, PivotTables, Conditional Formatting).
- Logical clarity.
- Step-by-step reasoning.
- Practical application to business/finance/operations.

Here is the source data preview:
{df}
if the user ask the question : give the question  and no need to explain that to user 
else if user explains the question : check the wheather is it right or not .
"""

failed_message = {
              "candidate_id": "candidate_1",
              "key_themes": [
                  "N",
                  "N"
              ],
              "overall_score": 0.0,
              "recommendation": "N",
              "strengths": [
                  "N"
              ],
              "summary": "N",
              "topic_breakdown": {
                  "charts": 0.0,
                  "data_cleaning": 0.0,
                  "formulas": 0.0,
                  "pivot_tables": 0.0
              },
              "weaknesses": [
                  "N",
                  "N"
              ]
          }
json_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "ExcelInterviewSummary",
        "type": "object",
        "properties": {
            "candidate_id": {
                "type": "string",
                "description": "Unique identifier for the candidate"
            },
            "overall_score": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
                "description": "Overall performance score (0-100)"
            },
            "topic_breakdown": {
                "type": "object",
                "properties": {
                    "formulas": {"type": "integer", "minimum": 0, "maximum": 10},
                    "pivot_tables": {"type": "integer", "minimum": 0, "maximum": 10},
                    "charts": {"type": "integer", "minimum": 0, "maximum": 10},
                    "data_cleaning": {"type": "integer", "minimum": 0, "maximum": 10}
                },
                "required": ["formulas", "pivot_tables", "charts", "data_cleaning"]
            },
            "key_themes": {
                "type": "array",
                "items": {"type": "string"}
            },
            "summary": {"type": "string"},
            "strengths": {
                "type": "array",
                "items": {"type": "string"}
            },
            "weaknesses": {
                "type": "array",
                "items": {"type": "string"}
            },
            "recommendation": {
                "type": "string",
                "enum": ["Proceed", "Follow-up", "Do not proceed"]
            },
            "questions_asked": {
                "type": "integer",
                "minimum": 0,
                "description": "Total number of questions asked by interviewer"
            },
            "questions_answered": {
                "type": "integer",
                "minimum": 0,
                "description": "Total number of questions answered by candidate"
            }
        },
        "required": [
            "candidate_id",
            "overall_score",
            "topic_breakdown",
            "key_themes",
            "summary",
            "strengths",
            "weaknesses",
            "recommendation"
        ]
    }