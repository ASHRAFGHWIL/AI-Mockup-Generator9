import { GoogleGenAI } from "@google/genai";
import type {
  ProductType,
  DesignStyle,
  ModelAudience,
  AspectRatio,
  BackgroundStyle,
} from "../types";
import {
  MODEL_AUDIENCES,
  BACKGROUND_STYLES,
  FRAME_MODELS,
  MUG_MODELS,
  SIPPER_GLASS_MODELS,
  TUMBLER_MODELS,
  HALLOWEEN_TUMBLER_SETTINGS,
  TUMBLER_TRIO_SETTINGS,
  PHONE_CASE_MODELS,
  STICKER_SETTINGS,
  POSTER_SETTINGS,
  WALLET_MODELS,
  CAP_MODELS,
  PILLOW_SETTINGS,
  FLAT_LAY_STYLES,
  PUZZLE_SETTINGS,
} from "../constants";

// Fix: Initialize the GoogleGenAI client according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to generate a text description of an image.
 * This description can then be used in a text-to-image prompt.
 * @param imageDataUrl The data URL of the image.
 * @param context The context of the image ('logo' or 'background') to tailor the descriptive prompt.
 * @returns A promise that resolves to a string description of the image.
 */
async function describeImage(imageDataUrl: string, context: 'logo' | 'background'): Promise<string> {
  const match = imageDataUrl.match(/data:(.*);base64,(.*)/);
  if (!match) {
    throw new Error("Invalid image data URL format");
  }
  const mimeType = match[1];
  const base64Data = match[2];

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const prompt = context === 'logo'
    ? `Analyze this image and provide a highly detailed, precise description for a text-to-image AI. Capture every element, including exact shapes, colors (use specific color names or hex codes if possible), textures, gradients, and any text with its font style. The goal is to recreate this design with maximum fidelity. Describe it literally, do not add creative interpretation.`
    : `Describe this image in intricate detail for a text-to-image AI model. This will be used as a background for a photo of a model wearing apparel. Describe the setting, lighting, and overall mood.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
  });

  return response.text;
}

const getModelDescription = (audience: ModelAudience): string =>
  MODEL_AUDIENCES.find((a) => a.id === audience)?.description || "";

const buildApparelPrompt = (
  productType: "tshirt" | "sweatshirt" | "hoodie",
  color: string,
  designSubject: string,
  text: string,
  font: string,
  textColor: string,
  textStyle: string,
  designStyle: DesignStyle,
  audience: ModelAudience,
  backgroundStyle: BackgroundStyle,
  backgroundDescription: string | null
) => {
  const textPrompt = text
    ? `The design features the text "${text}" in a ${font} font, with a ${textColor} color and a ${textStyle} style.`
    : "The design does not contain any text.";
    
  const styleChoice = BACKGROUND_STYLES.find(s => s.id === backgroundStyle);
  const styleDescription = styleChoice?.description || '';

  const settingPrompt = backgroundDescription
    ? `The setting is described as: "${backgroundDescription}".`
    : styleDescription;

  const fidelityInstruction = `The design must be a high-fidelity, pixel-perfect reproduction of the provided description. Do not alter, add, or remove any elements from the described design. Maintain the original colors and structure precisely.`;

  // FIX: Corrected the condition to check for flat lay styles. The previous check `backgroundStyle === 'flat_lay'` caused a type error.
  if (styleChoice && styleChoice.description.includes("No model.")) {
    // Flat lay prompt
    return `Create an ultra-realistic 4K, high-resolution, photorealistic product mockup.
      - Product: A ${color} ${productType}.
      - Setting: ${settingPrompt}
      - Design: The design on the ${productType} is: "${designSubject}" in a ${designStyle.replace(/_/g, " ")} style. ${textPrompt}
      - Design Fidelity: ${fidelityInstruction}
      - Details: The lighting should be professional and highlight the product. The focus is on the product.`;
  } else {
    // Model prompt
    const modelDescription = getModelDescription(audience);
    return `Create an ultra-realistic 4K, high-resolution, photorealistic product mockup.
      - Product: A ${color} ${productType}.
      - Model: The ${productType} is worn by ${modelDescription}.
      - Pose/Setting: ${settingPrompt} The model should have a natural and suitable pose for the environment.
      - Design: The design on the ${productType} is: "${designSubject}" in a ${designStyle.replace(/_/g, " ")} style. ${textPrompt}
      - Design Fidelity: ${fidelityInstruction}
      - Details: The lighting should be professional and highlight the product. The focus is on the product. Ensure the model's face is realistic and expressive, but not the primary focus. Avoid any text or logos unless specified in the design.`;
  }
};

