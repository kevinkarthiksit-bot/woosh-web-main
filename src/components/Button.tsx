"use client";

type ButtonProps = {
  text: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  text,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ${className}`}
    >
      {text}
    </button>
  );
}