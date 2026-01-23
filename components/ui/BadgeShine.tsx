"use client";

type BadgeShineProps = {
  text: string;
  className?: string;
};

export default function BadgeShine({ text, className = "" }: BadgeShineProps) {
  return (
    <span
      className={`inline-flex items-center justify-center cursor-pointer rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300 animate-background-shine ${className}`}
    >
      {text}
    </span>
  );
}
