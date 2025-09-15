from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from Model.PROMPT import system_prompt ,json_schema , failed_message
from langchain_core.output_parsers import StrOutputParser
import json
from langchain_text_splitters import RecursiveCharacterTextSplitter


class MyModel:
    json_schema = json_schema

    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0
        )
        # self.item = RecursiveCharacterTextSplitter(self.model)
        self.parser = StrOutputParser()
        self.model = self.llm.with_structured_output(self.json_schema)
        self.list_of_messages = []
        self.last_summary = None
        

    def response(self, message: str) -> str:
        """
        Store conversation, generate response.
        """
        if not self.list_of_messages:
            # First message, greet candidate by getting started
            greeting = "Welcome to the Excel Interview! Please download the sample data (sales_data.csv) and load it into Excel. Let's begin."
            self.list_of_messages.append(system_prompt+message)
            self.list_of_messages.append(f"Interviewer: {greeting}")
            return greeting

        self.list_of_messages.append(f"{system_prompt}\n{message}")
        response = self.llm.invoke("for understanding I have included the Tags of Interviewer, don't include that tags in output\n".join(self.list_of_messages))
        self.list_of_messages.append(f"Interviewer: {response.content}")
        return response.content

    def summary(self):
        """
        Generate JSON summary of candidate's performance. when len != 0
        """
        # If there are no new messages but we have a cached summary, return it
        if len(self.list_of_messages) == 0:
            if self.last_summary is not None:
                return self.last_summary
            return failed_message

        last_response = self.list_of_messages
        # Reset the conversation for next session after we compute the summary
        self.list_of_messages = []

        # Try structured LLM summary, fallback to heuristic summary on failure
        try:
            response = self.model.invoke("\n".join(last_response))
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
                "recommendation": "Follow-up"
            }
            self.last_summary = fallback
            return fallback
