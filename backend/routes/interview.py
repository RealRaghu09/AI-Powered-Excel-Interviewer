from services.evaluator import Eval_model
from services.report_generator import report_generator
from services.question_bank import QuestionBank
import pandas as pd
import os

# Initialize services lazily
evaluator = None
question_bank = None

def get_evaluator():
    global evaluator
    if evaluator is None:
        try:
            evaluator = Eval_model()
        except Exception as e:
            print(f"Warning: Could not initialize evaluator: {e}")
            evaluator = None
    return evaluator

def get_question_bank():
    global question_bank
    if question_bank is None:
        question_bank = QuestionBank()
    return question_bank

def ask(question: str, answer: str):
    """
    Evaluate a candidate's answer to an Excel question
    """
    try:
        evaluator = get_evaluator()
        if evaluator is None:
            #  evaluation without LLM
            return {
                "status": "success",
                "evaluation": f"Answer received: {answer}. Note: AI evaluation is not available. Please check your Google API key configuration.",
                "report": "AI evaluation service is not available. Please configure your Google API key to enable full evaluation.",
                "question": question,
                "answer": answer
            }
        
        # Get evaluation from LLM
        evaluation_result = evaluator.verify_answer(answer, question)
        
        # Generate detailed report
        report = report_generator(evaluator.llm, evaluation_result, question, answer)
        
        return {
            "status": "success",
            "evaluation": evaluation_result,
            "report": report,
            "question": question,
            "answer": answer
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error evaluating answer: {str(e)}"
        }

def summary():
    """
    Generate a summary of the interview session
    """
    try:
        # Load sales data for context
        data_path = os.path.join('data', 'sales_data.csv')
        df = pd.read_csv(data_path)
        
        evaluator = get_evaluator()
        if evaluator is None:
            # Fallback summary without LLM
            return {
                "status": "success",
                "summary": f"Interview session completed. The sales data contains {len(df)} records with information about orders, regions, representatives, items, and sales figures. This data can be used to practice various Excel functions like SUMIF, AVERAGEIF, and more complex formulas.",
                "data_insights": {
                    "total_records": len(df),
                    "columns": list(df.columns),
                    "date_range": f"{df['OrderDate'].min()} to {df['OrderDate'].max()}"
                }
            }
        
        # Generate summary using LLM
        summary_prompt = f"""
        Based on the sales data provided, generate a comprehensive summary of the interview session.
        The data contains {len(df)} records with sales information.
        
        Data sample:
        {df.head().to_string()}
        
        Please provide insights about the data structure and potential Excel questions that could be asked.
        """
        
        response = evaluator.llm([summary_prompt])
        
        return {
            "status": "success",
            "summary": response.content,
            "data_insights": {
                "total_records": len(df),
                "columns": list(df.columns),
                "date_range": f"{df['OrderDate'].min()} to {df['OrderDate'].max()}"
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error generating summary: {str(e)}"
        }
