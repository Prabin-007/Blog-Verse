import api from "../utils/axios";
async function getBlogs() {
    const res=await api.get("/blogs");
    console.log(res.data);
}

function Blog() {
  return (
    <div>
      Blog
      <button onClick={getBlogs}>get blog</button>
    </div>
  );
}

export default Blog;