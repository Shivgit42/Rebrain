import type { ReactElement } from "react";

type Variants = "primary" | "secondary";

interface ButtonProps {
  variant: Variants;
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary:
    "bg-[#5046e4] text-white hover:bg-[#3f3ac0] disabled:bg-[#5046e4]/70",
  secondary:
    "bg-[#e0e7ff] text-[#6861d6] hover:bg-[#d5dbff] disabled:bg-[#e0e7ff]/60",
};

const defaultStyles =
  "px-4 py-2.5 rounded-md font-normal flex items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer";

export const Button = ({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth = false,
  loading = false,
}: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`
        ${variantStyles[variant]}
        ${defaultStyles}
        ${fullWidth ? "w-full" : ""}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {startIcon && !loading && <div className="pr-2">{startIcon}</div>}
      {loading ? <span className="animate-pulse">Loading...</span> : text}
    </button>
  );
};
