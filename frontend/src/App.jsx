import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Blog from "./pages/Blogpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blog/>} />
    </Routes>
  );
}

export default App;