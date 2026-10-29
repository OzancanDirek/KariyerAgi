import { useEffect } from "react";
import { X } from "lucide-react";
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md"
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) {
    return null;
  }
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl"
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202938]/40 backdrop-blur-xs animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
      <div
    className="fixed inset-0"
    onClick={onClose}
    aria-hidden="true"
  />

      <div
    className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-xl border border-[#E3E7ED] shadow-xl overflow-hidden z-10 transition-all`}
  >
        <div className="flex items-start justify-between p-6 border-b border-[#E3E7ED]">
          <div>
            <h3 id="modal-title" className="text-base font-semibold text-[#202938]">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#667085] mt-1">{subtitle}</p>}
          </div>
          <button
    onClick={onClose}
    className="text-[#667085] hover:text-[#202938] p-1 rounded-md hover:bg-[#F7F8FA] transition-colors"
    aria-label="Kapat"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>;
};
export {
  Modal
};
