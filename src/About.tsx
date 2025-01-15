import { Link } from "react-router-dom";
import "./About.css";
import sourceImage from "./assets/source.jpg";

function About() {
    return (
        <div className="about-container">
            <Link to="/" className="back-button">
                ← Back
            </Link>
            <div className="about-content">
                <h1>About Is There Any Red?</h1>

                <div className="origin-story">
                    <h2>Origin Story</h2>
                    <p className="intro">
                        This project started when a friend showed me this image
                        and claimed there was no red in it:
                    </p>
                    <div className="source-image">
                        <img
                            src={sourceImage}
                            alt="Source image that started it all"
                        />
                        <p className="image-caption">
                            The image that started it all
                        </p>
                    </div>
                    <p>
                        To settle the debate once and for all, I created this
                        tool that uses multiple detection methods to analyze
                        images for the presence of red.
                    </p>
                </div>

                <h2>Detection Methods</h2>
                <div className="method-card">
                    <h3>RGB Analysis</h3>
                    <p>
                        Examines the{" "}
                        <a
                            href="https://en.wikipedia.org/wiki/RGB_color_model"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            RGB
                        </a>{" "}
                        values of each pixel, focusing on the red channel. This
                        method is particularly effective for pure or dominant
                        reds and provides a baseline detection capability.
                    </p>
                </div>

                <div className="method-card">
                    <h3>HSL Color Space</h3>
                    <p>
                        Converts pixels to{" "}
                        <a
                            href="https://en.wikipedia.org/wiki/HSL_and_HSV"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            HSL
                        </a>{" "}
                        (Hue, Saturation, Lightness) color space to detect red
                        hues more accurately, even in varying lighting
                        conditions. This helps identify subtle red tones that
                        might be missed in RGB analysis.
                    </p>
                </div>

                <div className="method-card">
                    <h3>Color Distance</h3>
                    <p>
                        Calculates the{" "}
                        <a
                            href="https://en.wikipedia.org/wiki/Color_difference"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            color distance
                        </a>{" "}
                        between each pixel's color and pure red in the color
                        space. This method is excellent for detecting near-red
                        colors and determining how "red" a color actually is.
                    </p>
                </div>

                <div className="method-card">
                    <h3>Histogram Analysis</h3>
                    <p>
                        Analyzes the distribution of colors using a{" "}
                        <a
                            href="https://en.wikipedia.org/wiki/Color_histogram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            color histogram
                        </a>
                        , identifying red-heavy regions and their intensity.
                        This method is particularly useful for images with mixed
                        colors or subtle red undertones.
                    </p>
                </div>

                <h2>Confidence Scores</h2>
                <p>
                    Each method provides a confidence score (0-100%) indicating
                    how certain it is about the presence of red. Higher scores
                    indicate stronger red presence. The final result combines
                    these methods for maximum accuracy.
                </p>

                <div className="footer">
                    <p>
                        Created with ❤️ for color analysis
                        <br />
                        <a
                            href="https://github.com/insertusernamed/IsThereAnyRed"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
