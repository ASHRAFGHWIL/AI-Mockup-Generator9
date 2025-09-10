import React from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import {
  PRODUCT_TYPES, PRODUCT_COLORS, DESIGN_STYLES, TEXT_STYLES, BACKGROUND_STYLES, MODEL_AUDIENCES, TSHIRT_FONTS,
} from '../constants';
import type {
  ProductType, DesignStyle, ModelAudience, TshirtFont, TextStyle, AspectRatio, ImageMode, BackgroundStyle
} from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ColorPicker from './ColorPicker';
import { WandIcon, UploadIcon, TrashIcon, FitIcon, FitBlurIcon, FitTransparentIcon, CropIcon, StretchIcon, AspectRatioSquareIcon, AspectRatioHorizontalIcon, AspectRatioVerticalIcon } from './icons';

interface ControlsPanelProps {
  productType: ProductType;
  setProductType: (value: ProductType) => void;
  designSubject: string;
  setDesignSubject: (value: string) => void;
  logoImage: string | null;
  setLogoImage: (value: string | null) => void;
  logoBrightness: number;
  setLogoBrightness: (value: number) => void;
  logoContrast: number;
  setLogoContrast: (value: number) => void;
  backgroundImage: string | null;
  setBackgroundImage: (value: string | null) => void;
  text: string;
  setText: (value: string) => void;
  tshirtColor: string;
  setTshirtColor: (value: string) => void;
  textColor: string;
  setTextColor: (value: string) => void;
  font: TshirtFont;
  setFont: (value: TshirtFont) => void;
  textStyle: TextStyle;
  setTextStyle: (value: TextStyle) => void;
  designStyle: DesignStyle;
  setDesignStyle: (value: DesignStyle) => void;
  modelAudience: ModelAudience;
  setModelAudience: (value: ModelAudience) => void;
  backgroundStyle: BackgroundStyle;
  setBackgroundStyle: (value: BackgroundStyle) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  imageMode: ImageMode;
  setImageMode: (value: ImageMode) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ControlsPanel: React.FC<ControlsPanelProps> = (props) => {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // FIX: Corrected check for flat lay styles. The previous check `props.backgroundStyle === 'flat_lay'` caused a type error.
  const isFlatLay = props.backgroundStyle.startsWith('flat_lay');
  
  const isGenerateDisabled = props.productType === 'logo_mockup' 
      ? !props.logoImage 
      : (!props.designSubject && !props.logoImage);

  const renderApparelControls = () => (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">{t('modelLabel')} & {t('backgroundStyleLabel')}</h3>
        <SelectControl label={t('modelLabel')} value={props.modelAudience} onChange={e => props.setModelAudience(e.target.value as ModelAudience)} options={MODEL_AUDIENCES} disabled={isFlatLay} />
        <SelectControl label={t('backgroundStyleLabel')} value={props.backgroundStyle} onChange={e => props.setBackgroundStyle(e.target.value as BackgroundStyle)} options={BACKGROUND_STYLES} disabled={!!props.backgroundImage} />
        <ImageUploadControl label={t('backgroundImageLabel')} image={props.backgroundImage} setImage={props.setBackgroundImage} aspect={16/9} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">{t('designStyleLabel')}</h3>
        <ImageUploadControl 
            label={t('logoImageLabel')} 
            image={props.logoImage} 
            setImage={props.setLogoImage} 
            aspect={1}
            brightness={props.logoBrightness}
            setBrightness={props.setLogoBrightness}
            contrast={props.logoContrast}
            setContrast={props.setLogoContrast}
        />
        <InputControl 
            label={t('designSubjectLabel')} 
            placeholder={props.logoImage ? t('designSubjectFromLogoPlaceholder') : t('designSubjectPlaceholder')} 
            value={props.designSubject} 
            onChange={e => props.setDesignSubject(e.target.value)} 
            disabled={!!props.logoImage}
        />
        <SelectControl label={t('designStyleLabel')} value={props.designStyle} onChange={e => props.setDesignStyle(e.target.value as DesignStyle)} options={DESIGN_STYLES} />
        <ColorPicker label={t('colorLabel')} colors={PRODUCT_COLORS} selectedValue={props.tshirtColor} onChange={props.setTshirtColor} />
      </div>

       <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">{t('textLabel')}</h3>
        <InputControl label={t('textLabel')} placeholder={t('textPlaceholder')} value={props.text} onChange={e => props.setText(e.target.value)} />
        <SelectControl label={t('fontLabel')} value={props.font} onChange={e => props.setFont(e.target.value as TshirtFont)} options={TSHIRT_FONTS.map(f => ({id: f.id, nameKey: f.name}))} />
        <ColorPicker label={t('textColorLabel')} colors={PRODUCT_COLORS} selectedValue={props.textColor} onChange={props.setTextColor} />
        <SelectControl label={t('textStyleLabel')} value={props.textStyle} onChange={e => props.setTextStyle(e.target.value as TextStyle)} options={TEXT_STYLES} />
      </div>
    </>
  );

  const renderLogoMockupControls = () => (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">{t('logoLabel')}</h3>
        <ImageUploadControl 
            label={t('logoImageLabel')} 
            image={props.logoImage} 
            setImage={props.setLogoImage} 
            aspect={1}
            brightness={props.logoBrightness}
            setBrightness={props.setLogoBrightness}
            contrast={props.logoContrast}
            setContrast={props.setLogoContrast}
        />
        <InputControl 
            label={t('logoContextLabel')} 
            placeholder={t('logoContextPlaceholder')} 
            value={props.designSubject} 
            onChange={e => props.setDesignSubject(e.target.value)} 
        />
      </div>
    </>
  );

  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-gray-900 text-white p-6 overflow-y-auto h-full flex flex-col gap-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-400">{t('appTitle')}</h2>
        <button
          onClick={toggleLanguage}
          className="text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition-colors"
          aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <SelectControl label={t('productTypeLabel')} value={props.productType} onChange={e => props.setProductType(e.target.value as ProductType)} options={PRODUCT_TYPES} />

      {['tshirt', 'sweatshirt', 'hoodie', 'flat_lay'].includes(props.productType) && renderApparelControls()}
      {props.productType === 'logo_mockup' && renderLogoMockupControls()}
      
      <div className="space-y-4 mt-auto pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">Image Settings</h3>
        <ToggleButtons label={t('aspectRatioLabel')} value={props.aspectRatio} onChange={props.setAspectRatio} options={[
          { value: '1:1', icon: AspectRatioSquareIcon, name: '1:1' },
          { value: '16:9', icon: AspectRatioHorizontalIcon, name: '16:9' },
          { value: '9:16', icon: AspectRatioVerticalIcon, name: '9:16' },
        ]} />
        <SelectControl
            label={t('presentationStyleLabel')}
            value={props.imageMode}
            onChange={e => props.setImageMode(e.target.value as ImageMode)}
            options={[
                { id: 'fit', nameKey: 'imageFit_fit' },
                { id: 'fit_blur', nameKey: 'imageFit_fit_blur' },
                { id: 'fit_transparent', nameKey: 'imageFit_fit_transparent' },
                { id: 'crop', nameKey: 'imageFit_crop' },
                { id: 'stretch', nameKey: 'imageFit_stretch' },
                { id: 'floating', nameKey: 'imageFit_floating' },
                { id: 'framed', nameKey: 'imageFit_framed' },
            ]}
        />
      </div>

      <button
        onClick={props.onGenerate}
        disabled={props.isLoading || isGenerateDisabled}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
      >
        <WandIcon className="w-6 h-6" />
        <span className="text-lg">{props.isLoading ? t('generatingButton') : t('generateButton')}</span>
      </button>
    </div>
  );
};

