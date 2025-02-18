# this file will use the openAI API to generate replies to the user's messages
# it will use the exercise data to generate and message history to generate a response
# I want to append some prompt engineering to the conversation to help the model understand the user's intent

import openai
import os
from dotenv import load_dotenv
from models import Message
load_dotenv()

def convert_message_history_to_openai_format(message_history: list[Message]) -> list[dict]:
    # convert the message history to the openai format
    openai_format = []
    for message in message_history:
        openai_format.append({"role": "user" if message.is_user else "assistant", "content": message.text})
    return openai_format

def generate_response(
    user_level: str,
    message_history: list[Message] = [],
    current_objectives: set[int] = set()
) -> str:
    # define the openai client
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    # first, send a system message to the model with the following prompt
    system_message = {
        "role": "system",
        "content": """You are a spanish conversation partner. Follow these rules:
        1. Adjust your response length, complexity and vocabulary to the user's level. For example, if the user is a beginner, your response should be 1-2 sentences.
        2. Do not correct the user's grammar or punctuation. If you can guess what the user wanted to say, tell the user what you assume and then answer.
        3. if you don't understand the user's message at all, ask them to clarify it. 
        4. The user needs to complete objectives to finish the exercise. These are things they need to figure out through the conversation. 
        5. If the user is saying goodbye, say goodbye too and end your response with [END_CONVERSATION].
        The user's spanish level is {user_level}.
    """
    }
    # add the conversation history
    openai_format = convert_message_history_to_openai_format(message_history)
    openai_format.insert(0, system_message)
    # call the openai API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=openai_format,
        temperature=0.5,
        max_tokens=1000
    )
    # return the response
    return response.choices[0].message.content
