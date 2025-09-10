import React, { useState, useCallback } from 'react';
import ControlsPanel from './components/ControlsPanel';
import PreviewDisplay from './components/PreviewDisplay';
import { generateMockup } from './services/geminiService';
import { generateTextSvg, generateEngravingSvg } from './services/svgService';
import type {
  ProductType,
  DesignStyle,
  BackgroundStyle,
  ModelAudience,
  TshirtFont,
  TextStyle,
  AspectRatio,
  ImageMode,
} from './types';
import { LanguageContext, Language } from './hooks/useTranslation';
import { en } from './i18n/en';
import { ar } from './i18n/ar';

const translations = { en, ar };

function App() {
  // Language state
  const [language, setLanguage] = useState<Language>('en');
  const t = useCallback((key: keyof typeof en) => translations[language][key] || key, [language]);
  const languageContextValue = { language, setLanguage, t };
  
  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copyStatusMessage, setCopyStatusMessage] = useState('');

  // Form State
  const [productType, setProductType] = useState<ProductType>('tshirt');
  const [designSubject, setDesignSubject] = useState('a majestic wolf howling at the moon');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoBrightness, setLogoBrightness] = useState(100);
  const [logoContrast, setLogoContrast] = useState(100);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [text, setText] = useState('WILD SOUL');
  const [tshirtColor, setTshirtColor] = useState('#272727'); // Black
  const [textColor, setTextColor] = useState('#FFFFFF'); // White
  const [font, setFont] = useState<TshirtFont>('anton');
  const [textStyle, setTextStyle] = useState<TextStyle>('none');
  const [designStyle, setDesignStyle] = useState<DesignStyle>('classic');
  const [modelAudience, setModelAudience] = useState<ModelAudience>('woman_30s_plus_size_confident');
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('studio_plain');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageMode, setImageMode] = useState<ImageMode>('fit_blur');

  // Helper function to apply brightness/contrast filters to an image data URL
  const applyImageFilters = (dataUrl: string, brightness: number, contrast: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (err) => {
        reject(new Error('Failed to load image for filtering.'));
      };
      img.src = dataUrl;
    });
  };


  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);
    
    let processedLogoImage = logoImage;
    const needsFiltering = logoImage && (logoBrightness !== 100 || logoContrast !== 100);

    if (needsFiltering) {
      try {
        processedLogoImage = await applyImageFilters(logoImage, logoBrightness, logoContrast);
      } catch (e: any) {
        console.error("Failed to apply image filters:", e);
        setError(e.message || "Could not apply filters to the logo image.");
        setIsLoading(false);
        return;
      }
    }

    // This object would expand to include state for all product types
    const params = {
      productType,
      designSubject,
      logoImage: processedLogoImage, // Use the potentially filtered image
      backgroundImage,
      text,
      tshirtColor,
      textColor,
      font,
      textStyle,
      designStyle,
      modelAudience,
      backgroundStyle,
      aspectRatio,
    };

    try {
      const imageB64 = await generateMockup(params);
      setGeneratedImage(imageB64);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDownloadMockup = () => {
      if (generatedImage) {
          downloadDataUrl(`data:image/png;base64,${generatedImage}`, 'mockup.png');
      }
  };
  
  const downloadSvg = (svgString: string, filename: string) => {
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-s' });
    const url = URL.createObjectURL(svgBlob);
    downloadDataUrl(url, filename);
    URL.revokeObjectURL(url);
  };

  const onDownloadTextSvg = () => {
    downloadSvg(generateTextSvg(text, font, textColor, textStyle), 'text.svg');
  };

  const onDownloadEngravingSvg = () => {
    downloadSvg(generateEngravingSvg(designSubject, text, font, designStyle), 'engraving.svg');
  };
  
  const onShare = async () => {
    if (!generatedImage) return;
    const blob = await (await fetch(`data:image/png;base64,${generatedImage}`)).blob();
    const file = new File([blob], "mockup.png", { type: "image/png" });
    
    try {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
             await navigator.share({
                title: 'AI Mockup',
                text: 'Check out this mockup I generated!',
                files: [file],
            });
        } else {
            // Fallback: Copy the image to the clipboard
            // @ts-ignore
            await navigator.clipboard.write([
              // @ts-ignore
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopyStatusMessage(t('shareSuccess'));
            setTimeout(() => setCopyStatusMessage(''), 3000);
        }
    } catch (err) {
        console.error('Share/Copy failed:', err);
        setCopyStatusMessage(t('shareError'));
        setTimeout(() => setCopyStatusMessage(''), 3000);
    }
  };


  return (
    <LanguageContext.Provider value={languageContextValue}>
      <main className="flex h-screen bg-gray-800 font-sans">
        <ControlsPanel
          productType={productType} setProductType={setProductType}
          designSubject={designSubject} setDesignSubject={setDesignSubject}
          logoImage={logoImage} setLogoImage={setLogoImage}
          logoBrightness={logoBrightness} setLogoBrightness={setLogoBrightness}
          logoContrast={logoContrast} setLogoContrast={setLogoContrast}
          backgroundImage={backgroundImage} setBackgroundImage={setBackgroundImage}
          text={text} setText={setText}
          tshirtColor={tshirtColor} setTshirtColor={setTshirtColor}
          textColor={textColor} setTextColor={setTextColor}
          font={font} setFont={setFont}
          textStyle={textStyle} setTextStyle={setTextStyle}
          designStyle={designStyle} setDesignStyle={setDesignStyle}
          modelAudience={modelAudience} setModelAudience={setModelAudience}
          backgroundStyle={backgroundStyle} setBackgroundStyle={setBackgroundStyle}
          aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
          imageMode={imageMode} setImageMode={setImageMode}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <PreviewDisplay
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
          productType={productType}
          onDownloadMockup={onDownloadMockup}
          onDownloadTextSvg={onDownloadTextSvg}
          onDownloadTextPng={() => {}} // Placeholder
          onDownloadLogoPng={() => {}} // Placeholder
          onDownloadEngravingSvg={onDownloadEngravingSvg}
          onShare={onShare}
          copyStatusMessage={copyStatusMessage}
          imageMode={imageMode}
        />
      </main>
    </LanguageContext.Provider>
  );
}

export default App;