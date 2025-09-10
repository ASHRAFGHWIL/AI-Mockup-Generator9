export type ProductType = 
  | 'tshirt' 
  | 'sweatshirt' 
  | 'hoodie' 
  | 'flat_lay'
  | 'bag' 
  | 'wallet'
  | 'cap'
  | 'pillow'
  | 'wooden_frame' 
  | 'tea_mug' 
  | 'sipper_glass' 
  | 'tumbler_wrap'
  | 'halloween_tumbler'
  | 'tumbler_trio'
  | 'laser_engraving' 
  | 'phone_case' 
  | 'sticker' 
  | 'poster'
  | 'jigsaw_puzzle';

export type BagMaterial = 'canvas' | 'leather' | 'nylon' | 'denim';
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
export type PhoneCaseStyle = 'glossy' | 'matte' | 'clear';
export type PhoneCaseModel = 'person_holding' | 'on_desk' | 'flat_lay';
export type StickerStyle = 'die_cut_glossy' | 'kiss_cut_matte' | 'holographic';
export type StickerSetting = 'on_laptop' | 'on_water_bottle' | 'on_notebook';
export type PosterStyle = 'glossy_finish' | 'matte_finish';
export type PosterSetting = 'framed_on_wall' | 'person_holding' | 'taped_on_brick_wall';
export type WalletStyle = 'bifold' | 'cardholder' | 'zipper';
export type WalletModel = 'person_holding' | 'flat_lay_desk' | 'in_pocket';
export type CapStyle = 'structured_baseball' | 'unstructured_dad_hat' | 'snapback';
export type CapModel = 'person_forwards' | 'person_backwards' | 'flat_lay';
export type PillowStyle = 'square_cotton' | 'lumbar_linen' | 'round_velvet';
export type PillowSetting = 'on_sofa' | 'on_bed' | 'on_armchair';
export type FlatLayStyle = 'minimalist_neutral' | 'rustic_outdoors' | 'urban_streetwear' | 'cozy_autumn' | 'beach_vacation' | 'tech_office' | 'feminine_elegance' | 'dark_academia' | 'boho_chic' | 'adventure_travel';
export type PuzzleStyle = 'rectangle_cardboard' | 'heart_shaped_wood';
export type PuzzleSetting = 'on_wooden_table' | 'family_playing' | 'flat_lay_minimalist';

export type DesignStyle = 
  | 'classic'
  | 'split'
  | 'sketch'
  | 'slasher'
  | 'vintage_stamp'
  | 'retro_wave'
  | 'minimalist_line'
  | 'grunge_overlay'
  | 'stacked_text'
  | 'emblem'
  | 'photo_text'
  | 'cyberpunk_glitch'
  | 'full_wrap'
  | 'full_front'
  | 'american_traditional_tattoo'
  | 'watercolor_splash'
  | 'art_deco'
  | 'pop_art'
  | 'cosmic_galaxy'
  | 'japanese_ukiyo-e'
  | 'distressed_vintage'
  | 'typography_focus'
  | 'abstract_geometric'
  | 'vintage_poster'
  | 'geometric_pattern'
  | 'hand_drawn_sketch';

export type TextStyle = 
  | 'none'
  | 'outline'
  | 'shadow'
  | 'glow'
  | 'neon'
  | '3d'
  | 'metallic'
  | 'chrome'
  | 'gradient'
  | 'pastel_rainbow'
  | 'distressed'
  | 'fire'
  | 'ice'
  | 'wooden'
  | 'comic'
  | 'glitch'
  | 'script'
  | 'varsity';

export type ModelPose =
  | 'flat_lay_simple'
  | 'standing'
  | 'closeup_casual'
  | 'professional_office_standing'
  | 'urban_professional_walking'
  | 'art_gallery_viewing'
  | 'creative_studio_loft'
  | 'coffee_shop_thoughtful'
  | 'mountain_summit_view'
  | 'beach_sunset_walk'
  | 'forest_trail_hike'
  | 'rooftop_city_dusk'
  | 'neon_urban_night'
  | 'geometric_abstract_background'
  | 'sitting'
  | 'sitting_floor_cozy'
  | 'sitting_hand_hip'
  | 'sitting_on_counter'
  | 'recumbent'
  | 'smiling_glasses'
  | 'back'
  | 'drinking_tea'
  | 'jumping'
  | 'dancing'
  | 'meditating'
  | 'heroic'
  | 'action'
  | 'yoga'
  | 'casual_lean'
  | 'walking_street'
  | 'laughing'
  | 'arms_crossed'
  | 'thinking'
  | 'hands_in_pockets'
  | 'leaning_against_railing'
  | 'looking_over_shoulder'
  | 'running_action_shot'
  | 'adjusting_cuff'
  | 'hands_on_hips_confident'
  | 'celebrating_excited';

export type ModelAudience = 
  | 'teenager_female_skater'
  | 'woman_20s_barista'
  | 'woman_20s_urban_fashion'
  | 'woman_20s_athletic'
  | 'woman_30s_casual'
  | 'woman_30s_yogi'
  | 'woman_30s_plus_size_confident'
  | 'woman_40s_professional'
  | 'middle_aged_woman_artist'
  | 'woman_40s_edgy_tattoos'
  | 'woman_50s_elegant'
  | 'woman_50s_traveler'
  | 'elderly_woman_gardener'
  | 'elderly_woman_baker'
  | 'teenager_male_gamer'
  | 'man_20s_student'
  | 'young_man_musician'
  | 'man_30s_creative'
  | 'man_40s_business'
  | 'man_50s_distinguished';
  
export type TshirtFont = 
  | 'anton'
  | 'archivo_black'
  | 'bangers'
  | 'bebas_neue'
  | 'caveat'
  | 'creepster'
  | 'dancing_script'
  | 'impact'
  | 'lato'
  | 'lobster'
  | 'merriweather'
  | 'monoton'
  | 'montserrat'
  | 'nosifier'
  | 'oswald'
  | 'pacifico'
  | 'permanent_marker'
  | 'playfair_display'
  | 'poppins'
  | 'press_start_2p'
  | 'roboto'
  | 'rock_salt'
  | 'special_elite'
  | 'zilla_slab';

export type ImageMode = 'fit' | 'fit_blur' | 'fit_transparent' | 'crop' | 'stretch';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