// Helper components for controls
const InputControl: React.FC<{ label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input type="text" {...props} className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed" />
  </div>
);

// --- Image Cropping Modal and Helpers ---

// Helper function to generate cropped image data URL
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): string {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL('image/png');
}

const ImageCropModal: React.FC<{
  src: string;
  onClose: () => void;
  onCrop: (croppedImageUrl: string) => void;
  aspect?: number;
}> = ({ src, onClose, onCrop, aspect = 1 }) => {
  const { t } = useTranslation();
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  }
  
  const handleCrop = () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current) {
          const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop);
          onCrop(croppedImageUrl);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg mx-auto text-white border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">{t('cropImageTitle')}</h3>
            <div className="max-h-[60vh] overflow-y-auto mb-4 bg-gray-900/50 p-2 rounded-md">
                 <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    minWidth={50}
                    minHeight={50}
                 >
                    <img
                        ref={imgRef}
                        alt="Image to crop"
                        src={src}
                        onLoad={onImageLoad}
                        style={{ maxHeight: '55vh' }}
                        className="w-full h-auto"
                    />
                 </ReactCrop>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                    {t('cancelButton')}
                </button>
                <button
                    onClick={handleCrop}
                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold"
                >
                    {t('applyCropButton')}
                </button>
            </div>
        </div>
    </div>
  )
}


