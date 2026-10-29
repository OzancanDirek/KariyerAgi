import { Logo } from "./Logo.jsx";
import { Compass, Network, Award } from "lucide-react";
const BrandPanel = ({
  heading,
  supportingText,
  contextTag = "Mod\xFCl 01 \xB7 Kimlik & CV Kurulumu"
}) => {
  return <div className="auth-brand-panel relative h-full flex flex-col justify-between p-8 lg:p-12 bg-[#EEF2F6] overflow-hidden border-r border-[#E3E7ED]/80">
      {
    /* Background: Subtle abstract skill network motif (low contrast, secondary) */
  }
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <svg
    className="absolute w-full h-full opacity-35"
    viewBox="0 0 600 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#5276A7" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {
    /* Connected network graph links */
  }
          <g stroke="#5276A7" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 3">
            <line x1="120" y1="180" x2="260" y2="240" />
            <line x1="260" y1="240" x2="420" y2="190" />
            <line x1="260" y1="240" x2="230" y2="380" />
            <line x1="230" y1="380" x2="140" y2="480" />
            <line x1="230" y1="380" x2="380" y2="450" />
            <line x1="380" y1="450" x2="480" y2="360" />
            <line x1="380" y1="450" x2="430" y2="580" />
            <line x1="140" y1="480" x2="250" y2="600" />
            <line x1="250" y1="600" x2="430" y2="580" />
          </g>

          {
    /* Network Nodes */
  }
          <g fill="#243B64">
            <circle cx="120" cy="180" r="4.5" fillOpacity="0.5" />
            <circle cx="260" cy="240" r="6" fill="#243B64" fillOpacity="0.8" />
            <circle cx="420" cy="190" r="5" fill="#5276A7" fillOpacity="0.6" />
            <circle cx="230" cy="380" r="7" fill="#243B64" />
            <circle cx="140" cy="480" r="4" fillOpacity="0.5" />
            <circle cx="380" cy="450" r="6.5" fill="#2F8F83" />
            <circle cx="480" cy="360" r="4.5" fill="#5276A7" fillOpacity="0.5" />
            <circle cx="430" cy="580" r="5" fillOpacity="0.5" />
            <circle cx="250" cy="600" r="5.5" fillOpacity="0.7" />
          </g>

          {
    /* Subtle node pulse rings */
  }
          <circle cx="230" cy="380" r="14" stroke="#243B64" strokeWidth="1" strokeOpacity="0.25" />
          <circle cx="380" cy="450" r="13" stroke="#2F8F83" strokeWidth="1" strokeOpacity="0.35" />
        </svg>
      </div>

      {
    /* Top Brand Header */
  }
      <div className="relative z-10">
        <Logo size="md" showSubtitle />
      </div>

      {
    /* Central Value Proposition Area */
  }
      <div className="relative z-10 my-8 lg:my-12 max-w-lg">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BDD4D0] bg-white/65 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#2F8F83]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2F8F83]" />
          {contextTag}
        </span>
        <h1 className="text-2xl lg:text-3xl font-semibold text-[#202938] tracking-tight leading-tight mb-4">
          {heading}
        </h1>
        <p className="text-sm lg:text-base text-[#667085] leading-relaxed mb-8">
          {supportingText}
        </p>

        {
    /* Feature List — Clean typography, no pills */
  }
        <div className="space-y-4 pt-4 border-t border-[#E3E7ED]/70">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center shrink-0 text-[#243B64] shadow-xs">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#202938]">Beceri Tabanlı Haritalandırma</div>
              <div className="text-xs text-[#667085] mt-0.5">Özgeçmişinizi analiz ederek güçlü yönlerinizi ve gelişim alanlarınızı belirler.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center shrink-0 text-[#243B64] shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#202938]">Hedefe Yönelik Kariyer Rotası</div>
              <div className="text-xs text-[#667085] mt-0.5">İstediğiniz pozisyona ulaşmak için edinmeniz gereken yetkinlikleri sunar.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center shrink-0 text-[#243B64] shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#202938]">Yetkinlik & Sektörel Uyum</div>
              <div className="text-xs text-[#667085] mt-0.5">Sektör gereksinimlerine göre beceri gelişimi ve kariyer uyumu.</div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Bottom Footnote */
  }
      <div className="relative z-10 pt-4 border-t border-[#E3E7ED]/70 flex items-center justify-between text-xs text-[#667085]">
        <span>Kariyer gelişimin için tasarlandı</span>
        <span className="text-[#5276A7] font-medium">CareerPath Platformu</span>
      </div>
    </div>;
};
export {
  BrandPanel
};
