from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from schema.PROMPT import SYSTEM_MESSAGE, USER_PAYLOAD
from langchain.schema import SystemMessage, HumanMessage

class Eval_model:
    def __init__(self):
        load_dotenv()
        self.llm = ChatGoogleGenerativeAI(
            model='gemini-1.5-flash',
            temperature=0
        )
        self.messages = [
            SystemMessage(content=SYSTEM_MESSAGE),
            HumanMessage(content=USER_PAYLOAD)
        ]

    def verify_answer(self, answer: str, question: str):
        """
        Verifies the user's answer to an Excel-related question using Gemini.
        Returns the model's evaluation as a string.
        """
        prompt = (
            f"Question: {question}\n"
            f"User's Answer: {answer}\n"
            "Evaluate if the answer is correct, and explain why."
        )
        messages = self.messages + [HumanMessage(content=prompt)]

        response = self.llm(messages)
        
        return response.content