export const generateMockup = async (
  params: any
): Promise<string> => {
  let designForPrompt = params.designSubject;
  const { logoImage, backgroundImage } = params;

  // If a logo image is provided, use AI to describe it for the prompt.
  if (logoImage) {
    try {
      designForPrompt = await describeImage(logoImage, 'logo');
    } catch (e) {
      console.error("Failed to describe logo:", e);
      // Fallback to a generic prompt if description fails
      designForPrompt = "the user-uploaded logo";
    }
  }

  let backgroundDescription: string | null = null;
  if (backgroundImage) {
      try {
        backgroundDescription = await describeImage(backgroundImage, 'background');
      } catch (e) {
        console.error("Failed to describe background:", e);
        // Fallback to not using a background description
        backgroundDescription = null; 
      }
  }


  let prompt = "";
  const { productType, text, aspectRatio } = params;

  const negativePrompt = "Ensure the image does not contain any text, logos, or watermarks unless it's part of the design specified in the prompt. Avoid unrealistic anatomy or proportions on models. Ensure faces are realistic.";
  const fidelityInstruction = `The design must be a high-fidelity, pixel-perfect reproduction of the provided description. Do not alter, add, or remove any elements. Maintain the original colors and structure precisely.`;

  switch (productType as ProductType) {
    case 'logo_mockup':
      const logoContext = params.designSubject;
      prompt = `Create an ultra-realistic 4K, high-resolution, photorealistic mockup of a logo.
        - Logo Description: The logo is: "${designForPrompt}".
        - Context: This logo is for "${logoContext}".
        - Task: Generate a creative and professional mockup of this logo in a realistic setting that fits the provided context. Examples include on a building sign, a coffee cup, a business card, a website on a laptop screen, etc. The AI should choose an appropriate and visually appealing setting.
        - Design Fidelity: ${fidelityInstruction} The logo must be perfectly and accurately reproduced. Do not alter the logo's design, colors, or text.
        - Details: The lighting should be natural and professional. The scene should look authentic.`;
      break;
      
    case "tshirt":
    case "sweatshirt":
    case "hoodie":
      prompt = buildApparelPrompt(
        productType,
        params.tshirtColor,
        designForPrompt,
        text,
        params.font,
        params.textColor,
        params.textStyle,
        params.designStyle,
        params.modelAudience,
        params.backgroundStyle,
        backgroundDescription
      );
      break;
    
    case 'flat_lay':
      const flatLayDesc = FLAT_LAY_STYLES.find(s => s.id === params.flatLayStyle)?.description || '';
      const apparelType = params.apparelType || "t-shirt"; // e.g. "t-shirt"
      prompt = `Create an ultra-realistic 4K, high-resolution, photorealistic product mockup.
        - Product: A ${params.color} ${apparelType}.
        - Setting: This is a flat lay photo. The setting is described as: "${flatLayDesc}".
        - Design: The design on the ${apparelType} is: "${designForPrompt}" in a ${params.designStyle.replace(/_/g, ' ')} style.
        - Text: ${text ? `The design includes the text "${text}" in a ${params.font} font with ${params.textColor} color and a ${params.textStyle} style.` : 'No text in the design.'}
        - Design Fidelity: ${fidelityInstruction}
        - Details: Professional, clean lighting. The focus is on the apparel and the overall aesthetic of the flat lay.`;
      break;

    case "bag":
      prompt = `Create an ultra-realistic 4K, high-resolution, photorealistic product mockup.
        - Product: A ${params.color} ${params.bagMaterial} tote bag.
        - Setting: The bag is displayed in a lifestyle setting, like being held by a person (hands and arm visible) or sitting on a stylish surface. The background should be slightly blurred.
        - Design: The design on the bag is: "${designForPrompt}" in a ${params.designStyle.replace(/_/g, ' ')} style.
        - Text: ${text ? `The design includes the text "${text}" in a ${params.font} font with ${params.textColor} color and a ${params.textStyle} style.` : 'No text.'}
        - Design Fidelity: ${fidelityInstruction}`;
      break;

    default:
        prompt = `Create an ultra-realistic 4K, high-resolution, photorealistic photo of a ${params.color || 'white'} ${productType.replace(/_/g, ' ')} mockup.
        - Design: A design about "${designForPrompt}" in a ${params.designStyle.replace(/_/g, ' ')} style.
        - Text: ${text ? `The design includes the text "${text}".` : 'No text.'}
        - Design Fidelity: ${fidelityInstruction}
        - Details: The product is the main focus, on a clean, slightly blurred background.`;
        break;
  }
  
  try {
    // Fix: Use the correct API for image generation as per guidelines
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `${prompt} ${negativePrompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio as AspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated. The response may have been blocked due to safety policies.");
    }
  } catch (error) {
    console.error("Error generating mockup:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during image generation.";
    throw new Error(errorMessage);
  }
};