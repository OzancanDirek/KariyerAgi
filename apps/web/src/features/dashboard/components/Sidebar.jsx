import { Logo } from "../../../shared/ui/Logo.jsx";
import {
  LayoutDashboard,
  UserCheck,
  Target,
  Briefcase,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  FileCheck,
  Edit3,
  Network,
  Compass,
  BookOpen,
  Building2,
  PlusCircle,
  Users
} from "lucide-react";
const Sidebar = ({
  currentView,
  onViewChange,
  user,
  onLogout
}) => {
  const module2Items = [
    {
      id: "dashboard",
      label: "Ana Dashboard",
      icon: LayoutDashboard
    },
    {
      id: "profile",
      label: "Kariyer Profilim",
      icon: UserCheck
    },
    {
      id: "goals",
      label: "Kariyer Hedeflerim",
      icon: Target
    }
  ];
  const module3Items = [
    {
      id: "cv-analysis",
      label: "CV Analiz Raporu",
      icon: FileCheck,
      badge: "84 Puan"
    },
    {
      id: "cv-builder",
      label: "CV Olu\u015Fturucu & Edit\xF6r",
      icon: Edit3
    }
  ];
  const module4Items = [
    {
      id: "knowledge-graph",
      label: "Beceri Haritas\u0131 (Graph)",
      icon: Network,
      badge: "G\xF6rsel A\u011F"
    }
  ];
  const module5Items = [
    {
      id: "career-roadmap",
      label: "Kariyer Yol Haritas\u0131 & Plan",
      icon: Compass,
      badge: "Yol Haritas\u0131"
    },
    {
      id: "learning-recommendations",
      label: "E\u011Fitim & Kaynaklar",
      icon: BookOpen,
      badge: "\xD6neriler"
    }
  ];
  const module6Items = [
    {
      id: "job-listings",
      label: "\u0130\u015F \u0130lanlar\u0131 & E\u015Fle\u015Fme",
      icon: Briefcase,
      badge: "AI Uyum"
    }
  ];
  const module7Items = [
    {
      id: "company-profile",
      label: "\u015Eirket Profili",
      icon: Building2,
      badge: "\u0130\u015Fveren"
    },
    {
      id: "create-job",
      label: "\u0130lan Olu\u015Ftur",
      icon: PlusCircle
    },
    {
      id: "applicant-management",
      label: "Aday Y\xF6netimi",
      icon: Users,
      badge: "48 Aday"
    }
  ];
  const futureItems = [
    {
      id: "events",
      label: "Kariyer Etkinlikleri",
      icon: Calendar,
      badge: "Mod\xFCl 08"
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings
    }
  ];
  return <aside className="w-64 bg-white border-r border-[#E3E7ED] flex flex-col justify-between shrink-0 select-none min-h-screen">
      {
    /* Top Brand Header */
  }
      <div className="overflow-y-auto">
        <div className="p-5 border-b border-[#E3E7ED]">
          <Logo size="sm" showSubtitle={false} />
          <div className="mt-1.5 text-[11px] font-medium text-[#5276A7] tracking-wide">
            Kariyer & Yetkinlik Platformu
          </div>
        </div>

        {
    /* Section 1: Modül 02 */
  }
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#667085]">
            Modül 02 · Kariyer & Profil
          </div>
          {module2Items.map((item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-[#243B64] text-white shadow-xs" : "text-[#202938] hover:bg-[#F7F8FA] hover:text-[#243B64]"}`}
    >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#5276A7]"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>;
  })}
        </div>

        {
    /* Section 2: Modül 03 */
  }
        <div className="p-3 pt-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2F8F83] flex items-center justify-between">
            <span>Modül 03 · AI CV Merkezi</span>
            <span className="text-[9px] bg-[#EBF5F4] px-1.5 py-0.2 rounded font-semibold text-[#2F8F83]">YENİ</span>
          </div>
          {module3Items.map((item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-[#243B64] text-white shadow-xs" : "text-[#202938] hover:bg-[#F7F8FA] hover:text-[#243B64]"}`}
    >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#2F8F83]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EBF5F4] text-[#2F8F83] border border-[#2F8F83]/20">
                    {item.badge}
                  </span>}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>;
  })}
        </div>

        {
    /* Section 3: Modül 04 - Knowledge Graph & Beceriler */
  }
        <div className="p-3 pt-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#243B64] flex items-center justify-between">
            <span>Modül 04 · Knowledge Graph</span>
            <span className="text-[9px] bg-[#EEF2F6] px-1.5 py-0.2 rounded font-semibold text-[#243B64]">AKTİF</span>
          </div>
          {module4Items.map((item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-[#243B64] text-white shadow-xs" : "text-[#202938] hover:bg-[#F7F8FA] hover:text-[#243B64]"}`}
    >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#243B64]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF2F6] text-[#243B64] border border-[#CBD5E1]">
                    {item.badge}
                  </span>}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>;
  })}
        </div>

        {
    /* Section 4: Modül 05 - AI Kariyer Yol Haritası & Eğitimler */
  }
        <div className="p-3 pt-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#243B64] flex items-center justify-between">
            <span>Modül 05 · Yol Haritası</span>
          </div>
          {module5Items.map((item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-[#243B64] text-white shadow-xs" : "text-[#202938] hover:bg-[#F7F8FA] hover:text-[#243B64]"}`}
    >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#243B64]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF2F6] text-[#243B64] border border-[#CBD5E1]">
                    {item.badge}
                  </span>}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>;
  })}
        </div>

        {
    /* Section 5: Modül 06 - AI İş İlanı Eşleştirme & Başvuru */
  }
        <div className="p-3 pt-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#243B64] flex items-center justify-between">
            <span>Modül 06 · İş İlanları</span>
            <span className="text-[9px] bg-[#EBF5F4] text-[#134E4A] px-1.5 py-0.2 rounded font-semibold border border-[#2F8F83]/30">
              YENİ
            </span>
          </div>
          {module6Items.map((item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-[#243B64] text-white shadow-xs" : "text-[#202938] hover:bg-[#F7F8FA] hover:text-[#243B64]"}`}
    >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#243B64]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF2F6] text-[#243B64] border border-[#CBD5E1]">
                    {item.badge}
                  </span>}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>;
  })}
        </div>

        {
    /* Section 6: Modül 07 - İşveren ve Şirket Yönetimi */
  }
        <div className="p-3 pt-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#243B64] flex items-center justify-between">
            <span>Modül 07 · İşveren & Şirket</span>
            <span className="text-[9px] bg-[#EEF2F6] text-[#243B64] px-1.5 py-0.2 rounded font-bold">
              3 Ekran
            </span>
          </div>
          {module7Items.map((item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${isActive ? "bg-[#243B64] text-white shadow-xs" : "text-[#202938] hover:bg-[#F7F8FA] hover:text-[#243B64]"}`}
    >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#243B64]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF2F6] text-[#243B64] border border-[#CBD5E1]">
                    {item.badge}
                  </span>}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>;
  })}
        </div>

        {
    /* Section 7: Diğer Modüller */
  }
        <div className="p-3 pt-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#667085]">
            Diğer Modüller
          </div>
          {futureItems.map((item) => {
    const Icon = item.icon;
    return <button
      key={item.id}
      type="button"
      onClick={() => onViewChange("dashboard")}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#667085] hover:bg-[#F7F8FA] hover:text-[#202938] transition-colors cursor-pointer"
    >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 text-[#667085]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F7F8FA] text-[#667085] border border-[#E3E7ED]">
                    {item.badge}
                  </span>}
              </button>;
  })}
        </div>
      </div>

      {
    /* Bottom User Profile Section */
  }
      <div className="p-4 border-t border-[#E3E7ED]">
        <div className="p-3 bg-[#F7F8FA] rounded-xl border border-[#E3E7ED] mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#243B64] text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs">
              {user.firstName ? user.firstName[0].toUpperCase() : "U"}
              {user.lastName ? user.lastName[0].toUpperCase() : ""}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#202938] truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-[11px] text-[#667085] truncate">
                {user.title || user.targetRole || "Aday Profil"}
              </div>
            </div>
          </div>

          {
    /* Quick profile completion bar */
  }
          <div className="mt-3 pt-2.5 border-t border-[#E3E7ED]/70">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#667085]">Profil Doluluğu</span>
              <span className="font-semibold text-[#2F8F83]">
                %{user.completionRate || 85}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden">
              <div
    className="h-full bg-[#2F8F83] rounded-full transition-all duration-300"
    style={{ width: `${user.completionRate || 85}%` }}
  />
            </div>
          </div>
        </div>

        {
    /* Logout button */
  }
        <button
    type="button"
    onClick={onLogout}
    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#667085] hover:text-[#C74747] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#C74747]/20"
  >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>;
};
export {
  Sidebar
};
