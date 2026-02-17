import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { PostsList } from "./PostsList"
import { MyPosts } from "../components/posts/MyPosts.jsx"
import { PostForm } from "../components/posts/PostForm.jsx"
import { ConditionalPostView } from "../components/posts/ConditionalPostView.jsx"
import { PostDetail } from "./PostDetail"

export const ApplicationViews = ({ token, setToken }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />

      <Route element={<Authorized token={token} />}>
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/" element={<PostsList />} />
        <Route path="/posts" element={<PostsList />} />
        {/* Add Routes here */}
        <Route path="/new_post" element={<PostForm/>}/>
        <Route path="/post/:id" element={<ConditionalPostView/>}/>
        <Route path="/posts/:userId" element={<MyPosts/>}/>

      </Route>

    </Routes>
  )
}