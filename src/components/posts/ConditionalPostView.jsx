import { useSearchParams } from "react-router-dom";
import { PostForm } from "./PostForm.jsx";

// TODO: Either reconfigure pathing once PostDetails is implemented, or possibly implement
// a component to switch between displaying info and editing 

// Conditionally renders components based on if "edit" is a query in the url path
export const ConditionalPostView = () => {
    const [searchParams] = useSearchParams();
    const edit = searchParams.get("edit");

        return edit ? <PostForm /> : <>Post Details Coming Soon</>
}