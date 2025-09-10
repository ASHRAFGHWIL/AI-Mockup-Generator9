import React from 'react';
import type { DesignStyle, ModelPose, ModelAudience, TshirtFont, ProductType, BagMaterial, TextStyle, FrameStyle, FrameModel, MugStyle, MugModel, SipperGlassStyle, SipperGlassModel, TumblerStyle, TumblerModel, HalloweenTumblerStyle, HalloweenTumblerSetting, TumblerTrioStyle, TumblerTrioSetting, EngravingMaterial, PhoneCaseStyle, PhoneCaseModel, StickerStyle, StickerSetting, PosterStyle, PosterSetting, WalletStyle, WalletModel, CapStyle, CapModel, PillowStyle, PillowSetting, FlatLayStyle, PuzzleStyle, PuzzleSetting } from './types';
import { TshirtIcon, SweatshirtIcon, HoodieIcon, BagIcon, FrameIcon, MugIcon, SipperGlassIcon, TumblerIcon, HalloweenTumblerIcon, TumblerTrioIcon, LaserIcon, PhoneCaseIcon, StickerIcon, PosterIcon, WalletIcon, CapIcon, PillowIcon, FlatLayIcon, PuzzleIcon } from './components/productIcons';

export const PRODUCT_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#272727' },
  { name: 'Jet Black', value: '#111111' },
  { name: 'Grey', value: '#808080' },
  { name: 'Charcoal', value: '#4A4A4A' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Cream', value: '#FEF3C7' },
  { name: 'Beige', value: '#D2B48C' },
  { name: 'Red', value: '#B91C1C' },
  { name: 'Maroon', value: '#800000' },
  { name: 'Burgundy', value: '#9F1239' },
  { name: 'Rose', value: '#FB7185' },
  { name: 'Pink', value: '#F472B6' },
  { name: 'Hot Pink', value: '#D946EF' },
  { name: 'Light Pink', value: '#FBCFE8' },
  { name: 'Coral', value: '#FF7F50' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Bright Orange', value: '#F97316' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Yellow', value: '#FBBF24' },
  { name: 'Electric Lime', value: '#BEF264' },
  { name: 'Lime', value: '#A3E635' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Forest Green', value: '#15803D' },
  { name: 'Mint Green', value: '#6EE7B7' },
  { name: 'Teal', value: '#2DD4BF' },
  { name: 'Turquoise', value: '#40E0D0' },
  { name: 'Cyan', value: '#22D3EE' },
  { name: 'Sky Blue', value: '#38BDF8' },
  { name: 'Baby Blue', value: '#BFDBFE' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Royal Blue', value: '#4338CA' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Navy', value: '#001f3f' },
  { name: 'Purple', value: '#A78BFA' },
  { name: 'Lavender', value: '#C4B5FD' },
  { name: 'Lilac', value: '#D8B4FE' },
  { name: 'Fuchsia', value: '#E879F9' },
  { name: 'Brown', value: '#78350F' },
  { name: 'Walnut', value: '#5C4033' },
  { name: 'Pine', value: '#A67B5B' },
  { name: 'Oak', value: '#C2A47C' },
  { name: 'Mahogany', value: '#C04000' },
];

export const PRODUCT_TYPES: {id: ProductType, nameKey: string, icon: React.FC<{ className?: string }>}[] = [
    { id: 'tshirt', nameKey: 'productType_tshirt', icon: TshirtIcon },
    { id: 'sweatshirt', nameKey: 'productType_sweatshirt', icon: SweatshirtIcon },
    { id: 'hoodie', nameKey: 'productType_hoodie', icon: HoodieIcon },
    { id: 'flat_lay', nameKey: 'productType_flat_lay', icon: FlatLayIcon },
    { id: 'bag', nameKey: 'productType_bag', icon: BagIcon },
    { id: 'wallet', nameKey: 'productType_wallet', icon: WalletIcon },
    { id: 'cap', nameKey: 'productType_cap', icon: CapIcon },
    { id: 'pillow', nameKey: 'productType_pillow', icon: PillowIcon },
    { id: 'wooden_frame', nameKey: 'productType_wooden_frame', icon: FrameIcon },
    { id: 'tea_mug', nameKey: 'productType_tea_mug', icon: MugIcon },
    { id: 'sipper_glass', nameKey: 'productType_sipper_glass', icon: SipperGlassIcon },
    { id: 'tumbler_wrap', nameKey: 'productType_tumbler_wrap', icon: TumblerIcon },
    { id: 'halloween_tumbler', nameKey: 'productType_halloween_tumbler', icon: HalloweenTumblerIcon },
    { id: 'tumbler_trio', nameKey: 'productType_tumbler_trio', icon: TumblerTrioIcon },
    { id: 'laser_engraving', nameKey: 'productType_laser_engraving', icon: LaserIcon },
    { id: 'phone_case', nameKey: 'productType_phone_case', icon: PhoneCaseIcon },
    { id: 'sticker', nameKey: 'productType_sticker', icon: StickerIcon },
    { id: 'poster', nameKey: 'productType_poster', icon: PosterIcon },
    { id: 'jigsaw_puzzle', nameKey: 'productType_jigsaw_puzzle', icon: PuzzleIcon },
];

export const BAG_MATERIALS: {id: BagMaterial, nameKey: string}[] = [
    { id: 'canvas', nameKey: 'bagMaterial_canvas' },
    { id: 'leather', nameKey: 'bagMaterial_leather' },
    { id: 'nylon', nameKey: 'bagMaterial_nylon' },
    { id: 'denim', nameKey: 'bagMaterial_denim' },
];

export const FRAME_STYLES: {id: FrameStyle, nameKey: string}[] = [
    { id: 'classic_ornate', nameKey: 'frameStyle_classic_ornate' },
    { id: 'modern_minimalist', nameKey: 'frameStyle_modern_minimalist' },
    { id: 'rustic_barnwood', nameKey: 'frameStyle_rustic_barnwood' },
    { id: 'modern_mahogany', nameKey: 'frameStyle_modern_mahogany' },
];

export const FRAME_MODELS: {id: FrameModel, nameKey: string, description: string}[] = [
    { id: 'elegant_woman_street', nameKey: 'frameModel_elegant_woman_street', description: 'an elegant woman in elegant clothing, standing on a picturesque European-style street and holding the frame' },
    { id: 'art_curator_gallery', nameKey: 'frameModel_art_curator_gallery', description: 'an art curator with a professional appearance in a minimalist gallery, presenting the frame' },
    { id: 'craftsman_workshop', nameKey: 'frameModel_craftsman_workshop', description: 'a craftsman in a woodworking workshop, showcasing the frame' },
    { id: 'man_modern_loft', nameKey: 'frameModel_man_modern_loft', description: 'a stylish man in a modern, industrial-style loft apartment, hanging the frame on an exposed brick wall' },
    { id: 'woman_cozy_living_room', nameKey: 'frameModel_woman_cozy_living_room', description: 'a woman in a cozy, hygge-style living room with a fireplace, placing the frame on a wooden mantle' },
    { id: 'couple_art_store', nameKey: 'frameModel_couple_art_store', description: 'a happy young couple in a bright, well-lit art supply store, holding up the frame together' },
];

export const MUG_STYLES: {id: MugStyle, nameKey: string}[] = [
    { id: 'classic_ceramic', nameKey: 'mugStyle_classic_ceramic' },
    { id: 'modern_glass', nameKey: 'mugStyle_modern_glass' },
    { id: 'vintage_enamel', nameKey: 'mugStyle_vintage_enamel' },
];

export const MUG_MODELS: {id: MugModel, nameKey: string, description: string}[] = [
    { id: 'woman_cafe', nameKey: 'mugModel_woman_cafe', description: 'a woman sitting in a picturesque European-style cafe, smiling while wearing elegant clothing and holding the mug' },
    { id: 'man_office', nameKey: 'mugModel_man_office', description: 'a man in a modern office, holding the mug during a break' },
    { id: 'person_cozy_home', nameKey: 'mugModel_person_cozy_home', description: 'a person in a cozy, hygge-style living room, relaxing with the mug' },
];

export const SIPPER_GLASS_STYLES: {id: SipperGlassStyle, nameKey: string}[] = [
    { id: 'classic_can_shape', nameKey: 'sipperGlassStyle_classic_can_shape' },
    { id: 'modern_tapered', nameKey: 'sipperGlassStyle_modern_tapered' },
    { id: 'frosted_finish', nameKey: 'sipperGlassStyle_frosted_finish' },
];

export const SIPPER_GLASS_MODELS: {id: SipperGlassModel, nameKey: string, description: string}[] = [
    { id: 'woman_cafe_elegant', nameKey: 'sipperGlassModel_woman_cafe_elegant', description: 'a young woman sitting in a cafe on a European or historical street, smiling and wearing elegant clothes, holding the sipper glass with a beverage inside' },
    { id: 'man_modern_kitchen', nameKey: 'sipperGlassModel_man_modern_kitchen', description: 'a man in a bright, modern kitchen, holding the sipper glass with a beverage inside' },
    { id: 'person_outdoor_patio', nameKey: 'sipperGlassModel_person_outdoor_patio', description: 'a person relaxing on a sunny outdoor patio, holding the sipper glass with a beverage inside' },
];

export const TUMBLER_STYLES: {id: TumblerStyle, nameKey: string}[] = [
    { id: 'stainless_steel', nameKey: 'tumblerStyle_stainless_steel' },
    { id: 'matte_finish', nameKey: 'tumblerStyle_matte_finish' },
    { id: 'glossy_white', nameKey: 'tumblerStyle_glossy_white' },
];

export const TUMBLER_MODELS: {id: TumblerModel, nameKey: string, description: string}[] = [
    { id: 'person_gym', nameKey: 'tumblerModel_person_gym', description: 'an athletic person at a modern gym, holding the tumbler' },
    { id: 'hiker_trail', nameKey: 'tumblerModel_hiker_trail', description: 'a hiker resting on a scenic mountain trail, holding the tumbler' },
    { id: 'student_desk', nameKey: 'tumblerModel_student_desk', description: 'a student studying at a desk in a well-lit room, with the tumbler nearby' },
];

export const HALLOWEEN_TUMBLER_STYLES: {id: HalloweenTumblerStyle, nameKey: string}[] = [
    { id: 'glossy_black', nameKey: 'halloweenTumblerStyle_glossy_black' },
    { id: 'matte_black', nameKey: 'halloweenTumblerStyle_matte_black' },
    { id: 'stainless_steel', nameKey: 'halloweenTumblerStyle_stainless_steel' },
];

export const HALLOWEEN_TUMBLER_SETTINGS: {id: HalloweenTumblerSetting, nameKey: string, description: string}[] = [
    { id: 'spooky_table', nameKey: 'halloweenTumblerSetting_spooky_table', description: 'a festive Halloween scene on a wooden table, with out-of-focus pumpkins, candy corn, and spooky string lights in the background' },
    { id: 'haunted_house', nameKey: 'halloweenTumblerSetting_haunted_house', description: 'a moody, atmospheric setting in front of a slightly blurred, spooky haunted house at dusk' },
    { id: 'witchs_cauldron', nameKey: 'halloweenTumblerSetting_witchs_cauldron', description: 'a magical setting next to a bubbling witch\'s cauldron with glowing green smoke and potion ingredients scattered around' },
    { id: 'autumn_porch', nameKey: 'halloweenTumblerSetting_autumn_porch', description: 'a cozy autumn scene on a porch, surrounded by fall leaves, mums, and rustic decorations' },
];

export const TUMBLER_TRIO_STYLES: {id: TumblerTrioStyle, nameKey: string}[] = [
    { id: 'glossy_white', nameKey: 'tumblerTrioStyle_glossy_white' },
    { id: 'matte_white', nameKey: 'tumblerTrioStyle_matte_white' },
    { id: 'stainless_steel', nameKey: 'tumblerTrioStyle_stainless_steel' },
];

export const TUMBLER_TRIO_SETTINGS: {id: TumblerTrioSetting, nameKey: string, description: string}[] = [
    { id: 'marble_countertop', nameKey: 'tumblerTrioSetting_marble_countertop', description: 'a clean, bright white marble countertop with soft, out-of-focus kitchen background elements' },
    { id: 'light_wood', nameKey: 'tumblerTrioSetting_light_wood', description: 'a light-colored wooden table with a soft, warm, and slightly blurred background' },
    { id: 'minimalist_shelf', nameKey: 'tumblerTrioSetting_minimalist_shelf', description: 'a simple, floating minimalist shelf against a plain, neutral-colored wall' },
];

export const ENGRAVING_MATERIALS: {id: EngravingMaterial, nameKey: string}[] = [
    { id: 'wood_plaque', nameKey: 'engravingMaterial_wood_plaque' },
    { id: 'slate_coaster', nameKey: 'engravingMaterial_slate_coaster' },
    { id: 'metal_card', nameKey: 'engravingMaterial_metal_card' },
];

export const PHONE_CASE_STYLES: {id: PhoneCaseStyle, nameKey: string}[] = [
    { id: 'glossy', nameKey: 'phoneCaseStyle_glossy' },
    { id: 'matte', nameKey: 'phoneCaseStyle_matte' },
    { id: 'clear', nameKey: 'phoneCaseStyle_clear' },
];

export const PHONE_CASE_MODELS: {id: PhoneCaseModel, nameKey: string, description: string}[] = [
    { id: 'person_holding', nameKey: 'phoneCaseModel_person_holding', description: 'a person with natural-looking hands holding a modern smartphone, showcasing the case' },
    { id: 'on_desk', nameKey: 'phoneCaseModel_on_desk', description: 'a modern smartphone in a case, placed on a stylish desk next to a laptop and a coffee mug, with a blurred background' },
    { id: 'flat_lay', nameKey: 'phoneCaseModel_flat_lay', description: 'a flat lay photo of a modern smartphone in a case on a clean, minimalist background' },
];

export const STICKER_STYLES: {id: StickerStyle, nameKey: string}[] = [
    { id: 'die_cut_glossy', nameKey: 'stickerStyle_die_cut_glossy' },
    { id: 'kiss_cut_matte', nameKey: 'stickerStyle_kiss_cut_matte' },
    { id: 'holographic', nameKey: 'stickerStyle_holographic' },
];

export const STICKER_SETTINGS: {id: StickerSetting, nameKey: string, description: string}[] = [
    { id: 'on_laptop', nameKey: 'stickerSetting_on_laptop', description: 'a sticker placed on the corner of a modern laptop with a blurred background' },
    { id: 'on_water_bottle', nameKey: 'stickerSetting_on_water_bottle', description: 'a sticker placed on a sleek, modern water bottle' },
    { id: 'on_notebook', nameKey: 'stickerSetting_on_notebook', description: 'a sticker placed on the cover of a minimalist notebook or journal' },
];

export const POSTER_STYLES: {id: PosterStyle, nameKey: string}[] = [
    { id: 'glossy_finish', nameKey: 'posterStyle_glossy_finish' },
    { id: 'matte_finish', nameKey: 'posterStyle_matte_finish' },
];

export const POSTER_SETTINGS: {id: PosterSetting, nameKey: string, description: string}[] = [
    { id: 'framed_on_wall', nameKey: 'posterSetting_framed_on_wall', description: 'a poster in a simple, modern frame hanging on a well-lit wall in a stylish room' },
    { id: 'person_holding', nameKey: 'posterSetting_person_holding', description: 'a person with natural-looking hands holding up a poster, with a blurred, neutral background' },
    { id: 'taped_on_brick_wall', nameKey: 'posterSetting_taped_on_brick_wall', description: 'a poster casually taped to an urban-style exposed brick wall' },
];

export const WALLET_STYLES: {id: WalletStyle, nameKey: string}[] = [
    { id: 'bifold', nameKey: 'walletStyle_bifold' },
    { id: 'cardholder', nameKey: 'walletStyle_cardholder' },
    { id: 'zipper', nameKey: 'walletStyle_zipper' },
];

export const WALLET_MODELS: {id: WalletModel, nameKey: string, description: string}[] = [
    { id: 'person_holding', nameKey: 'walletModel_person_holding', description: 'a person with well-manicured hands holding a modern leather wallet, showcasing the front' },
    { id: 'flat_lay_desk', nameKey: 'walletModel_flat_lay_desk', description: 'a flat lay photo of a modern leather wallet on a stylish desk next to a pen and notebook, with a blurred background' },
    { id: 'in_pocket', nameKey: 'walletModel_in_pocket', description: 'a modern leather wallet peeking out of the back pocket of a pair of stylish jeans' },
];

export const CAP_STYLES: {id: CapStyle, nameKey: string}[] = [
    { id: 'structured_baseball', nameKey: 'capStyle_structured_baseball' },
    { id: 'unstructured_dad_hat', nameKey: 'capStyle_unstructured_dad_hat' },
    { id: 'snapback', nameKey: 'capStyle_snapback' },
];

export const CAP_MODELS: {id: CapModel, nameKey: string, description: string}[] = [
    { id: 'person_forwards', nameKey: 'capModel_person_forwards', description: 'a lifelike model wearing the cap forwards' },
    { id: 'person_backwards', nameKey: 'capModel_person_backwards', description: 'a lifelike model wearing the cap backwards' },
    { id: 'flat_lay', nameKey: 'capModel_flat_lay', description: 'a flat lay photo of the cap on a clean, minimalist surface' },
];

export const PILLOW_STYLES: {id: PillowStyle, nameKey: string}[] = [
    { id: 'square_cotton', nameKey: 'pillowStyle_square_cotton' },
    { id: 'lumbar_linen', nameKey: 'pillowStyle_lumbar_linen' },
    { id: 'round_velvet', nameKey: 'pillowStyle_round_velvet' },
];

export const PILLOW_SETTINGS: {id: PillowSetting, nameKey: string, description: string}[] = [
    { id: 'on_sofa', nameKey: 'pillowSetting_on_sofa', description: 'a stylish, modern sofa in a well-lit living room' },
    { id: 'on_bed', nameKey: 'pillowSetting_on_bed', description: 'a neatly made bed with plush duvets in a cozy bedroom' },
    { id: 'on_armchair', nameKey: 'pillowSetting_on_armchair', description: 'a comfortable armchair in a reading nook' },
];

export const FLAT_LAY_STYLES: {id: FlatLayStyle, nameKey: string, description: string}[] = [
    { id: 'minimalist_neutral', nameKey: 'flatLayStyle_minimalist_neutral', description: 'a clean, minimalist flat lay on a neutral background (like light gray concrete or a white wooden surface), with simple, elegant accessories like a pair of sunglasses, a watch, and a small plant.' },
    { id: 'rustic_outdoors', nameKey: 'flatLayStyle_rustic_outdoors', description: 'a rustic, outdoors-themed flat lay on a dark wood or slate background, surrounded by items like hiking boots, a compass, a leather-bound journal, and some pine cones.' },
    { id: 'urban_streetwear', nameKey: 'flatLayStyle_urban_streetwear', description: 'an urban streetwear flat lay on a concrete or asphalt background, accompanied by accessories like trendy sneakers, a beanie, headphones, and a skateboard deck.' },
    { id: 'cozy_autumn', nameKey: 'flatLayStyle_cozy_autumn', description: 'a cozy autumn-themed flat lay on a warm-toned wooden surface, featuring items like a knitted scarf, a steaming mug of coffee, fall leaves, and a book.' },
    { id: 'beach_vacation', nameKey: 'flatLayStyle_beach_vacation', description: 'a bright, beach vacation-themed flat lay on a sandy background, with accessories like sandals, a straw hat, seashells, and a pair of sunglasses.' },
    { id: 'tech_office', nameKey: 'flatLayStyle_tech_office', description: 'a modern tech office flat lay on a clean desk mat, featuring a sleek wireless keyboard, a minimalist mouse, a tablet, and a cup of black coffee.' },
    { id: 'feminine_elegance', nameKey: 'flatLayStyle_feminine_elegance', description: 'an elegant, feminine flat lay on a marble surface, with delicate gold jewelry, a silk scarf, a high-fashion magazine, and a single peony.' },
    { id: 'dark_academia', nameKey: 'flatLayStyle_dark_academia', description: 'a "dark academia" themed flat lay on a dark mahogany wood surface, with vintage hardcover books, a fountain pen, a magnifying glass, and a pair of classic spectacles.' },
    { id: 'boho_chic', nameKey: 'flatLayStyle_boho_chic', description: 'a "boho chic" flat lay on a woven rattan placemat, featuring dried pampas grass, healing crystals, a scented candle, and a piece of macrame.' },
    { id: 'adventure_travel', nameKey: 'flatLayStyle_adventure_travel', description: 'an adventure travel themed flat lay on a vintage world map, with a leather passport holder, a brass compass, a classic film camera, and a pair of hiking boots.' },
];

export const PUZZLE_STYLES: {id: PuzzleStyle, nameKey: string}[] = [
    { id: 'rectangle_cardboard', nameKey: 'puzzleStyle_rectangle_cardboard' },
    { id: 'heart_shaped_wood', nameKey: 'puzzleStyle_heart_shaped_wood' },
];

export const PUZZLE_SETTINGS: {id: PuzzleSetting, nameKey: string, description: string}[] = [
    { id: 'on_wooden_table', nameKey: 'puzzleSetting_on_wooden_table', description: 'a blank jigsaw puzzle on a rustic wooden table with soft, warm lighting and a blurred background' },
    { id: 'family_playing', nameKey: 'puzzleSetting_family_playing', description: 'the hands of a family gathered around a table, about to start working on the blank jigsaw puzzle, with a cozy home background' },
    { id: 'flat_lay_minimalist', nameKey: 'puzzleSetting_flat_lay_minimalist', description: 'a flat lay of the blank jigsaw puzzle on a clean, minimalist neutral-colored surface' },
];


export const DESIGN_STYLES: {id: DesignStyle, nameKey: string}[] = [
    { id: 'classic', nameKey: 'designStyle_classic' },
    { id: 'split', nameKey: 'designStyle_split' },
    { id: 'sketch', nameKey: 'designStyle_sketch' },
    { id: 'slasher', nameKey: 'designStyle_slasher' },
    { id: 'vintage_stamp', nameKey: 'designStyle_vintage_stamp' },
    { id: 'retro_wave', nameKey: 'designStyle_retro_wave' },
    { id: 'minimalist_line', nameKey: 'designStyle_minimalist_line' },
    { id: 'grunge_overlay', nameKey: 'designStyle_grunge_overlay' },
    { id: 'stacked_text', nameKey: 'designStyle_stacked_text' },
    { id: 'emblem', nameKey: 'designStyle_emblem' },
    { id: 'photo_text', nameKey: 'designStyle_photo_text' },
    { id: 'cyberpunk_glitch', nameKey: 'designStyle_cyberpunk_glitch' },
    { id: 'full_wrap', nameKey: 'designStyle_full_wrap' },
    { id: 'full_front', nameKey: 'designStyle_full_front' },
    { id: 'american_traditional_tattoo', nameKey: 'designStyle_american_traditional_tattoo' },
    { id: 'watercolor_splash', nameKey: 'designStyle_watercolor_splash' },
    { id: 'art_deco', nameKey: 'designStyle_art_deco' },
    { id: 'pop_art', nameKey: 'designStyle_pop_art' },
    { id: 'cosmic_galaxy', nameKey: 'designStyle_cosmic_galaxy' },
    { id: 'japanese_ukiyo-e', nameKey: 'designStyle_japanese_ukiyo_e' },
    { id: 'distressed_vintage', nameKey: 'designStyle_distressed_vintage' },
    { id: 'typography_focus', nameKey: 'designStyle_typography_focus' },
    { id: 'abstract_geometric', nameKey: 'designStyle_abstract_geometric' },
    { id: 'vintage_poster', nameKey: 'designStyle_vintage_poster' },
    { id: 'geometric_pattern', nameKey: 'designStyle_geometric_pattern' },
    { id: 'hand_drawn_sketch', nameKey: 'designStyle_hand_drawn_sketch' },
];

export const TEXT_STYLES: {id: TextStyle, nameKey: string}[] = [
    { id: 'none', nameKey: 'textStyle_none' },
    { id: 'outline', nameKey: 'textStyle_outline' },
    { id: 'shadow', nameKey: 'textStyle_shadow' },
    { id: 'glow', nameKey: 'textStyle_glow' },
    { id: 'neon', nameKey: 'textStyle_neon' },
    { id: '3d', nameKey: 'textStyle_3d' },
    { id: 'metallic', nameKey: 'textStyle_metallic' },
    { id: 'chrome', nameKey: 'textStyle_chrome' },
    { id: 'gradient', nameKey: 'textStyle_gradient' },
    { id: 'pastel_rainbow', nameKey: 'textStyle_pastel_rainbow' },
    { id: 'distressed', nameKey: 'textStyle_distressed' },
    { id: 'fire', nameKey: 'textStyle_fire' },
    { id: 'ice', nameKey: 'textStyle_ice' },
    { id: 'wooden', nameKey: 'textStyle_wooden' },
    { id: 'comic', nameKey: 'textStyle_comic' },
    { id: 'glitch', nameKey: 'textStyle_glitch' },
    { id: 'script', nameKey: 'textStyle_script' },
    { id: 'varsity', nameKey: 'textStyle_varsity' },
];

export const MODEL_POSES: {id: ModelPose, nameKey: string}[] = [
    { id: 'flat_lay_simple', nameKey: 'modelPose_flat_lay_simple' },
    { id: 'standing', nameKey: 'modelPose_standing' },
    { id: 'closeup_casual', nameKey: 'modelPose_closeup_casual' },
    { id: 'professional_office_standing', nameKey: 'modelPose_professional_office_standing' },
    { id: 'urban_professional_walking', nameKey: 'modelPose_urban_professional_walking' },
    { id: 'art_gallery_viewing', nameKey: 'modelPose_art_gallery_viewing' },
    { id: 'creative_studio_loft', nameKey: 'modelPose_creative_studio_loft' },
    { id: 'coffee_shop_thoughtful', nameKey: 'modelPose_coffee_shop_thoughtful' },
    { id: 'mountain_summit_view', nameKey: 'modelPose_mountain_summit_view' },
    { id: 'beach_sunset_walk', nameKey: 'modelPose_beach_sunset_walk' },
    { id: 'forest_trail_hike', nameKey: 'modelPose_forest_trail_hike' },
    { id: 'rooftop_city_dusk', nameKey: 'modelPose_rooftop_city_dusk' },
    { id: 'neon_urban_night', nameKey: 'modelPose_neon_urban_night' },
    { id: 'geometric_abstract_background', nameKey: 'modelPose_geometric_abstract_background' },
    { id: 'sitting', nameKey: 'modelPose_sitting' },
    { id: 'sitting_floor_cozy', nameKey: 'modelPose_sitting_floor_cozy' },
    { id: 'sitting_hand_hip', nameKey: 'modelPose_sitting_hand_hip' },
    { id: 'sitting_on_counter', nameKey: 'modelPose_sitting_on_counter' },
    { id: 'recumbent', nameKey: 'modelPose_recumbent' },
    { id: 'smiling_glasses', nameKey: 'modelPose_smiling_glasses' },
    { id: 'back', nameKey: 'modelPose_back' },
    { id: 'drinking_tea', nameKey: 'modelPose_drinking_tea' },
    { id: 'jumping', nameKey: 'modelPose_jumping' },
    { id: 'dancing', nameKey: 'modelPose_dancing' },
    { id: 'meditating', nameKey: 'modelPose_meditating' },
    { id: 'heroic', nameKey: 'modelPose_heroic' },
    { id: 'action', nameKey: 'modelPose_action' },
    { id: 'yoga', nameKey: 'modelPose_yoga' },
    { id: 'casual_lean', nameKey: 'modelPose_casual_lean' },
    { id: 'walking_street', nameKey: 'modelPose_walking_street' },
    { id: 'laughing', nameKey: 'modelPose_laughing' },
    { id: 'arms_crossed', nameKey: 'modelPose_arms_crossed' },
    { id: 'thinking', nameKey: 'modelPose_thinking' },
    { id: 'hands_in_pockets', nameKey: 'modelPose_hands_in_pockets' },
    { id: 'leaning_against_railing', nameKey: 'modelPose_leaning_against_railing' },
    { id: 'looking_over_shoulder', nameKey: 'modelPose_looking_over_shoulder' },
    { id: 'running_action_shot', nameKey: 'modelPose_running_action_shot' },
    { id: 'adjusting_cuff', nameKey: 'modelPose_adjusting_cuff' },
    { id: 'hands_on_hips_confident', nameKey: 'modelPose_hands_on_hips_confident' },
    { id: 'celebrating_excited', nameKey: 'modelPose_celebrating_excited' },
];

export const MODEL_AUDIENCES: {id: ModelAudience, nameKey: string, description: string}[] = [
    // Female Models
    { id: 'teenager_female_skater', nameKey: 'modelAudience_teenager_female_skater', description: 'a female teenager with a cool skater style' },
    { id: 'woman_20s_barista', nameKey: 'modelAudience_woman_20s_barista', description: 'a young woman with a friendly barista style, perhaps with an apron' },
    { id: 'woman_20s_urban_fashion', nameKey: 'modelAudience_woman_20s_urban_fashion', description: 'a young woman in trendy, stylish urban fashion' },
    { id: 'woman_20s_athletic', nameKey: 'modelAudience_woman_20s_athletic', description: 'a woman with an athletic build, in sporty-casual clothing' },
    { id: 'woman_30s_casual', nameKey: 'modelAudience_woman_30s_casual', description: 'a woman with a relaxed and casual style' },
    { id: 'woman_30s_yogi', nameKey: 'modelAudience_woman_30s_yogi', description: 'a woman in comfortable activewear, with a calm and serene yogi vibe' },
    { id: 'woman_30s_plus_size_confident', nameKey: 'modelAudience_woman_30s_plus_size_confident', description: 'a confident and happy plus-size woman with a stylish, modern look' },
    { id: 'woman_40s_professional', nameKey: 'modelAudience_woman_40s_professional', description: 'a woman with a sharp, professional appearance' },
    { id: 'middle_aged_woman_artist', nameKey: 'modelAudience_middle_aged_woman_artist', description: 'a middle-aged woman with an artistic and creative style' },
    { id: 'woman_40s_edgy_tattoos', nameKey: 'modelAudience_woman_40s_edgy_tattoos', description: 'a stylish middle-aged woman with visible artistic tattoos on her arms' },
    { id: 'woman_50s_elegant', nameKey: 'modelAudience_woman_50s_elegant', description: 'an elegant and sophisticated woman' },
    { id: 'woman_50s_traveler', nameKey: 'modelAudience_woman_50s_traveler', description: 'an energetic, mature woman dressed for travel, perhaps with a camera' },
    { id: 'elderly_woman_gardener', nameKey: 'modelAudience_elderly_woman_gardener', description: 'an elderly woman with a warm smile, dressed for gardening' },
    { id: 'elderly_woman_baker', nameKey: 'modelAudience_elderly_woman_baker', description: 'a kind, grandmotherly woman in an apron, looking like she just finished baking' },
    
    // Male Models
    { id: 'teenager_male_gamer', nameKey: 'modelAudience_teenager_male_gamer', description: 'a male teenager with a gamer style, perhaps wearing headphones around his neck' },
    { id: 'man_20s_student', nameKey: 'modelAudience_man_20s_student', description: 'a young man with a student style' },
    { id: 'young_man_musician', nameKey: 'modelAudience_young_man_musician', description: 'a young man with a creative, musician-like appearance' },
    { id: 'man_30s_creative', nameKey: 'modelAudience_man_30s_creative', description: 'a creative professional man' },
    { id: 'man_40s_business', nameKey: 'modelAudience_man_40s_business', description: 'a man in business-casual style' },
    { id: 'man_50s_distinguished', nameKey: 'modelAudience_man_50s_distinguished', description: 'a distinguished-looking man' },
];

export const TSHIRT_FONTS: {id: TshirtFont, name: string}[] = [
    { id: 'anton', name: 'Anton' },
    { id: 'archivo_black', name: 'Archivo Black' },
    { id: 'bangers', name: 'Bangers' },
    { id: 'bebas_neue', name: 'Bebas Neue' },
    { id: 'caveat', name: 'Caveat' },
    { id: 'creepster', name: 'Creepster' },
    { id: 'dancing_script', name: 'Dancing Script' },
    { id: 'impact', name: 'Impact' },
    { id: 'lato', name: 'Lato' },
    { id: 'lobster', name: 'Lobster' },
    { id: 'merriweather', name: 'Merriweather' },
    { id: 'monoton', name: 'Monoton' },
    { id: 'montserrat', name: 'Montserrat' },
    { id: 'nosifier', name: 'Nosifier' },
    { id: 'oswald', name: 'Oswald' },
    { id: 'pacifico', name: 'Pacifico' },
    { id: 'permanent_marker', name: 'Permanent Marker' },
    { id: 'playfair_display', name: 'Playfair Display' },
    { id: 'poppins', name: 'Poppins' },
    { id: 'press_start_2p', name: 'Press Start 2P' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'rock_salt', name: 'Rock Salt' },
    { id: 'special_elite', name: 'Special Elite' },
    { id: 'zilla_slab', name: 'Zilla Slab' },
];


// This is a placeholder for a base image of a model wearing a t-shirt.
// In a real application, you would use a high-quality image.
// For this example, we will ask the AI to generate the model too.
export const BASE_MODEL_IMAGE_B64 = ''; // We will generate the model instead of editing a base image.