"use client";

import { useRef, useState } from "react";

type RoleCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function RoleCard({
  icon,
  title,
  description,
}: RoleCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onFocus={() => {
        setIsFocused(true);
        setOpacity(1);
      }}
      onBlur={() => {
        setIsFocused(false);
        setOpacity(0);
      }}
      tabIndex={0}
      className="relative flex flex-col gap-5 overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-black to-gray-950 px-8 py-10 shadow-2xl"
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(
            520px circle at ${position.x}px ${position.y}px,
            rgba(120,119,198,0.18),
            transparent 40%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="text-3xl">{icon}</div>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-3 text-base md:text-lg font-medium text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
