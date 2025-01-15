interface DetectionResult {
    method: string;
    hasRed: boolean;
    confidence: number;
    description: string;
}

// Simple RGB threshold check
const simpleRGBCheck = async (imageUrl: string): Promise<DetectionResult> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let redPixels = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];

                if (r > 150 && r > g * 1.4 && r > b * 1.4) {
                    redPixels++;
                }
            }

            const confidence = redPixels / (imageData.length / 4);
            resolve({
                method: "Simple RGB Check",
                hasRed: confidence > 0.01,
                confidence: confidence * 100,
                description: "Checks if red channel is significantly higher than others"
            });
        };
        img.src = imageUrl;
    });
};

// HSL-based red detection
const hslCheck = async (imageUrl: string): Promise<DetectionResult> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let redHuePixels = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i] / 255;
                const g = imageData[i + 1] / 255;
                const b = imageData[i + 2] / 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h = 0;

                if (max === min) {
                    h = 0;
                } else if (max === r) {
                    h = 60 * ((g - b) / (max - min));
                    if (h < 0) h += 360;
                }

                if ((h >= 330 || h <= 30) && max > 0.2) {
                    redHuePixels++;
                }
            }

            const confidence = redHuePixels / (imageData.length / 4);
            resolve({
                method: "HSL Analysis",
                hasRed: confidence > 0.01,
                confidence: confidence * 100,
                description: "Analyzes hue values to detect reddish colors"
            });
        };
        img.src = imageUrl;
    });
};

// Dominant color analysis
const dominantColorCheck = async (imageUrl: string): Promise<DetectionResult> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 50; // Reduce size for performance
            canvas.height = 50;
            ctx.drawImage(img, 0, 0, 50, 50);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let totalR = 0, totalG = 0, totalB = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                totalR += imageData[i];
                totalG += imageData[i + 1];
                totalB += imageData[i + 2];
            }

            const pixelCount = imageData.length / 4;
            const avgR = totalR / pixelCount;
            const avgG = totalG / pixelCount;
            const avgB = totalB / pixelCount;

            const redDominance = avgR / ((avgG + avgB) / 2);
            const confidence = Math.max(0, Math.min(100, (redDominance - 1) * 100));

            resolve({
                method: "Dominant Color",
                hasRed: redDominance > 1.2,
                confidence: confidence,
                description: "Checks if red is a dominant color in the image"
            });
        };
        img.src = imageUrl;
    });
};

export const detectRed = async (imageUrl: string): Promise<DetectionResult[]> => {
    try {
        const results = await Promise.all([
            simpleRGBCheck(imageUrl),
            hslCheck(imageUrl),
            dominantColorCheck(imageUrl)
        ]);
        return results;
    } catch (error) {
        console.error('Error detecting red:', error);
        return [];
    }
};
