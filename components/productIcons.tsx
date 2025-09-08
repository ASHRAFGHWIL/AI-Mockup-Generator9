import React from 'react';

const IconProps = {
  // Common props for all icons
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.5,
};

export const TshirtIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v1.5l-2.5 2.5V19.5h11V8.5L15 6V4.5h-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5a3 3 0 013-3 3 3 0 013 3" />
  </svg>
);

export const SweatshirtIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5A3.375 3.375 0 008.625 1.125 3.375 3.375 0 0012 4.5zm0 0A3.375 3.375 0 0115.375 1.125 3.375 3.375 0 0112 4.5zm0 0v1.5m0 0a3 3 0 013 3v2.25m-6 0V9a3 3 0 013-3m-3 9H3.75l1.5-1.5m9.75 1.5H20.25l-1.5-1.5M9 18h6v-3H9v3z" />
  </svg>
);

export const HoodieIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6v-3H9v3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75V9A3 3 0 0112 6v0a3 3 0 013 3v3.75m-6 0H3.75l1.5-1.5M15 12.75H20.25l-1.5-1.5m-3.75 0V9a2.25 2.25 0 00-4.5 0v3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V3.75A2.25 2.25 0 0114.25 6v0" />
  </svg>
);

export const BagIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m11.25 0H2.25l1.125 11.25H19.125l1.125-11.25z" />
  </svg>
);

export const WalletIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5H3a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 003 19.5h18a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0021 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 11.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01z" />
  </svg>
);

export const FrameIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5h16.5V3.75H3.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25v7.5h7.5v-7.5h-7.5z" />
  </svg>
);

export const MugIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5v6a3.75 3.75 0 01-3.75 3.75h-3.75a3.75 3.75 0 01-3.75-3.75v-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 00-3.75-3.75H8.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 9.75h.008v4.5h-.008v-4.5z" />
  </svg>
);

export const SipperGlassIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.25h10.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75h12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 19.5h12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v4.5" />
  </svg>
);

export const TumblerIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.25h10.5m-10.5 0L8.25 21.75h7.5L17.25 2.25" />
  </svg>
);

export const HalloweenTumblerIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.25h10.5m-10.5 0L8.25 21.75h7.5L17.25 2.25" />
    <path d="M10.5 12l-1.5 1.5 1.5 1.5" />
    <path d="M13.5 12l1.5 1.5-1.5 1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18a4.5 4.5 0 004.5 0" />
  </svg>
);

export const TumblerTrioIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 2.25h5m-5 0L5.25 21.75h2.5L9 2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2.25h5m-5 0L10.75 21.75h2.5L14.5 2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 2.25h5m-5 0L16.25 21.75h2.5L20 2.25" />
  </svg>
);

export const LaserIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 18h14M7 15h10m-8-4.5l-2-2m2 2l2-2m-2 2v-4m4 4l2-2m-2 2l-2-2m2 2v-4m2 0l-2 2" />
  </svg>
);

export const PhoneCaseIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.25A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5h7.5" />
  </svg>
);

export const StickerIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75l15 15m-15 0L12 3.75l7.5 7.5-15 15z" clipRule="evenodd" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A2.25 2.25 0 001.5 6.75v10.5c0 1.24 1.01 2.25 2.25 2.25h10.5A2.25 2.25 0 0019.5 17.25V6.75A2.25 2.25 0 0017.25 4.5H3.75zM19.5 4.5l-4.5 4.5H19.5V4.5z" />
  </svg>
);

export const PosterIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3h16.5v18H3.75V3zM9 7.5h6m-6 3.75h6m-6 3.75h3.75" />
  </svg>
);

export const CapIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a6 6 0 016 6v1.5H6v-1.5a6 6 0 016-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12a6 6 0 00-12 0h12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12.5a2.5 2.5 0 010 5H6" />
  </svg>
);

export const PillowIcon = ({ className }: { className?: string }) => (
  <svg {...IconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.25A4.5 4.5 0 0012 3.75 4.5 4.5 0 003.75 8.25" />
  </svg>
);

export const FlatLayIcon = ({ className }: { className?: string }) => (
    <svg {...IconProps} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75v1.5L6.75 9.75v6h10.5v-6L15.75 8.25v-1.5h-7.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75a3 3 0 013-3 3 3 0 013 3" />
    </svg>
  );

export const PuzzleIcon = ({ className }: { className?: string }) => (
    <svg {...IconProps} className={className} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75h3.375v3.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25h-3.375v-3.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.625 14.25v3.375h-3.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 9.75v-3.375h3.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5V4.5h15v15H4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5v4.5h-4.5z" />
    </svg>
);