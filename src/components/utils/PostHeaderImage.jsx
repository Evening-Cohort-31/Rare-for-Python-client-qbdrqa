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
        return <></>
    }

    return (
        <>
        {loading && (
            <></>
        )}
        <div className="card-image">
            <figure className="image is-16by9">
                <img
                    style={{borderTopLeftRadius: "6px", borderTopRightRadius: "6px"}}
                    src={src}
                    alt="post header"
                    onLoad={handleLoad}
                    onError={handleError}
                />
            </figure>
        </div>
        </>
    )
}

