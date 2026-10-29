const Logo = ({
  className = "",
  size = "md",
  variant = "dark",
  showSubtitle = false
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };
  const textColor = variant === "light" ? "text-white" : "text-[#243B64]";
  const subtitleColor = variant === "light" ? "text-slate-300" : "text-[#667085]";
  return <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {
    /* Minimal geometric symbol: 3 skill nodes connected into an upward directional pathway */
  }
      <div
    className={`${iconSizes[size]} rounded-lg bg-[#243B64] p-1.5 flex items-center justify-center shrink-0 shadow-xs`}
    aria-hidden="true"
  >
        <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
          {
    /* Path connection lines */
  }
          <path
    d="M5 19L12 12M12 12L19 5M12 12L7 7M12 12L17 17"
    stroke="#5276A7"
    strokeWidth="2"
    strokeLinecap="round"
  />
          {
    /* Main direction arrow vector */
  }
          <path
    d="M13 5H19V11"
    stroke="#2F8F83"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
          {
    /* Connecting skill nodes */
  }
          <circle cx="5" cy="19" r="2.5" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="2.8" fill="#2F8F83" />
          <circle cx="7" cy="7" r="1.8" fill="#FFFFFF" />
          <circle cx="17" cy="17" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight ${textSizes[size]} ${textColor}`}>
          Career<span className="text-[#5276A7] font-semibold">Path</span>
        </span>
        {showSubtitle && <span className={`text-[10px] tracking-wider uppercase font-medium mt-0.5 ${subtitleColor}`}>
            Kariyer & Beceri Platformu
          </span>}
      </div>
    </div>;
};
export {
  Logo
};
