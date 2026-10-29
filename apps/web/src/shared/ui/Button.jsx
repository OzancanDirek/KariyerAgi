import { Loader2 } from "lucide-react";
const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-medium",
    md: "px-4 py-2.5 text-sm font-medium",
    lg: "px-5 py-3 text-base font-medium"
  };
  const variantStyles = {
    primary: "bg-[#243B64] hover:bg-[#1B2D4E] text-white border border-[#243B64] shadow-xs focus-visible:ring-2 focus-visible:ring-[#243B64]/30",
    secondary: "bg-white hover:bg-[#F7F8FA] text-[#202938] border border-[#E3E7ED] hover:border-[#CBD3E1] shadow-xs focus-visible:ring-2 focus-visible:ring-[#5276A7]/20",
    outline: "bg-transparent hover:bg-[#EEF2F6] text-[#243B64] border border-[#243B64]/30 hover:border-[#243B64] focus-visible:ring-2 focus-visible:ring-[#243B64]/20",
    ghost: "bg-transparent hover:bg-[#EEF2F6] text-[#667085] hover:text-[#202938] border border-transparent focus-visible:ring-2 focus-visible:ring-[#5276A7]/20",
    teal: "bg-[#2F8F83] hover:bg-[#27796F] text-white border border-[#2F8F83] shadow-xs focus-visible:ring-2 focus-visible:ring-[#2F8F83]/30"
  };
  return <button
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed outline-none select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    {...props}
  >
      {isLoading ? <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Lütfen bekleyin...</span>
        </span> : children}
    </button>;
};
const GoogleButton = ({ onClick, isLoading, label }) => {
  return <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-[#202938] bg-white hover:bg-[#F9FAFB] border border-[#E3E7ED] hover:border-[#CBD3E1] rounded-lg shadow-xs transition-colors duration-150 cursor-pointer disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#5276A7]/20"
  >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path
    fill="#4285F4"
    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
  />
        <path
    fill="#34A853"
    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
  />
        <path
    fill="#FBBC05"
    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
  />
        <path
    fill="#EA4335"
    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
  />
      </svg>
      <span>{label}</span>
    </button>;
};
export {
  Button,
  GoogleButton
};
