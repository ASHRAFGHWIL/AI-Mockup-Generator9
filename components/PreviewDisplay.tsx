import React from 'react';
import { WandIcon, DownloadIcon, ShareIcon } from './icons';
import type { ProductType, ImageMode } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface PreviewDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  productType: ProductType;
  onDownloadLogoPng: () => void;
  onDownloadTextSvg: () => void;
  onDownloadTextPng: () => void;
  onDownloadEngravingSvg: () => void;
  onDownloadMockup: () => void;
  onShare: () => void;
  copyStatusMessage: string;
  imageMode: ImageMode;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = ({ generatedImage, isLoading, error, productType, onDownloadLogoPng, onDownloadTextSvg, onDownloadTextPng, onDownloadEngravingSvg, onDownloadMockup, onShare, copyStatusMessage, imageMode }) => {
    const { t } = useTranslation();
    
    const loadingMessages = React.useMemo(() => [
        t('loadingMsg1'),
        t('loadingMsg2'),
        t('loadingMsg3'),
        t('loadingMsg4'),
        t('loadingMsg5'),
        t('loadingMsg6'),
    ], [t]);

    const [loadingMessage, setLoadingMessage] = React.useState(loadingMessages[0]);
    
    const textBasedProducts: ProductType[] = ['tshirt', 'sweatshirt', 'hoodie', 'bag', 'phone_case', 'sticker', 'poster', 'wallet', 'cap', 'pillow', 'flat_lay'];
    const imageUrl = generatedImage ? `data:image/png;base64,${generatedImage}` : '';

    React.useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isLoading, loadingMessages]);

    const getImageClasses = () => {
      const base = 'transition-all duration-500 ease-in-out relative';
      const sizing = (['fit', 'fit_blur', 'fit_transparent', 'floating', 'framed'].includes(imageMode))
          ? 'max-w-full max-h-full object-contain'
          : imageMode === 'crop'
          ? 'w-full h-full object-cover'
          : 'w-full h-full object-fill';
      
      switch (imageMode) {
          case 'floating':
              return `${base} ${sizing} rounded-lg transform hover:-translate-y-2 shadow-[0_35px_60px_-15px_rgba(99,102,241,0.4)]`;
          case 'framed':
              return `${base} ${sizing} rounded-sm border-2 border-white/50`;
          case 'fit_transparent':
              return `${base} ${sizing} rounded-lg`;
          default:
              return `${base} ${sizing} rounded-lg shadow-2xl`;
      }
    };

  return (
    <div className="w-full lg:w-2/3 xl:w-3/4 flex-grow flex flex-col items-center justify-center gap-6">
      <div className={`w-full bg-gray-900/50 rounded-lg p-4 lg:p-8 relative flex items-center justify-center transition-colors ${imageMode === 'fit_transparent' ? '!bg-transparent' : ''}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white transition-opacity">
            <svg className="animate-spin h-12 w-12 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold">{loadingMessage}</p>
            <p className="text-sm text-gray-400 mt-1">{t('loadingMoment')}</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center text-red-400">
              <h3 className="text-xl font-semibold">{t('generationFailedTitle')}</h3>
              <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {!generatedImage && !isLoading && !error && (
           <div className="text-center text-gray-500">
            <WandIcon className="w-24 h-24 mx-auto text-gray-700" />
            <h3 className="mt-4 text-xl font-semibold text-gray-400">{t('previewPlaceholderTitle')}</h3>
            <p className="mt-1 text-sm">{t('previewPlaceholderSubtitle')}</p>
          </div>
        )}

        {generatedImage && !isLoading && !error && (
            imageMode === 'framed' ? (
                <div className="p-3 lg:p-4 bg-gradient-to-br from-[#6b4f3a] to-[#a0846c] rounded-lg shadow-2xl">
                    <div className="bg-gray-200 p-1 shadow-inner rounded-sm">
                        <img src={imageUrl} alt="Generated mockup" className={getImageClasses()} />
                    </div>
                </div>
            ) : (
                <>
                    {imageMode === 'fit_blur' && (
                        <img 
                            src={imageUrl} 
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110"
                        />
                    )}
                    <img 
                        src={imageUrl}
                        alt="Generated mockup" 
                        className={getImageClasses()}
                    />
                </>
            )
        )}
      </div>

      {generatedImage && !isLoading && (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Primary Action Buttons */}
              {productType !== 'laser_engraving' ? (
                  <>
                      <button
                          onClick={onDownloadMockup}
                          title="Download Mockup Image (PNG)"
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
                      >
                          <DownloadIcon className="w-6 h-6" />
                          <span className="text-lg">{t('downloadMockupButton')}</span>
                      </button>
                      <button
                          onClick={onShare}
                          title="Share Mockup"
                          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
                      >
                          <ShareIcon className="w-6 h-6" />
                          <span className="text-lg">{t('shareMockupButton')}</span>
                      </button>
                  </>
              ) : (
                   <button
                      onClick={onDownloadEngravingSvg}
                      title="Download Laser Engraving SVG File"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                      <DownloadIcon className="w-6 h-6" />
                      <span className="text-lg">{t('downloadEngravingButton')}</span>
                  </button>
              )}
            </div>
            
            {copyStatusMessage && (
                <p className="text-sm text-green-400 transition-opacity duration-300">{copyStatusMessage}</p>
            )}

            {/* Asset downloads */}
            {textBasedProducts.includes(productType) && productType !== 'laser_engraving' && (
                <div className="p-2 rounded-lg bg-black/30">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400 ms-2 me-2 shrink-0">{t('assetsLabel')}</span>
                        <button onClick={onDownloadLogoPng} title="Download logo as PNG" className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md shadow-lg transition-all text-xs">{t('logoPngButton')}</button>
                        <button onClick={onDownloadTextSvg} title="Download text as SVG" className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md shadow-lg transition-all text-xs">{t('textSvgButton')}</button>
                        <button onClick={onDownloadTextPng} title="Download text as PNG" className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md shadow-lg transition-all text-xs">{t('textPngButton')}</button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default PreviewDisplay;