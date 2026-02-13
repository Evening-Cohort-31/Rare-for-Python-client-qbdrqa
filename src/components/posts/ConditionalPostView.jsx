import { useSearchParams } from "react-router-dom";
import { PostForm } from "./PostForm.jsx";

export const ConditionalPostView = () => {
    const [searchParams] = useSearchParams();
    const edit = searchParams.get("edit");

        return edit ? <PostForm /> : <>Post Details Coming Soon</>
}