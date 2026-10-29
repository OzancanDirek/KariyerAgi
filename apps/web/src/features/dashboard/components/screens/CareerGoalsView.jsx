import { useState } from "react";
import { Button } from "../../../../shared/ui/Button.jsx";
import {
  Target,
  Laptop,
  Building,
  Home,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Save
} from "lucide-react";
const CareerGoalsView = ({
  user,
  onUpdateGoals
}) => {
  const initialGoals = user.careerGoals || {
    targetRole: user.targetRole || "Frontend & Web Geli\u015Ftirici",
    industry: "Teknoloji & Yaz\u0131l\u0131m",
    workModel: "hybrid",
    preferredLocation: "\u0130stanbul, T\xFCrkiye",
    expectedSeniority: "0-2 Y\u0131l (Junior)",
    notes: "Kullan\u0131c\u0131 deneyimi odakl\u0131 modern web projelerinde yer almak ve yapay zeka entegrasyonlu uygulamalar geli\u015Ftirmek istiyorum."
  };
  const [targetRole, setTargetRole] = useState(initialGoals.targetRole);
  const [industry, setIndustry] = useState(initialGoals.industry);
  const [workModel, setWorkModel] = useState(initialGoals.workModel);
  const [preferredLocation, setPreferredLocation] = useState(initialGoals.preferredLocation);
  const [expectedSeniority, setExpectedSeniority] = useState(initialGoals.expectedSeniority);
  const [notes, setNotes] = useState(initialGoals.notes || "");
  const [isSaved, setIsSaved] = useState(false);
  const popularRoles = [
    "Frontend Geli\u015Ftirici",
    "Full-Stack Geli\u015Ftirici",
    "Backend Geli\u015Ftirici",
    "Veri Analisti / Bilimci",
    "UI/UX Tasar\u0131mc\u0131s\u0131",
    "\xDCr\xFCn Y\xF6neticisi (Product Manager)",
    "DevOps / Bulut M\xFChendisi"
  ];
  const popularIndustries = [
    "Teknoloji & Yaz\u0131l\u0131m",
    "Fintech & Bankac\u0131l\u0131k",
    "E-Ticaret & Perakende",
    "Oyun & Mobil Geli\u015Ftirme",
    "Savunma & Havac\u0131l\u0131k",
    "Sa\u011Fl\u0131k Bili\u015Fimi & Biyoteknoloji",
    "Telekom\xFCnikasyon"
  ];
  const popularLocations = [
    "\u0130stanbul, T\xFCrkiye",
    "Ankara, T\xFCrkiye",
    "\u0130zmir, T\xFCrkiye",
    "Yurt D\u0131\u015F\u0131 / Global (Uzaktan)",
    "Avrupa / Remote"
  ];
  const handleSave = (e) => {
    e.preventDefault();
    const newGoals = {
      targetRole,
      industry,
      workModel,
      preferredLocation,
      expectedSeniority,
      notes,
      updatedAt: "Bug\xFCn, " + (/* @__PURE__ */ new Date()).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    };
    onUpdateGoals(newGoals);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {isSaved && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#2F8F83]" />
          <span>Kariyer hedefleriniz başarıyla kaydedildi ve yapay zeka haritasına işlendi.</span>
        </div>}

      {
    /* Main Grid: Form (8 cols) and Live Summary Card (4 cols) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Form Container (8 cols) */
  }
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E3E7ED] p-6 lg:p-8 shadow-xs">
          <div className="pb-5 border-b border-[#E3E7ED] mb-6">
            <h2 className="text-xl font-bold text-[#202938] tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-[#243B64]" />
              <span>Kariyer Hedefi Belirleme</span>
            </h2>
            <p className="text-xs text-[#667085] mt-1">
              Hedef pozisyonunuzu, çalışma modelinizi ve sektör tercihlerinizi tanımlayarak yapay zeka eşleşme algoritmasını yönlendirin.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {
    /* 1. Hedeflenen Meslek veya Pozisyon */
  }
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1.5">
                Hedeflenen Meslek veya Pozisyon
              </label>
              <input
    type="text"
    value={targetRole}
    onChange={(e) => setTargetRole(e.target.value)}
    required
    placeholder="Örn: Frontend Geliştirici"
    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none text-[#202938]"
  />

              {
    /* Quick Suggestion Chips */
  }
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-[#667085] mr-1 self-center">Öneriler:</span>
                {popularRoles.map((role) => <button
    key={role}
    type="button"
    onClick={() => setTargetRole(role)}
    className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${targetRole === role ? "bg-[#243B64] text-white border-[#243B64]" : "bg-[#F7F8FA] hover:bg-[#EEF2F6] text-[#202938] border-[#E3E7ED]"}`}
  >
                    {role}
                  </button>)}
              </div>
            </div>

            {
    /* 2. Çalışma Modeli Tercihi (Büyük Seçilebilir Kartlar) */
  }
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-2">
                Tercih Edilen Çalışma Modeli
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {
    /* Uzaktan (Remote) */
  }
                <button
    type="button"
    onClick={() => setWorkModel("remote")}
    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${workModel === "remote" ? "border-[#243B64] bg-[#EEF2F6] shadow-xs" : "border-[#E3E7ED] hover:border-[#CBD3E1] bg-white"}`}
  >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64]">
                      <Home className="w-4 h-4" />
                    </div>
                    {workModel === "remote" && <CheckCircle2 className="w-4 h-4 text-[#243B64]" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202938]">Uzaktan (Remote)</div>
                    <div className="text-[11px] text-[#667085] mt-0.5">Tamamen evden çalışma esnekliği</div>
                  </div>
                </button>

                {
    /* Hibrit */
  }
                <button
    type="button"
    onClick={() => setWorkModel("hybrid")}
    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${workModel === "hybrid" ? "border-[#243B64] bg-[#EEF2F6] shadow-xs" : "border-[#E3E7ED] hover:border-[#CBD3E1] bg-white"}`}
  >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64]">
                      <Laptop className="w-4 h-4" />
                    </div>
                    {workModel === "hybrid" && <CheckCircle2 className="w-4 h-4 text-[#243B64]" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202938]">Hibrit Model</div>
                    <div className="text-[11px] text-[#667085] mt-0.5">Haftalık dönüşümlü ofis ve ev</div>
                  </div>
                </button>

                {
    /* Ofis / Yerinde */
  }
                <button
    type="button"
    onClick={() => setWorkModel("office")}
    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${workModel === "office" ? "border-[#243B64] bg-[#EEF2F6] shadow-xs" : "border-[#E3E7ED] hover:border-[#CBD3E1] bg-white"}`}
  >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64]">
                      <Building className="w-4 h-4" />
                    </div>
                    {workModel === "office" && <CheckCircle2 className="w-4 h-4 text-[#243B64]" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202938]">Ofis / Yerinde</div>
                    <div className="text-[11px] text-[#667085] mt-0.5">Doğrudan şirket lokasyonunda</div>
                  </div>
                </button>
              </div>
            </div>

            {
    /* 3. İlgi Duyulan Sektör & Konum */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202938] mb-1.5">
                  İlgi Duyulan Sektör
                </label>
                <select
    value={industry}
    onChange={(e) => setIndustry(e.target.value)}
    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none text-[#202938]"
  >
                  {popularIndustries.map((ind) => <option key={ind} value={ind}>
                      {ind}
                    </option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202938] mb-1.5">
                  Çalışılmak İstenen Konum
                </label>
                <select
    value={preferredLocation}
    onChange={(e) => setPreferredLocation(e.target.value)}
    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none text-[#202938]"
  >
                  {popularLocations.map((loc) => <option key={loc} value={loc}>
                      {loc}
                    </option>)}
                </select>
              </div>
            </div>

            {
    /* 4. Hedef Kıdem Seviyesi */
  }
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1.5">
                Hedef Kıdem / Deneyim Seviyesi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
    { id: "0-2 Y\u0131l (Junior)", label: "Junior / Yeni Mezun", desc: "0 - 2 Y\u0131l Tecr\xFCbe" },
    { id: "3-5 Y\u0131l (Mid-Level)", label: "Mid-Level", desc: "3 - 5 Y\u0131l Tecr\xFCbe" },
    { id: "5+ Y\u0131l (Senior)", label: "Senior / Lider", desc: "5+ Y\u0131l Tecr\xFCbe" }
  ].map((lvl) => <button
    key={lvl.id}
    type="button"
    onClick={() => setExpectedSeniority(lvl.id)}
    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${expectedSeniority === lvl.id ? "border-[#243B64] bg-[#EEF2F6]" : "border-[#E3E7ED] bg-[#F7F8FA]"}`}
  >
                    <div className="text-xs font-semibold text-[#202938]">{lvl.label}</div>
                    <div className="text-[10px] text-[#667085] mt-0.5">{lvl.desc}</div>
                  </button>)}
              </div>
            </div>

            {
    /* 5. Kariyer Hedefi Notu */
  }
            <div>
              <label className="block text-xs font-semibold text-[#202938] mb-1.5">
                Kariyer Vizyonu & Beklentiler
              </label>
              <textarea
    rows={3}
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Önümüzdeki 1-2 yılda hangi uzmanlık alanına odaklanmak istiyorsunuz?"
    className="w-full p-3 text-xs bg-white border border-[#E3E7ED] rounded-lg text-[#202938] focus:border-[#243B64] outline-none"
  />
            </div>

            {
    /* Save Button */
  }
            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="gap-2">
                <Save className="w-4 h-4" />
                <span>Hedeflerimi Kaydet</span>
              </Button>
            </div>
          </form>
        </div>

        {
    /* Right Column: Live Goal Summary Card (4 cols) */
  }
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs sticky top-24">
            <div className="flex items-center gap-2 pb-4 border-b border-[#E3E7ED] mb-4">
              <Sparkles className="w-4 h-4 text-[#2F8F83]" />
              <h3 className="text-sm font-semibold text-[#202938]">
                Canlı Hedef Özeti
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#667085] block mb-0.5">Hedef Pozisyon</span>
                <span className="text-sm font-bold text-[#243B64]">{targetRole}</span>
              </div>

              <div className="pt-3 border-t border-[#E3E7ED]">
                <span className="text-[#667085] block mb-0.5">Sektör</span>
                <span className="font-semibold text-[#202938]">{industry}</span>
              </div>

              <div className="pt-3 border-t border-[#E3E7ED]">
                <span className="text-[#667085] block mb-0.5">Çalışma Şekli</span>
                <span className="font-semibold text-[#202938]">
                  {workModel === "remote" ? "Uzaktan (Remote)" : workModel === "hybrid" ? "Hibrit Model" : "Ofis / Yerinde"}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E3E7ED]">
                <span className="text-[#667085] block mb-0.5">Tercih Edilen Konum</span>
                <span className="font-semibold text-[#202938]">{preferredLocation}</span>
              </div>

              <div className="pt-3 border-t border-[#E3E7ED]">
                <span className="text-[#667085] block mb-0.5">Deneyim Düzeyi</span>
                <span className="font-semibold text-[#202938]">{expectedSeniority}</span>
              </div>

              {notes && <div className="pt-3 border-t border-[#E3E7ED]">
                  <span className="text-[#667085] block mb-0.5">Kariyer Vizyonu</span>
                  <p className="text-[11px] text-[#667085] leading-relaxed italic">
                    "{notes}"
                  </p>
                </div>}
            </div>

            <div className="mt-6 p-3 rounded-lg bg-[#EBF5F4] border border-[#2F8F83]/20 flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-[#2F8F83] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#202938]">
                Bu hedefler, sonraki modüllerde yer alacak <strong>Yapay Zeka İş Eşleşme Skoru</strong> ve <strong>Beceri Haritası</strong> motorunda referans alınacaktır.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  CareerGoalsView
};
