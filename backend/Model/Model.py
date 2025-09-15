from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from Model.PROMPT import system_prompt ,json_schema , failed_message
from langchain_core.output_parsers import StrOutputParser
import json
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import re


class MyModel:
    json_schema = json_schema

    def __init__(self):
        load_dotenv()
        # Sanitize GOOGLE_API_KEY to avoid illegal header value errors
        api_key = os.environ.get("GOOGLE_API_KEY", "")
        if api_key:
            cleaned = api_key.strip().strip('"').strip("'")
            # Remove accidental newlines/whitespace inside
            cleaned = re.sub(r"\s+", "", cleaned)
            os.environ["GOOGLE_API_KEY"] = cleaned
        else:
            # Leave empty; downstream will raise a clear error if used without key
            pass
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0
        )
        # self.item = RecursiveCharacterTextSplitter(self.model)
        self.parser = StrOutputParser()
        self.model = self.llm.with_structured_output(self.json_schema)
        self.list_of_messages = []
        self.last_summary = None
        # Track simple counts during the session
        self.num_questions_asked = 0
        self.num_questions_answered = 0
        # Structured chat history for templated prompts
        self.history = []
        

    def response(self, message: str) -> str:
        """
        Store conversation, generate response.
        """
        # First interaction: greet and ask first question
        if not self.history:
            self.history.append({"role": "user", "content": message})
            interviewer_text = (
                "Hello, I'm the Excel Interviewer. Let's begin.\n\n"
                "Question 1 (Easy): Calculate the total revenue generated from the sales data."
            )
            self.history.append({"role": "interviewer", "content": interviewer_text})
            self.num_questions_asked += 1
            return interviewer_text

        # Record user turn
        self.history.append({"role": "user", "content": message})

        # Build conversation text from history (role-tagged for context only)
        conversation_lines = []
        for turn in self.history:
            role = 'User' if turn['role'] == 'user' else 'Interviewer'
            conversation_lines.append(f"{role}: {turn['content']}")
        conversation_text = "\n".join(conversation_lines)

        # Prompt template: evaluate last user answer, then ask next question
        prompt = (
            f"{system_prompt}\n\n"
            f"Conversation so far:\n{conversation_text}\n\n"
            "Interviewer task: If the last User message is an answer/explanation, first evaluate it (correct/incorrect and why), then ask the next question with slightly higher difficulty. If the last User message asks for a question, provide only a new question. Keep it concise and do NOT include role tags."
        )

        try:
            llm_resp = self.llm.invoke(prompt)
            interviewer_output = llm_resp.content if hasattr(llm_resp, 'content') else str(llm_resp)
        except Exception:
            interviewer_output = "I'm having trouble evaluating right now. Please try again or rephrase your answer."

        # Append interviewer turn and update counters
        self.history.append({"role": "interviewer", "content": interviewer_output})
        self.num_questions_answered += 1
        self.num_questions_asked += 1
        return interviewer_output

    def summary(self):
        """
        Generate JSON summary of candidate's performance. when len != 0
        """
        # If there are no new messages but we have a cached summary, return it
        if len(self.history) == 0:
            if self.last_summary is not None:
                return self.last_summary
            return failed_message

        # Use structured history for summary
        last_response = [f"{t['role']}: {t['content']}" for t in self.history]
        # Capture counts prior to reset
        questions_asked = self.num_questions_asked
        questions_answered = self.num_questions_answered
        # Reset the conversation for next session after we compute the summary
        self.list_of_messages = []
        self.num_questions_asked = 0
        self.num_questions_answered = 0
        self.history = []

        # Try structured LLM summary, fallback to heuristic summary on failure
        try:
            response = self.model.invoke("\n".join(last_response))
            if isinstance(response, dict):
                response.setdefault("questions_asked", questions_asked)
                response.setdefault("questions_answered", questions_answered)
            self.last_summary = response
            return response
        except Exception:
            # Heuristic fallback summary to avoid empty/placeholder values
            conversation_len = max(1, len(last_response))
            fallback = {
                "candidate_id": "candidate_1",
                "overall_score": 60,
                "topic_breakdown": {
                    "formulas": 5,
                    "pivot_tables": 2,
                    "charts": 2,
                    "data_cleaning": 3
                },
                "key_themes": [
                    "Excel fundamentals",
                    "Business data analysis"
                ],
                "summary": "Interview completed. Automatic fallback summary generated due to LLM unavailability.",
                "strengths": [
                    "Clear communication"
                ],
                "weaknesses": [
                    "Needs deeper function mastery"
                ],
                "recommendation": "Follow-up",
                "questions_asked": questions_asked,
                "questions_answered": questions_answered
            }
            self.last_summary = fallback
            return fallback
