import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import ControlsPanel from './components/ControlsPanel';
import PreviewDisplay from './components/PreviewDisplay';
import { WandIcon } from './components/icons';
import type { DesignOptions, ImageMode, Preset } from './types';
import { generateMockup as generateMockupFromApi } from './services/geminiService';
import { generateDesignPng, generateEngravingSvg, generateTextOnlySvg, generateTextOnlyPng } from './services/svgService';
import { LanguageContext, useTranslation, Language } from './hooks/useTranslation';
import { en } from './i18n/en';
// FIX: Statically import the 'ar' translations to resolve the "Cannot find name 'require'" error, which is not available in a browser environment.
import { ar } from './i18n/ar';

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: keyof typeof en) => {
    if (language === 'ar') {
      return ar[key] || key;
    }
    return en[key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);
  
  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();

  const [design, setDesign] = useState<DesignOptions>({
    productType: 'tshirt',
    logo: null,
    text: 'YOUR TEXT HERE',
    productColor: '#FFFFFF',
    textColor: '#FFFFFF',
    style: 'classic',
    pose: 'standing',
    audience: 'woman_30s_casual',
    font: 'impact',
    textStyle: 'outline',
    gradientStartColor: '#2563EB',
    gradientEndColor: '#B91C1C',
    aspectRatio: '1:1',
    bagMaterial: 'canvas',
    frameStyle: 'classic_ornate',
    frameModel: 'elegant_woman_street',
    mugStyle: 'classic_ceramic',
    mugModel: 'woman_cafe',
    sipperGlassStyle: 'classic_can_shape',
    sipperGlassModel: 'woman_cafe_elegant',
    tumblerStyle: 'stainless_steel',
    tumblerModel: 'person_gym',
    halloweenTumblerStyle: 'glossy_black',
    halloweenTumblerSetting: 'spooky_table',
    tumblerTrioStyle: 'glossy_white',
    tumblerTrioSetting: 'marble_countertop',
    engravingMaterial: 'wood_plaque',
    phoneCaseStyle: 'glossy',
    phoneCaseModel: 'person_holding',
    stickerStyle: 'die_cut_glossy',
    stickerSetting: 'on_laptop',
    posterStyle: 'glossy_finish',
    posterSetting: 'framed_on_wall',
    walletStyle: 'bifold',
    walletModel: 'person_holding',
    capStyle: 'structured_baseball',
    capModel: 'person_forwards',
    pillowStyle: 'square_cotton',
    pillowSetting: 'on_sofa',
    flatLayStyle: 'minimalist_neutral',
    puzzleStyle: 'rectangle_cardboard',
    puzzleSetting: 'on_wooden_table',
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>('fit_blur');
  const [presets, setPresets] = useState<Preset[]>([]);

  const logoFileRef = useRef<File | null>(null);

  // Load presets from localStorage on initial render
  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('mockupGeneratorPresets');
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }
    } catch (e) {
      console.error("Failed to load presets from localStorage", e);
    }
  }, []);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('mockupGeneratorPresets', JSON.stringify(presets));
    } catch (e) {
      console.error("Failed to save presets to localStorage", e);
    }
  }, [presets]);


  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const input = e.target;

    setError(null);

    if (!file) {
      setDesign(d => ({ ...d, logo: null }));
      logoFileRef.current = null;
      return;
    }

    const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('errorUnsupportedFileType'));
      setDesign(d => ({ ...d, logo: null }));
      logoFileRef.current = null;
      if (input) input.value = '';
      return;
    }

    const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; 
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(t('errorFileSizeExceeds'));
      setDesign(d => ({ ...d, logo: null }));
      logoFileRef.current = null;
      if (input) input.value = '';
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      logoFileRef.current = file;
      setDesign(d => ({ ...d, logo: event.target?.result as string }));
    };
    
    reader.onerror = () => {
      setError(t('errorCouldNotReadFile'));
      setDesign(d => ({ ...d, logo: null }));
      logoFileRef.current = null;
      if (input) input.value = '';
    };
    
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!logoFileRef.current) {
      setError(t('errorNoLogo'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    if (design.productType === 'laser_engraving') {
      try {
        const pngDataUrl = await generateDesignPng(design);
        const base64Image = pngDataUrl.split(',')[1];
        setGeneratedImage(base64Image);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred while generating the preview.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const result = await generateMockupFromApi(
        logoFileRef.current, 
        design
        );
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadLogoPng = () => {
    if (!design.logo) {
      setError(t('errorNoLogoToDownload'));
      return;
    }
    try {
      setError(null);
      const a = document.createElement('a');
      a.href = design.logo;
      a.download = logoFileRef.current?.name ?? 'logo.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error downloading logo:', err);
      setError(err.message || 'Failed to download logo.');
    }
  };

  const handleDownloadTextSvg = async () => {
    if (!design.logo) {
      setError(t('errorNoLogoForLayout'));
      return;
    }
    if (!design.text.trim()) {
      setError(t('errorNoTextForSvg'));
      return;
    }
    try {
      setError(null);
      const svgString = await generateTextOnlySvg(design);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'design_text.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error generating text SVG:', err);
      setError(err.message || 'Failed to generate text SVG file.');
    }
  };
  
  const handleDownloadTextPng = async () => {
    if (!design.logo) {
      setError(t('errorNoLogoForLayout'));
      return;
    }
    if (!design.text.trim()) {
      setError(t('errorNoTextForSvg'));
      return;
    }
    try {
      setError(null);
      const pngDataUrl = await generateTextOnlyPng(design);
      
      const a = document.createElement('a');
      a.href = pngDataUrl;
      a.download = 'design_text.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error generating text PNG:', err);
      setError(err.message || 'Failed to generate text PNG file.');
    }
  };

  const handleDownloadEngravingSvg = async () => {
    if (!design.logo) {
      setError(t('errorNoLogoForLayout'));
      return;
    }
    try {
      setError(null);
      const svgString = await generateEngravingSvg(design);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      // FIX: The anchor element 'a' was used without being declared. This has been corrected.
      const a = document.createElement('a');
      a.href = url;
      a.download = 'engraving_design.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error generating engraving SVG:', err);
      setError(err.message || 'Failed to generate engraving SVG file.');
    }
  };

  const handleDownloadMockup = () => {
    if (!generatedImage) {
      setError(t('errorNoMockupToDownload'));
      return;
    }
    try {
      setError(null);
      const a = document.createElement('a');
      a.href = `data:image/png;base64,${generatedImage}`;
      a.download = `mockup_${design.productType}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error downloading mockup:', err);
      setError(err.message || 'Failed to download mockup image.');
    }
  };

  const handleSavePreset = (name: string) => {
    if (!name.trim()) {
      setError(t('errorPresetNameRequired'));
      return;
    }
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      options: design,
    };
    setPresets(prevPresets => [...prevPresets, newPreset]);
    setError(null);
  };

  const b64toFile = (b64Data: string, filename = 'logo.png'): File => {
    const arr = b64Data.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleLoadPreset = (id: string) => {
    const presetToLoad = presets.find(p => p.id === id);
    if (presetToLoad) {
      setDesign(presetToLoad.options);
      if (presetToLoad.options.logo) {
        try {
          logoFileRef.current = b64toFile(presetToLoad.options.logo);
        } catch(e) {
            console.error("Failed to reconstruct file from base64 string", e);
            setError("Could not load the logo from the preset.");
            logoFileRef.current = null;
        }
      } else {
        logoFileRef.current = null;
      }
      setGeneratedImage(null);
      setError(null);
    }
  };

  const handleDeletePreset = (id: string) => {
    if (window.confirm(t('confirmDeletePreset'))) {
        setPresets(prevPresets => prevPresets.filter(p => p.id !== id));
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <button 
            onClick={toggleLanguage}
            className="absolute top-0 right-0 rtl:right-auto rtl:left-0 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            aria-label="Toggle language"
          >
            {t('languageToggleButton')}
          </button>
          <div className="inline-flex items-center gap-3">
            <WandIcon className="w-10 h-10 text-indigo-400" />
            <h1 className="text-4xl font-extrabold tracking-tight">{t('headerTitle')}</h1>
          </div>
          <p className="mt-2 text-lg text-gray-400">
            {t('headerSubtitle')}
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <ControlsPanel 
            design={design} 
            setDesign={setDesign}
            onGenerate={handleGenerate} 
            isLoading={isLoading}
            handleLogoChange={handleLogoChange}
            imageMode={imageMode}
            setImageMode={setImageMode}
            presets={presets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
          <PreviewDisplay 
            generatedImage={generatedImage} 
            isLoading={isLoading}
            error={error}
            productType={design.productType}
            onDownloadLogoPng={handleDownloadLogoPng}
            onDownloadTextSvg={handleDownloadTextSvg}
            onDownloadTextPng={handleDownloadTextPng}
            onDownloadEngravingSvg={handleDownloadEngravingSvg}
            onDownloadMockup={handleDownloadMockup}
            imageMode={imageMode}
          />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;