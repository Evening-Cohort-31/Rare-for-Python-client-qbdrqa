import { Outlet, Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { PostsList } from "../components/posts/PostsList.js"
import { MyPosts } from "../components/posts/MyPosts.jsx"
import { PostForm } from "../components/posts/PostForm.jsx"
import { ConditionalPostView } from "../components/posts/ConditionalPostView.jsx"
import { Admin } from "./Admin.js"
import { UnapprovedPosts } from "../components/admin/UnapprovedPosts.jsx"
import { CategoryList } from "../components/categories/CategoryList.jsx"
import { PostComments } from "./PostComments"
import { CommentForm } from "./CommentForm"
import { UserList } from "../components/admin/UserList.js"
import { CategoryManagement } from "../components/admin/CategoryManagement.js"

export const ApplicationViews = ({ token, setToken }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />

      <Route element={<Authorized token={token} />}>
        <Route path="/" element={<PostsList />}/>
        <Route path="/post" element={<Outlet />}>
          <Route path=":postId" element={<ConditionalPostView/>}/>
          <Route path=":id/comments" element={<Outlet />}>
            <Route path="" element={<PostComments />}/>
            <Route path="new" element={<CommentForm />}/>
          </Route>
        </Route>
        <Route path="/posts" element={<Outlet />}>
          <Route path="" element={<PostsList />} />
          <Route path=":userId" element={<MyPosts />}/>
          <Route path='edit/:id' element={<PostForm />}/>
          <Route path="tags/:tagId" element={<PostsList />} />
        </Route>
        <Route path="/users" element={<Outlet />}>
          <Route path=":userId" element={<>Profile Coming Soon</>}/>
          <Route path=":userId/posts" element={<MyPosts />}/>
        </Route>
        <Route path="/new_post" element={<PostForm/>}/>
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/users" element={<UserList />} />
        {/* Add Admin Routes here */}
        <Route path="/admin" element={<Admin token={token}/>}>
          <Route path="categories" element={<CategoryManagement />}/>
          <Route path="unapproved_posts" element={<UnapprovedPosts/>}/>
          <Route path="users" element={<UserList />}/>
        </Route>
      </Route>
    </Routes>
  )
}