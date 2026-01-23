"use client";

type AnimatedButtonProps = {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export default function AnimatedButton({
  text,
  href = "#",
  onClick,
  className = "",
}: AnimatedButtonProps) {
  const Element = href ? "a" : "button";

  return (
    <Element
      href={href}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold text-white rounded-md shadow-2xl group ${className}`}
    >
      {/* Hover gradient */}
      <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100" />

      {/* Glass shine layers */}
      <span className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white to-transparent opacity-5" />
      <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5" />
      <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5" />
      <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5" />

      {/* Border */}
      <span className="absolute inset-0 border border-white/10 rounded-md" />

      {/* Ripple glow */}
      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5" />

      {/* Text */}
      <span className="relative z-10">{text}</span>
    </Element>
  );
}
