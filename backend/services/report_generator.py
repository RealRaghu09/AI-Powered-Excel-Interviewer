from langchain.schema import HumanMessage

def report_generator(llm, evaluation_result: str, question: str, answer: str):
    """
    Generates a detailed report based on the evaluation result, questions, and user's answers.
    Uses the LLM to create a human-readable summary.
    """
    prompt = f"""
    Based on the following interview evaluation, generate a comprehensive report:
    
    Question: {question}
    Candidate's Answer: {answer}
    Evaluation: {evaluation_result}
    
    Please provide:
    1. A summary of the candidate's performance
    2. Strengths identified
    3. Areas for improvement
    4. Overall recommendation
    5. Next steps for the candidate
    
    Format the response in a professional, constructive manner.
    """
    
    # Get the report from the LLM
    response = llm([HumanMessage(content=prompt)])
    # Return the generated report
    return response.content
