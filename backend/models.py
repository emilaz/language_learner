from pydantic import BaseModel

class ServerResponseMessage(BaseModel):
    text: str
    end_conversation: bool = False


class Message(BaseModel):
    text: str
    is_user: bool

class ExerciseInfo(BaseModel):
    title: str
    objectives: list[str]
    vocabulary: list[str]