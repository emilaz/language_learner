This is a simple language learning app that uses a chatbot to help the user learn a given language.

The app is built with React Native, Expo, and FastAPI.

The database is currently just a JSON file.

# Setup

1. Create a `.env` file in the `backend` directory with the following content:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```


# Running the app locally

1. Clone the repository
2. Run `npx expo install` from the frontend folder
3. Run `npm start` from the frontend folder
4. Run `uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload` from the root folder
