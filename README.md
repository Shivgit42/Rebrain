# ReBrain

Your personal **second brain** - Save, Tag & Share your content all in one place.

---

## ✨ Features

- Save content from **YouTube, Twitter, documents, and links**
- Organize with **tags** and filter easily
- Share curated collections with a **public link**
- Clean and minimal **dashboard UI**
- **Auth system** (Sign up / Sign in)
- Dark mode support 🌙

---

## 🛠️ Tech Stack

**Frontend**

- React + TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

**Deployment**

- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🚀 Getting Started

### Clone the repo

```bash
git clone https://github.com/your-username/rebrain.git
cd rebrain
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

## 🧑‍💻 Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
