import type { TshirtFont, TextStyle, DesignStyle } from '../types';

// Helper to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper to estimate text width. This is a very rough approximation.
const estimateTextWidth = (text: string, fontSize: number, fontWeight: string | number) => {
    const avgCharWidth = fontSize * (fontWeight === 'bold' ? 0.6 : 0.5);
    return text.length * avgCharWidth;
}

export const generateTextSvg = (
  text: string,
  fontFamily: TshirtFont,
  color: string,
  textStyle: TextStyle
): string => {
  if (!text) return '';

  const fontSize = 100; // Base font size
  const strokeWidth = 8;
  const fontWeight = 'bold';

  // Estimate width for viewBox
  const estimatedWidth = Math.max(200, estimateTextWidth(text, fontSize, fontWeight) + strokeWidth * 4);
  const estimatedHeight = fontSize * 1.5;

  let textElement = '';
  let filterElement = '';

  const commonProps = `x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${fontSize}" font-family="${fontFamily}, sans-serif" font-weight="${fontWeight}"`;
  
  const rgb = hexToRgb(color);
  const shadowColor = rgb ? `rgba(${rgb.r * 0.2}, ${rgb.g * 0.2}, ${rgb.b * 0.2}, 0.5)` : 'rgba(0,0,0,0.5)';

  switch (textStyle) {
    case 'outline':
      textElement = `<text ${commonProps} fill="none" stroke="${color}" stroke-width="${strokeWidth}">${text}</text>`;
      break;
    case 'shadow':
      filterElement = `
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="5" dy="5" stdDeviation="3" flood-color="${shadowColor}" />
        </filter>
      `;
      textElement = `<text ${commonProps} fill="${color}" filter="url(#shadow)">${text}</text>`;
      break;
    case 'glow':
        filterElement = `
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${color}" />
        </filter>
      `;
      textElement = `<text ${commonProps} fill="${color}" filter="url(#glow)">${text}</text>`;
      break;
    default:
      textElement = `<text ${commonProps} fill="${color}">${text}</text>`;
      break;
  }

  const svg = `
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 ${estimatedWidth} ${estimatedHeight}"
        width="${estimatedWidth}"
        height="${estimatedHeight}"
    >
      <defs>
        ${filterElement}
      </defs>
      ${textElement}
    </svg>
  `;

  return svg.replace(/\s+/g, ' ').trim();
};


export const generateEngravingSvg = (
    subject: string,
    text: string,
    fontFamily: TshirtFont,
    designStyle: DesignStyle
): string => {
    const width = 500;
    const height = 500;
    const textColor = "#FFFFFF"; // For engraving, we often just need the shape.

    let content = `<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="60" font-family="${fontFamily}, sans-serif" fill="${textColor}">${text}</text>`;

    if (subject) {
        content = `
            <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="${textColor}">
                (Vector for: ${subject})
            </text>
            ${content}
        `;
    }

    const svg = `
      <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 ${width} ${height}"
          width="${width}px"
          height="${height}px"
      >
        <rect width="100%" height="100%" fill="#000000" />
        ${content}
      </svg>
    `;
    
    return svg.replace(/\s+/g, ' ').trim();
};
