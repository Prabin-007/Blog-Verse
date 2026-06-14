import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import BlogDetail from "./pages/BlogDetail";
import AddBlog from "./pages/AddBlog";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
     
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/signin"       element={<SignIn />} />
          <Route path="/signup"       element={<SignUp />} />
          <Route path="/blog/:id"     element={<BlogDetail />} />
          <Route path="/blog/add-new" element={<AddBlog />} />
        </Routes>
      
    </AuthProvider>
  );
}
