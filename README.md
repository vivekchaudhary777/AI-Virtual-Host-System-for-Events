# Virtual Event Platform

An AI-powered virtual event platform featuring a 3D interactive avatar host, real-time chat, automated event agenda scheduling, and dynamic analytics. Built using the MERN stack (MongoDB, Express.js, React, Node.js) and integrating Google Gemini for intelligent AI chat capabilities, alongside LangSmith for interaction tracing and evaluation.

## 🚀 Features

- **🤖 AI-Powered 3D Virtual Host**: Interactive 3D avatar built with React Three Fiber/Drei and powered by Google Gemini AI for intelligent hosting.
- **💬 Real-Time Chat & Interaction**: Seamless communication between attendees and admins utilizing WebSockets (`Socket.io`).
- **📅 Automated Event Agenda Scheduling**: Event scheduling and time-based triggers handled by `node-cron`.
- **📊 Dynamic Analytics Dashboard**: Real-time insights into event revenue, ticket sales, and attendance tracking.
- **🎟️ Ticketing System**: Integrated event ticketing and attendee management workflows.
- **🛡️ Secure Authentication**: Robust user authentication and authorization managed securely using JWT and `bcrypt`.
- **🔍 AI Monitoring**: Observability, performance tracking, and debugging of AI interactions using LangSmith integration.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **Routing**: React Router DOM
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Bootstrap, React-Bootstrap, Styled Components
- **Networking**: Axios, Socket.io-client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-Time Engine**: Socket.io
- **Task Scheduling**: Node-cron

### AI & Observability Integrations
- **AI Models**: Google Gemini (`@google/generative-ai`, `@langchain/google-genai`)
- **LLM Orchestration**: LangChain
- **Tracing & Evaluation**: LangSmith

## ⚙️ Setup Instructions

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally or a MongoDB Atlas URI
- API Keys for Google Gemini and LangSmith

### 2. Clone the Repository
```bash
git clone <repository-url>
cd virtual-event-platform-master
```

### 3. Install Dependencies

**Backend Dependencies:**
From the root directory, install the backend dependencies.
```bash
npm install
```

**Frontend Dependencies:**
Navigate into the `frontend` folder and install its dependencies.
```bash
cd frontend
npm install
cd ..
```

### 4. Environment Variables
Create a `.env` file in the root directory. You can use the provided `.env.example` as a template:
```bash
cp .env.example .env
```

Update the `.env` file with your actual keys:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/virtual-event-platform
JWT_SECRET=your_jwt_secret_here

# Gemini AI Key (Get yours at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# LangSmith Tracing
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY=your_langchain_api_key_here
LANGCHAIN_PROJECT="virtual-event-platform"
```

### 5. Run the Application
The project is configured to run both the frontend and backend concurrently using a single command. 

From the root directory, run:
```bash
npm run dev
```

### 6. Access the Platform
- **Frontend** will run on: `http://localhost:3000` (by default React script)
- **Backend API** will be served at: `http://localhost:5000`
