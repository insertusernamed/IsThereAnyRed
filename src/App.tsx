import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { detectRed } from "./utils/redDetection";
import { Link } from "react-router-dom";
import "./App.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HistogramDisplay = ({
    data,
}: {
    data: { red: number[]; green: number[]; blue: number[] };
}) => {
    const labels = Array.from({ length: 256 }, (_, i) => i);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Red",
                data: data.red,
                borderColor: "rgba(255, 0, 0, 0.8)",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Green",
                data: data.green,
                borderColor: "rgba(0, 255, 0, 0.8)",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Blue",
                data: data.blue,
                borderColor: "rgba(0, 0, 255, 0.8)",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                    color: "#888",
                },
            },
            x: {
                grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                    color: "#888",
                    maxTicksLimit: 8,
                },
            },
        },
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: "#888",
                },
            },
            title: {
                display: true,
                text: "Color Distribution",
                color: "#fff",
            },
        },
    };

    return (
        <div className="histogram-container">
            <Line data={chartData} options={options} />
        </div>
    );
};

function App() {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isMobile] = useState(() =>
        /iPhone|iPad|Android/i.test(navigator.userAgent)
    );

    const CORS_PROXIES = [
        (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        (url: string) =>
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        (url: string) =>
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
                url
            )}`,
        (url: string) => url, // Try direct access as last resort
    ];

    const tryFetchImage = async (url: string): Promise<string> => {
        for (const proxyFn of CORS_PROXIES) {
            try {
                const proxiedUrl = proxyFn(url);
                // Test if the URL is accessible
                const response = await fetch(proxiedUrl, { method: "HEAD" });
                if (response.ok) {
                    return proxiedUrl;
                }
            } catch (error) {
                console.log(`Proxy failed, trying next one...`);
            }
        }
        throw new Error("All proxies failed");
    };

    useEffect(() => {
        const timer = requestAnimationFrame(() => {
            setIsLoaded(true);
        });
        return () => cancelAnimationFrame(timer);
    }, []);

    const analyzeImage = async (url: string) => {
        setIsAnalyzing(true);
        try {
            const accessibleUrl =
                url.startsWith("data:") || url.startsWith("blob:")
                    ? url
                    : await tryFetchImage(url);

            console.log("Using URL:", accessibleUrl);
            const detectionResults = await detectRed(accessibleUrl);
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            analyzeImage(url);
        }
    };

    const handleUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = formData.get("url") as string;

        if (!url) {
            alert("Please enter a valid URL");
            return;
        }

        try {
            new URL(url);
            setImageUrl(url);
            analyzeImage(url);
        } catch (error) {
            alert("Please enter a valid URL");
            console.error("Invalid URL:", error);
        }
    };

    return (
        <div className={`container ${isLoaded ? "visible" : ""}`}>
            <div className="content-wrapper">
                <h1 className="title-animation">
                    Is There Any Red?
                    <Link to="/about" className="about-button">
                        ?
                    </Link>
                </h1>
                <p className="subtitle subtitle-animation">
                    Upload an image or paste a URL to check if it contains red
                </p>

                <label
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
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file-input"
                        capture={isMobile ? "environment" : undefined}
                    />
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
                        <p>
                            {isMobile
                                ? "Tap to upload an image"
                                : "Drag and drop your image here"}
                        </p>
                    </div>
                </label>

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
                        <div className="left-column">
                            <div className="image-preview preview-animation">
                                <img src={imageUrl} alt="Uploaded preview" />
                            </div>
                            {results.some((r) => r.histogramData) && (
                                <div className="histogram-wrapper">
                                    <HistogramDisplay
                                        data={
                                            results.find((r) => r.histogramData)
                                                ?.histogramData
                                        }
                                    />
                                </div>
                            )}
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
                                    {/* Show Final Verdict first */}
                                    {results
                                        .filter(
                                            (r) => r.method === "Final Verdict"
                                        )
                                        .map((result, index) => (
                                            <div
                                                key={index}
                                                className="result-item final-verdict"
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
                                                    {result.confidence.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </p>
                                            </div>
                                        ))}
                                    {/* Show other results */}
                                    {results
                                        .filter(
                                            (r) => r.method !== "Final Verdict"
                                        )
                                        .map((result, index) => (
                                            <div
                                                key={index}
                                                className={`result-item ${
                                                    result.method ===
                                                    "Final Verdict"
                                                        ? "final-verdict"
                                                        : result.hasRed
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
                                                    {result.confidence.toFixed(
                                                        1
                                                    )}
                                                    %
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
