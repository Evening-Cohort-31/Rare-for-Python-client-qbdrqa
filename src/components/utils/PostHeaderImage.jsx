import { useState } from "react";

export const PostHeaderImage = ({src}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleError = () => {
        setError(true);
        setLoading(false);
    }

    const handleLoad = () => {
        setLoading(false)
    }

    if (error) {
        return <img 
                    src={"https://cdn11.bigcommerce.com/s-3uewkq06zr/images/stencil/1280x1280/products/230/406/blue_b__05623.1492487362.png?c=2"}
                    alt="post header"
                />
    }

    return (
        <>
        {loading && (
            <img
                alt="loading post header"
                src={"https://cdn11.bigcommerce.com/s-3uewkq06zr/images/stencil/1280x1280/products/230/406/blue_b__05623.1492487362.png?c=2"}
            />
        )}
        <img
            src={src}
            alt="post header"
            onLoad={handleLoad}
            onError={handleError}
        />
        </>
    )
}

