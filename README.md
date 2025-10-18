# Code-Lab

**Code-Lab** is a real-time collaborative coding platform that enables users to write, run, and share code online. It supports multiple programming languages, live collaboration, and secure user authentication via Google Sign-In.

---

## Features

- **Google Authentication**: Secure sign-in and sign-out using Google accounts.  
- **Real-time Collaboration**: Multiple users can edit the same code in a shared room simultaneously.  
- **Multi-Language Support**: Python, JavaScript, Java, C, C++.  
- **Run Code Online**: Code execution powered by the [Judge0 API](https://judge0.com/).  
- **Protected Routes**: Only authenticated users can access the code editor.  
- **Persistent Sessions**: User sessions are managed via context and optional cookies/local storage.

---

## Project Structure

```
project-root/
├─ backend/
│ ├─ server.js              # Socket.io server & Judge0 API integration
│ ├─ .env                   # Environment variables (API keys, secrets) - NOT included in repo
│ └─ package.json           # Backend dependencies
│
├─ frontend/
│ ├─ src/
│ │ ├─ App.jsx              # Main React app with routing and authentication
│ │ ├─ EditorCode.jsx       # Collaborative code editor component
│ │ ├─ AuthContext.jsx      # Context API for user authentication state
│ │ └─ firebase.jsx         # Firebase configuration
│ ├─ .env                   # Firebase environment variables - NOT included in repo
│ ├─ .gitignore             # To exclude node_modules, .env, and other sensitive files
│ └─ package.json           # Frontend dependencies
│
└─ README.md                # Project documentation
```
```





## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Monaco Editor, React Router, Socket.io-client  
- **Backend**: Node.js, Express, Socket.io, Axios  
- **Authentication**: Firebase Authentication (Google Sign-In)  
- **Code Execution**: Judge0 API  

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Dineshjogala7/CODE-LAB.git
2. Install dependencies

Backend:

cd backend
npm install


Frontend:

cd frontend
npm install

3. Add Environment Variables

Create .env files in both backend and frontend folders:

Frontend .env (Firebase keys):

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id


Backend .env (Judge0 API key and other secrets):

JUDGE0_API_KEY=your-judge0-api-key


Note: Never commit .env files to the repository. They contain sensitive information.

Running the Project

Backend:

cd backend
node server.js


Frontend:

cd frontend
npm run dev


Visit http://localhost:5173
 in your browser to access the app.

Usage

Open the app in a browser.

Click Sign-Up / Sign-In to authenticate via Google.

Enter a room ID to join or create a collaborative coding session.

Write code in the editor, select a language, and click Run Code.

Collaborators in the same room will see real-time updates instantly.

Contributing

Fork the repository.

Create a new branch: git checkout -b feature/your-feature.

Commit your changes: git commit -m "Add new feature".

Push to your branch: git push origin feature/your-feature.

Open a Pull Request for review.

License

This project is for educational purposes.
No commercial use is allowed without permission.
