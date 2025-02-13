from pydantic import BaseModel

class MessageResponse(BaseModel):
    message: str
    end_conversation: bool = False


class UserResponse(BaseModel):
    response: str 

class ExerciseResponse(BaseModel):
    title: str
    objectives: list[str]
    vocabulary: list[str]