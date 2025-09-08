// FIX: Add missing React import to resolve "Cannot find namespace 'React'" error.
import React from 'react';

export type DesignStyle = 'classic' | 'split' | 'sketch' | 'slasher' | 'vintage_stamp' | 'retro_wave' | 'minimalist_line' | 'grunge_overlay' | 'full_wrap' | 'full_front' | 'cyberpunk_glitch' | 'stacked_text' | 'emblem' | 'photo_text' | 'american_traditional_tattoo' | 'watercolor_splash' | 'art_deco' | 'pop_art' | 'cosmic_galaxy' | 'japanese_ukiyo-e' | 'distressed_vintage' | 'typography_focus' | 'abstract_geometric' | 'vintage_poster' | 'geometric_pattern' | 'hand_drawn_sketch';
export type ModelPose = 'flat_lay_simple' | 'standing' | 'sitting' | 'sitting_floor_cozy' | 'recumbent' | 'smiling_glasses' | 'back' | 'drinking_tea' | 'jumping' | 'dancing' | 'meditating' | 'heroic' | 'action' | 'yoga' | 'casual_lean' | 'walking_street' | 'laughing' | 'arms_crossed' | 'thinking' | 'hands_in_pockets' | 'closeup_casual' | 'sitting_hand_hip' | 'sitting_on_counter' | 'leaning_against_railing' | 'looking_over_shoulder' | 'running_action_shot' | 'adjusting_cuff' | 'hands_on_hips_confident' | 'celebrating_excited';
export type ModelAudience = 
  // Female
  'teenager_female_skater' |
  'woman_20s_athletic' | 'woman_20s_urban_fashion' | 'woman_20s_barista' |
  'woman_30s_casual' | 'woman_30s_yogi' | 'woman_30s_plus_size_confident' |
  'woman_40s_professional' | 'woman_40s_edgy_tattoos' | 'middle_aged_woman_artist' |
  'woman_50s_elegant' | 'woman_50s_traveler' |
  'elderly_woman_gardener' | 'elderly_woman_baker' |
  // Male
  'teenager_male_gamer' |
  'man_20s_student' | 'young_man_musician' |
  'man_30s_creative' |
  'man_40s_business' |
  'man_50s_distinguished';

export type TshirtFont = 'impact' | 'bebas_neue' | 'lobster' | 'montserrat' | 'oswald' | 'anton' | 'archivo_black' | 'pacifico' | 'bangers' | 'permanent_marker' | 'roboto' | 'playfair_display' | 'creepster' | 'nosifier' | 'merriweather' | 'lato' | 'poppins' | 'zilla_slab' | 'caveat' | 'dancing_script' | 'rock_salt' | 'special_elite' | 'press_start_2p' | 'monoton';

// New types
export type ProductType = 'tshirt' | 'sweatshirt' | 'hoodie' | 'bag' | 'wooden_frame' | 'tea_mug' | 'sipper_glass' | 'tumbler_wrap' | 'halloween_tumbler' | 'tumbler_trio' | 'laser_engraving' | 'phone_case' | 'sticker' | 'poster' | 'wallet' | 'cap' | 'pillow' | 'flat_lay' | 'jigsaw_puzzle';
export type BagMaterial = 'canvas' | 'leather' | 'nylon' | 'denim';
export type TextStyle = 'none' | 'outline' | 'shadow' | 'glow' | '3d' | 'metallic' | 'gradient' | 'distressed' | 'fire' | 'comic' | 'glitch' | 'pastel_rainbow' | 'neon' | 'chrome' | 'ice' | 'wooden' | 'script' | 'varsity';
export type FrameStyle = 'classic_ornate' | 'modern_minimalist' | 'rustic_barnwood' | 'modern_mahogany';
export type FrameModel = 'elegant_woman_street' | 'art_curator_gallery' | 'craftsman_workshop' | 'man_modern_loft' | 'woman_cozy_living_room' | 'couple_art_store';
export type MugStyle = 'classic_ceramic' | 'modern_glass' | 'vintage_enamel';
export type MugModel = 'woman_cafe' | 'man_office' | 'person_cozy_home';
export type SipperGlassStyle = 'classic_can_shape' | 'modern_tapered' | 'frosted_finish';
export type SipperGlassModel = 'woman_cafe_elegant' | 'man_modern_kitchen' | 'person_outdoor_patio';
export type TumblerStyle = 'stainless_steel' | 'matte_finish' | 'glossy_white';
export type TumblerModel = 'person_gym' | 'hiker_trail' | 'student_desk';
export type HalloweenTumblerStyle = 'glossy_black' | 'matte_black' | 'stainless_steel';
export type HalloweenTumblerSetting = 'spooky_table' | 'haunted_house' | 'witchs_cauldron' | 'autumn_porch';
export type TumblerTrioStyle = 'glossy_white' | 'matte_white' | 'stainless_steel';
export type TumblerTrioSetting = 'marble_countertop' | 'light_wood' | 'minimalist_shelf';
export type EngravingMaterial = 'wood_plaque' | 'slate_coaster' | 'metal_card';

