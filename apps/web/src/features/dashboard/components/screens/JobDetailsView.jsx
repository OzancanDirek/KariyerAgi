import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Check,
  BookOpen,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Share2
} from "lucide-react";
const JobDetailsView = ({
  user,
  selectedJob,
  onNavigate,
  onToggleSaveJob
}) => {
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleOpenExternal = () => {
    if (!selectedJob) {
      return;
    }
    window.open(selectedJob.externalUrl, "_blank", "noopener,noreferrer");
    showToast(`"${selectedJob.company}" resm\xEE ilan sayfas\u0131 yeni sekmede a\xE7\u0131ld\u0131.`);
  };
  const handleShare = () => {
    if (!selectedJob) {
      return;
    }
    navigator.clipboard.writeText(selectedJob.externalUrl);
    showToast("\u0130lan ba\u011Flant\u0131s\u0131 panoya kopyaland\u0131.");
  };
  if (!selectedJob) {
    return <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto text-[#64748B]">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#202938]">Görüntülenecek İlan Seçilmedi</h2>
        <p className="text-sm text-[#667085]">
          Lütfen listeleme ekranından incelemek istediğiniz bir iş ilanını seçin.
        </p>
        <button
      type="button"
      onClick={() => onNavigate("job-listings")}
      className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer"
    >
          İş İlanları Listesine Dön
        </button>
      </div>;
  }
  const isTopMatch = selectedJob.matchScore >= 90;
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-[#3b5582] animate-fade-in">
          <ExternalLink className="w-4 h-4 text-[#60A5FA]" />
          <span>{toastMessage}</span>
        </div>}

      {
    /* Top Navigation & Breadcrumb */
  }
      <div className="flex items-center justify-between">
        <button
    type="button"
    onClick={() => onNavigate("job-listings")}
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#243B64] transition-colors cursor-pointer group"
  >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>İş İlanları Listesine Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded">
            Modül 06 · Ekran 2 / 2
          </span>
          <span className="text-xs text-[#667085]">İlan Detayı & AI Analiz</span>
        </div>
      </div>

      {
    /* Main Header Card */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {
    /* Company Logo Badge */
  }
            <div
    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xs shrink-0"
    style={{ backgroundColor: selectedJob.companyColor || "#243B64" }}
  >
              {selectedJob.companyLogoText}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#667085]">{selectedJob.company}</span>
                <span className="text-[#CBD5E1]">·</span>
                <span className="text-xs text-[#667085] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                  {selectedJob.location}
                </span>
                <span className="text-[#CBD5E1]">·</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F1F5F9] font-medium text-[#475569]">
                  {selectedJob.workModelLabel}
                </span>
                <span className="text-[#CBD5E1]">·</span>
                <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {selectedJob.platformName || "Do\u011Frulanm\u0131\u015F \u015Eirket \u0130lan\u0131"}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#202938] tracking-tight">
                {selectedJob.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085] pt-1">
                <span className="flex items-center gap-1.5 font-semibold text-[#202938]">
                  <DollarSign className="w-4 h-4 text-[#10B981]" />
                  {selectedJob.salaryRange}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#94A3B8]" />
                  {selectedJob.experienceLevel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#94A3B8]" />
                  Yayınlanma: {selectedJob.postedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#94A3B8]" />
                  Son Tarih: {selectedJob.deadline}
                </span>
              </div>
            </div>
          </div>

          {
    /* Action CTAs: Direct External Link Button & Bookmark */
  }
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#F1F3F5]">
            <button
    type="button"
    onClick={handleShare}
    className="p-2.5 border border-[#E3E7ED] text-[#667085] hover:text-[#202938] hover:bg-[#F7F8FA] rounded-lg transition-colors cursor-pointer flex items-center justify-center"
    title="İlan Bağlantısını Kopyala"
  >
              <Share2 className="w-4 h-4" />
            </button>

            <button
    type="button"
    onClick={() => onToggleSaveJob(selectedJob.id)}
    className={`px-4 py-2.5 rounded-lg border font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${selectedJob.isSaved ? "bg-[#243B64] text-white border-[#243B64]" : "bg-white text-[#667085] border-[#E3E7ED] hover:bg-[#F7F8FA]"}`}
  >
              <Bookmark className={`w-4 h-4 ${selectedJob.isSaved ? "fill-current" : ""}`} />
              <span>{selectedJob.isSaved ? "Kaydedildi" : "\u0130lan\u0131 Kaydet"}</span>
            </button>

            {
    /* Primary Action: Go to External Job Posting */
  }
            <button
    type="button"
    onClick={handleOpenExternal}
    className="px-6 py-2.5 bg-[#243B64] hover:bg-[#1b2d4f] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
  >
              <span>İlana Git</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {
    /* Grid Layout: Left Job Details, Right AI Match Analysis */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left Column: Job Description, Requirements, Benefits (7 Cols) */
  }
        <div className="lg:col-span-7 space-y-6">
          {
    /* Direct Link Banner */
  }
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3A8A]">
                  Resmî Başvuru Sayfası
                </p>
                <p className="text-[11px] text-[#3B82F6]">
                  {selectedJob.platformName || selectedJob.company} portalı üzerinden doğrudan inceleyebilir ve başvurabilirsiniz.
                </p>
              </div>
            </div>
            <button
    type="button"
    onClick={handleOpenExternal}
    className="px-3.5 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
  >
              <span>Sayfayı Aç</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {
    /* Job Overview & Description */
  }
          <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#243B64]" />
              <span>İş Tanımı ve Pozisyon Özeti</span>
            </h3>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              {selectedJob.description}
            </p>
          </div>

          {
    /* Responsibilities */
  }
          <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#243B64]" />
              <span>Temel Sorumluluklar</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-[#4A5568]">
              {selectedJob.responsibilities.map((resp, idx) => <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#243B64] mt-2 shrink-0" />
                  <span className="leading-relaxed">{resp}</span>
                </li>)}
            </ul>
          </div>

          {
    /* Requirements */
  }
          <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#243B64]" />
              <span>Aranan Nitelikler & Teknik Yetkinlikler</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-[#4A5568]">
              {selectedJob.requirements.map((req, idx) => <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                  <span className="leading-relaxed">{req}</span>
                </li>)}
            </ul>
          </div>

          {
    /* Benefits */
  }
          <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#243B64]" />
              <span>Yan Haklar & Çalışan Avantajları</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedJob.benefits.map((benefit, idx) => <div
    key={idx}
    className="p-3 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs font-medium text-[#202938] flex items-center gap-2"
  >
                  <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{benefit}</span>
                </div>)}
            </div>
          </div>
        </div>

        {
    /* Right Column: AI Compatibility Breakdown (5 Cols) */
  }
        <div className="lg:col-span-5 space-y-6">
          {
    /* AI Match Overview Card */
  }
          <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#243B64]" />
                <h3 className="text-base font-bold text-[#202938]">Yapay Zeka Uyum Analizi</h3>
              </div>
              <span
    className={`px-3 py-1 rounded-full text-xs font-bold border ${isTopMatch ? "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]" : "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"}`}
  >
                %{selectedJob.matchScore} Genel Uyum
              </span>
            </div>

            {
    /* Rationale explanation */
  }
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#334155] leading-relaxed">
              <strong className="text-[#243B64] font-semibold block mb-1">
                Eşleşme Raporu:
              </strong>
              {selectedJob.matchRationale}
            </div>

            {
    /* Compatibility Breakdown Bars */
  }
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-[#202938] block">Kategori Bazlı AI Uyum Puanları</span>

              {
    /* Technical Skills */
  }
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#667085]">Teknik Beceriler</span>
                  <span className="font-bold text-[#202938]">%{selectedJob.matchBreakdown.technicalSkills}</span>
                </div>
                <div className="h-2 w-full bg-[#EEF2F6] rounded-full overflow-hidden">
                  <div
    className="h-full bg-[#243B64] rounded-full transition-all duration-500"
    style={{ width: `${selectedJob.matchBreakdown.technicalSkills}%` }}
  />
                </div>
              </div>

              {
    /* Experience */
  }
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#667085]">Deneyim Seviyesi</span>
                  <span className="font-bold text-[#202938]">%{selectedJob.matchBreakdown.experience}</span>
                </div>
                <div className="h-2 w-full bg-[#EEF2F6] rounded-full overflow-hidden">
                  <div
    className="h-full bg-[#10B981] rounded-full transition-all duration-500"
    style={{ width: `${selectedJob.matchBreakdown.experience}%` }}
  />
                </div>
              </div>

              {
    /* Education & Background */
  }
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#667085]">Eğitim & Altyapı</span>
                  <span className="font-bold text-[#202938]">%{selectedJob.matchBreakdown.education}</span>
                </div>
                <div className="h-2 w-full bg-[#EEF2F6] rounded-full overflow-hidden">
                  <div
    className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
    style={{ width: `${selectedJob.matchBreakdown.education}%` }}
  />
                </div>
              </div>

              {
    /* Work Model */
  }
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#667085]">Çalışma Modeli Uyumu</span>
                  <span className="font-bold text-[#202938]">%{selectedJob.matchBreakdown.workModel}</span>
                </div>
                <div className="h-2 w-full bg-[#EEF2F6] rounded-full overflow-hidden">
                  <div
    className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
    style={{ width: `${selectedJob.matchBreakdown.workModel}%` }}
  />
                </div>
              </div>
            </div>

            {
    /* Matching Skills */
  }
            <div className="space-y-2 pt-2 border-t border-[#F1F3F5]">
              <span className="text-xs font-bold text-[#15803D] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CV'nizde Doğrulanan Eşleşen Beceriler ({selectedJob.matchingSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.matchingSkills.map((skill, idx) => <span
    key={idx}
    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
  >
                    <Check className="w-3 h-3" />
                    {skill}
                  </span>)}
              </div>
            </div>

            {
    /* Missing Skills & Recommendation */
  }
            {selectedJob.missingSkills.length > 0 && <div className="space-y-2 pt-2 border-t border-[#F1F3F5]">
                <span className="text-xs font-bold text-[#B45309] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Eksik / Geliştirilmesi Gereken Beceriler ({selectedJob.missingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.missingSkills.map((skill, idx) => <span
    key={idx}
    className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7]"
  >
                      {skill}
                    </span>)}
                </div>
                <button
    type="button"
    onClick={() => onNavigate("learning-recommendations")}
    className="w-full mt-2 py-2 px-3 bg-[#F7F8FA] hover:bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#243B64] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
  >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bu beceriler için Eğitim Önerilerini Gör</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>}

            {
    /* Direct Action Box in sidebar */
  }
            <div className="pt-3 border-t border-[#F1F3F5] space-y-2">
              <button
    type="button"
    onClick={handleOpenExternal}
    className="w-full py-3 bg-[#243B64] hover:bg-[#1b2d4f] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
  >
                <span>İlana Git (Kariyer Portalı)</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-[#94A3B8]">
                {selectedJob.company} başvuru formu yeni pencerede açılır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  JobDetailsView
};
