import React from "react";

interface FloralCornerProps {
  className?: string;
  side: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const FloralCorner: React.FC<FloralCornerProps> = ({ className = "", side }) => {
  const rotationMap = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "rotate-270"
  };

  return (
    <div className={`absolute w-24 h-24 pointer-events-none ${rotationMap[side]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ornate corner with floral flourish */}
        <path
          d="M 10 10 Q 30 5, 50 10 Q 70 15, 90 10"
          stroke="#C5A059"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 10 10 Q 5, 30, 10 50 Q 15, 70, 10 90"
          stroke="#C5A059"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Small decorative flowers */}
        <circle cx="25" cy="25" r="3" fill="#C5A059" opacity="0.6" />
        <circle cx="25" cy="25" r="1.5" fill="#F3EBDD" />

        <circle cx="40" cy="15" r="2.5" fill="#C5A059" opacity="0.5" />
        <circle cx="40" cy="15" r="1" fill="#F3EBDD" />

        <circle cx="15" cy="40" r="2.5" fill="#C5A059" opacity="0.5" />
        <circle cx="15" cy="40" r="1" fill="#F3EBDD" />
      </svg>
    </div>
  );
};

interface FloralFlourishProps {
  className?: string;
  variant?: "horizontal" | "vertical";
}

export const FloralFlourish: React.FC<FloralFlourishProps> = ({
  className = "",
  variant = "horizontal"
}) => {
  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="w-0.5 h-3 bg-gradient-to-b from-transparent to-[#C5A059]" />
        <div className="w-6 h-6 relative">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Small floral flourish */}
            <circle cx="12" cy="12" r="2" fill="#C5A059" />
            <circle cx="12" cy="6" r="1.5" fill="#C5A059" opacity="0.7" />
            <circle cx="18" cy="12" r="1.5" fill="#C5A059" opacity="0.7" />
            <circle cx="12" cy="18" r="1.5" fill="#C5A059" opacity="0.7" />
            <circle cx="6" cy="12" r="1.5" fill="#C5A059" opacity="0.7" />
            <path
              d="M 12 6 Q 14 9 12 12 Q 10 9 12 6"
              fill="#C5A059"
              opacity="0.3"
            />
          </svg>
        </div>
        <div className="w-0.5 h-3 bg-gradient-to-t from-transparent to-[#C5A059]" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="flex-grow h-px bg-gradient-to-r from-transparent to-[#C5A059]" />
      <div className="w-8 h-6 relative flex-shrink-0">
        <svg viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Horizontal floral flourish */}
          <circle cx="16" cy="12" r="2.5" fill="#C5A059" />
          <circle cx="8" cy="12" r="2" fill="#C5A059" opacity="0.7" />
          <circle cx="24" cy="12" r="2" fill="#C5A059" opacity="0.7" />
          <circle cx="12" cy="6" r="1.5" fill="#C5A059" opacity="0.6" />
          <circle cx="20" cy="6" r="1.5" fill="#C5A059" opacity="0.6" />
          <circle cx="12" cy="18" r="1.5" fill="#C5A059" opacity="0.6" />
          <circle cx="20" cy="18" r="1.5" fill="#C5A059" opacity="0.6" />
          {/* Connecting flourish lines */}
          <path
            d="M 8 12 Q 12 8 16 12 Q 20 8 24 12"
            stroke="#C5A059"
            strokeWidth="0.8"
            opacity="0.3"
            fill="none"
          />
        </svg>
      </div>
      <div className="flex-grow h-px bg-gradient-to-l from-transparent to-[#C5A059]" />
    </div>
  );
};

interface StationeryFrameProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "simple" | "ornate";
}

export const StationeryFrame: React.FC<StationeryFrameProps> = ({
  children,
  className = "",
  variant = "simple"
}) => {
  return (
    <div
      className={`relative bg-[#FCFAF6] border-2 p-6 ${
        variant === "ornate"
          ? "border-double border-[#C5A059]"
          : "border-[#F3EBDD]"
      } ${className}`}
    >
      {variant === "ornate" && (
        <>
          {/* Decorative corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]" />
        </>
      )}
      {children}
    </div>
  );
};
