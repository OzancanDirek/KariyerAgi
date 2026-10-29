import { useState } from "react";
import {
  Briefcase,
  DollarSign,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Eye,
  FileText,
  ShieldCheck,
  X
} from "lucide-react";
const CreateJobListingView = ({
  user,
  company,
  onAddJob,
  onNavigate
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("frontend");
  const [workModel, setWorkModel] = useState("hybrid");
  const [location, setLocation] = useState("\u0130stanbul (Levent)");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Senior (3-5 Y\u0131l)");
  const [salaryMin, setSalaryMin] = useState("85.000");
  const [salaryMax, setSalaryMax] = useState("115.000");
  const [currency, setCurrency] = useState("\u20BA");
  const [deadline, setDeadline] = useState("30 Kas\u0131m 2026");
  const [description, setDescription] = useState(
    "Milyonlarca kullan\u0131c\u0131ya hizmet veren dijital platformlar\u0131m\u0131z\u0131n \xF6n y\xFCz mimarisini geli\u015Ftirecek, y\xFCksek performansl\u0131 ve modern bile\u015Fen k\xFCt\xFCphaneleri \xFCretecek tak\u0131m arkada\u015F\u0131 ar\u0131yoruz."
  );
  const [responsibilities, setResponsibilities] = useState([
    "Modern React ve TypeScript ile y\xFCksek performansl\u0131 aray\xFCzlerin geli\u015Ftirilmesi",
    "Tasar\u0131m sistemi bile\u015Fen k\xFCt\xFCphanesinin s\xFCrd\xFCr\xFClmesi ve eri\u015Filebilirlik optimizasyonlar\u0131",
    "RESTful API ve WebSocket entegrasyonlar\u0131n\u0131n yap\u0131lmas\u0131",
    "Birim ve entegrasyon testlerinin yaz\u0131larak kod kalitesinin y\xFCkseltilmesi"
  ]);
  const [newResp, setNewResp] = useState("");
  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Tailwind CSS",
    "RESTful API",
    "Git & GitHub"
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [benefits, setBenefits] = useState([
    "\xD6zel Sa\u011Fl\u0131k Sigortas\u0131 (Aile Kapsaml\u0131)",
    "Ayl\u0131k Yemek Kart\u0131 & Al\u0131\u015Fveri\u015F \xC7eki",
    "En \xDCst Seviye Donan\u0131m Paketi (MacBook Pro)",
    "Ki\u015Fisel Geli\u015Fim & Konferans B\xFCt\xE7esi"
  ]);
  const [newBenefit, setNewBenefit] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleAddResponsibility = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp("");
    }
  };
  const handleRemoveResponsibility = (idx) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };
  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };
  const handleRemoveBenefit = (idx) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };
  const handleSaveDraft = () => {
    showToast("\u0130lan taslak olarak kaydedildi. Diledi\u011Finiz zaman d\xFCzenlemeye devam edebilirsiniz.");
  };
  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("L\xFCtfen pozisyon ba\u015Fl\u0131\u011F\u0131n\u0131 girin.");
      return;
    }
    const workModelLabel = workModel === "remote" ? "Tamamen Uzaktan (Remote)" : workModel === "hybrid" ? "Hibrit (Haftada 2 g\xFCn ofis)" : "Ofis Odakl\u0131";
    const newJob = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.name,
      companyLogoText: company.logoText,
      companyColor: company.logoColor,
      location,
      workModel,
      workModelLabel,
      salaryRange: `${currency}${salaryMin} - ${currency}${salaryMax} / Ay`,
      category,
      experienceLevel,
      postedDate: "Bug\xFCn (Yeni)",
      deadline,
      externalUrl: company.website,
      platformName: `${company.name} Kariyer Portal\u0131`,
      matchScore: 92,
      matchBreakdown: {
        technicalSkills: 94,
        experience: 90,
        education: 90,
        workModel: 95
      },
      matchingSkills: skills.slice(0, 4),
      missingSkills: ["Fintech G\xFCvenli\u011Fi"],
      matchRationale: `CV'nizdeki yetkinlikler ${company.name} taraf\u0131ndan yeni a\xE7\u0131lan bu pozisyonun gereksinimleriyle %92 oran\u0131nda \xF6rt\xFC\u015Fmektedir.`,
      description,
      responsibilities,
      requirements: [
        `${experienceLevel} seviyesinde kan\u0131tlanm\u0131\u015F ticari yaz\u0131l\u0131m geli\u015Ftirme deneyimi`,
        `${skills.join(", ")} teknolojilerinde ileri d\xFCzey hakimiyet`,
        "Ekip \xE7al\u0131\u015Fmas\u0131na yatk\u0131nl\u0131k ve \u015Feffaf ileti\u015Fim becerisi",
        "Analitik d\xFC\u015F\xFCnme ve performans optimizasyonu refleksi"
      ],
      benefits,
      isSaved: false
    };
    onAddJob(newJob);
    showToast(`"${newJob.title}" ilan\u0131 ba\u015Far\u0131yla yay\u0131nland\u0131!`);
    setTimeout(() => {
      onNavigate("job-listings");
    }, 1200);
  };
  return <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-[#3b5582] animate-fade-in">
          <Check className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>}

      {
    /* Screen 2 Header */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded">
                Modül 07 · Ekran 2 / 3
              </span>
              <span className="text-xs text-[#667085]">İşveren Portalı</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202938] tracking-tight">
              Yeni İş İlanı Oluştur
            </h1>
            <p className="text-sm text-[#4A5568] mt-1">
              Pozisyon gereksinimlerini belirleyin; yapay zeka sistemimiz CV'leri tarayarak en uyumlu adayları otomatik olarak önceliklendirsin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
    type="button"
    onClick={handleSaveDraft}
    className="px-4 py-2.5 bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
  >
              Taslak Kaydet
            </button>
            <button
    type="button"
    onClick={() => setShowPreview(true)}
    className="px-4 py-2.5 bg-[#EEF2F6] hover:bg-[#E2E8F0] text-[#243B64] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
  >
              <Eye className="w-4 h-4" />
              <span>Önizleme</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Form Card */
  }
      <form onSubmit={handlePublish} className="bg-white border border-[#E3E7ED] rounded-xl p-6 lg:p-8 shadow-xs space-y-6">
        {
    /* Section 1: Temel Bilgiler */
  }
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#F1F3F5] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#243B64]" />
            <span>1. Pozisyon ve Temel Bilgiler</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Pozisyon Başlığı <span className="text-red-500">*</span>
              </label>
              <input
    type="text"
    required
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Örn: Senior Frontend Geliştirici (React & TypeScript)"
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Kategori / Departman <span className="text-red-500">*</span>
              </label>
              <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  >
                <option value="frontend">Ön Yüz (Frontend Engineering)</option>
                <option value="backend">Arka Yüz (Backend Engineering)</option>
                <option value="fullstack">Full-Stack Geliştirme</option>
                <option value="mobile">Mobil Uygulama (iOS / Android)</option>
                <option value="devops">DevOps & Cloud Mimari</option>
                <option value="uiux">UI / UX Tasarım</option>
                <option value="data">Yapay Zeka & Veri Bilimi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Çalışma Modeli <span className="text-red-500">*</span>
              </label>
              <select
    value={workModel}
    onChange={(e) => setWorkModel(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  >
                <option value="remote">Tamamen Uzaktan (100% Remote)</option>
                <option value="hybrid">Hibrit (Haftada 2 gün ofis)</option>
                <option value="office">Ofis Odaklı (Yüz Yüze)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Konum / Şehir <span className="text-red-500">*</span>
              </label>
              <input
    type="text"
    required
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Örn: İstanbul (Levent) veya Türkiye (Uzaktan)"
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Deneyim Seviyesi <span className="text-red-500">*</span>
              </label>
              <select
    value={experienceLevel}
    onChange={(e) => setExperienceLevel(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  >
                <option value="Junior-Mid (1-3 Yıl)">Junior - Mid (1-3 Yıl Deneyim)</option>
                <option value="Mid-Level (2-4 Yıl)">Mid-Level (2-4 Yıl Deneyim)</option>
                <option value="Mid-Senior (3-5 Yıl)">Mid-Senior (3-5 Yıl Deneyim)</option>
                <option value="Senior (5+ Yıl)">Senior (5+ Yıl Deneyim)</option>
                <option value="Lead / Staff (7+ Yıl)">Lead / Staff Architect (7+ Yıl)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Son Başvuru Tarihi
              </label>
              <input
    type="text"
    value={deadline}
    onChange={(e) => setDeadline(e.target.value)}
    placeholder="Örn: 30 Kasım 2026"
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>
          </div>
        </div>

        {
    /* Section 2: Maaş Aralığı */
  }
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#F1F3F5] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#243B64]" />
            <span>2. Maaş Aralığı ve Ödeme Koşulları</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Para Birimi
              </label>
              <select
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  >
                <option value="₺">₺ Türk Lirası (TRY)</option>
                <option value="$">$ Amerikan Doları (USD)</option>
                <option value="€">€ Euro (EUR)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Minimum Aylık Maaş
              </label>
              <input
    type="text"
    value={salaryMin}
    onChange={(e) => setSalaryMin(e.target.value)}
    placeholder="Örn: 85.000"
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Maksimum Aylık Maaş
              </label>
              <input
    type="text"
    value={salaryMax}
    onChange={(e) => setSalaryMax(e.target.value)}
    placeholder="Örn: 115.000"
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>
          </div>
        </div>

        {
    /* Section 3: Açıklama ve Sorumluluklar */
  }
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#F1F3F5] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#243B64]" />
            <span>3. İş Tanımı ve Sorumluluklar</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1.5">
              Pozisyon Özeti ve Rol Tanımı <span className="text-red-500">*</span>
            </label>
            <textarea
    rows={3}
    required
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64] leading-relaxed"
  />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1.5">
              Temel Sorumluluklar
            </label>
            <div className="space-y-2 mb-3">
              {responsibilities.map((resp, idx) => <div
    key={idx}
    className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#334155]"
  >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#243B64] shrink-0" />
                    <span>{resp}</span>
                  </span>
                  <button
    type="button"
    onClick={() => handleRemoveResponsibility(idx)}
    className="text-[#94A3B8] hover:text-red-500 p-1 cursor-pointer"
  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>)}
            </div>

            <div className="flex gap-2">
              <input
    type="text"
    value={newResp}
    onChange={(e) => setNewResp(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddResponsibility())}
    placeholder="Yeni sorumluluk maddesi ekleyin..."
    className="flex-1 px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
              <button
    type="button"
    onClick={handleAddResponsibility}
    className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer flex items-center gap-1"
  >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {
    /* Section 4: Aranan Beceriler (Skill Chips) */
  }
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#F1F3F5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#243B64]" />
            <span>4. Aranan Beceriler ve Nitelikler (AI Eşleşme Anahtarları)</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1.5">
              Öncelikli Beceriler (Aday CV eşleştirmelerinde kullanılır)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, idx) => <span
    key={idx}
    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
  >
                  <span>{skill}</span>
                  <button
    type="button"
    onClick={() => handleRemoveSkill(skill)}
    className="hover:text-red-500 cursor-pointer"
  >
                    <X className="w-3 h-3" />
                  </button>
                </span>)}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
    type="text"
    value={newSkill}
    onChange={(e) => setNewSkill(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
    placeholder="Beceri adı (örn: Next.js, GraphQL, Docker)..."
    className="flex-1 px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
              <button
    type="button"
    onClick={handleAddSkill}
    className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer flex items-center gap-1"
  >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {
    /* Section 5: Yan Haklar & Avantajlar */
  }
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#F1F3F5] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#243B64]" />
            <span>5. Yan Haklar & Çalışan Avantajları</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {benefits.map((b, idx) => <div
    key={idx}
    className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#334155]"
  >
                <span className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{b}</span>
                </span>
                <button
    type="button"
    onClick={() => handleRemoveBenefit(idx)}
    className="text-[#94A3B8] hover:text-red-500 p-1 cursor-pointer"
  >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>)}
          </div>

          <div className="flex gap-2 max-w-md">
            <input
    type="text"
    value={newBenefit}
    onChange={(e) => setNewBenefit(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBenefit())}
    placeholder="Yeni yan hak (örn: Özel Sağlık Sigortası)..."
    className="flex-1 px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            <button
    type="button"
    onClick={handleAddBenefit}
    className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer flex items-center gap-1"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>Ekle</span>
            </button>
          </div>
        </div>

        {
    /* Submit Bar */
  }
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#F1F3F5]">
          <span className="text-xs text-[#667085]">
            İlan yayınlandığında aday havuzundaki CV'lerle anında eşleştirilir.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
    type="button"
    onClick={() => onNavigate("company-profile")}
    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#CBD5E1] text-[#667085] hover:bg-[#F8FAFC] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
  >
              İptal
            </button>
            <button
    type="submit"
    className="w-full sm:w-auto px-6 py-2.5 bg-[#243B64] hover:bg-[#1b2d4f] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
  >
              <Check className="w-4 h-4" />
              <span>İlanı Yayınla</span>
            </button>
          </div>
        </div>
      </form>

      {
    /* Preview Modal */
  }
      {showPreview && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <span className="text-xs font-bold text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded uppercase">
                İlan Önizlemesi
              </span>
              <button
    type="button"
    onClick={() => setShowPreview(false)}
    className="text-[#94A3B8] hover:text-[#202938] cursor-pointer"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div
    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xs shrink-0"
    style={{ backgroundColor: company.logoColor || "#5D3EBC" }}
  >
                {company.logoText}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#667085]">{company.name}</span>
                <h3 className="text-lg font-bold text-[#202938]">{title || "Ba\u015Fl\u0131k Belirtilmedi"}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                  <span>{location}</span>
                  <span>·</span>
                  <span>{experienceLevel}</span>
                  <span>·</span>
                  <span className="font-bold text-[#202938]">
                    {currency}{salaryMin} - {currency}{salaryMax} / Ay
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#4A5568] leading-relaxed">{description}</p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202938] block">Aranan Beceriler:</span>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => <span
    key={idx}
    className="text-xs px-2.5 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
  >
                    {s}
                  </span>)}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F3F5] flex justify-end">
              <button
    type="button"
    onClick={() => setShowPreview(false)}
    className="px-5 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer"
  >
                Önizlemeyi Kapat
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export {
  CreateJobListingView
};
