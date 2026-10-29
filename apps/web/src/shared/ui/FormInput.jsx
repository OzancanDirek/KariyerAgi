import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
const FormInput = ({
  label,
  id,
  error,
  helperText,
  isPassword = false,
  required = false,
  type = "text",
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const effectiveType = isPassword ? showPassword ? "text" : "password" : type;
  return <div className="w-full">
      <div className="flex justify-between items-baseline mb-1.5">
        <label
    htmlFor={id}
    className="block text-xs font-medium text-[#202938]"
  >
          {label}
          {required && <span className="text-[#C74747] ml-0.5" aria-hidden="true">*</span>}
        </label>
      </div>

      <div className="relative">
        <input
    id={id}
    type={effectiveType}
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : void 0}
    className={`auth-input w-full min-h-12 px-3.5 py-3 text-sm bg-white text-[#202938] placeholder-[#667085]/55 rounded-xl border transition-all duration-150 outline-none
            ${error ? "border-[#C74747] focus:border-[#C74747] focus:ring-2 focus:ring-[#C74747]/15" : "border-[#E3E7ED] hover:border-[#CBD3E1] focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15"}
            ${isPassword ? "pr-11" : ""}
            ${className}`}
    {...props}
  />

        {isPassword && <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#667085] hover:text-[#202938] transition-colors focus:outline-none"
    aria-label={showPassword ? "\u015Eifreyi gizle" : "\u015Eifreyi g\xF6ster"}
    tabIndex={-1}
  >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>}
      </div>

      {error ? <p id={`${id}-error`} className="mt-1.5 text-xs text-[#C74747] flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#C74747]" />
          {error}
        </p> : helperText ? <p id={`${id}-helper`} className="mt-1.5 text-xs text-[#667085]">
          {helperText}
        </p> : null}
    </div>;
};
export {
  FormInput
};
