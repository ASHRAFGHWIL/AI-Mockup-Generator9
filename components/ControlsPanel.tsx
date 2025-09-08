import React, { useRef } from 'react';
import type { DesignOptions, SetDesignOptions, TextStyle, ImageMode, DesignStyle, ModelPose, ModelAudience, TshirtFont, BagMaterial, WalletStyle, WalletModel, FrameStyle, FrameModel, MugStyle, MugModel, SipperGlassStyle, SipperGlassModel, TumblerStyle, TumblerModel, HalloweenTumblerStyle, HalloweenTumblerSetting, TumblerTrioStyle, TumblerTrioSetting, EngravingMaterial, PhoneCaseStyle, PhoneCaseModel, StickerStyle, StickerSetting, PosterStyle, PosterSetting, CapStyle, CapModel, PillowStyle, PillowSetting, FlatLayStyle, PuzzleStyle, PuzzleSetting, ProductType, AspectRatio } from '../types';
import { PRODUCT_COLORS, DESIGN_STYLES, MODEL_POSES, MODEL_AUDIENCES, TSHIRT_FONTS, PRODUCT_TYPES, BAG_MATERIALS, TEXT_STYLES, FRAME_STYLES, FRAME_MODELS, MUG_STYLES, MUG_MODELS, SIPPER_GLASS_STYLES, SIPPER_GLASS_MODELS, TUMBLER_STYLES, TUMBLER_MODELS, HALLOWEEN_TUMBLER_STYLES, HALLOWEEN_TUMBLER_SETTINGS, TUMBLER_TRIO_STYLES, TUMBLER_TRIO_SETTINGS, ENGRAVING_MATERIALS, PHONE_CASE_STYLES, PHONE_CASE_MODELS, STICKER_STYLES, STICKER_SETTINGS, POSTER_STYLES, POSTER_SETTINGS, WALLET_STYLES, WALLET_MODELS, CAP_STYLES, CAP_MODELS, PILLOW_STYLES, PILLOW_SETTINGS, FLAT_LAY_STYLES, PUZZLE_STYLES, PUZZLE_SETTINGS } from '../constants';
import { UploadIcon, TrashIcon, WandIcon, FitIcon, FitBlurIcon, FitTransparentIcon, CropIcon, StretchIcon, AspectRatioSquareIcon, AspectRatioHorizontalIcon, AspectRatioVerticalIcon } from './icons';
import ColorPicker from './ColorPicker';
import { useTranslation } from '../hooks/useTranslation';

interface ControlsPanelProps {
  design: DesignOptions;
  setDesign: SetDesignOptions;
  onGenerate: () => void;
  isLoading: boolean;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageMode: ImageMode;
  setImageMode: React.Dispatch<React.SetStateAction<ImageMode>>;
}

