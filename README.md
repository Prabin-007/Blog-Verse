# Blog Verse

A full-stack blog platform built with the MERN stack. Users can create, edit, and manage blog posts, comment on posts, like posts, and leverage AI-powered features including blog summarization and grammar correction.

Live: [blog-verse-pink.vercel.app](https://blog-verse-pink.vercel.app)

---

## Features

- User authentication with JWT (signup, signin, logout)
- Create, edit, and delete blog posts with cover image upload
- Comment on blog posts
- Like and unlike posts
- User dashboard — manage your blogs, view your comments, and view liked posts
- AI-powered blog summarization using Google Gemini (available to all users)
- AI-powered grammar correction (available to post author only)
- Profile image upload on signup
- Cloudinary integration for image storage
- Fully responsive UI

---

## Tech Stack

**Frontend**
- React with Vite
- React Router DOM
- Axios
- CSS (custom, no UI library)

**Backend**
- Node.js with Express 5
- MongoDB with Mongoose
- JSON Web Tokens for authentication
- Multer for file handling
- Cloudinary for image storage
- Google Gemini API for AI features
- Helmet, CORS for security

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
Blog-Verse/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── commentController.js
│   │   ├── userController.js
│   │   └── Aicontroller.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── upload.js
│   │   └── uploadProfilePic.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Blog.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── userRoutes.js
│   │   └── Airoutes.js
│   ├── services/
│   │   ├── tokenService.js
│   │   └── geminiService.js
│   └── app.js
└── frontend/
    └── src/
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── BlogDetail.jsx
        │   ├── AddBlog.jsx
        │   ├── EditBlog.jsx
        │   ├── Dashboard.jsx
        │   ├── SignIn.jsx
        │   └── SignUp.jsx
        └── utils/
            └── axios.js
```

---

## API Endpoints

**Auth**
```
POST   /api/auth/signup
POST   /api/auth/signin
GET    /api/auth/logout
GET    /api/auth/me
```

**Blogs**
```
GET    /api/blogs
GET    /api/blogs/:id
POST   /api/blogs
DELETE /api/blogs/:id
POST   /api/blogs/:id/like
```

**Comments**
```
POST   /api/comments/:blogId
DELETE /api/comments/:id
```

**User**
```
GET    /api/users/me/blogs
GET    /api/users/me/comments
GET    /api/users/me/liked
PUT    /api/users/me/blogs/:id
```

**AI**
```
POST   /api/ai/summarize/:id
POST   /api/ai/grammar-fix/:id
```

---

## Local Setup

**Prerequisites**
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

**Clone the repository**
```bash
git clone https://github.com/Prabin-007/Blog-Verse.git
cd Blog-Verse
```

**Backend setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

```bash
npm run dev
```

**Frontend setup**
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8000`.

---

## Deployment

**Backend — Render**

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node app.js`
- Add all environment variables from `.env`

**Frontend — Vercel**

- Root Directory: `frontend`
- Framework: Vite
- Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Port for the backend server |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `VITE_API_URL` | Backend base URL (frontend only) |

---

## Author

Prabin Prasad — [github.com/Prabin-007](https://github.com/Prabin-007)
