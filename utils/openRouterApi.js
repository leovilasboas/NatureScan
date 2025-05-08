/**
 * Utility for interacting with the OpenRouter API to access deepseek-chat
 */

// The OpenRouter API endpoint
const OPENROUTER_API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Sends an image to the OpenRouter API for identification
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<Object>} Identification results
 */
export async function identifyWithOpenRouter(imageData) {
  try {
    // Get API key from environment variable
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    // Check if we have valid image data
    if (!imageData) {
      throw new Error('No image was provided for analysis');
    }
    
    console.log('Image data type:', typeof imageData);
    console.log('Image data starts with:', imageData.substring(0, 50) + '...');
    console.log('Image data length:', imageData.length);
    
    // Handle common image issues by testing different image formats
    let imageUrl;
    
    if (imageData.startsWith('http')) {
      // It's already a URL, use as is
      imageUrl = imageData;
      console.log('Using image URL directly');
    } else if (imageData.startsWith('data:image/')) {
      // It's already a data URL with correct format, use as is
      imageUrl = imageData;
      console.log('Using image data URL directly');
    } else if (imageData.startsWith('data:')) {
      // It's a data URL but might not have correct format
      const contentType = imageData.split(';')[0].split(':')[1];
      console.log('Content type detected:', contentType);
      
      if (!contentType || !contentType.startsWith('image/')) {
        // Fix content type if needed
        console.log('Invalid content type, trying to fix');
        const base64Data = imageData.includes('base64,') ? 
          imageData.split('base64,')[1] : imageData;
        imageUrl = `data:image/jpeg;base64,${base64Data}`;
      } else {
        imageUrl = imageData;
      }
    } else {
      // Assume it's raw base64 data and add the prefix
      imageUrl = `data:image/jpeg;base64,${imageData}`;
      console.log('Added data:image/jpeg prefix to base64 data');
    }
    
    // Ensure valid URL format for OpenRouter API
    if (!imageUrl) {
      throw new Error('Failed to process image into valid format');
    }

    // Prepare the prompt for identification
    const prompt = `
      I need you to carefully analyze this image and identify if it contains a plant or animal species.
      
      IMPORTANT: Be honest about your confidence level. If you're not very certain, use a lower confidence score (below 0.7).
      If the image is unclear, low quality, or you can't identify the species with reasonable certainty, 
      admit this by using a low confidence score (0.3-0.5) and stating your uncertainty.
      
      Please provide:
      - Category (plant or animal)
      - Common name of the species (be specific)
      - Scientific name (genus and species)
      - Brief description (1-2 sentences about key identifying features)
      - Additional relevant information (habitat, characteristics, interesting facts)
      
      Format your response as JSON with this structure:
      {
        "identification": {
          "category": "plant" or "animal",
          "name": "Common name",
          "scientificName": "Scientific name",
          "confidence": 0.3 to 0.95, // be honest about your confidence level
          "description": "Brief description of key features",
          "additionalInfo": {
            "habitat": "Where it's commonly found",
            "characteristics": "Distinctive traits",
            "notes": "Any uncertainty or limitations in your identification"
          }
        }
      }
      
      If you cannot confidently identify the species, indicate this in your response with lower confidence.
    `;

    // Make request to OpenRouter
    const response = await fetch(OPENROUTER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://natureid.app', // Replace with your actual app URL
        'X-Title': 'NatureID'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        response_format: { type: "text" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error response:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.error?.message || 
          `OpenRouter API responded with status ${response.status}`
        );
      } catch (parseError) {
        throw new Error(`OpenRouter API error (${response.status}): ${errorText.slice(0, 100)}...`);
      }
    }

    let data;
    try {
      const responseText = await response.text();
      console.log("API response text:", responseText.slice(0, 200) + "...");
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError);
      throw new Error("Failed to parse API response");
    }
    
    // Extract the content from the response
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from OpenRouter API');
    }

    // Parse the JSON response
    try {
      // Find the JSON content (in case there's text around it)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in the response');
      }
      
      const identificationData = JSON.parse(jsonMatch[0]);
      
      // Validate response format
      if (!identificationData.identification) {
        throw new Error('Invalid identification format in response');
      }
      
      return identificationData;
    } catch (parseError) {
      console.error('Failed to parse identification data:', parseError);
      
      // Fallback response if parsing fails
      return {
        identification: {
          category: content.toLowerCase().includes('plant') ? 'plant' : 'animal',
          name: 'Unknown Species',
          scientificName: 'N/A',
          confidence: 0.5,
          description: 'We could not properly identify this specimen. The AI provided a response but it was not in the expected format.',
          additionalInfo: {
            note: 'The identification system encountered an issue. Try again with a clearer image.'
          }
        }
      };
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}
