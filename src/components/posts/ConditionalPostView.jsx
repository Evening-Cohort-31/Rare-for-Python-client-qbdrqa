import { useSearchParams } from "react-router-dom"
import { PostForm } from "./PostForm.jsx"
import { PostDetail } from "./PostDetail"

export const ConditionalPostView = () => {
  const [searchParams] = useSearchParams()
  const edit = searchParams.get("edit")

  return edit ? <PostForm /> : <PostDetail />
}