from pydantic import BaseModel, Field, ConfigDict

class ServerResponseMessage(BaseModel):
    text: str
    end_conversation: bool = False


class Message(BaseModel):
    text: str
    is_user: bool = Field(alias="isUser")

    model_config = ConfigDict(populate_by_name=True)

class ExerciseInfo(BaseModel):
    title: str
    objectives: list[str]
    vocabulary: list[str]