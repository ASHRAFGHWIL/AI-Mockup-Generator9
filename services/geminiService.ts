// FIX: Import `GenerateImagesResponse` to correctly type the response from the image generation API.
import { GoogleGenAI, GenerateContentResponse, GenerateImagesResponse, Part, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { DesignOptions, DesignStyle, ModelPose, ModelAudience, TshirtFont, BagMaterial, TextStyle, FrameStyle, FrameModel, MugStyle, MugModel, SipperGlassStyle, SipperGlassModel, TumblerStyle, TumblerModel, HalloweenTumblerStyle, HalloweenTumblerSetting, TumblerTrioStyle, TumblerTrioSetting, PhoneCaseStyle, PhoneCaseModel, StickerStyle, StickerSetting, PosterStyle, PosterSetting, WalletStyle, WalletModel, CapStyle, CapModel, PillowStyle, PillowSetting, FlatLayStyle, PuzzleStyle, PuzzleSetting, AspectRatio } from "../types";
import { MODEL_AUDIENCES, FRAME_MODELS, MUG_MODELS, SIPPER_GLASS_MODELS, TUMBLER_MODELS, HALLOWEEN_TUMBLER_SETTINGS, TUMBLER_TRIO_SETTINGS, PHONE_CASE_MODELS, STICKER_SETTINGS, POSTER_SETTINGS, WALLET_MODELS, CAP_MODELS, PILLOW_SETTINGS, FLAT_LAY_STYLES, PUZZLE_SETTINGS, PRODUCT_COLORS } from "../constants";

// IMPORTANT: This key is read from environment variables and should not be hardcoded.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define less restrictive safety settings to reduce the chance of false positives on logos/designs.
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const qualityPrompt = "8K, ultra-high resolution, photorealistic, DSLR photo with a 50mm f/1.8 lens, sharp focus, professional commercial photography, cinematic lighting, soft shadows, beautiful bokeh, high dynamic range.";

const criticalRealismInstructions = `
- **CRITICAL REALISM INSTRUCTIONS:**
- The design must be perfectly integrated onto the product's surface, looking like a high-end, realistic print or embroidery, not a flat sticker.
- **Texture Mapping:** The underlying fabric or material texture (e.g., cotton weave, fleece, leather grain) must be subtly visible through the design, especially in lighter areas of the print.
- **Warping & Draping:** The design must precisely follow all contours, folds, wrinkles, and seams of the product. The perspective of the design must match the product's angle perfectly.
- **Lighting & Shadows:** The lighting of the design (highlights, mid-tones, shadows) must perfectly match the lighting of the product in the photo. Shadows cast by wrinkles in the fabric must realistically fall across the design. The design's colors should be slightly affected by the ambient light color.
`;


/**
 * A wrapper for API calls that implements retry logic with exponential backoff
 * for rate limit errors (429).
 * @param apiCall The function that makes the API call.
 * @param maxRetries The maximum number of retries.
 * @returns The result of the API call.
 */
const withRetry = async <T>(apiCall: () => Promise<T>, maxRetries = 5): Promise<T> => {
  let attempt = 0;
  let delay = 10000; // Increased initial delay to 10 seconds to handle stricter rate limits

  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      // More robustly check for rate limit error indicators
      const isRateLimitError = (err: any): boolean => {
        if (!err) return false;
        const message = (err.message || err.toString()).toLowerCase();
        // Check for common rate limit indicators from Google AI platform
        return message.includes('429') || 
               message.includes('resource_exhausted') || 
               message.includes('rate limit') ||
               message.includes('quota');
      };

      if (isRateLimitError(error)) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error(`API call failed after ${maxRetries} retries due to rate limiting.`, error);
          throw new Error('The service is currently busy. Please wait a moment and try again.');
        }
        
        const jitter = Math.random() * 1000; // Add up to 1 second of jitter
        const waitTime = delay + jitter;

        console.warn(`Rate limit hit. Retrying attempt ${attempt}/${maxRetries} in ${waitTime.toFixed(0)}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        delay *= 2; // Exponential backoff: 10s, 20s, 40s, ...
      } else {
        // Not a retryable error, rethrow it immediately
        throw error;
      }
    }
  }
  // This line is for TypeScript's benefit and should not be reached.
  throw new Error('Exited retry loop unexpectedly.');
};


/**
 * Gets the color name from a hex value for more descriptive AI prompts.
 * @param hex The hex color string.
 * @returns The color name or the original hex if not found.
 */
const getColorName = (hex: string): string => {
    const color = PRODUCT_COLORS.find(c => c.value.toLowerCase() === hex.toLowerCase());
    return color ? color.name : hex;
};


/**
 * Calculates whether black or white text will have a better contrast against a given hex color.
 * @param hex The hex color of the background.
 * @returns 'white' or 'black'.
 */
const getContrastColor = (hex: string): 'white' | 'black' => {
  // Remove '#' if present
  let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

  // Handle 3-digit hex shorthand
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  if (cleanHex.length !== 6) {
      // Default to white for invalid hex codes
      return 'white'; 
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Calculate perceived brightness using the standard formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // If brightness is high (> 128), use black text. Otherwise, use white.
  return brightness > 128 ? 'black' : 'white';
};


/**
 * Converts a File object to a Generative AI Part, handling errors.
 * @param file The file to convert.
 * @returns A promise that resolves with the Part object.
 */
const fileToGenerativePart = (file: File): Promise<Part> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }

      // The result includes the data URL prefix (e.g., "data:image/png;base64,"), remove it.
      const base64Data = reader.result.split(',')[1];

      if (!base64Data) {
        return reject(new Error('Could not extract base64 data from file. The file may be corrupt or in an unsupported format.'));
      }

      resolve({
        inlineData: {
          data: base64Data,
          // Provide a fallback MIME type just in case file.type is empty
          mimeType: file.type || 'application/octet-stream',
        },
      });
    };

    reader.onerror = () => {
      reject(new Error(`FileReader encountered an error while reading the file: ${reader.error?.message || 'Unknown error'}`));
    };

    reader.readAsDataURL(file);
  });
};

const getPoseDescription = (pose: ModelPose): string => {
    switch (pose) {
        case 'standing': return 'standing pose,';
        case 'sitting': return 'sitting on a stool,';
        case 'sitting_floor_cozy': return 'sitting cross-legged on the floor in a cozy, well-lit setting, smiling warmly towards the camera,';
        case 'sitting_hand_hip': return 'a relaxed sitting pose on a neutral surface, with one hand casually resting on the hip,';
        case 'sitting_on_counter': return 'sitting cross-legged on a clean kitchen counter in a modern, well-lit kitchen, looking relaxed and happy,';
        case 'recumbent': return 'recumbent pose (lying down gracefully on a neutral surface),';
        case 'smiling_glasses': return 'standing pose, smiling warmly, wearing stylish dark glasses,';
        case 'back': return 'standing with their back to the camera,';
        case 'drinking_tea': return 'sitting comfortably and holding a cup of tea, looking relaxed,';
        case 'jumping': return 'mid-air jumping pose, expressive and energetic,';
        case 'dancing': return 'dynamic dancing pose, capturing movement,';
        case 'meditating': return 'sitting in a calm, cross-legged meditation pose,';
        case 'heroic': return 'powerful heroic pose, like a superhero,';
        case 'action': return 'dynamic action pose, as if in motion,';
        case 'yoga': return 'serene yoga pose (e.g., tree pose),';
        case 'casual_lean': return 'casually leaning against a wall,';
        case 'walking_street': return 'dynamic walking pose on a blurred city street,';
        case 'laughing': return 'joyful laughing pose, looking natural and happy,';
        case 'arms_crossed': return 'standing with arms crossed confidently,';
        case 'thinking': return 'pensive pose, hand to chin as if in thought,';
        case 'hands_in_pockets': return 'casual standing pose with hands in pockets,';
        case 'closeup_casual': return 'a casual, close-up shot from the chest up against a clean, neutral studio background, focusing clearly on the garment,';
        case 'leaning_against_railing': return 'casually leaning against a modern metal or glass railing on a balcony with a blurred city or nature background, looking relaxed,';
        case 'looking_over_shoulder': return 'standing and looking back over their shoulder at the camera with a slight smile,';
        case 'running_action_shot': return 'a dynamic, frozen-motion action shot as if the model is jogging or running, with a blurred background suggesting movement,';
        case 'adjusting_cuff': return 'a close-up shot focusing on the model\'s torso and arm as they subtly adjust the cuff of their sleeve, highlighting the garment details,';
        case 'hands_on_hips_confident': return 'a confident power pose, standing with both hands placed firmly on the hips, looking directly at the camera,';
        case 'celebrating_excited': return 'a joyful, energetic pose as if celebrating, with arms possibly raised and a happy, excited expression,';
        // flat_lay_simple is handled directly in generateBaseImage and doesn't use this function.
        case 'flat_lay_simple': return ''; 
        default: return 'standing pose,';
    }
}

const getAudienceDescription = (audience: ModelAudience): string => {
    const audienceData = MODEL_AUDIENCES.find(a => a.id === audience);
    return audienceData ? audienceData.description : 'a woman with a casual style';
}

const getFrameStyleDescription = (style: FrameStyle): string => {
    switch (style) {
        case 'classic_ornate': return 'a classic, ornate, and intricately carved wooden frame';
        case 'modern_minimalist': return 'a modern, minimalist wooden frame with clean lines and a smooth finish';
        case 'rustic_barnwood': return 'a rustic frame made from reclaimed barnwood, with a weathered and textured look';
        case 'modern_mahogany': return 'a modern, minimalist frame with a rich, dark red mahogany finish';
        default: return 'a high-quality wooden frame';
    }
}

const getFrameModelDescription = (model: FrameModel): string => {
    const modelData = FRAME_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person';
}

const getMugStyleDescription = (style: MugStyle): string => {
    switch (style) {
        case 'classic_ceramic': return 'a classic, high-quality ceramic mug';
        case 'modern_glass': return 'a sleek, modern double-walled glass mug';
        case 'vintage_enamel': return 'a vintage-style enamel camping mug';
        default: return 'a high-quality mug';
    }
}

const getMugModelDescription = (model: MugModel): string => {
    const modelData = MUG_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person';
}

const getSipperGlassStyleDescription = (style: SipperGlassStyle): string => {
    switch (style) {
        case 'classic_can_shape': return 'a classic, can-shaped glass';
        case 'modern_tapered': return 'a sleek, modern tapered glass';
        case 'frosted_finish': return 'a glass with a stylish frosted finish';
        default: return 'a high-quality sipper glass';
    }
}

const getSipperGlassModelDescription = (model: SipperGlassModel): string => {
    const modelData = SIPPER_GLASS_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person';
}

const getTumblerStyleDescription = (style: TumblerStyle): string => {
    switch (style) {
        case 'stainless_steel': return 'a classic, high-quality stainless steel tumbler with a lid';
        case 'matte_finish': return 'a tumbler with a modern, non-reflective matte finish';
        case 'glossy_white': return 'a glossy white tumbler, perfect for sublimation prints';
        default: return 'a high-quality tumbler';
    }
}

const getTumblerModelDescription = (model: TumblerModel): string => {
    const modelData = TUMBLER_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person';
}

const getHalloweenTumblerStyleDescription = (style: HalloweenTumblerStyle): string => {
    switch (style) {
        case 'glossy_black': return 'a high-quality tumbler with a glossy black finish';
        case 'matte_black': return 'a high-quality tumbler with a modern, non-reflective matte black finish';
        case 'stainless_steel': return 'a classic, high-quality stainless steel tumbler with a lid';
        default: return 'a high-quality tumbler';
    }
}

const getHalloweenTumblerSettingDescription = (setting: HalloweenTumblerSetting): string => {
    const settingData = HALLOWEEN_TUMBLER_SETTINGS.find(s => s.id === setting);
    return settingData ? settingData.description : 'a festive halloween scene';
}

const getTumblerTrioStyleDescription = (style: TumblerTrioStyle): string => {
    switch (style) {
        case 'glossy_white': return 'three identical high-quality tumblers with a glossy white finish, perfect for sublimation prints';
        case 'matte_white': return 'three identical high-quality tumblers with a modern, non-reflective matte white finish';
        case 'stainless_steel': return 'three identical classic, high-quality stainless steel tumblers with lids';
        default: return 'three identical high-quality tumblers';
    }
}

const getTumblerTrioSettingDescription = (setting: TumblerTrioSetting): string => {
    const settingData = TUMBLER_TRIO_SETTINGS.find(s => s.id === setting);
    return settingData ? settingData.description : 'a clean, well-lit product setting';
}

const getPhoneCaseStyleDescription = (style: PhoneCaseStyle): string => {
    switch (style) {
        case 'glossy': return 'a high-quality glossy finish';
        case 'matte': return 'a modern, non-reflective matte finish';
        case 'clear': return 'a transparent, clear';
        default: return 'a high-quality';
    }
}

const getPhoneCaseModelDescription = (model: PhoneCaseModel): string => {
    const modelData = PHONE_CASE_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person holding a phone';
}

const getStickerStyleDescription = (style: StickerStyle): string => {
    switch (style) {
        case 'die_cut_glossy': return 'die-cut sticker with a glossy vinyl finish';
        case 'kiss_cut_matte': return 'kiss-cut sticker on a square backing with a matte finish';
        case 'holographic': return 'die-cut sticker with a vibrant holographic finish';
        default: return 'a high-quality sticker';
    }
}

const getStickerSettingDescription = (setting: StickerSetting): string => {
    const settingData = STICKER_SETTINGS.find(s => s.id === setting);
    return settingData ? settingData.description : 'a sticker on a surface';
}

const getPosterStyleDescription = (style: PosterStyle): string => {
    switch (style) {
        case 'glossy_finish': return 'poster with a glossy finish';
        case 'matte_finish': return 'poster with a non-reflective matte finish';
        default: return 'a high-quality poster';
    }
}

const getPosterSettingDescription = (setting: PosterSetting): string => {
    const settingData = POSTER_SETTINGS.find(s => s.id === setting);
    return settingData ? settingData.description : 'a poster on a wall';
}

const getWalletStyleDescription = (style: WalletStyle): string => {
    switch (style) {
        case 'bifold': return 'a classic bifold leather wallet';
        case 'cardholder': return 'a slim, minimalist leather cardholder wallet';
        case 'zipper': return 'a modern leather wallet with a zipper closure';
        default: return 'a high-quality leather wallet';
    }
}

const getWalletModelDescription = (model: WalletModel): string => {
    const modelData = WALLET_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person holding a wallet';
}

const getCapStyleDescription = (style: CapStyle): string => {
    switch (style) {
        case 'structured_baseball': return 'a classic, structured baseball cap with a curved brim';
        case 'unstructured_dad_hat': return 'a casual, unstructured "dad hat" with a soft crown';
        case 'snapback': return 'a stylish snapback cap with a flat brim';
        default: return 'a high-quality cap';
    }
}

const getCapModelDescription = (model: CapModel): string => {
    const modelData = CAP_MODELS.find(m => m.id === model);
    return modelData ? modelData.description : 'a person wearing a cap';
}

const getPillowStyleDescription = (style: PillowStyle): string => {
    switch (style) {
        case 'square_cotton': return 'a square throw pillow made of high-quality cotton';
        case 'lumbar_linen': return 'a rectangular lumbar pillow with a textured linen finish';
        case 'round_velvet': return 'a round decorative pillow made of plush velvet';
        default: return 'a high-quality pillow';
    }
}

const getPillowSettingDescription = (setting: PillowSetting): string => {
    const settingData = PILLOW_SETTINGS.find(s => s.id === setting);
    return settingData ? settingData.description : 'a cozy home setting';
}

const getFlatLayStyleDescription = (style: FlatLayStyle): string => {
    const styleData = FLAT_LAY_STYLES.find(s => s.id === style);
    return styleData ? styleData.description : 'a clean, minimalist flat lay';
}

const getPuzzleStyleDescription = (style: PuzzleStyle): string => {
    switch (style) {
        case 'rectangle_cardboard': return 'a rectangular jigsaw puzzle made of high-quality cardboard with standard interlocking pieces';
        case 'heart_shaped_wood': return 'a heart-shaped jigsaw puzzle made of laser-cut wood with unique, thematic pieces';
        default: return 'a high-quality jigsaw puzzle';
    }
}

const getPuzzleSettingDescription = (setting: PuzzleSetting): string => {
    const settingData = PUZZLE_SETTINGS.find(s => s.id === setting);
    return settingData ? settingData.description : 'a product setting';
}


const getTextStyleDescription = (style: TextStyle, contrastColor: 'white' | 'black', gradientStart?: string, gradientEnd?: string): string => {
    switch (style) {
        case 'outline':
            return `Each letter must have a thin, sharp outline. The outline color must be exactly ${contrastColor}.`;
        case 'shadow': 
            return 'The text must have a professional, soft drop shadow to give it depth.';
        case 'glow': 
            return 'The text should have a vibrant, neon-like glow effect around it.';
        case 'neon':
            return 'The text must look like a realistic, brightly glowing neon sign. The glow should be vibrant and emanate from the letters.';
        case '3d': 
            return 'The text must be rendered in a bold 3D block style with realistic shading.';
        case 'metallic': 
            return 'The text should have a realistic metallic texture, like brushed gold or polished silver.';
        case 'chrome':
            return 'The text must have a hyper-realistic, polished chrome effect, with metallic reflections and highlights that suggest a curved, shiny surface.';
        case 'gradient':
            if (gradientStart && gradientEnd) {
                return `The text must be rendered with a smooth vertical gradient, transitioning from ${gradientStart} at the top to ${gradientEnd} at the bottom.`;
            }
            return 'The text must be rendered with a smooth vertical gradient effect.';
        case 'pastel_rainbow':
            return 'The text must be rendered with a smooth horizontal gradient of soft pastel rainbow colors (e.g., light pink, soft orange, pale yellow, mint green, baby blue, lavender).';
        case 'distressed':
            return 'The text should have a rugged, distressed, and cracked texture, as if it has been weathered over time.';
        case 'fire':
            return 'The text must be rendered as if it is engulfed in realistic, vibrant flames.';
        case 'ice':
            return 'The text must be rendered to look like it is made of solid, clear or slightly frosted ice, with realistic frosty textures and chilly highlights.';
        case 'wooden':
            return 'The text should appear as if it is carved from or made of realistic wood, with complete wood grain texture and natural lighting effects.';
        case 'comic':
            return 'The text should be in a dynamic, comic-book style, with a bold outline and possibly a halftone dot pattern fill.';
        case 'glitch':
            return 'The text must have a modern digital glitch effect, with color channel separation and pixel distortion.';
        case 'script':
            return 'The text must be rendered in an elegant, flowing, and connected script style, as if written with a calligraphy pen.';
        case 'varsity':
            return `The text should be in a classic, blocky "varsity" or "collegiate" athletic style. Each letter must have a thick, contrasting outline (use ${contrastColor} for the outline).`;
        case 'none': 
        default: 
            return 'The text should be rendered cleanly without any additional effects.';
    }
}

/**
 * Step 1: Generate a base image of a model with a blank product.
 * This uses a text-to-image model to create a safe "canvas" for editing.
 */
const generateBaseImage = async (options: DesignOptions): Promise<string> => {
    const { productType, productColor, pose, audience, bagMaterial, frameStyle, frameModel, mugStyle, mugModel, sipperGlassStyle, sipperGlassModel, tumblerStyle, tumblerModel, halloweenTumblerStyle, halloweenTumblerSetting, tumblerTrioStyle, tumblerTrioSetting, phoneCaseStyle, phoneCaseModel, stickerStyle, stickerSetting, posterStyle, posterSetting, walletStyle, walletModel, capStyle, capModel, pillowStyle, pillowSetting, flatLayStyle, puzzleStyle, puzzleSetting, aspectRatio } = options;
    let prompt;

    switch (productType) {
        case 'tshirt':
        case 'sweatshirt':
        case 'hoodie': {
            let productGarment;
            if (productType === 'tshirt') {
                productGarment = 't-shirt';
            } else if (productType === 'sweatshirt') {
                productGarment = 'sweatshirt';
            } else {
                productGarment = 'hoodie';
            }

            if (pose === 'flat_lay_simple') {
                prompt = `Top-down commercial product photo. A plain, unbranded, high-quality ${getColorName(productColor)} ${productGarment} is laid perfectly flat on a clean, neutral-colored wooden surface. The ${productGarment} has a few subtle, natural-looking wrinkles to show fabric texture. The lighting is soft and even, creating gentle, realistic shadows. The background is simple and out of focus. ${qualityPrompt}`;
            } else {
                const audienceDescription = getAudienceDescription(audience);
                const poseDescription = getPoseDescription(pose);
                prompt = `Commercial product mockup photo, waist-up portrait. A hyperrealistic model, ${audienceDescription}, in a ${poseDescription} with a natural expression. The model has extremely detailed, natural skin texture with subtle pores and looks completely authentic. The model is wearing a plain, unbranded, high-quality ${getColorName(productColor)} ${productGarment} with detailed fabric weave and texture visible. The garment is shown clearly for a mockup. The background is a clean, modern, heavily out-of-focus studio setting. ${qualityPrompt}`;
            }
            break;
        }
        case 'bag':
             prompt = `Commercial product lifestyle photo. A person's hand and arm with hyperrealistic, natural skin texture, holding a plain, unbranded ${bagMaterial} bag in ${getColorName(productColor)}. The focus is on the bag, highlighting its detailed material texture. The background is a stylish, heavily blurred urban or cafe setting with strong bokeh. ${qualityPrompt}`;
            break;
        case 'wallet':
            const walletStyleDescription = getWalletStyleDescription(walletStyle);
            const walletModelDescription = getWalletModelDescription(walletModel);
            prompt = `Commercial product photo of a plain, unbranded ${walletStyleDescription} in a ${getColorName(productColor)} color, highlighting the detailed leather texture. Scene: ${walletModelDescription}. The background has a beautiful, strong bokeh effect. ${qualityPrompt}`;
            break;
        case 'wooden_frame':
            const frameStyleDescription = getFrameStyleDescription(frameStyle);
            const frameModelDescription = getFrameModelDescription(frameModel);
            prompt = `Commercial product photo. A hyperrealistic model, ${frameModelDescription}, with natural skin texture, is holding up a plain, empty ${frameStyleDescription} in a ${getColorName(productColor)} finish. The focus is on the empty frame, showing its detailed wood grain. The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'tea_mug':
            // FIX: Changed 'style' to 'mugStyle' to fix reference error.
            const mugStyleDescription = getMugStyleDescription(mugStyle);
            const mugModelDescription = getMugModelDescription(mugModel);
            prompt = `Commercial product photo. A hyperrealistic model, ${mugModelDescription}, with natural skin texture, is holding a plain, unbranded ${mugStyleDescription} in a ${getColorName(productColor)} color. The focus is on the mug, showing its texture. The background has a beautiful, strong bokeh effect. ${qualityPrompt}`;
            break;
        case 'sipper_glass':
            const sipperStyleDescription = getSipperGlassStyleDescription(sipperGlassStyle);
            const sipperModelDescription = getSipperGlassModelDescription(sipperGlassModel);
            const beverageColor = productColor === '#FFFFFF' ? 'clear' : getColorName(productColor);
            prompt = `Commercial product photo. A hyperrealistic model, ${sipperModelDescription}, holding a plain, unbranded ${sipperStyleDescription} containing a ${beverageColor} beverage. The focus is on the sipper glass, showing realistic condensation and reflections. The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'tumbler_wrap':
            const tumblerStyleDescription = getTumblerStyleDescription(tumblerStyle);
            const tumblerModelDescription = getTumblerModelDescription(tumblerModel);
            prompt = `Commercial product photo. A hyperrealistic model, ${tumblerModelDescription}, holding a plain, unbranded ${tumblerStyleDescription} in a ${getColorName(productColor)} color. The focus is on the tumbler, highlighting its material finish (matte, steel). The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'halloween_tumbler':
            const halloweenTumblerStyleDescription = getHalloweenTumblerStyleDescription(halloweenTumblerStyle);
            const halloweenTumblerSettingDescription = getHalloweenTumblerSettingDescription(halloweenTumblerSetting);
            prompt = `Commercial product photo. A plain, unbranded ${halloweenTumblerStyleDescription} in a ${getColorName(productColor)} color is placed in the center of ${halloweenTumblerSettingDescription}. The focus is on the tumbler, highlighting its material and the atmospheric lighting. The background has a beautiful, strong bokeh effect. ${qualityPrompt}`;
            break;
        case 'tumbler_trio':
            const tumblerTrioStyleDescription = getTumblerTrioStyleDescription(tumblerTrioStyle);
            const tumblerTrioSettingDescription = getTumblerTrioSettingDescription(tumblerTrioSetting);
            prompt = `Commercial product photo. ${tumblerTrioStyleDescription} are standing in a neat row, side-by-side, on ${tumblerTrioSettingDescription}. They are all plain, unbranded, and have a ${getColorName(productColor)} base color. The focus is on the three tumblers, highlighting their material and reflections. The background has a beautiful bokeh effect. ${qualityPrompt}`;
            break;
        case 'phone_case':
            const phoneCaseStyleDescription = getPhoneCaseStyleDescription(phoneCaseStyle);
            const phoneCaseModelDescription = getPhoneCaseModelDescription(phoneCaseModel);
            prompt = `Commercial product photo. A plain, unbranded phone case with a ${phoneCaseStyleDescription} in a ${getColorName(productColor)} color is shown. Scene: ${phoneCaseModelDescription}. The focus is on the phone case, highlighting its material and realistic reflections. The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'sticker':
            const stickerStyleDescription = getStickerStyleDescription(stickerStyle);
            const stickerSettingDescription = getStickerSettingDescription(stickerSetting);
            prompt = `Commercial product photo. A plain, unbranded, white ${stickerStyleDescription} is shown. Scene: ${stickerSettingDescription}. The focus is on the sticker, which is clean and empty, showing its material finish. The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'poster':
            const posterStyleDescription = getPosterStyleDescription(posterStyle);
            const posterSettingDescription = getPosterSettingDescription(posterSetting);
            prompt = `Commercial product photo. A plain, unbranded, white ${posterStyleDescription} is shown. Scene: ${posterSettingDescription}. The focus is on the empty poster, showing its paper texture. The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'cap':
            const capStyleDescription = getCapStyleDescription(capStyle);
            const capModelDescription = getCapModelDescription(capModel);
            prompt = `Commercial product photo. Scene: ${capModelDescription}, featuring a plain, unbranded ${capStyleDescription} in a ${getColorName(productColor)} color. The focus is on the cap, showing detailed fabric texture. The background is beautifully blurred with strong bokeh. ${qualityPrompt}`;
            break;
        case 'pillow':
            const pillowStyleDescription = getPillowStyleDescription(pillowStyle);
            const pillowSettingDescription = getPillowSettingDescription(pillowSetting);
            prompt = `Commercial product photo. A plain, unbranded ${pillowStyleDescription} in a ${getColorName(productColor)} color is placed in the center of the scene: ${pillowSettingDescription}. The focus is on the pillow, highlighting its detailed fabric texture and softness. The background has a beautiful bokeh effect. ${qualityPrompt}`;
            break;
        case 'flat_lay':
            const flatLayStyleDescription = getFlatLayStyleDescription(flatLayStyle);
            prompt = `Top-down commercial product photo. A perfectly arranged flat lay composition featuring a plain, unbranded, high-quality ${getColorName(productColor)} t-shirt with visible fabric texture. Scene: ${flatLayStyleDescription}. The lighting is soft and even, creating gentle, realistic shadows. ${qualityPrompt}`;
            break;
        case 'jigsaw_puzzle':
            const puzzleStyleDescription = getPuzzleStyleDescription(puzzleStyle);
            const puzzleSettingDescription = getPuzzleSettingDescription(puzzleSetting);
            prompt = `Commercial product photo. Scene: ${puzzleSettingDescription}. The ${puzzleStyleDescription} is completely blank and white, ready for an artwork to be applied, showing the subtle texture of the pieces. The focus is on the puzzle. The background has a beautiful bokeh effect. ${qualityPrompt}`;
            break;
        default:
            throw new Error(`Invalid product type for base image generation: ${productType}`);
    }

    // FIX: Explicitly provide the response type to withRetry to fix errors on accessing response.generatedImages.
    // FIX: Moved 'safetySettings' to be a top-level property. It is not part of the 'config' object for 'generateImages'.
    const response = await withRetry<GenerateImagesResponse>(() => ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        safetySettings: safetySettings,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
    }));

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error('Base image generation failed. The API did not return an image.');
    }

    const base64Image = response.generatedImages[0].image.imageBytes;
    if (!base64Image) {
        throw new Error('Base image generation failed. The API returned empty image data.');
    }

    return base64Image;
};

