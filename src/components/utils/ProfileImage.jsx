import { useState } from "react";

export const ProfileImage = ({src}) => {
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
                    src={"data:image/png;base64,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"}
                    alt="profile"
                    className="is-rounded"
                />
    }

    return (
        <>
            {loading && (
                <img
                    alt="loading profile"
                    className="is-rounded"
                    src={"data:image/png;base64,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"}
                />
            )}
        <img
            src={src}
            alt="profile"
            onLoad={handleLoad}
            onError={handleError}
        />
        </>
    )
}