// Phone Case Types
export type PhoneCaseStyle = 'glossy' | 'matte' | 'clear';
export type PhoneCaseModel = 'person_holding' | 'on_desk' | 'flat_lay';
// Sticker Types
export type StickerStyle = 'die_cut_glossy' | 'kiss_cut_matte' | 'holographic';
export type StickerSetting = 'on_laptop' | 'on_water_bottle' | 'on_notebook';
// Poster Types
export type PosterStyle = 'glossy_finish' | 'matte_finish';
export type PosterSetting = 'framed_on_wall' | 'person_holding' | 'taped_on_brick_wall';
// Wallet Types
export type WalletStyle = 'bifold' | 'cardholder' | 'zipper';
export type WalletModel = 'person_holding' | 'flat_lay_desk' | 'in_pocket';
// Cap Types
export type CapStyle = 'structured_baseball' | 'unstructured_dad_hat' | 'snapback';
export type CapModel = 'person_forwards' | 'person_backwards' | 'flat_lay';
// Pillow Types
export type PillowStyle = 'square_cotton' | 'lumbar_linen' | 'round_velvet';
export type PillowSetting = 'on_sofa' | 'on_bed' | 'on_armchair';
// Flat Lay Types
export type FlatLayStyle = 'minimalist_neutral' | 'rustic_outdoors' | 'urban_streetwear' | 'cozy_autumn' | 'beach_vacation';
// Jigsaw Puzzle Types
export type PuzzleStyle = 'rectangle_cardboard' | 'heart_shaped_wood';
export type PuzzleSetting = 'on_wooden_table' | 'family_playing' | 'flat_lay_minimalist';


export type ImageMode = 'fit' | 'fit_blur' | 'fit_transparent' | 'crop' | 'stretch';
export type AspectRatio = '1:1' | '16:9' | '9:16';


export interface DesignOptions {
  productType: ProductType;
  logo: string | null;
  text: string;
  productColor: string; // Renamed from tshirtColor
  textColor: string;
  font: TshirtFont;
  textStyle: TextStyle;
  gradientStartColor: string;
  gradientEndColor: string;
  aspectRatio: AspectRatio;
  
  // T-shirt specific
  style: DesignStyle;
  pose: ModelPose;
  audience: ModelAudience;

  // Bag specific
  bagMaterial: BagMaterial;

  // Frame specific
  frameStyle: FrameStyle;
  frameModel: FrameModel;

  // Mug specific
  mugStyle: MugStyle;
  mugModel: MugModel;

  // Sipper Glass specific
  sipperGlassStyle: SipperGlassStyle;
  sipperGlassModel: SipperGlassModel;

  // Tumbler Wrap specific
  tumblerStyle: TumblerStyle;
  tumblerModel: TumblerModel;

  // Halloween Tumbler specific
  halloweenTumblerStyle: HalloweenTumblerStyle;
  halloweenTumblerSetting: HalloweenTumblerSetting;

  // Tumbler Trio specific
  tumblerTrioStyle: TumblerTrioStyle;
  tumblerTrioSetting: TumblerTrioSetting;
  
  // Laser Engraving specific
  engravingMaterial: EngravingMaterial;

  // Phone Case specific
  phoneCaseStyle: PhoneCaseStyle;
  phoneCaseModel: PhoneCaseModel;

  // Sticker specific
  stickerStyle: StickerStyle;
  stickerSetting: StickerSetting;

  // Poster specific
  posterStyle: PosterStyle;
  posterSetting: PosterSetting;

  // Wallet specific
  walletStyle: WalletStyle;
  walletModel: WalletModel;

  // Cap specific
  capStyle: CapStyle;
  capModel: CapModel;

  // Pillow specific
  pillowStyle: PillowStyle;
  pillowSetting: PillowSetting;

  // Flat Lay specific
  flatLayStyle: FlatLayStyle;

  // Puzzle specific
  puzzleStyle: PuzzleStyle;
  puzzleSetting: PuzzleSetting;
}

export type SetDesignOptions = React.Dispatch<React.SetStateAction<DesignOptions>>;