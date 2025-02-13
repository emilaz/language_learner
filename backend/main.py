import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import MessageResponse, UserResponse, ExerciseResponse
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

@app.post("/exercise/start", response_model=MessageResponse)
async def start_exercise():
    # You'll implement the logic to get the first message
    return MessageResponse(
        message="Hola!",
        end_conversation=False
    )

@app.post("/exercise/respond", response_model=MessageResponse)
async def create_response(user_response: UserResponse):
    # get the response from the conversation
    response = generate_response(user_level= "A1", message_history=user_response.message_history)
    # return the response
    return MessageResponse(
        message=response,
        end_conversation=False
    ) 

@app.get("/home")
async def home():
    return {
        "message": "Hello, World!"
    }

@app.get("/exercise/{exercise_id}")
async def exercise(exercise_id: str):
    if exercise_id not in EXERCISES:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ExerciseResponse(**EXERCISES[exercise_id])