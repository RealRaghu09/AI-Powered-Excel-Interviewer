# Excel AI Interviewer (Backend)

This project is a backend system for an **AI-driven Excel Interviewer**.  
It simulates a structured Excel interview process, asks questions, evaluates answers using AI (Gemini + LangChain), and generates a final performance summary.

The system is designed to replace **manual Excel interviews**, which are often inconsistent and time-consuming, with a smart, automated solution.

---

## 🚀 Installation
- Update it later 
<!-- *(Instructions will be added here later — setup commands, dependencies, etc.)* -->

---

## 🎯 Project Overview

### Why This Project?
- Hiring teams waste hours conducting **manual Excel skill assessments**.
- Evaluations are **inconsistent** across different interviewers.
- Growth is blocked by a **slow hiring pipeline**.

This backend solves the problem by:
- Running a **structured, multi-turn interview flow**.
- Evaluating candidate answers intelligently using **Gemini + LangChain**.
- Managing **interview state and context** across questions.
- Generating a **final feedback report** for recruiters.

---

## 🏗️ System Workflow

1. **Start Interview**  
   - Candidate is introduced to the process.  
   - System fetches the first Excel-related question from the `questions.json` bank.  

2. **Multi-turn Conversation**  
   - Candidate answers via the frontend (or API).  
   - Answer is passed to **Gemini + LangChain**, which evaluates correctness, reasoning, and skill level.  
   - State is updated (which question was asked, score so far, etc.).  

3. **Question Loop**  
   - Next question is chosen (static from JSON or dynamically adapted based on performance).  

4. **Evaluation & Summary**  
   - At the end, system generates a **performance report** with:
     - Strengths
     - Weaknesses
     - Overall score
     - Hiring recommendation  



