import { useState } from "react"
import { FileUploader } from "react-drag-drop-files"

const fileTypes = ["JPG", "JPEG", "PNG"]

export const DragDrop = ({setProfileImage}) => {
    const [file, setFile] = useState(null)
    const handleChange = (file) => {
        setFile(file)
        setProfileImage(file)
    }

    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes}/>
    )
}