// --- EDITING PROMPT FUNCTIONS --- //
// These functions create prompts for the second step: editing the base image.

const getTshirtEditPrompt = (options: DesignOptions): string => {
    const { style, text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const personaPrompt = `As a world-class photorealistic mockup artist, your task is to add a design to the t-shirt in the provided image.`;
    const basePrompt = `${personaPrompt}
- The design consists of the provided logo image ${textProvided ? `and the text: "${text}"` : ''}.
- Professionally combine the logo ${textProvided ? 'and text' : ''} into a cohesive, artistic composition on the garment.
${criticalRealismInstructions}
- Do not change the model, the shirt color, or the background. Only add the design.
- Output ONLY the final, photorealistic image.`;

    if (!textProvided && style !== 'full_wrap' && style !== 'full_front') return basePrompt;

    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = `- The text must be rendered in the "${fontName}" font.\n- The text color must be "${colorName}".\n- ${textStyleDescription}`;

    switch (style) {
        case 'full_front':
            return `As a world-class photorealistic mockup artist, your task is to create a full-front print mockup.
- Take the provided logo/artwork image and apply it as a single, large graphic that covers the entire front surface of the t-shirt.
- The image should be scaled to fit the front of the garment, from just below the collar to the bottom hem, and from side seam to side seam, without repeating or tiling.
${criticalRealismInstructions}
- Do not change the model, the background, or the t-shirt's shape.
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image.
- Output ONLY the final, edited image.`;
        case 'full_wrap':
            return `As a world-class photorealistic mockup artist, your task is to create an all-over print mockup.
- Take the provided logo/artwork image and apply it as a seamless, repeating pattern that covers the entire visible surface of the t-shirt, including the front, sleeves, and any visible parts of the back.
${criticalRealismInstructions}
- Do not change the model, the background, or the t-shirt's shape.
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image pattern.
- Output ONLY the final, edited image.`;
        case 'slasher': return `${basePrompt}\n${textStylingPrompt}\n- The text style should be distressed and dripping, reminiscent of classic slasher horror movie posters.\n- Position the text creatively around the logo.`;
        case 'split': return `${basePrompt}\n${textStylingPrompt}\n- The font should be bold, grungy, and distressed.\n- Arrange the text vertically in two columns, with the logo in the center between them.`;
        case 'sketch': return `${basePrompt}\n- The logo should be transformed into a gritty, monochrome charcoal sketch.\n${textStylingPrompt}\n- The text should have a simple, faded, type-written effect below the sketch.`;
        case 'vintage_stamp': return `${basePrompt}\n${textStylingPrompt}\n- Arrange the text in a circular path that wraps around the logo, creating a classic stamp or seal effect.\n- The font should be a classic serif or sans-serif type.`;
        case 'retro_wave': return `${basePrompt}\n${textStylingPrompt}\n- The text should be bold and positioned below the logo.\n- Apply a vibrant, 80s-inspired retro wave aesthetic, possibly with a neon glow or a chrome finish to the text.`;
        case 'minimalist_line': return `${basePrompt}\n${textStylingPrompt}\n- Create a clean, minimalist composition.\n- Place the logo on the left chest area and the text vertically aligned on the right side of the shirt.`;
        case 'grunge_overlay': return `${basePrompt}\n${textStylingPrompt}\n- The text must be placed directly on top of the logo, creating a layered effect.\n- Apply a heavy grunge or distressed texture to both the text and logo so they look unified and worn out.`;
        case 'cyberpunk_glitch': return `${basePrompt}\n${textStylingPrompt}\n- The text should be rendered in a futuristic, digital font. Apply a heavy cyberpunk-style glitch effect to both the logo and the text, with neon colors like magenta, cyan, and electric blue, creating a vibrant, high-tech, and distorted look.`;
        case 'stacked_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be arranged in a stacked, vertical layout. Each word should be on its own line, centered. Use a bold, condensed sans-serif font. Position the stacked text block below the logo for a clean, modern typographic composition.`;
        case 'emblem': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a single, cohesive badge or emblem. The text should wrap around or be integrated within a circular or shield-like shape that also contains the logo. The entire emblem should look like a unified patch or seal.`;
        case 'photo_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be placed directly *inside* the main subject of the logo image, as if it is part of the original photo. The text should follow the contours and lighting of the object it is placed on, creating a seamless and integrated effect. Use a bold, clear font that complements the image.`;
        case 'american_traditional_tattoo': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a classic American Traditional tattoo design.\n- The logo should be the centerpiece, rendered with bold black outlines and a limited, high-contrast color palette (e.g., red, yellow, green, black).\n- The text should be integrated into a flowing banner or ribbon that wraps around the logo.\n- The entire design must have a clean, inked-on appearance.`;
        case 'watercolor_splash': return `${basePrompt}\n${textStylingPrompt}\n- The design should appear as if it was painted directly onto the shirt with watercolors.\n- The logo should blend softly into the fabric, with soft, feathered edges.\n- Surround and overlay the logo and text with artistic, vibrant watercolor splashes and splatters.\n- The text should also have a soft, painted look.`;
        case 'art_deco': return `${basePrompt}\n${textStylingPrompt}\n- Reinterpret the logo and text in a sophisticated Art Deco style.\n- Frame the logo with strong, elegant geometric shapes, intricate line work, and symmetrical patterns reminiscent of 1920s architecture and design.\n- The text should be rendered in a classic Art Deco sans-serif font, integrated into the geometric frame.\n- Use a color palette with metallic golds, silvers, and bold contrasting colors like black or navy.`;
        case 'pop_art': return `${basePrompt}\n${textStylingPrompt}\n- Transform the design into a vibrant Pop Art piece inspired by Andy Warhol and Roy Lichtenstein.\n- The logo should be rendered with bold outlines and bright, flat colors.\n- Incorporate a distinct halftone dot pattern (Ben-Day dots) into parts of the design.\n- The text should be in a bold, comic-book style, possibly enclosed in a speech bubble or action-style container.`;
        case 'cosmic_galaxy': return `${basePrompt}\n${textStylingPrompt}\n- Fill the logo and text with a stunning, high-resolution image of a vibrant nebula or galaxy.\n- The text and logo shapes should act as a "window" to the cosmic scene inside.\n- Add subtle glowing star highlights and cosmic dust effects around the design to enhance the theme.`;
        case 'japanese_ukiyo-e': return `${basePrompt}\n${textStylingPrompt}\n- Re-imagine the logo and text in the style of a traditional Japanese Ukiyo-e woodblock print.\n- Integrate iconic Ukiyo-e elements like stylized waves (like "The Great Wave off Kanagawa"), clouds, or cherry blossoms around the logo.\n- The color palette should be muted and reminiscent of traditional prints.\n- The text should be rendered in a font that complements the artistic style, perhaps with a brush-stroke effect.`;
        case 'distressed_vintage': return `${basePrompt}\n${textStylingPrompt}\n- The entire design (logo and text) must have a heavy, realistic distressed and cracked ink effect.\n- The graphic should look like a well-worn, faded print from a vintage t-shirt from the 1980s.\n- Slightly desaturate the colors to enhance the vintage feel.`;
        case 'typography_focus': return `${basePrompt}\n${textStylingPrompt}\n- The design's primary focus must be the text. Make it large, bold, and the center of attention.\n- The logo should be used as a smaller, secondary element, integrated subtly above or below the main text.`;
        case 'abstract_geometric': return `${basePrompt}\n${textStylingPrompt}\n- Frame the logo and text with a dynamic and artistic composition of abstract geometric shapes (lines, triangles, circles).\n- The overall aesthetic should be modern, clean, and visually striking.`;
        case 'vintage_poster': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a design reminiscent of a 1950s or 1960s vintage travel poster.\n- Use a limited, muted color palette, bold and stylized typography, and add a subtle paper texture overlay to the entire design for an authentic retro feel.`;
        case 'geometric_pattern': return `${basePrompt}\n${textStylingPrompt}\n- Create a modern, abstract design by integrating the logo within a repeating pattern of clean geometric shapes like triangles, hexagons, or circles.\n- The text should be placed cleanly within the pattern.\n- The overall effect should be contemporary and artistic.`;
        case 'hand_drawn_sketch': return `${basePrompt}\n${textStylingPrompt}\n- Transform the logo and text into a delicate, hand-drawn pencil or ink sketch.\n- The lines should be fine and slightly imperfect, giving it an authentic, artistic, and organic feel.\n- The text should also appear hand-lettered.`;
        case 'classic': default: return `${basePrompt}\n${textStylingPrompt}\n- Typeset the text in a semi-circular arc below the logo.`;
    }
};

const getFlatLayEditPrompt = (options: DesignOptions): string => {
    const { style, text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const personaPrompt = `As a world-class photorealistic mockup artist, your task is to add a graphic design to the T-shirt in the flat lay image.`;
    const basePrompt = `${personaPrompt}
- The design consists of the provided logo image ${textProvided ? `and the text: "${text}"` : ''}.
- Professionally combine the logo ${textProvided ? 'and text' : ''} into a cohesive, artistic composition.
- The design must be prominently displayed on the t-shirt.
${criticalRealismInstructions}
- **DO NOT CHANGE** any other elements in the flat lay scene (e.g., accessories, background). Only add the design to the T-shirt.
- Output ONLY the final, edited image.`;

    if (!textProvided && style !== 'full_wrap' && style !== 'full_front') return basePrompt;

    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = `- The text must be rendered in the "${fontName}" font.\n- The text color must be "${colorName}".\n- ${textStyleDescription}`;

    switch (style) {
        case 'full_front':
            return `As a world-class photorealistic mockup artist, create a full-front print mockup on the t-shirt within the provided flat lay image.
- Take the provided logo/artwork image and apply it as a single, large graphic that covers the entire front surface of the t-shirt.
- The image should be scaled to fit the front of the garment, from just below the collar to the bottom hem, and from side seam to side seam, without repeating or tiling.
${criticalRealismInstructions}
- **DO NOT CHANGE** any other elements of the flat lay scene (accessories, background).
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image.
- Output ONLY the final, edited image.`;
        case 'full_wrap':
            return `As a world-class photorealistic mockup artist, create an all-over print mockup on the t-shirt within the provided flat lay image.
- Take the provided logo/artwork image and apply it as a seamless, repeating pattern that covers the entire visible surface of the t-shirt.
${criticalRealismInstructions}
- **DO NOT CHANGE** any other elements of the flat lay scene (accessories, background).
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image pattern.
- Output ONLY the final, edited image.`;
        case 'slasher': return `${basePrompt}\n${textStylingPrompt}\n- The text style should be distressed and dripping, reminiscent of classic slasher horror movie posters.\n- Position the text creatively around the logo.`;
        case 'split': return `${basePrompt}\n${textStylingPrompt}\n- The font should be bold, grungy, and distressed.\n- Arrange the text vertically in two columns, with the logo in the center between them.`;
        case 'sketch': return `${basePrompt}\n- The logo should be transformed into a gritty, monochrome charcoal sketch.\n${textStylingPrompt}\n- The text should have a simple, faded, type-written effect below the sketch.`;
        case 'vintage_stamp': return `${basePrompt}\n${textStylingPrompt}\n- Arrange the text in a circular path that wraps around the logo, creating a classic stamp or seal effect.\n- The font should be a classic serif or sans-serif type.`;
        case 'retro_wave': return `${basePrompt}\n${textStylingPrompt}\n- The text should be bold and positioned below the logo.\n- Apply a vibrant, 80s-inspired retro wave aesthetic, possibly with a neon glow or a chrome finish to the text.`;
        case 'minimalist_line': return `${basePrompt}\n${textStylingPrompt}\n- Create a clean, minimalist composition.\n- Place the logo on the left chest area and the text vertically aligned on the right side of the shirt.`;
        case 'grunge_overlay': return `${basePrompt}\n${textStylingPrompt}\n- The text must be placed directly on top of the logo, creating a layered effect.\n- Apply a heavy grunge or distressed texture to both the text and logo so they look unified and worn out.`;
        case 'cyberpunk_glitch': return `${basePrompt}\n${textStylingPrompt}\n- The text should be rendered in a futuristic, digital font. Apply a heavy cyberpunk-style glitch effect to both the logo and the text, with neon colors like magenta, cyan, and electric blue, creating a vibrant, high-tech, and distorted look.`;
        case 'stacked_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be arranged in a stacked, vertical layout. Each word should be on its own line, centered. Use a bold, condensed sans-serif font. Position the stacked text block below the logo for a clean, modern typographic composition.`;
        case 'emblem': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a single, cohesive badge or emblem. The text should wrap around or be integrated within a circular or shield-like shape that also contains the logo. The entire emblem should look like a unified patch or seal.`;
        case 'photo_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be placed directly *inside* the main subject of the logo image, as if it is part of the original photo. The text should follow the contours and lighting of the object it is placed on, creating a seamless and integrated effect. Use a bold, clear font that complements the image.`;
        case 'american_traditional_tattoo': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a classic American Traditional tattoo design.\n- The logo should be the centerpiece, rendered with bold black outlines and a limited, high-contrast color palette (e.g., red, yellow, green, black).\n- The text should be integrated into a flowing banner or ribbon that wraps around the logo.\n- The entire design must have a clean, inked-on appearance.`;
        case 'watercolor_splash': return `${basePrompt}\n${textStylingPrompt}\n- The design should appear as if it was painted directly onto the shirt with watercolors.\n- The logo should blend softly into the fabric, with soft, feathered edges.\n- Surround and overlay the logo and text with artistic, vibrant watercolor splashes and splatters.\n- The text should also have a soft, painted look.`;
        case 'art_deco': return `${basePrompt}\n${textStylingPrompt}\n- Reinterpret the logo and text in a sophisticated Art Deco style.\n- Frame the logo with strong, elegant geometric shapes, intricate line work, and symmetrical patterns reminiscent of 1920s architecture and design.\n- The text should be rendered in a classic Art Deco sans-serif font, integrated into the geometric frame.\n- Use a color palette with metallic golds, silvers, and bold contrasting colors like black or navy.`;
        case 'pop_art': return `${basePrompt}\n${textStylingPrompt}\n- Transform the design into a vibrant Pop Art piece inspired by Andy Warhol and Roy Lichtenstein.\n- The logo should be rendered with bold outlines and bright, flat colors.\n- Incorporate a distinct halftone dot pattern (Ben-Day dots) into parts of the design.\n- The text should be in a bold, comic-book style, possibly enclosed in a speech bubble or action-style container.`;
        case 'cosmic_galaxy': return `${basePrompt}\n${textStylingPrompt}\n- Fill the logo and text with a stunning, high-resolution image of a vibrant nebula or galaxy.\n- The text and logo shapes should act as a "window" to the cosmic scene inside.\n- Add subtle glowing star highlights and cosmic dust effects around the design to enhance the theme.`;
        case 'japanese_ukiyo-e': return `${basePrompt}\n${textStylingPrompt}\n- Re-imagine the logo and text in the style of a traditional Japanese Ukiyo-e woodblock print.\n- Integrate iconic Ukiyo-e elements like stylized waves (like "The Great Wave off Kanagawa"), clouds, or cherry blossoms around the logo.\n- The color palette should be muted and reminiscent of traditional prints.\n- The text should be rendered in a font that complements the artistic style, perhaps with a brush-stroke effect.`;
        case 'distressed_vintage': return `${basePrompt}\n${textStylingPrompt}\n- The entire design (logo and text) must have a heavy, realistic distressed and cracked ink effect.\n- The graphic should look like a well-worn, faded print from a vintage t-shirt from the 1980s.\n- Slightly desaturate the colors to enhance the vintage feel.`;
        case 'typography_focus': return `${basePrompt}\n${textStylingPrompt}\n- The design's primary focus must be the text. Make it large, bold, and the center of attention.\n- The logo should be used as a smaller, secondary element, integrated subtly above or below the main text.`;
        case 'abstract_geometric': return `${basePrompt}\n${textStylingPrompt}\n- Frame the logo and text with a dynamic and artistic composition of abstract geometric shapes (lines, triangles, circles).\n- The overall aesthetic should be modern, clean, and visually striking.`;
        case 'vintage_poster': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a design reminiscent of a 1950s or 1960s vintage travel poster.\n- Use a limited, muted color palette, bold and stylized typography, and add a subtle paper texture overlay to the entire design for an authentic retro feel.`;
        case 'geometric_pattern': return `${basePrompt}\n${textStylingPrompt}\n- Create a modern, abstract design by integrating the logo within a repeating pattern of clean geometric shapes like triangles, hexagons, or circles.\n- The text should be placed cleanly within the pattern.\n- The overall effect should be contemporary and artistic.`;
        case 'hand_drawn_sketch': return `${basePrompt}\n${textStylingPrompt}\n- Transform the logo and text into a delicate, hand-drawn pencil or ink sketch.\n- The lines should be fine and slightly imperfect, giving it an authentic, artistic, and organic feel.\n- The text should also appear hand-lettered.`;
        case 'classic': default: return `${basePrompt}\n${textStylingPrompt}\n- Typeset the text in a semi-circular arc below the logo.`;
    }
};

const getSweatshirtEditPrompt = (options: DesignOptions): string => {
    const { style, text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const personaPrompt = `As a world-class photorealistic mockup artist, your task is to add a design to the sweatshirt in the provided image.`;
    const basePrompt = `${personaPrompt}
- The design consists of the provided logo image ${textProvided ? `and the text: "${text}"` : ''}.
- Professionally combine the logo ${textProvided ? 'and text' : ''} into a cohesive, artistic composition on the garment.
${criticalRealismInstructions}
- Do not change the model, the sweatshirt color, or the background. Only add the design.
- Output ONLY the final, photorealistic image.`;

    if (!textProvided && style !== 'full_wrap' && style !== 'full_front') return basePrompt;

    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = `- The text must be rendered in the "${fontName}" font.\n- The text color must be "${colorName}".\n- ${textStyleDescription}`;

    switch (style) {
        case 'full_front':
            return `As a world-class photorealistic mockup artist, your task is to create a full-front print mockup.
- Take the provided logo/artwork image and apply it as a single, large graphic that covers the entire front surface of the sweatshirt.
- The image should be scaled to fit the front of the garment, from just below the collar to the bottom hem, and from side seam to side seam, without repeating or tiling.
${criticalRealismInstructions}
- Do not change the model, the background, or the sweatshirt's shape.
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image.
- Output ONLY the final, edited image.`;
        case 'full_wrap':
            return `As a world-class photorealistic mockup artist, your task is to create an all-over print mockup.
- Take the provided logo/artwork image and apply it as a seamless, repeating pattern that covers the entire visible surface of the sweatshirt, including the front, sleeves, and any visible parts of the back.
${criticalRealismInstructions}
- Do not change the model, the background, or the sweatshirt's shape.
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image pattern.
- Output ONLY the final, edited image.`;
        case 'slasher': return `${basePrompt}\n${textStylingPrompt}\n- The text style should be distressed and dripping, reminiscent of classic slasher horror movie posters.\n- Position the text creatively around the logo.`;
        case 'split': return `${basePrompt}\n${textStylingPrompt}\n- The font should be bold, grungy, and distressed.\n- Arrange the text vertically in two columns, with the logo in the center between them.`;
        case 'sketch': return `${basePrompt}\n- The logo should be transformed into a gritty, monochrome charcoal sketch.\n${textStylingPrompt}\n- The text should have a simple, faded, type-written effect below the sketch.`;
        case 'vintage_stamp': return `${basePrompt}\n${textStylingPrompt}\n- Arrange the text in a circular path that wraps around the logo, creating a classic stamp or seal effect.\n- The font should be a classic serif or sans-serif type.`;
        case 'retro_wave': return `${basePrompt}\n${textStylingPrompt}\n- The text should be bold and positioned below the logo.\n- Apply a vibrant, 80s-inspired retro wave aesthetic, possibly with a neon glow or a chrome finish to the text.`;
        case 'minimalist_line': return `${basePrompt}\n${textStylingPrompt}\n- Create a clean, minimalist composition.\n- Place the logo on the left chest area and the text vertically aligned on the right side of the shirt.`;
        case 'grunge_overlay': return `${basePrompt}\n${textStylingPrompt}\n- The text must be placed directly on top of the logo, creating a layered effect.\n- Apply a heavy grunge or distressed texture to both the text and logo so they look unified and worn out.`;
        case 'cyberpunk_glitch': return `${basePrompt}\n${textStylingPrompt}\n- The text should be rendered in a futuristic, digital font. Apply a heavy cyberpunk-style glitch effect to both the logo and the text, with neon colors like magenta, cyan, and electric blue, creating a vibrant, high-tech, and distorted look.`;
        case 'stacked_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be arranged in a stacked, vertical layout. Each word should be on its own line, centered. Use a bold, condensed sans-serif font. Position the stacked text block below the logo for a clean, modern typographic composition.`;
        case 'emblem': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a single, cohesive badge or emblem. The text should wrap around or be integrated within a circular or shield-like shape that also contains the logo. The entire emblem should look like a unified patch or seal.`;
        case 'photo_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be placed directly *inside* the main subject of the logo image, as if it is part of the original photo. The text should follow the contours and lighting of the object it is placed on, creating a seamless and integrated effect. Use a bold, clear font that complements the image.`;
        case 'american_traditional_tattoo': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a classic American Traditional tattoo design.\n- The logo should be the centerpiece, rendered with bold black outlines and a limited, high-contrast color palette (e.g., red, yellow, green, black).\n- The text should be integrated into a flowing banner or ribbon that wraps around the logo.\n- The entire design must have a clean, inked-on appearance.`;
        case 'watercolor_splash': return `${basePrompt}\n${textStylingPrompt}\n- The design should appear as if it was painted directly onto the shirt with watercolors.\n- The logo should blend softly into the fabric, with soft, feathered edges.\n- Surround and overlay the logo and text with artistic, vibrant watercolor splashes and splatters.\n- The text should also have a soft, painted look.`;
        case 'art_deco': return `${basePrompt}\n${textStylingPrompt}\n- Reinterpret the logo and text in a sophisticated Art Deco style.\n- Frame the logo with strong, elegant geometric shapes, intricate line work, and symmetrical patterns reminiscent of 1920s architecture and design.\n- The text should be rendered in a classic Art Deco sans-serif font, integrated into the geometric frame.\n- Use a color palette with metallic golds, silvers, and bold contrasting colors like black or navy.`;
        case 'pop_art': return `${basePrompt}\n${textStylingPrompt}\n- Transform the design into a vibrant Pop Art piece inspired by Andy Warhol and Roy Lichtenstein.\n- The logo should be rendered with bold outlines and bright, flat colors.\n- Incorporate a distinct halftone dot pattern (Ben-Day dots) into parts of the design.\n- The text should be in a bold, comic-book style, possibly enclosed in a speech bubble or action-style container.`;
        case 'cosmic_galaxy': return `${basePrompt}\n${textStylingPrompt}\n- Fill the logo and text with a stunning, high-resolution image of a vibrant nebula or galaxy.\n- The text and logo shapes should act as a "window" to the cosmic scene inside.\n- Add subtle glowing star highlights and cosmic dust effects around the design to enhance the theme.`;
        case 'japanese_ukiyo-e': return `${basePrompt}\n${textStylingPrompt}\n- Re-imagine the logo and text in the style of a traditional Japanese Ukiyo-e woodblock print.\n- Integrate iconic Ukiyo-e elements like stylized waves (like "The Great Wave off Kanagawa"), clouds, or cherry blossoms around the logo.\n- The color palette should be muted and reminiscent of traditional prints.\n- The text should be rendered in a font that complements the artistic style, perhaps with a brush-stroke effect.`;
        case 'distressed_vintage': return `${basePrompt}\n${textStylingPrompt}\n- The entire design (logo and text) must have a heavy, realistic distressed and cracked ink effect.\n- The graphic should look like a well-worn, faded print from a vintage sweatshirt from the 1980s.\n- Slightly desaturate the colors to enhance the vintage feel.`;
        case 'typography_focus': return `${basePrompt}\n${textStylingPrompt}\n- The design's primary focus must be the text. Make it large, bold, and the center of attention.\n- The logo should be used as a smaller, secondary element, integrated subtly above or below the main text.`;
        case 'abstract_geometric': return `${basePrompt}\n${textStylingPrompt}\n- Frame the logo and text with a dynamic and artistic composition of abstract geometric shapes (lines, triangles, circles).\n- The overall aesthetic should be modern, clean, and visually striking.`;
        case 'vintage_poster': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a design reminiscent of a 1950s or 1960s vintage travel poster.\n- Use a limited, muted color palette, bold and stylized typography, and add a subtle paper texture overlay to the entire design for an authentic retro feel.`;
        case 'geometric_pattern': return `${basePrompt}\n${textStylingPrompt}\n- Create a modern, abstract design by integrating the logo within a repeating pattern of clean geometric shapes like triangles, hexagons, or circles.\n- The text should be placed cleanly within the pattern.\n- The overall effect should be contemporary and artistic.`;
        case 'hand_drawn_sketch': return `${basePrompt}\n${textStylingPrompt}\n- Transform the logo and text into a delicate, hand-drawn pencil or ink sketch.\n- The lines should be fine and slightly imperfect, giving it an authentic, artistic, and organic feel.\n- The text should also appear hand-lettered.`;
        case 'classic': default: return `${basePrompt}\n${textStylingPrompt}\n- Typeset the text in a semi-circular arc below the logo.`;
    }
};

const getHoodieEditPrompt = (options: DesignOptions): string => {
    const { style, text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const personaPrompt = `As a world-class photorealistic mockup artist, your task is to add a design to the hoodie in the provided image.`;
    const basePrompt = `${personaPrompt}
- The design consists of the provided logo image ${textProvided ? `and the text: "${text}"` : ''}.
- Professionally combine the logo ${textProvided ? 'and text' : ''} into a cohesive, artistic composition on the garment.
- The design must be realistically placed above the front pocket if one is visible.
${criticalRealismInstructions}
- Do not change the model, the hoodie color, or the background. Only add the design.
- Output ONLY the final, photorealistic image.`;

    if (!textProvided && style !== 'full_wrap' && style !== 'full_front') return basePrompt;

    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = `- The text must be rendered in the "${fontName}" font.\n- The text color must be "${colorName}".\n- ${textStyleDescription}`;

    switch (style) {
        case 'full_front':
            return `As a world-class photorealistic mockup artist, your task is to create a full-front print mockup.
- Take the provided logo/artwork image and apply it as a single, large graphic that covers the entire front surface of the hoodie.
- The image should be scaled to fit the front of the garment, from just below the collar to the bottom hem, and from side seam to side seam. Avoid printing over the front pocket if one is visible.
${criticalRealismInstructions}
- Do not change the model, the background, or the hoodie's shape.
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image.
- Output ONLY the final, edited image.`;
        case 'full_wrap':
            return `As a world-class photorealistic mockup artist, your task is to create an all-over print mockup.
- Take the provided logo/artwork image and apply it as a seamless, repeating pattern that covers the entire visible surface of the hoodie, including the front, sleeves, hood, and any visible parts of the back.
${criticalRealismInstructions}
- Do not change the model, the background, or the hoodie's shape.
- **IMPORTANT:** Ignore any text prompt. The design is based solely on the provided image pattern.
- Output ONLY the final, edited image.`;
        case 'slasher': return `${basePrompt}\n${textStylingPrompt}\n- The text style should be distressed and dripping, reminiscent of classic slasher horror movie posters.\n- Position the text creatively around the logo.`;
        case 'split': return `${basePrompt}\n${textStylingPrompt}\n- The font should be bold, grungy, and distressed.\n- Arrange the text vertically in two columns, with the logo in the center between them.`;
        case 'sketch': return `${basePrompt}\n- The logo should be transformed into a gritty, monochrome charcoal sketch.\n${textStylingPrompt}\n- The text should have a simple, faded, type-written effect below the sketch.`;
        case 'vintage_stamp': return `${basePrompt}\n${textStylingPrompt}\n- Arrange the text in a circular path that wraps around the logo, creating a classic stamp or seal effect.\n- The font should be a classic serif or sans-serif type.`;
        case 'retro_wave': return `${basePrompt}\n${textStylingPrompt}\n- The text should be bold and positioned below the logo.\n- Apply a vibrant, 80s-inspired retro wave aesthetic, possibly with a neon glow or a chrome finish to the text.`;
        case 'minimalist_line': return `${basePrompt}\n${textStylingPrompt}\n- Create a clean, minimalist composition.\n- Place the logo on the left chest area and the text vertically aligned on the right side of the shirt.`;
        case 'grunge_overlay': return `${basePrompt}\n${textStylingPrompt}\n- The text must be placed directly on top of the logo, creating a layered effect.\n- Apply a heavy grunge or distressed texture to both the text and logo so they look unified and worn out.`;
        case 'cyberpunk_glitch': return `${basePrompt}\n${textStylingPrompt}\n- The text should be rendered in a futuristic, digital font. Apply a heavy cyberpunk-style glitch effect to both the logo and the text, with neon colors like magenta, cyan, and electric blue, creating a vibrant, high-tech, and distorted look.`;
        case 'stacked_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be arranged in a stacked, vertical layout. Each word should be on its own line, centered. Use a bold, condensed sans-serif font. Position the stacked text block below the logo for a clean, modern typographic composition.`;
        case 'emblem': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a single, cohesive badge or emblem. The text should wrap around or be integrated within a circular or shield-like shape that also contains the logo. The entire emblem should look like a unified patch or seal.`;
        case 'photo_text': return `${basePrompt}\n${textStylingPrompt}\n- The text should be placed directly *inside* the main subject of the logo image, as if it is part of the original photo. The text should follow the contours and lighting of the object it is placed on, creating a seamless and integrated effect. Use a bold, clear font that complements the image.`;
        case 'american_traditional_tattoo': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a classic American Traditional tattoo design.\n- The logo should be the centerpiece, rendered with bold black outlines and a limited, high-contrast color palette (e.g., red, yellow, green, black).\n- The text should be integrated into a flowing banner or ribbon that wraps around the logo.\n- The entire design must have a clean, inked-on appearance.`;
        case 'watercolor_splash': return `${basePrompt}\n${textStylingPrompt}\n- The design should appear as if it was painted directly onto the shirt with watercolors.\n- The logo should blend softly into the fabric, with soft, feathered edges.\n- Surround and overlay the logo and text with artistic, vibrant watercolor splashes and splatters.\n- The text should also have a soft, painted look.`;
        case 'art_deco': return `${basePrompt}\n${textStylingPrompt}\n- Reinterpret the logo and text in a sophisticated Art Deco style.\n- Frame the logo with strong, elegant geometric shapes, intricate line work, and symmetrical patterns reminiscent of 1920s architecture and design.\n- The text should be rendered in a classic Art Deco sans-serif font, integrated into the geometric frame.\n- Use a color palette with metallic golds, silvers, and bold contrasting colors like black or navy.`;
        case 'pop_art': return `${basePrompt}\n${textStylingPrompt}\n- Transform the design into a vibrant Pop Art piece inspired by Andy Warhol and Roy Lichtenstein.\n- The logo should be rendered with bold outlines and bright, flat colors.\n- Incorporate a distinct halftone dot pattern (Ben-Day dots) into parts of the design.\n- The text should be in a bold, comic-book style, possibly enclosed in a speech bubble or action-style container.`;
        case 'cosmic_galaxy': return `${basePrompt}\n${textStylingPrompt}\n- Fill the logo and text with a stunning, high-resolution image of a vibrant nebula or galaxy.\n- The text and logo shapes should act as a "window" to the cosmic scene inside.\n- Add subtle glowing star highlights and cosmic dust effects around the design to enhance the theme.`;
        case 'japanese_ukiyo-e': return `${basePrompt}\n${textStylingPrompt}\n- Re-imagine the logo and text in the style of a traditional Japanese Ukiyo-e woodblock print.\n- Integrate iconic Ukiyo-e elements like stylized waves (like "The Great Wave off Kanagawa"), clouds, or cherry blossoms around the logo.\n- The color palette should be muted and reminiscent of traditional prints.\n- The text should be rendered in a font that complements the artistic style, perhaps with a brush-stroke effect.`;
        case 'distressed_vintage': return `${basePrompt}\n${textStylingPrompt}\n- The entire design (logo and text) must have a heavy, realistic distressed and cracked ink effect.\n- The graphic should look like a well-worn, faded print from a vintage hoodie from the 1980s.\n- Slightly desaturate the colors to enhance the vintage feel.`;
        case 'typography_focus': return `${basePrompt}\n${textStylingPrompt}\n- The design's primary focus must be the text. Make it large, bold, and the center of attention.\n- The logo should be used as a smaller, secondary element, integrated subtly above or below the main text.`;
        case 'abstract_geometric': return `${basePrompt}\n${textStylingPrompt}\n- Frame the logo and text with a dynamic and artistic composition of abstract geometric shapes (lines, triangles, circles).\n- The overall aesthetic should be modern, clean, and visually striking.`;
        case 'vintage_poster': return `${basePrompt}\n${textStylingPrompt}\n- Combine the logo and text into a design reminiscent of a 1950s or 1960s vintage travel poster.\n- Use a limited, muted color palette, bold and stylized typography, and add a subtle paper texture overlay to the entire design for an authentic retro feel.`;
        case 'geometric_pattern': return `${basePrompt}\n${textStylingPrompt}\n- Create a modern, abstract design by integrating the logo within a repeating pattern of clean geometric shapes like triangles, hexagons, or circles.\n- The text should be placed cleanly within the pattern.\n- The overall effect should be contemporary and artistic.`;
        case 'hand_drawn_sketch': return `${basePrompt}\n${textStylingPrompt}\n- Transform the logo and text into a delicate, hand-drawn pencil or ink sketch.\n- The lines should be fine and slightly imperfect, giving it an authentic, artistic, and organic feel.\n- The text should also appear hand-lettered.`;
        case 'classic': default: return `${basePrompt}\n${textStylingPrompt}\n- Typeset the text in a semi-circular arc below the logo.`;
    }
};

const getBagEditPrompt = (options: DesignOptions): string => {
    const { bagMaterial, text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = textProvided ? `- The text "${text}" must be added to the bag.\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a photorealistic mockup artist, add a design to the bag in the provided image.
- The design consists of the provided logo image ${textProvided ? `and text.` : ''}
- Combine the elements into a cohesive composition on the front of the bag.
${criticalRealismInstructions}
- Do not change the bag, the hand holding it, or the background.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getWalletEditPrompt = (options: DesignOptions): string => {
    const { text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = textProvided ? `- The text "${text}" must be added to the wallet.\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a product mockup artist, add a design to the plain leather wallet in the provided image.
- The design consists of the provided logo image ${textProvided ? `and text.` : ''}
- Combine the elements into a cohesive, centered composition on the front of the wallet.
- The design must look like a high-quality, photorealistic print or embossing on the leather.
${criticalRealismInstructions}
- Do not change the wallet, its surroundings, or the background.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getCapEditPrompt = (options: DesignOptions): string => {
    const { text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = textProvided ? `- The text "${text}" must be added to the cap.\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a product mockup artist, add a design to the plain cap in the provided image.
- The design consists of the provided logo image ${textProvided ? `and text.` : ''}
- Combine the elements into a cohesive, centered composition on the front panel of the cap.
- The design must look like a high-quality, photorealistic embroidery or print.
${criticalRealismInstructions}
- Do not change the cap, its surroundings, or the background.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getPillowEditPrompt = (options: DesignOptions): string => {
    const { text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = textProvided ? `- The text "${text}" must be added to the pillow.\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a product mockup artist, add a design to the plain pillow in the provided image.
- The design consists of the provided logo image ${textProvided ? `and text.` : ''}
- Combine the elements into a cohesive, centered composition on the front of the pillow.
${criticalRealismInstructions}
- Do not change the pillow, its surroundings, or the background.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getFrameEditPrompt = (): string => {
    return `As a professional photo editor, place artwork inside the empty frame in the provided image.
- Inside the empty wooden frame, place the provided artwork image.
- **CRITICAL:** The artwork must look like a high-quality, textured painting or print.
- Ensure the lighting, shadows, and reflections on the artwork's surface match the scene perfectly for a photorealistic composite. The artwork should appear to be behind the frame's glass or have a matte finish, matching the scene.
- Do not change the frame, the person holding it, or the background.
- Output ONLY the final image.`;
};

const getMugEditPrompt = (): string => {
     return `As a product mockup artist, add a design to the plain mug in the provided image.
- On the plain mug, add the provided logo image.
- The logo must look like a high-quality, permanent print that wraps naturally around the curve of the mug.
- Ensure lighting, shadows, and reflections on the logo match the mug's surface and the scene.
- Do not change the mug, the person holding it, or the background.
- Output ONLY the final image.`;
};

const getSipperGlassEditPrompt = (): string => {
     return `As a product mockup artist, add a design to the plain sipper glass in the provided image.
- On the plain glass, add the provided artwork image.
- The artwork must look like a high-quality, permanent print that wraps naturally around the curve of the glass.
- Ensure lighting, shadows, and reflections on the artwork match the glass's surface and the scene.
- Do not change the glass, the person holding it, or the background.
- Output ONLY the final image.`;
};

const getTumblerWrapEditPrompt = (): string => {
     return `As a product mockup artist, add a design to the plain tumbler in the provided image.
- On the plain tumbler, add the provided artwork image as a full wrap.
- The artwork must look like a high-quality, permanent print that wraps seamlessly and naturally around the curve of the tumbler.
- Ensure lighting, shadows, and reflections on the artwork match the tumbler's surface and the scene.
- Do not change the tumbler, the person holding it, or the background.
- Output ONLY the final image.`;
};

const getHalloweenTumblerEditPrompt = (): string => {
    return `As a product mockup artist, add a design to the plain tumbler in the provided image.
- On the plain tumbler, add the provided artwork image as a full wrap.
- The artwork must look like a high-quality, permanent print that wraps seamlessly and naturally around the curve of the tumbler.
- Ensure lighting, shadows, and reflections on the artwork match the tumbler's surface and the scene.
- Do not change the tumbler itself or the background setting.
- Output ONLY the final image.`;
};

const getTumblerTrioEditPrompt = (): string => {
    return `As an expert product mockup artist, your task is to add a seamless panoramic design to the three tumblers in the provided image.
- You are provided with a single artwork image. This artwork must be applied as a full, continuous wrap across all three tumblers.
- The three tumblers represent a single, unwrapped design. The leftmost tumbler should show the left part of the artwork, the middle tumbler should show the center, and the rightmost tumbler should show the right part.
- The artwork must look like a high-quality, permanent print that wraps seamlessly and naturally around each tumbler's curve.
- Ensure the lighting, shadows, and reflections on the artwork match the tumblers' surfaces and the scene for maximum realism.
- **CRITICAL:** Do not change the tumblers themselves, their positions, or the background setting. Only add the artwork.
- Output ONLY the final image.`;
};

const getPhoneCaseEditPrompt = (options: DesignOptions): string => {
    const { text, font, textStyle, textColor, productColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const contrastColor = getContrastColor(productColor);
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, contrastColor, gradientStartColor, gradientEndColor);
    const textStylingPrompt = textProvided ? `- The text "${text}" must be added on top of the design.\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a product mockup artist, add a design to the plain phone case in the provided image.
- The provided logo image must be applied as a full-wrap design, covering the entire back of the phone case.
- The design must look like a high-quality, permanent print that follows the contours of the case and wraps around the camera cutout realistically.
${criticalRealismInstructions}
- Do not change the phone case, its surroundings, or the background.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getStickerEditPrompt = (options: DesignOptions): string => {
    const { text, font, textStyle, textColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, 'black', gradientStartColor, gradientEndColor); // Sticker is white, so contrast is black
    const textStylingPrompt = textProvided ? `- The design should incorporate the text "${text}".\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a sticker designer, your task is to apply a design to the blank sticker in the image.
- The design is composed of the provided logo image ${textProvided ? 'and text.' : '.'}
- Combine these elements into a single, cohesive sticker design.
- The plain white sticker in the image must be completely replaced by this new design.
- The final design must conform to the sticker's shape and material properties (e.g., glossy, holographic).
- **CRITICAL:** Do not change the setting, the surface the sticker is on, or the background. Only replace the blank sticker with the design.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getPosterEditPrompt = (options: DesignOptions): string => {
    const { text, font, textStyle, textColor, gradientStartColor, gradientEndColor } = options;
    const textProvided = text.trim().length > 0;
    const fontName = font.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const colorName = getColorName(textColor);
    const textStyleDescription = getTextStyleDescription(textStyle, 'black', gradientStartColor, gradientEndColor); // Poster is white, so contrast is black
    const textStylingPrompt = textProvided ? `- The design should incorporate the text "${text}".\n- Render it in the "${fontName}" font with color "${colorName}".\n- ${textStyleDescription}` : '';
    return `As a professional graphic designer, place a complete design onto the blank poster in the provided image.
- The design consists of the provided artwork image ${textProvided ? 'and text.' : '.'}
- Combine these elements into a single, compelling, and well-composed poster design.
- Apply this final design to the blank poster area.
- Ensure the lighting, shadows, and perspective of the design match the scene perfectly for a photorealistic composite.
- Do not change the poster's surroundings (frame, wall, hands, etc.) or the background.
${textStylingPrompt}
- Output ONLY the final image.`;
};

const getPuzzleEditPrompt = (): string => {
    return `As a product mockup artist, add a design to the blank jigsaw puzzle in the provided image.
- The provided artwork image must be applied as the main design, covering the entire surface of the puzzle.
- The design must look like a high-quality, permanent print.
- **CRITICAL:** Subtly overlay the puzzle piece cut lines on top of the artwork. The lines should be visible but not distracting, giving a realistic puzzle texture.
- Ensure lighting, shadows, and reflections on the design match the puzzle's surface and the scene.
- Do not change the puzzle's shape, its surroundings, or the background.
- Output ONLY the final image.`;
};


/**
 * Generates a T-shirt mockup using a two-step process to avoid safety issues.
 * @param logoFile The logo file to be placed on the T-shirt.
 * @param options The design options for the mockup.
 * @returns A promise that resolves with the base64 string of the generated image.
 */
export const generateMockup = async (
  logoFile: File,
  options: DesignOptions,
): Promise<string> => {
  try {
    // Step 1: Generate the base image of the model and product
    const baseImageB64 = await generateBaseImage(options);

    const { productType } = options;

    // Step 2: Prepare parts for the editing model
    const baseImagePart: Part = { inlineData: { data: baseImageB64, mimeType: 'image/png' } };
    const logoPart = await fileToGenerativePart(logoFile);
    
    // Step 3: Get the correct *editing* prompt
    let editPrompt;
    switch (productType) {
        case 'tshirt': editPrompt = getTshirtEditPrompt(options); break;
        case 'sweatshirt': editPrompt = getSweatshirtEditPrompt(options); break;
        case 'hoodie': editPrompt = getHoodieEditPrompt(options); break;
        case 'bag': editPrompt = getBagEditPrompt(options); break;
        case 'wallet': editPrompt = getWalletEditPrompt(options); break;
        case 'cap': editPrompt = getCapEditPrompt(options); break;
        case 'pillow': editPrompt = getPillowEditPrompt(options); break;
        case 'flat_lay': editPrompt = getFlatLayEditPrompt(options); break;
        case 'wooden_frame': editPrompt = getFrameEditPrompt(); break;
        case 'tea_mug': editPrompt = getMugEditPrompt(); break;
        case 'sipper_glass': editPrompt = getSipperGlassEditPrompt(); break;
        case 'tumbler_wrap': editPrompt = getTumblerWrapEditPrompt(); break;
        case 'halloween_tumbler': editPrompt = getHalloweenTumblerEditPrompt(); break;
        case 'tumbler_trio': editPrompt = getTumblerTrioEditPrompt(); break;
        case 'phone_case': editPrompt = getPhoneCaseEditPrompt(options); break;
        case 'sticker': editPrompt = getStickerEditPrompt(options); break;
        case 'poster': editPrompt = getPosterEditPrompt(options); break;
        case 'jigsaw_puzzle': editPrompt = getPuzzleEditPrompt(); break;
        default: throw new Error(`Invalid product type: ${productType}`);
    }

    // Step 4: Call the editing model with the base image, logo, and prompt
    // FIX: The 'safetySettings' property must be passed within the 'config' object, not at the top level of the request.
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [baseImagePart, logoPart, { text: editPrompt }] },
      config: {
        safetySettings: safetySettings,
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    }));

    const candidates = response?.candidates;

    if (!candidates || candidates.length === 0 || !candidates[0].content || !candidates[0].content.parts) {
      let errorMessage = 'API response was empty or malformed. This may be due to safety filters.';
      if (candidates && candidates[0] && candidates[0].finishReason === 'PROHIBITED_CONTENT') {
          errorMessage = 'The generated image was blocked for safety reasons. Please adjust your text or logo and try again.';
      }
      console.error('Invalid response structure or blocked content:', JSON.stringify(response, null, 2));
      throw new Error(errorMessage);
    }
    
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('API did not return an image.');
  } catch (error) {
    console.error('Error generating mockup:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while generating the mockup.');
  }
};
