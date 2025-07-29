rkitech
A modern full-stack boilerplate for personal and freelance web projects.
Built to scale from idea to deployment — fast.



🧠 Philosophy
rkitech is a foundational starter kit designed for rapid development and long-term scalability. It’s built for developers who value:

Type safety and maintainability

Scalable file structures

Separation of concerns (API, UI, state)

Rapid prototyping with clean abstractions

🛠️ Tech Stack
Frontend
React (w/ Vite)

TypeScript

Tailwind CSS v4

Redux Toolkit for global state

React Router for navigation

MUI components (selectively used)

Backend
Express.js (Node.js)

Firestore (as the default database)

CORS, dotenv, and clean route separation

📁 Folder Structure (WIP)
bash
Copy
Edit
rkitech/
├── client/                 # Frontend codebase
│   ├── components/         # Reusable UI components
│   ├── containers/         # Page-level components
│   ├── store/              # Redux slices and hooks
│   └── styles/             # Tailwind configs and global styles
├── server/                 # Express backend
│   ├── controllers/
│   ├── routes/
│   └── services/
├── .env
├── package.json
└── README.md
🚀 Getting Started
bash
Copy
Edit
# Clone the repo
git clone https://github.com/abrown5421/rkitech.git

# Install dependencies
cd rkitech
npm install

# Run both frontend and backend
npm run dev
You’ll need to create a .env file in the root directory. Example:

ini
Copy
Edit
PORT=5000
VITE_API_BASE_URL=http://localhost:5000
FIREBASE_API_KEY=...
🧩 Features (current & planned)
✅ Current
🔄 Fullstack local dev setup with proxy

🎨 Tailwind + MUI hybrid styling

📁 Modular file structure with scalable architecture

🔒 Environment variables support

🛠 In Progress / Planned
🧠 Component configuration system via Firestore

🗂 CMS-style page and form editor

🗺 Custom navigation + animation framework

📦 Component + form libraries

🌍 Deployment (Vercel/Firebase/etc.)

🧪 Scripts
bash
Copy
Edit
npm run dev       # Run frontend + backend
npm run client    # Start frontend only
npm run server    # Start backend only
npm run build     # Build frontend
📚 Usage
You can use rkitech as a boilerplate for:

Freelance client dashboards

Admin portals and CMS apps

Experimental product MVPs

Static + dynamic hybrid sites

🙋‍♂️ Why the Name?
"rkitech" is a stylized take on “architecture,” reflecting the clean, scalable, and structured approach to fullstack app development.

📝 License
This project is licensed under the MIT License.
See the LICENSE file for details.

📌 Notes
This repo is still actively evolving.

PRs, ideas, and discussions welcome.

📍 To-Do (Internal)
 Add Firestore rules and setup guide

 Create CLI or script to spin up new components/forms

 Add CI/CD pipeline

 Improve type sharing between client/server

 Add tests (unit + integration)