from pydantic import BaseModel
from typing import Optional, List

class StartInterviewRequest(BaseModel):
    candidate_name: str
    role: Optional[str] = "Excel Analyst"

class AnswerRequest(BaseModel):
    candidate_id: str
    question_id: str
    answer: str

class LLMScore(BaseModel):
    score: int                           
    strengths: List[str]
    weaknesses: List[str]
    feedback: str
    confidence: float 