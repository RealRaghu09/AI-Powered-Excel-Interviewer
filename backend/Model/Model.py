from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from Model.PROMPT import system_prompt
from langchain_core.output_parsers import StrOutputParser


class MyModel:
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

    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0
        )
        self.parser = StrOutputParser()
        self.model = self.llm.with_structured_output(self.json_schema)
        self.list_of_messages = []  # global history

    def response(self, message: str) -> str:
        """
        Store conversation, generate response.
        """
        if not self.list_of_messages:
            # First message, greet candidate
            greeting = "Welcome to the Excel Interview! Please download the sample data (sales_data.csv) and load it into Excel. Let's begin."
            self.list_of_messages.append(system_prompt)
            self.list_of_messages.append(f"Candidate: {message}")
            self.list_of_messages.append(f"Interviewer: {greeting}")
            return greeting

        self.list_of_messages.append(f"Candidate: {message}")
        response = self.llm.invoke("\n".join(self.list_of_messages))
        self.list_of_messages.append(f"Interviewer: {response.content}")
        return response.content

    def summary(self):
        """
        Generate JSON summary of candidate's performance.
        """
        return self.model.invoke("\n".join(self.list_of_messages))