const ImageUploadControl: React.FC<{
  label: string;
  image: string | null;
  setImage: (value: string | null) => void;
  aspect?: number;
  brightness?: number;
  setBrightness?: (value: number) => void;
  contrast?: number;
  setContrast?: (value: number) => void;
}> = ({ label, image, setImage, aspect, brightness, setBrightness, contrast, setContrast }) => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = React.useState<string | null>(null);

  const showSliders = image && brightness !== undefined && setBrightness && contrast !== undefined && setContrast;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert("File is too large. Please select an image under 5MB.");
          return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageToCrop(loadEvent.target?.result as string);
      };
      reader.onerror = () => {
        alert("Error reading file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedImageUrl: string) => {
    setImage(croppedImageUrl);
    setImageToCrop(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();
  const removeImage = () => {
    setImage(null);
    if (setBrightness) setBrightness(100);
    if (setContrast) setContrast(100);
  };

  return (
    <div>
      {imageToCrop && (
          <ImageCropModal
              src={imageToCrop}
              onClose={() => setImageToCrop(null)}
              onCrop={onCropComplete}
              aspect={aspect}
          />
      )}
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        aria-hidden="true"
      />
      {image ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img 
                src={image} 
                alt="Preview" 
                className="w-16 h-16 object-contain rounded-md bg-gray-700 p-1" 
                style={showSliders ? { filter: `brightness(${brightness}%) contrast(${contrast}%)` } : {}}
            />
            <button
              onClick={removeImage}
              title="Remove image"
              aria-label="Remove uploaded image"
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>

          {showSliders && (
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                  <label htmlFor="brightness-slider" className="font-medium">{t('logoBrightnessLabel')}</label>
                  <span>{brightness}%</span>
                </div>
                <input
                  id="brightness-slider"
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-indigo-500 [&::-moz-range-thumb]:bg-indigo-500"
                />
              </div>
              <div>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                  <label htmlFor="contrast-slider" className="font-medium">{t('logoContrastLabel')}</label>
                  <span>{contrast}%</span>
                </div>
                <input
                  id="contrast-slider"
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-indigo-500 [&::-moz-range-thumb]:bg-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={triggerFileSelect}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-indigo-500 text-gray-400 hover:text-indigo-400 font-bold py-4 px-4 rounded-lg transition-colors"
        >
          <UploadIcon className="w-6 h-6" />
          <span>Upload Image</span>
        </button>
      )}
    </div>
  );
};


const SelectControl: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { id: string; nameKey: string }[], disabled?: boolean }> = ({ label, value, onChange, options, disabled }) => {
    const { t } = useTranslation();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <select value={value} onChange={onChange} disabled={disabled} className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none disabled:bg-gray-700 disabled:cursor-not-allowed">
                {options.map(opt => <option key={opt.id} value={opt.id}>{t(opt.nameKey as any) || opt.nameKey}</option>)}
            </select>
        </div>
    );
}

const ToggleButtons: React.FC<{ label: string, value: string, onChange: (value: any) => void, options: { value: string; icon: React.FC<{className?:string}>; name?: string }[] }> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <div className="flex flex-wrap items-center gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.name}
          className={`p-2 rounded-md transition-colors ${value === opt.value ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
        >
          <opt.icon className="w-6 h-6" />
        </button>
      ))}
    </div>
  </div>
);

export default ControlsPanel;