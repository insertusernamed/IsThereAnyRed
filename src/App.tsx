import { useState } from "react";
import "./App.css";

function App() {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    };

    const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = formData.get("url") as string;
        setImageUrl(url);
    };

    return (
        <div className="container">
            <h1>Is There Any Red?</h1>
            <p className="subtitle">
                Upload an image or paste a URL to check if it contains red
            </p>

            <div
                className={`drop-zone ${isDragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="drop-zone-content">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p>Drag and drop your image here</p>
                </div>
            </div>

            <div className="divider">OR</div>

            <form onSubmit={handleUrlSubmit} className="url-form">
                <input
                    type="url"
                    name="url"
                    placeholder="Paste an image URL here"
                    className="url-input"
                />
                <button type="submit" className="submit-button">
                    Check Image
                </button>
            </form>

            {imageUrl && (
                <div className="image-preview">
                    <img src={imageUrl} alt="Uploaded preview" />
                </div>
            )}
        </div>
    );
}

export default App;
