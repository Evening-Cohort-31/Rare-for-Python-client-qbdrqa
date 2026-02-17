import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { PostsList } from "./PostsList"
import { MyPosts } from "../components/posts/MyPosts.jsx"
import { PostForm } from "../components/posts/PostForm.jsx"
import { ConditionalPostView } from "../components/posts/ConditionalPostView.jsx"
import { Admin } from "./Admin.js"
import { UnapprovedPosts } from "../components/admin/UnapprovedPosts.jsx"
import { CategoryList } from "../components/categories/CategoryList.jsx"

export const ApplicationViews = ({ token, setToken }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />
      <Route element={<Authorized token={token} />}>
        <Route path="/" element={<PostsList />} />
        <Route path="/posts" element={<PostsList />} />
        {/* Add Routes here */}
        <Route path="/new_post" element={<PostForm/>}/>
        <Route path="/post/:id" element={<ConditionalPostView/>}/>
        <Route path="/posts/:userId" element={<MyPosts/>}/>
        {/* Add Admin Routes here */}
        <Route path="/admin" element={<Admin token={token}/>}>
          <Route path="unapproved_posts" element={<UnapprovedPosts/>}/>
        </Route>
        <Route path="/categories" element={<CategoryList/>}/>

      </Route>

    </Routes>
  )
}