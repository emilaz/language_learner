import json
import uuid
from typing import Dict, Set
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from models import Message, ExerciseInfo, ServerResponseMessage
from conversation import generate_response

with open('exercises.json') as f:
    EXERCISES = json.load(f)

app = FastAPI()

# Session storage (temp in-memory for development)
session_data: Dict[str, Set[int]] = {}

# Add CORS middleware to allow requests from Expo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/exercise/start", response_model=ServerResponseMessage)
async def start_exercise(session_id: str = Header(default=None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    
    session_data[session_id] = set()
    
    return ServerResponseMessage(
        text="Hola!",
        completed_objectives=list(session_data[session_id]),
        end_conversation=False
    )

@app.post("/exercise/respond", response_model=ServerResponseMessage)
async def create_response(
    message_history: list[Message],
    session_id: str = Header(...)
):
    # Get existing completed objectives
    current_completed = session_data.get(session_id, set())
    
    response = generate_response(
        user_level="A1",
        message_history=message_history,
        current_objectives=current_completed
    )
    
    # Temporary objective detection logic
    new_objectives = set()
    if "completed" in response.lower():
        new_objectives.add(0)
    
    updated_objectives = current_completed.union(new_objectives)
    session_data[session_id] = updated_objectives

    if "[END_CONVERSATION]" in response:
        response = response.replace("[END_CONVERSATION]", "")
        end_conversation = True
    else:
        end_conversation = False
    
    return ServerResponseMessage(
        text=response,
        end_conversation=end_conversation,
        completed_objectives=list(new_objectives)
    )

@app.get("/exercise/{exercise_id}")
async def exercise(exercise_id: str):
    if exercise_id not in EXERCISES:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ExerciseInfo(**EXERCISES[exercise_id])
