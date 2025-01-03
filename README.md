# Doc

A collaborative document editor that allows users to create, update, edit, and save documents in real-time.

---

## Features

- Real-time collaborative editing using **Socket.io**.
- Persistent document storage using **MongoDB**.
- Responsive and user-friendly text editor using **Quill.js**.

---

## Tech Stack

- Frontend using **React**(**Vite**) and some **CSS**
- Backend(for sockets) in plain **javascript**
- Persistent document storage using **MongoDB**.
- Responsive and user-friendly text editor using **Quill.js**.

---

## Installation

- Cloning the repo
```bash
git clone https://github.com/itsmeherepranetha/doc.git
cd doc
```

- inside the `client` folder
```
cd client
npm i
```

- inside the `server` folder
```
cd ../server
npm i
```

- Create a `.env` inside the server folder and add these varaibles there
```
MONGO_URL=your_mongo_url
FRONTEND_PORT=your_frontend_port(by default 5173 by vite)
BACKEND_PORT=your_backend_port
```

- Run ```npm run dev``` inside both client and server folder

