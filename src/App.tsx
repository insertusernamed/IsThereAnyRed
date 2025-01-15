import { useState, useEffect } from "react";
import { detectRed } from "./utils/redDetection";
import "./App.css";

function App() {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const getCorsUrl = (url: string) => {
        if (url.startsWith("data:") || url.startsWith("blob:")) {
            return url;
        }
        // Try one of these proxies (uncomment one that works):
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        // return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
        // return `https://crossorigin.me/${url}`;
    };

    useEffect(() => {
        // Prevent flicker by delaying the initial render slightly
        const timer = requestAnimationFrame(() => {
            setIsLoaded(true);
        });
        return () => cancelAnimationFrame(timer);
    }, []);

    const analyzeImage = async (url: string) => {
        setIsAnalyzing(true);
        try {
            const processedUrl = getCorsUrl(url);
            const detectionResults = await detectRed(processedUrl);
            setResults(detectionResults);
        } catch (error) {
            console.error("Error analyzing image:", error);
            setResults([
                {
                    method: "Error",
                    hasRed: false,
                    confidence: 0,
                    description:
                        "Failed to load image. Please try uploading the image directly instead of using a URL.",
                },
            ]);
        }
        setIsAnalyzing(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            analyzeImage(url);
        }
    };

    const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = formData.get("url") as string;
        setImageUrl(url);
        analyzeImage(url);
    };

    return (
        <div className={`container ${isLoaded ? "visible" : ""}`}>
            <div className="content-wrapper">
                <h1 className="title-animation">Is There Any Red?</h1>
                <p className="subtitle subtitle-animation">
                    Upload an image or paste a URL to check if it contains red
                </p>

                <div
                    className={`drop-zone ${
                        isDragging ? "dragging" : ""
                    } zone-animation`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <div className="drop-zone-content">
                        <svg
                            className="upload-icon"
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

                <div className="divider divider-animation">OR</div>

                <form
                    onSubmit={handleUrlSubmit}
                    className="url-form form-animation"
                >
                    <input
                        type="url"
                        name="url"
                        placeholder="Paste an image URL here"
                        className="url-input"
                    />
                    <button type="submit" className="submit-button">
                        <span className="button-content">
                            Check Image
                            <svg
                                className="arrow-icon"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                            >
                                <path
                                    d="M5 12h14M12 5l7 7-7 7"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </button>
                </form>

                {imageUrl && (
                    <div className="results-container">
                        <div className="image-preview preview-animation">
                            <img src={imageUrl} alt="Uploaded preview" />
                        </div>

                        <div className="detection-results">
                            {isAnalyzing ? (
                                <div className="analyzing">
                                    <div className="spinner"></div>
                                    <p>Analyzing image...</p>
                                </div>
                            ) : (
                                <div className="results-list">
                                    <h2>Detection Results</h2>
                                    {results.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`result-item ${
                                                result.hasRed
                                                    ? "has-red"
                                                    : "no-red"
                                            }`}
                                        >
                                            <h3>{result.method}</h3>
                                            <p className="description">
                                                {result.description}
                                            </p>
                                            <div className="confidence-bar">
                                                <div
                                                    className="confidence-fill"
                                                    style={{
                                                        width: `${result.confidence}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="confidence">
                                                Confidence:{" "}
                                                {result.confidence.toFixed(1)}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
