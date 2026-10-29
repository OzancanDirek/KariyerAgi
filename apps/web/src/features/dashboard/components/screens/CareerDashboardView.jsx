import {
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  UploadCloud,
  Briefcase,
  MapPin,
  Building,
  TrendingUp,
  Clock,
  Edit3
} from "lucide-react";
import { Button } from "../../../../shared/ui/Button.jsx";
const CareerDashboardView = ({
  user,
  onNavigate
}) => {
  const completionRate = user.completionRate || 85;
  const sampleSkills = user.skills.length > 0 ? user.skills : [
    "React",
    "TypeScript",
    "JavaScript (ES6+)",
    "Tailwind CSS",
    "Git",
    "REST API",
    "SQL",
    "UI/UX Tasar\u0131m\u0131"
  ];
  const targetRole = user.careerGoals?.targetRole || user.targetRole || "Frontend & Web Geli\u015Ftirici";
  const targetIndustry = user.careerGoals?.industry || "Teknoloji & Yaz\u0131l\u0131m";
  const workModelLabel = {
    remote: "Uzaktan (Remote)",
    hybrid: "Hibrit \xC7al\u0131\u015Fma",
    office: "Ofis / Yerinde"
  }[user.careerGoals?.workModel || "hybrid"];
  const preferredLocation = user.careerGoals?.preferredLocation || "\u0130stanbul / Uzaktan";
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {
    /* 1. Personalized Welcome & Quick Metric Banner */
  }
      <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5276A7] mb-1">
            Kariyer Kontrol Paneli
          </div>
          <h2 className="text-2xl font-bold text-[#202938] tracking-tight">
            Hoş geldin, {user.firstName} 👋
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-xl">
            Profiliniz yapay zeka analiz motoru tarafından işlendi. Hedeflerinize uygun beceri haritası ve kariyer önerileriniz hazır.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
    variant="outline"
    size="sm"
    onClick={() => onNavigate("profile")}
    className="gap-2"
  >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Profili Düzenle</span>
          </Button>

          <Button
    variant="primary"
    size="sm"
    onClick={() => onNavigate("goals")}
    className="gap-2"
  >
            <Target className="w-3.5 h-3.5" />
            <span>Hedefleri Güncelle</span>
          </Button>
        </div>
      </div>

      {
    /* 2. Top Metric Grid: Progress Bar + CV Status + Career Goal Summary */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
    /* Card A: Profil Tamamlama Yüzdesi */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#667085]">Profil Tamamlama</span>
              <span className="text-sm font-bold text-[#2F8F83]">%{completionRate}</span>
            </div>

            <div className="w-full h-2.5 bg-[#E3E7ED] rounded-full overflow-hidden mb-4">
              <div
    className="h-full bg-[#2F8F83] rounded-full transition-all duration-500"
    style={{ width: `${completionRate}%` }}
  />
            </div>

            <div className="space-y-2 text-xs text-[#202938]">
              <div className="flex items-center gap-2 text-[#2F8F83]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-[#202938]">Kişisel ve iletişim bilgileri girildi</span>
              </div>
              <div className="flex items-center gap-2 text-[#2F8F83]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-[#202938]">Özgeçmiş (CV) belgesi analiz edildi</span>
              </div>
              <div className="flex items-center gap-2 text-[#2F8F83]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-[#202938]">Temel kariyer hedefleri tanımlandı</span>
              </div>
              <div className="flex items-center gap-2 text-[#667085]">
                <span className="w-4 h-4 rounded-full border border-dashed border-[#CBD3E1] flex items-center justify-center text-[10px]">○</span>
                <span>Proje portfolyosu & sertifikalar eklenebilir</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E3E7ED]">
            <button
    type="button"
    onClick={() => onNavigate("profile")}
    className="text-xs font-medium text-[#243B64] hover:text-[#1B2D4E] hover:underline flex items-center gap-1 cursor-pointer"
  >
              <span>Eksik alanları tamamla</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {
    /* Card B: CV Durumu */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-[#667085]">Mevcut CV Durumu</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBF5F4] text-[#2F8F83]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F83]" />
                Aktif & Eşleşti
              </span>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#F7F8FA] rounded-lg border border-[#E3E7ED] mb-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64] shrink-0 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#202938] truncate">
                  {user.cvFileName || "Mehmet_Akif_Yazilim_CV.pdf"}
                </div>
                <div className="text-[11px] text-[#667085] mt-0.5">
                  {user.cvFileSize || "1.4 MB"} · Son Analiz: Bugün
                </div>
              </div>
            </div>

            <p className="text-xs text-[#667085] leading-relaxed">
              Yapay zeka ayrıştırma motoru bu özgeçmişten {sampleSkills.length} temel yetkinlik ve 2 yıllık akademik deneyim çıkardı.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E3E7ED] flex items-center justify-between">
            <button
    type="button"
    onClick={() => alert("CV indiriliyor...")}
    className="text-xs font-medium text-[#5276A7] hover:text-[#243B64] flex items-center gap-1 cursor-pointer"
  >
              <Download className="w-3.5 h-3.5" />
              <span>Görüntüle / İndir</span>
            </button>

            <button
    type="button"
    onClick={() => onNavigate("profile")}
    className="text-xs font-medium text-[#243B64] hover:underline flex items-center gap-1 cursor-pointer"
  >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>CV Değiştir</span>
            </button>
          </div>
        </div>

        {
    /* Card C: Kariyer Hedefi Özeti */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-[#667085]">Kariyer Hedefi Özeti</span>
              <Target className="w-4 h-4 text-[#243B64]" />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-[#5276A7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#667085]">Hedeflenen Rol</div>
                  <div className="text-sm font-semibold text-[#202938]">{targetRole}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-[#5276A7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#667085]">Odak Sektör</div>
                  <div className="text-xs font-medium text-[#202938]">{targetIndustry}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#5276A7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#667085]">Çalışma Şekli & Konum</div>
                  <div className="text-xs font-medium text-[#202938]">
                    {workModelLabel} · {preferredLocation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E7ED] flex items-center justify-between">
            <button
    type="button"
    onClick={() => onNavigate("goals")}
    className="text-xs font-medium text-[#64748B] hover:text-[#202938] hover:underline flex items-center gap-1 cursor-pointer"
  >
              <span>Hedefleri Düzenle</span>
            </button>
            <button
    type="button"
    onClick={() => onNavigate("job-listings")}
    className="text-xs font-semibold text-[#243B64] hover:text-[#1B2D4E] hover:underline flex items-center gap-1 cursor-pointer"
  >
              <span>Eşleşen İlanlar (Modül 06)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {
    /* 3. Bottom Section: Beceri Özeti & Son Aktiviteler */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left Column (7 cols): Beceri Özeti */
  }
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#202938] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2F8F83]" />
                <span>Tespit Edilen Yetkinlikler ({sampleSkills.length})</span>
              </h3>
              <p className="text-xs text-[#667085] mt-0.5">
                CV ve deneyim analizinizden çıkarılan doğrulanmış temel yetkinlikler.
              </p>
            </div>

            <button
    type="button"
    onClick={() => onNavigate("knowledge-graph")}
    className="text-xs font-semibold text-[#243B64] hover:text-[#1B2D4E] bg-[#EEF2F6] hover:bg-[#E2E8F0] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
  >
              Haritada İncele (Modül 04)
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {sampleSkills.map((skill, idx) => <span
    key={skill}
    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED] text-xs font-medium text-[#202938]"
  >
                <span>{skill}</span>
                {idx < 3 && <span className="text-[10px] text-[#2F8F83] font-semibold bg-[#EBF5F4] px-1 rounded">
                    Öncü
                  </span>}
              </span>)}
          </div>

          {
    /* AI Skill Growth Teaser */
  }
          <div className="p-4 rounded-lg bg-[#EEF2F6] border border-[#E3E7ED] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64] shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#202938]">
                Hedef Pozisyon İçin Tavsiye Edilen Ek Yetkinlikler
              </div>
              <div className="text-xs text-[#667085] mt-0.5 leading-relaxed">
                {targetRole} pozisyonuna başvurularda en çok aranan <strong>Next.js</strong> ve <strong>Docker</strong> becerilerini kazanmak için hazırlanan aşamaları inceleyebilirsiniz.
              </div>
              <div className="mt-2.5">
                <button
    type="button"
    onClick={() => onNavigate("career-roadmap")}
    className="inline-flex items-center gap-1 text-xs font-semibold text-[#243B64] hover:text-[#1B2D4E] hover:underline cursor-pointer"
  >
                  <span>Kariyer Yol Haritasını Gör (Modül 05)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {
    /* Right Column (5 cols): Son Aktiviteler & Sistem Durumu */
  }
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
              <h3 className="text-base font-semibold text-[#202938] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5276A7]" />
                <span>Son Aktiviteler</span>
              </h3>
              <span className="text-xs text-[#667085]">Bu hafta</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#2F8F83] mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#202938]">CV Başarıyla Analiz Edildi</div>
                  <div className="text-[#667085] mt-0.5">
                    {user.cvFileName || "Mehmet_Akif_Yazilim_CV.pdf"} belgesi üzerinden yetkinlik çıkarımı tamamlandı.
                  </div>
                  <div className="text-[10px] text-[#5276A7] mt-0.5">Bugün, 10:45</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#243B64] mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#202938]">Kariyer Hedefleri Tanımlandı</div>
                  <div className="text-[#667085] mt-0.5">
                    {targetRole} ({workModelLabel}) hedefi kaydedildi.
                  </div>
                  <div className="text-[10px] text-[#5276A7] mt-0.5">Bugün, 10:42</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#5276A7] mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-[#202938]">Hesap Doğrulandı & Oluşturuldu</div>
                  <div className="text-[#667085] mt-0.5">
                    {user.email} e-posta adresiyle platforma katıldınız.
                  </div>
                  <div className="text-[10px] text-[#5276A7] mt-0.5">Bugün, 10:38</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#E3E7ED] flex items-center justify-between text-xs text-[#667085]">
            <span>Sistem: Modül 02 Etkin</span>
            <span className="text-[#2F8F83] font-medium">Veriler Güncel</span>
          </div>
        </div>
      </div>
    </div>;
};
export {
  CareerDashboardView
};
