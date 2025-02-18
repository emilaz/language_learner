import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Message, ExerciseInfo, ServerResponseMessage
from conversation import generate_response

with open('exercises.json') as f:
    EXERCISES = json.load(f)

app = FastAPI()

# Add CORS middleware to allow requests from Expo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/exercise/start", response_model=ServerResponseMessage)
async def start_exercise():
    # You'll implement the logic to get the first message
    return ServerResponseMessage(
        text="Hola!",
        end_conversation=False
    )

@app.post("/exercise/respond", response_model=ServerResponseMessage)
async def create_response(message_history: list[Message]):
    # get the response from the conversation
    response = generate_response(user_level= "A1", message_history=message_history)
    # Temporary stub logic - replace later with real tracking
    completed_objectives = []
    if "completed" in response.lower():
        completed_objectives = [0]  # Example - always mark first objective as completed

    if "[END_CONVERSATION]" in response:
        response = response.replace("[END_CONVERSATION]", "")
        end_conversation = True
    else:
        end_conversation = False
    
    return ServerResponseMessage(
        text=response,
        end_conversation=end_conversation,
        completed_objectives=completed_objectives
    )

@app.get("/exercise/{exercise_id}")
async def exercise(exercise_id: str):
    if exercise_id not in EXERCISES:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ExerciseInfo(**EXERCISES[exercise_id])
