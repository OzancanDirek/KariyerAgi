import { useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Mail,
  Edit3,
  Check,
  X,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Plus,
  ArrowRight
} from "lucide-react";
const CompanyProfileView = ({
  user,
  company,
  jobs,
  onUpdateCompany,
  onNavigate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(company);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleSave = (e) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setIsEditing(false);
    showToast("\u015Eirket profili ba\u015Far\u0131yla g\xFCncellendi.");
  };
  const handleCancel = () => {
    setFormData(company);
    setIsEditing(false);
  };
  const companyJobs = jobs.filter(
    (j) => j.company.toLowerCase().includes("getir") || j.company === company.name
  );
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-[#3b5582] animate-fade-in">
          <Check className="w-4 h-4 text-[#10B981]" />
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
                Modül 07 · Ekran 1 / 3
              </span>
              <span className="text-xs text-[#667085]">İşveren & Şirket Portalı</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202938] tracking-tight">
              Şirket Profili & İşveren Paneli
            </h1>
            <p className="text-sm text-[#4A5568] mt-1 max-w-2xl">
              Şirketinizin marka kimliğini, merkez ve ofis lokasyonlarını, kültürünü ve açık pozisyonlarını yönetin. Adaylar başvurularında bu bilgileri görüntüler.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isEditing ? <button
    type="button"
    onClick={() => setIsEditing(true)}
    className="px-4 py-2.5 bg-white hover:bg-[#F7F8FA] border border-[#CBD5E1] text-[#243B64] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
  >
                <Edit3 className="w-4 h-4" />
                <span>Profili Düzenle</span>
              </button> : <button
    type="button"
    onClick={handleCancel}
    className="px-4 py-2.5 bg-white hover:bg-[#F7F8FA] border border-[#CBD5E1] text-[#667085] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
  >
                <X className="w-4 h-4" />
                <span>İptal</span>
              </button>}

            <button
    type="button"
    onClick={() => onNavigate("create-job")}
    className="px-4 py-2.5 bg-[#243B64] hover:bg-[#1b2d4f] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
  >
              <Plus className="w-4 h-4" />
              <span>Yeni İlan Oluştur</span>
            </button>
          </div>
        </div>

        {
    /* Quick Employer Metrics Bar */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F1F3F5]">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-center">
            <span className="text-xs text-[#64748B] block font-medium">Aktif İlanlar</span>
            <span className="text-xl font-bold text-[#202938]">6 Pozisyon</span>
          </div>
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 text-center">
            <span className="text-xs text-[#1D4ED8] block font-medium">Toplam Başvuran</span>
            <span className="text-xl font-bold text-[#1D4ED8]">48 Aday</span>
          </div>
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 text-center">
            <span className="text-xs text-[#15803D] block font-medium">%90+ AI Uyum</span>
            <span className="text-xl font-bold text-[#15803D]">14 Aday</span>
          </div>
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-lg p-3 text-center">
            <span className="text-xs text-[#7E22CE] block font-medium">Mülakat Sürecinde</span>
            <span className="text-xl font-bold text-[#7E22CE]">7 Aday</span>
          </div>
        </div>
      </div>

      {
    /* Main Profile View / Edit Form */
  }
      {isEditing ? <form onSubmit={handleSave} className="bg-white border border-[#E3E7ED] rounded-xl p-6 lg:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
            <h2 className="text-lg font-bold text-[#202938] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#243B64]" />
              <span>Şirket Bilgilerini Düzenle</span>
            </h2>
            <span className="text-xs text-[#667085]">Zorunlu alanları eksiksiz doldurun</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {
    /* Company Name */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Şirket Adı <span className="text-red-500">*</span>
              </label>
              <input
    type="text"
    required
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            {
    /* Industry */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Sektör / Faaliyet Alanı <span className="text-red-500">*</span>
              </label>
              <input
    type="text"
    required
    value={formData.industry}
    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            {
    /* Website */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Resmî Web Sitesi <span className="text-red-500">*</span>
              </label>
              <input
    type="url"
    required
    value={formData.website}
    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            {
    /* Headquarters */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Genel Merkez <span className="text-red-500">*</span>
              </label>
              <input
    type="text"
    required
    value={formData.headquarters}
    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            {
    /* Employee Count */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Çalışan Sayısı Aralığı
              </label>
              <select
    value={formData.employeeCount}
    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  >
                <option value="1 - 50 Çalışan">1 - 50 Çalışan (Erken Aşama Startup)</option>
                <option value="50 - 250 Çalışan">50 - 250 Çalışan (Büyüyen Şirket)</option>
                <option value="250 - 1.000 Çalışan">250 - 1.000 Çalışan (Orta Ölçek)</option>
                <option value="1.000 - 5.000 Çalışan">1.000 - 5.000 Çalışan (Büyük Ölçek / Unicorn)</option>
                <option value="5.000+ Çalışan">5.000+ Çalışan (Global Enterprise)</option>
              </select>
            </div>

            {
    /* Founded Year */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Kuruluş Yılı
              </label>
              <input
    type="text"
    value={formData.foundedYear}
    onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            {
    /* Contact Email */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                İşe Alım / Yetenek İletişim E-Postası <span className="text-red-500">*</span>
              </label>
              <input
    type="email"
    required
    value={formData.contactEmail}
    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>

            {
    /* Phone */
  }
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                İletişim Telefonu
              </label>
              <input
    type="text"
    value={formData.phone || ""}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
            </div>
          </div>

          {
    /* Description */
  }
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-1.5">
              Şirket Açıklaması & Kültür <span className="text-red-500">*</span>
            </label>
            <textarea
    rows={4}
    required
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64] leading-relaxed"
  />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F3F5]">
            <button
    type="button"
    onClick={handleCancel}
    className="px-5 py-2.5 bg-white border border-[#CBD5E1] text-[#667085] text-xs font-semibold rounded-lg hover:bg-[#F7F8FA] transition-colors cursor-pointer"
  >
              Vazgeç
            </button>
            <button
    type="submit"
    className="px-6 py-2.5 bg-[#243B64] hover:bg-[#1b2d4f] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
  >
              <Check className="w-4 h-4" />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </form> : (
    /* Read-Only Profile Card */
    <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 lg:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-[#F1F3F5]">
            <div className="flex items-start gap-5">
              {
      /* Company Logo Display */
    }
              <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-sm shrink-0"
      style={{ backgroundColor: company.logoColor || "#5D3EBC" }}
    >
                {company.logoText}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#202938] tracking-tight">{company.name}</h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                    <ShieldCheck className="w-3 h-3" />
                    Doğrulanmış İşveren
                  </span>
                </div>
                <p className="text-sm font-medium text-[#64748B]">{company.industry}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085] pt-1">
                  <a
      href={company.website}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[#243B64] hover:underline font-semibold"
    >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{company.website.replace("https://", "")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {company.headquarters}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {company.employeeCount}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    Kuruluş: {company.foundedYear}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
      type="button"
      onClick={() => onNavigate("applicant-management")}
      className="px-4 py-2 bg-[#EEF2F6] hover:bg-[#E2E8F0] text-[#243B64] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
    >
                <Users className="w-3.5 h-3.5" />
                <span>Adayları Yönet (48)</span>
              </button>
            </div>
          </div>

          {
      /* Description Section */
    }
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Şirket Hakkında & Mühendislik Vizyonu
            </h3>
            <p className="text-sm text-[#334155] leading-relaxed">
              {company.description}
            </p>
          </div>

          {
      /* Locations and Contact Grid */
    }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#202938] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#243B64]" />
                <span>Faaliyet ve Teknoloji Merkezleri</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {company.operatingLocations.map((loc, idx) => <span
      key={idx}
      className="text-xs px-2.5 py-1 bg-white border border-[#CBD5E1] rounded-md font-medium text-[#475569]"
    >
                    {loc}
                  </span>)}
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#202938] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#243B64]" />
                <span>İletişim & Yetenek Edinimi</span>
              </span>
              <div className="space-y-1 text-xs text-[#475569] pt-1">
                <p className="flex items-center gap-2">
                  <span className="text-[#94A3B8]">E-posta:</span>
                  <span className="font-semibold text-[#202938]">{company.contactEmail}</span>
                </p>
                {company.phone && <p className="flex items-center gap-2">
                    <span className="text-[#94A3B8]">Telefon:</span>
                    <span className="font-semibold text-[#202938]">{company.phone}</span>
                  </p>}
              </div>
            </div>
          </div>
        </div>
  )}

      {
    /* Active Jobs Section for this Company */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F3F5]">
          <div>
            <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#243B64]" />
              <span>Yayınlanan Açık İlanlar ({companyJobs.length})</span>
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Bu şirket adına sistemde yayınlanan güncel pozisyonlar
            </p>
          </div>
          <button
    type="button"
    onClick={() => onNavigate("create-job")}
    className="text-xs font-bold text-[#243B64] hover:underline flex items-center gap-1 cursor-pointer"
  >
            <span>+ Yeni İlan Ekle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyJobs.map((job) => <div
    key={job.id}
    className="p-4 border border-[#E2E8F0] rounded-xl hover:border-[#93C5FD] transition-colors space-y-2.5 bg-[#FAFBFD]"
  >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-[#202938] line-clamp-1">{job.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] shrink-0 border border-[#DCFCE7]">
                  Aktif Yayında
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#94A3B8]" />
                  {job.location}
                </span>
                <span>·</span>
                <span className="text-[#202938] font-medium">{job.salaryRange}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#EEF2F6]">
                <span className="text-[11px] text-[#94A3B8]">{job.postedDate} yayınlandı</span>
                <button
    type="button"
    onClick={() => onNavigate("applicant-management")}
    className="text-xs font-semibold text-[#243B64] hover:underline flex items-center gap-1 cursor-pointer"
  >
                  <span>Adayları İncele</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export {
  CompanyProfileView
};
