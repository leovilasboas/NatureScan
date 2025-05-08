import { identifyWithOpenRouter } from '../../utils/openRouterApi';
import { addToHistory } from '../../utils/memoryDb';
import { processImageServerSide } from '../../utils/imageProcessing';

// Configure Next.js API route to handle larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase the body parser limit for image uploads
    },
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("API request received:", req.method, req.url);
    const { image } = req.body;

    console.log("Image data received:", image ? 
      `${typeof image} (length: ${image.length})` : "null");

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Process image for server-side use (extract base64 content)
    const processedImage = await processImageServerSide(image);
    console.log("Processed image size:", processedImage.length);
      
    // Call OpenRouter API for identification
    console.log("Calling OpenRouter API...");
    
    try {
      const identificationResults = await identifyWithOpenRouter(processedImage);

      // Extract results
      if (!identificationResults || !identificationResults.identification) {
        return res.status(500).json({ 
          message: 'Failed to identify the image. The AI service returned an invalid response.' 
        });
      }

      // Store in history (keep original image for display)
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        imageData: image, // Store original image for better quality in history view
        results: identificationResults,
        type: identificationResults.identification.category // 'plant' or 'animal'
      };

      addToHistory(historyItem);

      // Return results to client
      return res.status(200).json(identificationResults);
    } catch (identifyError) {
      console.error('OpenRouter identification error:', identifyError);
      return res.status(500).json({ 
        message: `Failed to identify with AI service: ${identifyError.message}` 
      });
    }
  } catch (error) {
    console.error('General identification error:', error);
    return res.status(500).json({ 
      message: `Failed to process image: ${error.message || 'Unknown error'}` 
    });
  }
}
