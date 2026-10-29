import { useState, useMemo } from "react";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Check,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Share2
} from "lucide-react";
const JobListingView = ({
  user,
  jobs,
  onSelectJob,
  onNavigate,
  onToggleSaveJob,
  initialSelectedJob = null
}) => {
  const [activeJobDetail, setActiveJobDetail] = useState(initialSelectedJob);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkModel, setSelectedWorkModel] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [onlySaved, setOnlySaved] = useState(false);
  const [sortBy, setSortBy] = useState("match");
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleOpenExternalJob = (job, e) => {
    if (e) {
      e.stopPropagation();
    }
    window.open(job.externalUrl, "_blank", "noopener,noreferrer");
    showToast(`"${job.company}" resm\xEE kariyer sayfas\u0131 yeni sekmede a\xE7\u0131ld\u0131.`);
  };
  const handleOpenJobDetails = (job) => {
    setActiveJobDetail(job);
    if (onSelectJob) {
      onSelectJob(job);
    }
  };
  const handleCloseJobDetails = () => {
    setActiveJobDetail(null);
  };
  const handleShare = (job) => {
    navigator.clipboard.writeText(job.externalUrl);
    showToast("\u0130lan ba\u011Flant\u0131s\u0131 panoya kopyaland\u0131.");
  };
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase()) || job.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) || job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWorkModel = selectedWorkModel === "all" || job.workModel === selectedWorkModel;
      const matchesExp = selectedExperience === "all" || selectedExperience === "junior" && job.experienceLevel.includes("Junior") || selectedExperience === "mid" && job.experienceLevel.includes("Mid") || selectedExperience === "senior" && job.experienceLevel.includes("Senior");
      const matchesSaved = !onlySaved || job.isSaved;
      return matchesSearch && matchesWorkModel && matchesExp && matchesSaved;
    }).sort((a, b) => {
      if (sortBy === "match") {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === "recent") {
        return a.postedDate.localeCompare(b.postedDate);
      }
      return b.matchScore - a.matchScore;
    });
  }, [jobs, searchQuery, selectedWorkModel, selectedExperience, onlySaved, sortBy]);
  const totalJobs = jobs.length;
  const highMatchJobs = jobs.filter((j) => j.matchScore >= 90).length;
  const savedCount = jobs.filter((j) => j.isSaved).length;
  if (activeJobDetail) {
    const isTopMatch = activeJobDetail.matchScore >= 90;
    return <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {
      /* Toast Notification */
    }
        {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-[#3b5582] animate-fade-in">
            <ExternalLink className="w-4 h-4 text-[#60A5FA]" />
            <span>{toastMessage}</span>
          </div>}

        {
      /* Top Back Navigation Bar */
    }
        <div className="flex items-center justify-between">
          <button
      type="button"
      onClick={handleCloseJobDetails}
      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#243B64] bg-white hover:bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer group shadow-2xs"
    >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>← Tüm İş İlanlarına Dön</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <span className="font-bold text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded text-[11px]">
              Modül 06
            </span>
            <span>İş İlanı Detayı</span>
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
      style={{ backgroundColor: activeJobDetail.companyColor || "#243B64" }}
    >
                {activeJobDetail.companyLogoText}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#667085]">{activeJobDetail.company}</span>
                  <span className="text-[#CBD5E1]">·</span>
                  <span className="text-xs text-[#667085] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {activeJobDetail.location}
                  </span>
                  <span className="text-[#CBD5E1]">·</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F1F5F9] font-medium text-[#475569]">
                    {activeJobDetail.workModelLabel}
                  </span>
                  <span className="text-[#CBD5E1]">·</span>
                  <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {activeJobDetail.platformName || "Do\u011Frulanm\u0131\u015F \u015Eirket \u0130lan\u0131"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-[#202938] tracking-tight">
                  {activeJobDetail.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085] pt-1">
                  <span className="flex items-center gap-1 font-semibold text-[#202938]">
                    <DollarSign className="w-4 h-4 text-[#243B64]" />
                    {activeJobDetail.salaryRange}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {activeJobDetail.experienceLevel}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {activeJobDetail.postedDate} yayınlandı
                  </span>
                </div>
              </div>
            </div>

            {
      /* Header Right Action CTA */
    }
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E3E7ED]">
              <button
      type="button"
      onClick={() => onToggleSaveJob(activeJobDetail.id)}
      className={`px-4 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${activeJobDetail.isSaved ? "bg-[#243B64] text-white border-[#243B64]" : "bg-white text-[#243B64] border-[#CBD5E1] hover:bg-[#F8FAFC]"}`}
    >
                <Bookmark className={`w-4 h-4 ${activeJobDetail.isSaved ? "fill-current" : ""}`} />
                <span>{activeJobDetail.isSaved ? "Kaydedildi" : "\u0130lan\u0131 Kaydet"}</span>
              </button>

              <button
      type="button"
      onClick={() => handleShare(activeJobDetail)}
      className="p-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#667085] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
      title="Paylaş"
    >
                <Share2 className="w-4 h-4" />
              </button>

              <button
      type="button"
      onClick={() => handleOpenExternalJob(activeJobDetail)}
      className="px-5 py-2.5 rounded-lg bg-[#243B64] hover:bg-[#1b2d4f] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
    >
                <span>İlana Git (Resmî Sayfada Aç)</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {
      /* AI Match Overview Banner */
    }
        <div
      className={`rounded-xl border p-6 shadow-xs ${isTopMatch ? "bg-[#F0FDF4] border-[#BBF7D0]" : "bg-[#EFF6FF] border-[#BFDBFE]"}`}
    >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${isTopMatch ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#DBEAFE] text-[#1D4ED8]"}`}
    >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>%{activeJobDetail.matchScore} Genel Eşleşme Skoru</span>
                </span>
                <span className="text-xs text-[#667085]">
                  · CV ve Beceri Haritanız ile Doğrulandı
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#202938]">
                {isTopMatch ? "M\xFCkemmel Uyumlu Pozisyon" : "Y\xFCksek Potansiyelli Pozisyon"}
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {activeJobDetail.matchRationale}
              </p>
            </div>

            {
      /* Circular or Bar Score */
    }
            <div className="bg-white border border-[#E3E7ED] rounded-xl p-4 text-center min-w-[140px] shadow-2xs">
              <span className="text-xs text-[#667085] block font-medium">Uyum Skoru</span>
              <span
      className={`text-3xl font-extrabold block my-1 ${isTopMatch ? "text-[#15803D]" : "text-[#1D4ED8]"}`}
    >
                %{activeJobDetail.matchScore}
              </span>
              <span className="text-[11px] text-[#667085]">
                {activeJobDetail.matchingSkills.length} Eşleşen Beceri
              </span>
            </div>
          </div>
        </div>

        {
      /* Two Column Grid: Left Content (Desc & Resp), Right Sidebar (AI Skills Breakdown) */
    }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {
      /* Left Column (8 cols): Job Description, Responsibilities & Requirements */
    }
          <div className="lg:col-span-8 space-y-6">
            {
      /* Job Description */
    }
            <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#202938] pb-3 border-b border-[#E3E7ED] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#243B64]" />
                <span>İş Tanımı ve Genel Bakış</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                {activeJobDetail.description}
              </p>
            </div>

            {
      /* Responsibilities */
    }
            <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#202938] pb-3 border-b border-[#E3E7ED] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F8F83]" />
                <span>Sorumluluklar ve Görevler</span>
              </h2>
              <ul className="space-y-2.5">
                {activeJobDetail.responsibilities.map((resp, idx) => <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A5568]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#243B64] mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>)}
              </ul>
            </div>

            {
      /* Requirements */
    }
            <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#202938] pb-3 border-b border-[#E3E7ED] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#243B64]" />
                <span>Aranan Nitelikler & Deneyim</span>
              </h2>
              <ul className="space-y-2.5">
                {activeJobDetail.requirements.map((req, idx) => <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A5568]">
                    <Check className="w-4 h-4 text-[#2F8F83] mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>)}
              </ul>
            </div>
          </div>

          {
      /* Right Column (4 cols): AI Matching & Missing Skills */
    }
          <div className="lg:col-span-4 space-y-6">
            {
      /* Matching Skills Card */
    }
            <div className="bg-white border border-[#E3E7ED] rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E7ED]">
                <h3 className="text-sm font-bold text-[#202938] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  <span>Eşleşen Becerileriniz ({activeJobDetail.matchingSkills.length})</span>
                </h3>
              </div>
              <p className="text-xs text-[#667085]">
                CV'nizde ve yetkinlik haritanızda mevcut olan ve ilanla birebir eşleşen teknolojiler:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeJobDetail.matchingSkills.map((skill, idx) => <span
      key={idx}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#15803D]"
    >
                    <Check className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{skill}</span>
                  </span>)}
              </div>
            </div>

            {
      /* Missing Skills Card */
    }
            {activeJobDetail.missingSkills.length > 0 && <div className="bg-white border border-[#E3E7ED] rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#E3E7ED]">
                  <h3 className="text-sm font-bold text-[#202938] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                    <span>Geliştirilebilir Beceriler ({activeJobDetail.missingSkills.length})</span>
                  </h3>
                </div>
                <p className="text-xs text-[#667085]">
                  Bu ilanda aranan ancak CV'nizde öne çıkmayan teknolojiler:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeJobDetail.missingSkills.map((skill, idx) => <span
      key={idx}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs font-semibold text-[#B45309]"
    >
                      <span>+ {skill}</span>
                    </span>)}
                </div>
              </div>}

            {
      /* Direct Official Link CTA Box */
    }
            <div className="bg-[#243B64] text-white rounded-xl p-5 shadow-md space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#93C5FD] bg-white/10 px-2 py-0.5 rounded">
                Resmî Başvuru Adresi
              </span>
              <h4 className="text-base font-bold text-white">
                Bu İlanı {activeJobDetail.company} Sayfasında Aç
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Tüm başvuru adımları şirketin resmî kariyer portalında gerçekleştirilir.
              </p>
              <button
      type="button"
      onClick={() => handleOpenExternalJob(activeJobDetail)}
      className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#243B64] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
    >
                <span>İlana Git</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#243B64]" />
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-[#3b5582] animate-fade-in">
          <ExternalLink className="w-4 h-4 text-[#60A5FA]" />
          <span>{toastMessage}</span>
        </div>}

      {
    /* Screen 1 Header / Overview */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded">
                Modül 06 · İş İlanları & Eşleşme
              </span>
              <span className="text-xs text-[#667085]">CV & Becerilerle Eşleştirildi</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202938] tracking-tight">
              AI İş İlanı Eşleştirme
            </h1>
            <p className="text-sm text-[#4A5568] mt-1 max-w-2xl">
              Yapay zeka, güncel CV'nizi ve yetkinlik haritanızı analiz ederek sektördeki açık pozisyonlarla karşılaştırdı. Bir ilana tıklayarak detayını ve AI uyum analizini görebilir veya <strong className="text-[#243B64]">"İlana Git"</strong> butonuyla doğrudan resmî sayfasına gidebilirsiniz.
            </p>
          </div>

          {
    /* Quick Metrics Bar */
  }
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg p-3 text-center min-w-[90px]">
              <span className="text-xs text-[#667085] block font-medium">Toplam İlan</span>
              <span className="text-xl font-bold text-[#202938]">{totalJobs}</span>
            </div>
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 text-center min-w-[90px]">
              <span className="text-xs text-[#15803D] block font-medium">%90+ Uyum</span>
              <span className="text-xl font-bold text-[#15803D]">{highMatchJobs} İlan</span>
            </div>
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 text-center min-w-[90px]">
              <span className="text-xs text-[#1D4ED8] block font-medium">Kaydedilen</span>
              <span className="text-xl font-bold text-[#1D4ED8]">{savedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Filter and Search Bar Controls */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {
    /* Search Box */
  }
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Pozisyon, şirket adı, şehir veya teknoloji ara (React, Getir, İstanbul...)"
    className="w-full pl-9 pr-4 py-2 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs sm:text-sm text-[#202938] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#243B64] focus:border-[#243B64]"
  />
          </div>

          {
    /* Filter Dropdowns */
  }
          <div className="flex items-center gap-2 flex-wrap">
            {
    /* Work Model */
  }
            <select
    value={selectedWorkModel}
    onChange={(e) => setSelectedWorkModel(e.target.value)}
    className="bg-[#F7F8FA] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64] cursor-pointer"
  >
              <option value="all">Tüm Çalışma Modelleri</option>
              <option value="remote">Uzaktan (Remote)</option>
              <option value="hybrid">Hibrit</option>
              <option value="office">Ofisten / Yerinde</option>
            </select>

            {
    /* Experience */
  }
            <select
    value={selectedExperience}
    onChange={(e) => setSelectedExperience(e.target.value)}
    className="bg-[#F7F8FA] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64] cursor-pointer"
  >
              <option value="all">Tüm Deneyim Seviyeleri</option>
              <option value="junior">Junior (0-2 Yıl)</option>
              <option value="mid">Mid-Level (2-5 Yıl)</option>
              <option value="senior">Senior (5+ Yıl)</option>
            </select>

            {
    /* Sort Dropdown */
  }
            <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-[#F7F8FA] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64] cursor-pointer"
  >
              <option value="match">Sıralama: AI Uyum Skoru</option>
              <option value="recent">Sıralama: En Yeni İlanlar</option>
            </select>

            {
    /* Saved Toggle */
  }
            <button
    type="button"
    onClick={() => setOnlySaved(!onlySaved)}
    className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${onlySaved ? "bg-[#243B64] text-white border-[#243B64]" : "bg-[#F7F8FA] text-[#667085] border-[#CBD5E1] hover:bg-[#EEF2F6]"}`}
  >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Kaydedilenler ({savedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* JobList Grid / Cards */
  }
      {filteredJobs.length === 0 ? <div className="bg-white border border-[#E3E7ED] rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto text-[#64748B]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202938]">Eşleşen İlan Bulunamadı</h3>
          <p className="text-xs text-[#667085] max-w-sm mx-auto">
            Arama kriterlerinizi genişleterek veya filtreleri temizleyerek daha fazla ilana ulaşabilirsiniz.
          </p>
          <button
    type="button"
    onClick={() => {
      setSearchQuery("");
      setSelectedWorkModel("all");
      setSelectedExperience("all");
      setOnlySaved(false);
    }}
    className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer"
  >
            Filtreleri Temizle
          </button>
        </div> : <div className="space-y-4">
          {filteredJobs.map((job) => {
    const isTopMatch = job.matchScore >= 90;
    return <div
      key={job.id}
      onClick={() => handleOpenJobDetails(job)}
      className={`bg-white border rounded-xl p-5 sm:p-6 transition-all hover:shadow-md cursor-pointer ${isTopMatch ? "border-[#93C5FD] ring-1 ring-[#DBEAFE]" : "border-[#E3E7ED]"}`}
    >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {
      /* Left: Company & Job Information */
    }
                  <div className="flex items-start gap-4 flex-1">
                    {
      /* Company Logo Badge */
    }
                    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0"
      style={{ backgroundColor: job.companyColor || "#243B64" }}
    >
                      {job.companyLogoText}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#667085]">{job.company}</span>
                        <span className="text-[#CBD5E1]">·</span>
                        <span className="text-xs text-[#667085] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#94A3B8]" />
                          {job.location}
                        </span>
                        <span className="text-[#CBD5E1]">·</span>
                        <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                          {job.workModelLabel}
                        </span>
                        <span className="text-[#CBD5E1]">·</span>
                        <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-[#EEF2F6] text-[#243B64]">
                          {job.experienceLevel}
                        </span>
                      </div>

                      {
      /* Job Title */
    }
                      <h2
      className="text-base sm:text-lg font-bold text-[#202938] hover:text-[#243B64] transition-colors leading-snug"
    >
                        {job.title}
                      </h2>

                      {
      /* AI Match Rationale Summary */
    }
                      <p className="text-xs text-[#4A5568] line-clamp-2 leading-relaxed pt-0.5">
                        <strong className="text-[#243B64] font-medium">AI Eşleşme Analizi: </strong>
                        {job.matchRationale}
                      </p>

                      {
      /* Skills match badge tags */
    }
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="text-[11px] font-semibold text-[#667085] mr-1">Eşleşenler:</span>
                        {job.matchingSkills.map((skill, idx) => <span
      key={idx}
      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
    >
                            <Check className="w-2.5 h-2.5" />
                            {skill}
                          </span>)}
                        {job.missingSkills.length > 0 && <>
                            <span className="text-[11px] font-semibold text-[#94A3B8] ml-2 mr-1">Eksik:</span>
                            {job.missingSkills.slice(0, 2).map((skill, idx) => <span
      key={idx}
      className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
    >
                                {skill}
                              </span>)}
                          </>}
                      </div>
                    </div>
                  </div>

                  {
      /* Right: AI Score & Actions */
    }
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F1F3F5]">
                    {
      /* Match Score Badge */
    }
                    <div className="flex items-center gap-2">
                      <div
      className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold text-xs ${isTopMatch ? "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]" : "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"}`}
    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>%{job.matchScore} Uyum</span>
                      </div>

                      {
      /* Bookmark Button */
    }
                      <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggleSaveJob(job.id);
      }}
      className={`p-2 rounded-lg border transition-colors cursor-pointer ${job.isSaved ? "bg-[#243B64] text-white border-[#243B64]" : "bg-white text-[#667085] border-[#E3E7ED] hover:bg-[#F7F8FA]"}`}
      title={job.isSaved ? "Kaydedilenlerden \xC7\u0131kar" : "\u0130lan\u0131 Kaydet"}
    >
                        <Bookmark className={`w-4 h-4 ${job.isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {
      /* Salary & Posted Date info */
    }
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-[#202938] block">{job.salaryRange}</span>
                      <span className="text-[11px] text-[#94A3B8]">{job.postedDate} yayınlandı</span>
                    </div>

                    {
      /* Action Buttons: "Detay & Analiz" and "İlana Git" */
    }
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleOpenJobDetails(job);
      }}
      className="px-3 py-2 bg-white hover:bg-[#F7F8FA] border border-[#CBD5E1] text-[#243B64] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
    >
                        <span>Detay & Analiz</span>
                      </button>

                      <button
      type="button"
      onClick={(e) => handleOpenExternalJob(job, e)}
      className="px-4 py-2 bg-[#243B64] hover:bg-[#1b2d4f] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
    >
                        <span>İlana Git</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>;
  })}
        </div>}
    </div>;
};
export {
  JobListingView
};
