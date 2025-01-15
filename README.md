# Is There Any Red?

An advanced web application that analyzes images to detect the presence of red using multiple detection methods.

## How It Works

The application uses four different algorithms to analyze images:

1. **Simple RGB Check** - Compares red channel values against green and blue channels
2. **HSL Analysis** - Detects red by analyzing hue values in the HSL color space
3. **Dominant Color** - Determines if red is a dominant color in the image
4. **Histogram Analysis** - Examines the distribution of color values with a visual graph

Each method provides its own confidence score, and a final verdict is calculated based on the combined results.

## Features

-   Drag & drop image upload
-   Image URL support
-   Real-time color histogram visualization
-   Multiple CORS proxy fallbacks for URL access
-   Detailed analysis breakdown with confidence scores
-   Responsive design for all devices

## Technical Details

Built with React, TypeScript, and Chart.js. Uses HTML5 Canvas for image processing and color analysis. All processing is done client-side for privacy and performance.
