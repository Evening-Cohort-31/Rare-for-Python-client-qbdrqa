import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { CreatePostForm } from "../components/posts/CreatePostForm.jsx"
import { MyPosts } from "../components/posts/MyPosts.jsx"

export const ApplicationViews = ({ token, setToken }) => {
  return <>
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />}  />
      <Route path="/register" element={<Register setToken={setToken} />}  />
      <Route element={<Authorized token={token} />}>
        {/* Add Routes here */}
        <Route path="/new_post" element={<CreatePostForm/>}/>
        <Route path="/post/:id" element={<>Post Details Coming Soon!</>}/>
        <Route path="/posts/:userId" element={<MyPosts/>}/>
      </Route>
    </Routes>
  </>
}
