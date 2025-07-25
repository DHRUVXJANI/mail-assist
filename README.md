# MailAssist

MailAssist is an AI-powered email response generator that helps you craft professional, concise, and context-aware replies to your emails. Built with a modern React frontend and an Express/MongoDB backend, MailAssist leverages Google Gemini AI to generate high-quality responses in various tones.

## Features
- ✉️ Generate AI-powered email responses in multiple tones (professional, casual, apologetic, enthusiastic, concise, diplomatic)
- 📝 Custom instructions for tailored replies
- 🌗 Light/Dark mode toggle for comfortable viewing
- 📜 Email response history with easy access
- 🔒 User authentication (login/signup)
- 📋 One-click copy to clipboard
- ⚡ Fast, responsive, and modern UI

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI Integration:** Google Gemini API

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/DHRUVXJANI/mail-assist.git
   cd mail-assist
   ```

2. **Install dependencies:**
   - For the backend:
     ```sh
     cd backend
     npm install
     ```
   - For the frontend:
     ```sh
     cd ../frontend
     npm install
     ```

3. **Set up environment variables:**
   - Create a `.env` file in both `backend/` and `frontend/` (if needed).
   - Example for `backend/.env`:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_google_gemini_api_key
     PORT=5000
     ```

4. **Run the backend server:**
   ```sh
   cd backend
   npm start
   ```

5. **Run the frontend app:**
   ```sh
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
- Paste the email you want to respond to in the input box.
- Select the desired tone and add any custom instructions.
- Click "Generate Response" to get an AI-crafted reply.
- Edit, copy, or save your response as needed.
- View your response history in the sidebar.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.

## Acknowledgements
- [Google Gemini AI](https://ai.google/discover/gemini/)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