const getTextStylePreview = (styleId: TextStyle): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        fontFamily: 'Impact, sans-serif',
        fontSize: '1.5rem',
        color: '#E5E7EB', // text-gray-200
        display: 'block',
        height: '2.5rem',
        lineHeight: '2.5rem',
        userSelect: 'none',
        fontWeight: 'bold',
    };
    switch (styleId) {
        case 'outline': return { ...baseStyle, WebkitTextStroke: '1.5px black', color: '#E0E7FF' };
        case 'shadow': return { ...baseStyle, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' };
        case 'glow': return { ...baseStyle, color: '#fff', textShadow: '0 0 5px #fff, 0 0 10px #A78BFA, 0 0 15px #A78BFA' };
        case 'neon': return { ...baseStyle, color: '#F9A8D4', textShadow: '0 0 2px #fff, 0 0 5px #F472B6, 0 0 10px #F472B6, 0 0 15px #E879F9, 0 0 20px #E879F9' };
        case '3d': return { ...baseStyle, color: '#D1D5DB', textShadow: '1px 1px 0 #9CA3AF, 2px 2px 0 #6B7280, 3px 3px 0 #4B5563, 4px 4px 5px rgba(0,0,0,0.5)' };
        case 'metallic': return { ...baseStyle, background: 'linear-gradient(180deg, #E5E7EB, #D1D5DB, #9CA3AF, #D1D5DB, #E5E7EB)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' };
        case 'chrome': return { ...baseStyle, background: 'linear-gradient(0deg, #6B7280 0%, #D1D5DB 30%, #F9FAFB 50%, #D1D5DB 70%, #6B7280 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: '0.5px #4B5563' };
        case 'gradient': return { ...baseStyle, background: 'linear-gradient(45deg, #A78BFA, #F472B6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' };
        case 'pastel_rainbow': return { ...baseStyle, background: 'linear-gradient(90deg, #ffadad, #ffd6a5, #fdffb6, #caffbf, #9bf6ff, #a0c4ff, #bdb2ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' };
        case 'distressed': return { ...baseStyle, fontFamily: '"Special Elite", cursive', color: '#9CA3AF', textShadow: '1px 1px 1px rgba(0,0,0,0.2)' };
        case 'fire': return { ...baseStyle, background: 'linear-gradient(180deg, #FBBF24, #F97316, #EF4444, #B91C1C)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: '0 0 5px #F59E0B, 0 0 10px #D97706' };
        case 'ice': return { ...baseStyle, color: '#E0F2FE', WebkitTextStroke: '1px #38BDF8', textShadow: '0 0 5px #7DD3FC, 1px 1px 2px rgba(0,0,0,0.3)' };
        case 'wooden': return { ...baseStyle, background: 'linear-gradient(45deg, #854d0e, #a37b4c, #854d0e)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: '2px 2px 3px rgba(0,0,0,0.5)' };
        case 'comic': return { ...baseStyle, fontFamily: '"Bangers", cursive', WebkitTextStroke: '2px black', color: '#38BDF8', letterSpacing: '2px' };
        case 'glitch': return { ...baseStyle, color: '#E5E7EB', textShadow: '2px 0 0 #F472B6, -2px 0 0 #38BDF8, 0 0 5px #9333EA' };
        case 'script': return { ...baseStyle, fontFamily: '"Dancing Script", cursive' };
        case 'varsity': return { ...baseStyle, fontFamily: '"Archivo Black", sans-serif', WebkitTextStroke: '2px black', color: '#FBBF24' };
        case 'none':
        default: return { ...baseStyle, fontWeight: 'normal' };
    }
};

const ControlsPanel: React.FC<ControlsPanelProps> = ({ design, setDesign, onGenerate, isLoading, handleLogoChange, imageMode, setImageMode }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeLogo = () => {
    setDesign(d => ({ ...d, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const femaleAudiences = MODEL_AUDIENCES.filter(a => a.id.includes('woman'));
  const maleAudiences = MODEL_AUDIENCES.filter(a => a.id.includes('man') || a.id.includes('male'));

  const imageModes: { id: ImageMode, nameKey: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'fit_blur', nameKey: 'imageMode_fit_blur', icon: FitBlurIcon },
    { id: 'fit_transparent', nameKey: 'imageMode_fit_transparent', icon: FitTransparentIcon },
    { id: 'crop', nameKey: 'imageMode_crop', icon: CropIcon },
    { id: 'stretch', nameKey: 'imageMode_stretch', icon: StretchIcon },
  ];

  const aspectRatios: { id: AspectRatio, nameKey: string, icon: React.FC<{className?: string}> }[] = [
    { id: '1:1', nameKey: 'aspectRatio_1_1', icon: AspectRatioSquareIcon },
    { id: '16:9', nameKey: 'aspectRatio_16_9', icon: AspectRatioHorizontalIcon },
    { id: '9:16', nameKey: 'aspectRatio_9_16', icon: AspectRatioVerticalIcon },
  ];
  
  const getProductColorLabel = () => {
    const key = `productColorLabel_${design.productType}` as keyof typeof import('../i18n/en').en;
    return t(key);
  }

  const productColorLabel = getProductColorLabel();

  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-gray-800 p-6 rounded-lg shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-white">{t('controlsTitle')}</h2>

      {/* Product Type */}
      <div>
        <label htmlFor="product-type" className="block text-sm font-medium text-gray-300">{t('productTypeLabel')}</label>
        <select
          id="product-type"
          value={design.productType}
          onChange={(e) => setDesign(d => ({ ...d, productType: e.target.value as ProductType }))}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          {PRODUCT_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {t(type.nameKey as keyof typeof import('../i18n/en').en)}
            </option>
          ))}
        </select>
      </div>


      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('logoArtworkLabel')}</label>
        <div className="mt-1 flex items-center justify-between p-3 border-2 border-dashed border-gray-600 rounded-md">
            {design.logo ? (
                <div className="flex items-center gap-4">
                    <img src={design.logo} alt="Logo preview" className="h-12 w-12 object-contain rounded-md bg-white p-1" />
                    <span className="text-sm text-gray-400 truncate">logo.png</span>
                     <button onClick={removeLogo} className="text-red-400 hover:text-red-300">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="space-y-1 text-center w-full">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                        <UploadIcon className="w-10 h-10 mb-2"/>
                        <span className="font-medium">{t('uploadImage')}</span>
                        <span className="text-xs">{t('uploadHint')}</span>
                    </button>
                </div>
            )}
           
        </div>
        <input ref={fileInputRef} type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleLogoChange} />
      </div>

      {/* Text controls - not for frame, mug, or sipper glass */}
      {design.productType !== 'wooden_frame' && design.productType !== 'tea_mug' && design.productType !== 'sipper_glass' && design.productType !== 'tumbler_wrap' && design.productType !== 'halloween_tumbler' && design.productType !== 'tumbler_trio' && design.productType !== 'jigsaw_puzzle' && (
        <>
            {/* Custom Text */}
            <div>
                <label htmlFor="custom-text" className="block text-sm font-medium text-gray-300">
                {t('textLabel')}
                </label>
                <div className="mt-1">
                <input
                    type="text"
                    id="custom-text"
                    value={design.text}
                    onChange={(e) => setDesign(d => ({ ...d, text: e.target.value }))}
                    placeholder={t('textPlaceholder')}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                </div>
            </div>
            
            {/* Font Family */}
            <div>
              <label htmlFor="font-family" className="block text-sm font-medium text-gray-300">{t('fontLabel')}</label>
              <select
                id="font-family"
                value={design.font}
                onChange={(e) => setDesign(d => ({ ...d, font: e.target.value as TshirtFont }))}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {TSHIRT_FONTS.map(font => (
                  <option key={font.id} value={font.id} style={{ fontFamily: `'${font.name}', sans-serif`, fontSize: '1.2rem', backgroundColor: '#374151' }}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Style */}
            <div>
              <label htmlFor="text-style" className="block text-sm font-medium text-gray-300">{t('textStyleLabel')}</label>
              <select
                id="text-style"
                value={design.textStyle}
                onChange={(e) => setDesign(d => ({ ...d, textStyle: e.target.value as TextStyle }))}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {TEXT_STYLES.map(style => {
                    const optionStyle: React.CSSProperties = { ...getTextStylePreview(style.id) };
                    
                    optionStyle.backgroundColor = '#374151';
                    optionStyle.height = 'auto';
                    optionStyle.lineHeight = 'normal';
                    optionStyle.display = 'block';
                    optionStyle.padding = '4px 8px';
                    optionStyle.fontSize = '1.2rem';

                    if (optionStyle.color === 'transparent') {
                        optionStyle.color = '#E5E7EB';
                        optionStyle.background = 'none';
                    }

                    return (
                    <option
                        key={style.id}
                        value={style.id}
                        style={optionStyle}
                    >
                        {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                    </option>
                    );
                })}
              </select>
            </div>

            <ColorPicker
                label={t('textColorLabel')}
                colors={PRODUCT_COLORS}
                selectedValue={design.textColor}
                onChange={(color) => setDesign(d => ({ ...d, textColor: color }))}
            />

            {design.textStyle === 'gradient' && (
              <>
                <div>
                  <label htmlFor="gradient-start-color" className="block text-sm font-medium text-gray-300">{t('gradientStartLabel')}</label>
                  <select
                    id="gradient-start-color"
                    value={design.gradientStartColor}
                    onChange={(e) => setDesign(d => ({ ...d, gradientStartColor: e.target.value }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    {PRODUCT_COLORS.map(color => (
                      <option key={color.name} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gradient-end-color" className="block text-sm font-medium text-gray-300">{t('gradientEndLabel')}</label>
                  <select
                    id="gradient-end-color"
                    value={design.gradientEndColor}
                    onChange={(e) => setDesign(d => ({ ...d, gradientEndColor: e.target.value }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    {PRODUCT_COLORS.map(color => (
                      <option key={color.name} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
        </>
      )}

      {(design.productType === 'tshirt' || design.productType === 'sweatshirt' || design.productType === 'hoodie') && (
        <>
          <div>
            <label htmlFor="design-style" className="block text-sm font-medium text-gray-300">{t('designStyleLabel')}</label>
            <select
              id="design-style"
              value={design.style}
              onChange={(e) => setDesign(d => ({ ...d, style: e.target.value as DesignStyle }))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              {DESIGN_STYLES.map(style => (
                <option key={style.id} value={style.id}>
                  {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="model-pose" className="block text-sm font-medium text-gray-300">{t('presentationStyleLabel')}</label>
            <select
              id="model-pose"
              value={design.pose}
              onChange={(e) => setDesign(d => ({ ...d, pose: e.target.value as ModelPose }))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              {MODEL_POSES.map(pose => (
                <option key={pose.id} value={pose.id}>
                  {t(pose.nameKey as keyof typeof import('../i18n/en').en)}
                </option>
              ))}
            </select>
          </div>

          {design.pose !== 'flat_lay_simple' && (
            <div>
              <label htmlFor="model-audience" className="block text-sm font-medium text-gray-300">{t('modelLabel')}</label>
              <select
                id="model-audience"
                value={design.audience}
                onChange={(e) => setDesign(d => ({ ...d, audience: e.target.value as ModelAudience }))}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <optgroup label={t('femaleModels')}>
                  {femaleAudiences.map(audience => (
                    <option key={audience.id} value={audience.id}>
                      {t(audience.nameKey as keyof typeof import('../i18n/en').en)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t('maleModels')}>
                  {maleAudiences.map(audience => (
                    <option key={audience.id} value={audience.id}>
                      {t(audience.nameKey as keyof typeof import('../i18n/en').en)}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
        </>
      )}

      {design.productType === 'bag' && (
        <div>
          <label htmlFor="bag-material" className="block text-sm font-medium text-gray-300">{t('bagMaterialLabel')}</label>
          <select
            id="bag-material"
            value={design.bagMaterial}
            onChange={(e) => setDesign(d => ({ ...d, bagMaterial: e.target.value as BagMaterial }))}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {BAG_MATERIALS.map(material => (
              <option key={material.id} value={material.id}>
                {t(material.nameKey as keyof typeof import('../i18n/en').en)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {design.productType === 'wallet' && (
        <>
            <div>
                <label htmlFor="wallet-style" className="block text-sm font-medium text-gray-300">{t('walletStyleLabel')}</label>
                <select
                    id="wallet-style"
                    value={design.walletStyle}
                    onChange={(e) => setDesign(d => ({ ...d, walletStyle: e.target.value as WalletStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {WALLET_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="wallet-model" className="block text-sm font-medium text-gray-300">{t('walletModelLabel')}</label>
                <select
                    id="wallet-model"
                    value={design.walletModel}
                    onChange={(e) => setDesign(d => ({ ...d, walletModel: e.target.value as WalletModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {WALLET_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'cap' && (
        <>
            <div>
                <label htmlFor="cap-style" className="block text-sm font-medium text-gray-300">{t('capStyleLabel')}</label>
                <select
                    id="cap-style"
                    value={design.capStyle}
                    onChange={(e) => setDesign(d => ({ ...d, capStyle: e.target.value as CapStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {CAP_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="cap-model" className="block text-sm font-medium text-gray-300">{t('capModelLabel')}</label>
                <select
                    id="cap-model"
                    value={design.capModel}
                    onChange={(e) => setDesign(d => ({ ...d, capModel: e.target.value as CapModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {CAP_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'pillow' && (
        <>
            <div>
                <label htmlFor="pillow-style" className="block text-sm font-medium text-gray-300">{t('pillowStyleLabel')}</label>
                <select
                    id="pillow-style"
                    value={design.pillowStyle}
                    onChange={(e) => setDesign(d => ({ ...d, pillowStyle: e.target.value as PillowStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {PILLOW_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="pillow-setting" className="block text-sm font-medium text-gray-300">{t('pillowSettingLabel')}</label>
                <select
                    id="pillow-setting"
                    value={design.pillowSetting}
                    onChange={(e) => setDesign(d => ({ ...d, pillowSetting: e.target.value as PillowSetting }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {PILLOW_SETTINGS.map(setting => (
                        <option key={setting.id} value={setting.id}>
                            {t(setting.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'flat_lay' && (
        <>
            <div>
                <label htmlFor="flat-lay-style" className="block text-sm font-medium text-gray-300">{t('flatLayStyleLabel')}</label>
                <select
                    id="flat-lay-style"
                    value={design.flatLayStyle}
                    onChange={(e) => setDesign(d => ({ ...d, flatLayStyle: e.target.value as FlatLayStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {FLAT_LAY_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            
            <div>
                <label htmlFor="design-style" className="block text-sm font-medium text-gray-300">{t('tshirtDesignStyleLabel')}</label>
                <select
                  id="design-style"
                  value={design.style}
                  onChange={(e) => setDesign(d => ({ ...d, style: e.target.value as DesignStyle }))}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  {DESIGN_STYLES.map(style => (
                    <option key={style.id} value={style.id}>
                      {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                    </option>
                  ))}
                </select>
              </div>
        </>
      )}

      {design.productType === 'wooden_frame' && (
        <>
            <div>
                <label htmlFor="frame-style" className="block text-sm font-medium text-gray-300">{t('frameStyleLabel')}</label>
                <select
                    id="frame-style"
                    value={design.frameStyle}
                    onChange={(e) => setDesign(d => ({ ...d, frameStyle: e.target.value as FrameStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {FRAME_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="frame-model" className="block text-sm font-medium text-gray-300">{t('frameModelLabel')}</label>
                <select
                    id="frame-model"
                    value={design.frameModel}
                    onChange={(e) => setDesign(d => ({ ...d, frameModel: e.target.value as FrameModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {FRAME_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'tea_mug' && (
        <>
            <div>
                <label htmlFor="mug-style" className="block text-sm font-medium text-gray-300">{t('mugStyleLabel')}</label>
                <select
                    id="mug-style"
                    value={design.mugStyle}
                    onChange={(e) => setDesign(d => ({ ...d, mugStyle: e.target.value as MugStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {MUG_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="mug-model" className="block text-sm font-medium text-gray-300">{t('mugModelLabel')}</label>
                <select
                    id="mug-model"
                    value={design.mugModel}
                    onChange={(e) => setDesign(d => ({ ...d, mugModel: e.target.value as MugModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {MUG_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'sipper_glass' && (
        <>
            <div>
                <label htmlFor="sipper-style" className="block text-sm font-medium text-gray-300">{t('sipperStyleLabel')}</label>
                <select
                    id="sipper-style"
                    value={design.sipperGlassStyle}
                    onChange={(e) => setDesign(d => ({ ...d, sipperGlassStyle: e.target.value as SipperGlassStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {SIPPER_GLASS_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="sipper-model" className="block text-sm font-medium text-gray-300">{t('sipperModelLabel')}</label>
                <select
                    id="sipper-model"
                    value={design.sipperGlassModel}
                    onChange={(e) => setDesign(d => ({ ...d, sipperGlassModel: e.target.value as SipperGlassModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {SIPPER_GLASS_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'tumbler_wrap' && (
        <>
            <div>
                <label htmlFor="tumbler-style" className="block text-sm font-medium text-gray-300">{t('tumblerStyleLabel')}</label>
                <select
                    id="tumbler-style"
                    value={design.tumblerStyle}
                    onChange={(e) => setDesign(d => ({ ...d, tumblerStyle: e.target.value as TumblerStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {TUMBLER_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="tumbler-model" className="block text-sm font-medium text-gray-300">{t('tumblerModelLabel')}</label>
                <select
                    id="tumbler-model"
                    value={design.tumblerModel}
                    onChange={(e) => setDesign(d => ({ ...d, tumblerModel: e.target.value as TumblerModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {TUMBLER_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                           {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'halloween_tumbler' && (
        <>
            <div>
                <label htmlFor="halloween-tumbler-style" className="block text-sm font-medium text-gray-300">{t('halloweenTumblerStyleLabel')}</label>
                <select
                    id="halloween-tumbler-style"
                    value={design.halloweenTumblerStyle}
                    onChange={(e) => setDesign(d => ({ ...d, halloweenTumblerStyle: e.target.value as HalloweenTumblerStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {HALLOWEEN_TUMBLER_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="halloween-tumbler-setting" className="block text-sm font-medium text-gray-300">{t('halloweenTumblerSettingLabel')}</label>
                <select
                    id="halloween-tumbler-setting"
                    value={design.halloweenTumblerSetting}
                    onChange={(e) => setDesign(d => ({ ...d, halloweenTumblerSetting: e.target.value as HalloweenTumblerSetting }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {HALLOWEEN_TUMBLER_SETTINGS.map(setting => (
                        <option key={setting.id} value={setting.id}>
                            {t(setting.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'tumbler_trio' && (
        <>
            <div>
                <label htmlFor="tumbler-trio-style" className="block text-sm font-medium text-gray-300">{t('tumblerTrioStyleLabel')}</label>
                <select
                    id="tumbler-trio-style"
                    value={design.tumblerTrioStyle}
                    onChange={(e) => setDesign(d => ({ ...d, tumblerTrioStyle: e.target.value as TumblerTrioStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {TUMBLER_TRIO_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="tumbler-trio-setting" className="block text-sm font-medium text-gray-300">{t('tumblerTrioSettingLabel')}</label>
                <select
                    id="tumbler-trio-setting"
                    value={design.tumblerTrioSetting}
                    onChange={(e) => setDesign(d => ({ ...d, tumblerTrioSetting: e.target.value as TumblerTrioSetting }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {TUMBLER_TRIO_SETTINGS.map(setting => (
                        <option key={setting.id} value={setting.id}>
                            {t(setting.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'laser_engraving' && (
        <div>
            <label htmlFor="engraving-material" className="block text-sm font-medium text-gray-300">{t('engravingMaterialLabel')}</label>
            <select
                id="engraving-material"
                value={design.engravingMaterial}
                onChange={(e) => setDesign(d => ({ ...d, engravingMaterial: e.target.value as EngravingMaterial }))}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
                {ENGRAVING_MATERIALS.map(material => (
                    <option key={material.id} value={material.id}>
                        {t(material.nameKey as keyof typeof import('../i18n/en').en)}
                    </option>
                ))}
            </select>
        </div>
      )}

      {design.productType === 'phone_case' && (
        <>
            <div>
                <label htmlFor="phone-case-style" className="block text-sm font-medium text-gray-300">{t('phoneCaseStyleLabel')}</label>
                <select
                    id="phone-case-style"
                    value={design.phoneCaseStyle}
                    onChange={(e) => setDesign(d => ({ ...d, phoneCaseStyle: e.target.value as PhoneCaseStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {PHONE_CASE_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="phone-case-model" className="block text-sm font-medium text-gray-300">{t('phoneCaseModelLabel')}</label>
                <select
                    id="phone-case-model"
                    value={design.phoneCaseModel}
                    onChange={(e) => setDesign(d => ({ ...d, phoneCaseModel: e.target.value as PhoneCaseModel }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {PHONE_CASE_MODELS.map(model => (
                        <option key={model.id} value={model.id}>
                            {t(model.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'sticker' && (
        <>
            <div>
                <label htmlFor="sticker-style" className="block text-sm font-medium text-gray-300">{t('stickerStyleLabel')}</label>
                <select
                    id="sticker-style"
                    value={design.stickerStyle}
                    onChange={(e) => setDesign(d => ({ ...d, stickerStyle: e.target.value as StickerStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {STICKER_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="sticker-setting" className="block text-sm font-medium text-gray-300">{t('stickerSettingLabel')}</label>
                <select
                    id="sticker-setting"
                    value={design.stickerSetting}
                    onChange={(e) => setDesign(d => ({ ...d, stickerSetting: e.target.value as StickerSetting }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {STICKER_SETTINGS.map(setting => (
                        <option key={setting.id} value={setting.id}>
                            {t(setting.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'poster' && (
        <>
            <div>
                <label htmlFor="poster-style" className="block text-sm font-medium text-gray-300">{t('posterStyleLabel')}</label>
                <select
                    id="poster-style"
                    value={design.posterStyle}
                    onChange={(e) => setDesign(d => ({ ...d, posterStyle: e.target.value as PosterStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {POSTER_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="poster-setting" className="block text-sm font-medium text-gray-300">{t('posterSettingLabel')}</label>
                <select
                    id="poster-setting"
                    value={design.posterSetting}
                    onChange={(e) => setDesign(d => ({ ...d, posterSetting: e.target.value as PosterSetting }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {POSTER_SETTINGS.map(setting => (
                        <option key={setting.id} value={setting.id}>
                            {t(setting.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {design.productType === 'jigsaw_puzzle' && (
        <>
            <div>
                <label htmlFor="puzzle-style" className="block text-sm font-medium text-gray-300">{t('puzzleStyleLabel')}</label>
                <select
                    id="puzzle-style"
                    value={design.puzzleStyle}
                    onChange={(e) => setDesign(d => ({ ...d, puzzleStyle: e.target.value as PuzzleStyle }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {PUZZLE_STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                            {t(style.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="puzzle-setting" className="block text-sm font-medium text-gray-300">{t('puzzleSettingLabel')}</label>
                <select
                    id="puzzle-setting"
                    value={design.puzzleSetting}
                    onChange={(e) => setDesign(d => ({ ...d, puzzleSetting: e.target.value as PuzzleSetting }))}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                    {PUZZLE_SETTINGS.map(setting => (
                        <option key={setting.id} value={setting.id}>
                            {t(setting.nameKey as keyof typeof import('../i18n/en').en)}
                        </option>
                    ))}
                </select>
            </div>
        </>
      )}

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-300">{t('photoFormatLabel')}</label>
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-700 p-1">
          {aspectRatios.map(ratio => (
            <button
              key={ratio.id}
              type="button"
              title={`Set aspect ratio to ${t(ratio.nameKey as keyof typeof import('../i18n/en').en)} (${ratio.id})`}
              onClick={() => setDesign(d => ({ ...d, aspectRatio: ratio.id }))}
              className={`flex flex-col items-center justify-center text-center px-2 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500
                ${design.aspectRatio === ratio.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`
              }
              aria-pressed={design.aspectRatio === ratio.id}
            >
              <ratio.icon className="w-6 h-6 mb-1" />
              <span>{t(ratio.nameKey as keyof typeof import('../i18n/en').en)}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Logo Placement */}
      <div>
        <label htmlFor="logo-placement" className="block text-sm font-medium text-gray-300">{t('logoPlacementLabel')}</label>
        <select
          id="logo-placement"
          value={imageMode}
          onChange={(e) => setImageMode(e.target.value as ImageMode)}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          {imageModes.map(mode => (
            <option key={mode.id} value={mode.id}>
              {t(mode.nameKey as keyof typeof import('../i18n/en').en)}
            </option>
          ))}
        </select>
      </div>


      {/* Product Color */}
      {productColorLabel && (
        <ColorPicker
            label={productColorLabel}
            colors={PRODUCT_COLORS}
            selectedValue={design.productColor}
            onChange={(color) => setDesign(d => ({ ...d, productColor: color }))}
        />
      )}
      
       {/* Generate Button */}
       <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading || !design.logo}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('generatingButton')}
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5" />
              {design.productType === 'laser_engraving' ? t('generateEngravingButton') : t('generateButton')}
            </>
          )}
        </button>
        {!design.logo && <p className="text-xs text-red-400 text-center mt-2">{t('uploadLogoWarning')}</p>}
      </div>
    </div>
  );
};

export default ControlsPanel;
