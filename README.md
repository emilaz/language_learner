This is a simple language learning app that uses a chatbot to help the user learn a given language.

The app is built with React Native, Expo, and FastAPI.

The database is currently just a JSON file.

# Setup

1. Create a `.env` file in the `backend` directory with the following content:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```


# Running the app

1. Clone the repository
2. Run `npm install` from the client folder
3. Run `npm start` from the client folder
4. Run `uvicorn backend.main:app --reload` from the root folder
