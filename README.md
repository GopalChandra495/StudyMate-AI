# StudyMate AI

An AI-powered study companion built with the MERN stack and Google Gemini AI. StudyMate AI helps students organize subjects, explore topics, ask questions, create study plans, and track tasks in one place.

## Features

- **User Authentication** — Register, log in, and log out securely.
- **Subject Management** — Add, view, and manage study subjects.
- **AI Topic Generation** — Generate topics with AI, save them, mark them complete, or delete them.
- **AI Tutor** — Ask study-related questions and get AI-generated explanations with follow-up context.
- **AI Study Plan** — Generate a study plan based on selected topics.
- **Task Planner** — Add tasks, mark them complete, and keep track of your study work.

## Tech Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication

**AI**
- Google Gemini API

## Project Structure

```text
StudyMate-AI/
├── client/          # React frontend
├── server/          # Express backend
├── .gitignore
├── package.json
└── README.md
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/GopalChandra495/StudyMate-AI.git
cd StudyMate-AI
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open a second terminal from the project root:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder. Add the environment variables required by the backend, including your MongoDB connection string and Gemini API key.

Use the variable names expected by the code in `server/config/db.js` and `server/services/geminiService.js`.

**Never commit or share your `.env` file or API keys.**

### 5. Start the backend

From the `server` folder, run:

```bash
npm run dev
```

The backend is configured to use port `5000` by default, unless changed in your environment settings.

### 6. Start the frontend

In the frontend terminal, run:

```bash
cd client
npm run dev
```

Open the local URL shown in the Vite terminal.

## Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

The generated frontend build is placed in the `client/dist` folder.

## Security Note

Environment files, dependencies, and build output are excluded from Git using `.gitignore`. Keep API keys and database credentials private.

## Author

**Gopal Chandra**

GitHub: [GopalChandra495](https://github.com/GopalChandra495)