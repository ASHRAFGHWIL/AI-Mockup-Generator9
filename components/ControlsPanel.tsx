import React from 'react';
import {
  PRODUCT_TYPES, PRODUCT_COLORS, DESIGN_STYLES, TEXT_STYLES, MODEL_POSES, MODEL_AUDIENCES, TSHIRT_FONTS,
} from '../constants';
import type {
  ProductType, DesignStyle, ModelPose, ModelAudience, TshirtFont, TextStyle, AspectRatio, ImageMode
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
  modelPose: ModelPose;
  setModelPose: (value: ModelPose) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  imageMode: ImageMode;
  setImageMode: (value: ImageMode) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ControlsPanel: React.FC<ControlsPanelProps> = (props) => {
  const { t } = useTranslation();

  const renderApparelControls = () => (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Model & Pose</h3>
        <SelectControl label={t('modelLabel')} value={props.modelAudience} onChange={e => props.setModelAudience(e.target.value as ModelAudience)} options={MODEL_AUDIENCES} />
        <SelectControl label={t('poseLabel')} value={props.modelPose} onChange={e => props.setModelPose(e.target.value as ModelPose)} options={MODEL_POSES} disabled={!!props.backgroundImage} />
        <ImageUploadControl label={t('backgroundImageLabel')} image={props.backgroundImage} setImage={props.setBackgroundImage} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Design</h3>
        <ImageUploadControl label={t('logoImageLabel')} image={props.logoImage} setImage={props.setLogoImage} />
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
        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Text</h3>
        <InputControl label={t('textLabel')} placeholder={t('textPlaceholder')} value={props.text} onChange={e => props.setText(e.target.value)} />
        <SelectControl label={t('fontLabel')} value={props.font} onChange={e => props.setFont(e.target.value as TshirtFont)} options={TSHIRT_FONTS.map(f => ({id: f.id, nameKey: f.name}))} />
        <ColorPicker label={t('textColorLabel')} colors={PRODUCT_COLORS} selectedValue={props.textColor} onChange={props.setTextColor} />
        <SelectControl label={t('textStyleLabel')} value={props.textStyle} onChange={e => props.setTextStyle(e.target.value as TextStyle)} options={TEXT_STYLES} />
      </div>
    </>
  );

  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-gray-900 text-white p-6 overflow-y-auto h-full flex flex-col gap-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-400">{t('appTitle')}</h2>
      </div>

      <SelectControl label={t('productTypeLabel')} value={props.productType} onChange={e => props.setProductType(e.target.value as ProductType)} options={PRODUCT_TYPES} />

      {['tshirt', 'sweatshirt', 'hoodie', 'flat_lay'].includes(props.productType) && renderApparelControls()}
      
      <div className="space-y-4 mt-auto pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">Image Settings</h3>
        <ToggleButtons label={t('aspectRatioLabel')} value={props.aspectRatio} onChange={props.setAspectRatio} options={[
          { value: '1:1', icon: AspectRatioSquareIcon, name: '1:1' },
          { value: '16:9', icon: AspectRatioHorizontalIcon, name: '16:9' },
          { value: '9:16', icon: AspectRatioVerticalIcon, name: '9:16' },
        ]} />
        <ToggleButtons label={t('imageFitLabel')} value={props.imageMode} onChange={props.setImageMode} options={[
          { value: 'fit', icon: FitIcon, name: t('imageFit_fit') },
          { value: 'fit_blur', icon: FitBlurIcon, name: t('imageFit_fit_blur') },
          { value: 'fit_transparent', icon: FitTransparentIcon, name: t('imageFit_fit_transparent') },
          { value: 'crop', icon: CropIcon, name: t('imageFit_crop') },
          { value: 'stretch', icon: StretchIcon, name: t('imageFit_stretch') },
        ]} />
      </div>

      <button
        onClick={props.onGenerate}
        disabled={props.isLoading || (!props.designSubject && !props.logoImage)}
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

const ImageUploadControl: React.FC<{
  label: string;
  image: string | null;
  setImage: (value: string | null) => void;
}> = ({ label, image, setImage }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert("File is too large. Please select an image under 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImage(loadEvent.target?.result as string);
      };
      reader.onerror = () => {
        alert("Error reading file.");
      }
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();
  const removeImage = () => setImage(null);

  return (
    <div>
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
        <div className="flex items-center gap-4">
          <img src={image} alt="Preview" className="w-16 h-16 object-contain rounded-md bg-gray-700 p-1" />
          <button
            onClick={removeImage}
            title="Remove image"
            aria-label="Remove uploaded image"
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
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