import { useState } from "react";
import { Button } from "../../../../shared/ui/Button.jsx";
import { FormInput } from "../../../../shared/ui/FormInput.jsx";
import { Modal } from "../../../../shared/ui/Modal.jsx";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  FileText,
  UploadCloud,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  X
} from "lucide-react";
const CareerProfileView = ({
  user,
  onUpdateProfile
}) => {
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [title, setTitle] = useState(user.title || user.targetRole || "Frontend & Web Geli\u015Ftirici");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "+90 (555) 000 00 00");
  const [location, setLocation] = useState(user.location || "\u0130stanbul, T\xFCrkiye");
  const [linkedin, setLinkedin] = useState(user.linkedin || "linkedin.com/in/mehmetakiftutal");
  const [github, setGithub] = useState(user.github || "github.com/mehmetakiftutal");
  const [summary, setSummary] = useState(
    user.summary || "Modern web teknolojileri, React ve TypeScript ekosisteminde \xF6l\xE7eklenebilir ve eri\u015Filebilir aray\xFCzler tasarlayan, kullan\u0131c\u0131 odakl\u0131 d\xFC\u015F\xFCnen yaz\u0131l\u0131m geli\u015Ftirici."
  );
  const [experiences, setExperiences] = useState(
    user.experiences || [
      {
        id: "exp-1",
        title: "\xD6n Y\xFCz Geli\u015Ftirici Stajyeri",
        company: "Teknoloji Ar-Ge A.\u015E.",
        period: "Temmuz 2024 - Eyl\xFCl 2024 (3 Ay)",
        type: "Staj \xB7 Hibrit",
        description: "React ve Tailwind CSS kullan\u0131larak kurum i\xE7i y\xF6netim paneli bile\u015Fenleri geli\u015Ftirildi, RESTful API entegrasyonlar\u0131 yap\u0131ld\u0131."
      },
      {
        id: "exp-2",
        title: "Web Aray\xFCz Geli\u015Ftirici (Serbest / Proje Bazl\u0131)",
        company: "Akademik Portallar",
        period: "2023 - 2024",
        type: "Yar\u0131 Zamanl\u0131",
        description: "\xD6\u011Frenci kul\xFCpleri ve konferans siteleri i\xE7in responsive, SEO uyumlu web siteleri kodland\u0131."
      }
    ]
  );
  const [educations, setEducations] = useState(
    user.educations || [
      {
        id: "edu-1",
        institution: "Marmara \xDCniversitesi",
        degree: "Lisans",
        field: "Bilgisayar M\xFChendisli\u011Fi",
        period: "2020 - 2024",
        grade: "3.42 / 4.00"
      }
    ]
  );
  const [projects, setProjects] = useState(
    user.projects || [
      {
        id: "proj-1",
        name: "CareerPath \u2014 Kariyer & Yetkinlik Platformu",
        description: "Yapay zeka destekli CV analizi ve yetkinlik haritas\u0131 \xE7\u0131karan responsive web platformu.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
        link: "https://github.com/example/careerpath"
      },
      {
        id: "proj-2",
        name: "Ak\u0131ll\u0131 Ders & G\xF6rev Takip\xE7isi",
        description: "\xD6\u011Frenciler i\xE7in takvim entegrasyonlu ve istatistik odakl\u0131 g\xF6rev planlama sistemi.",
        technologies: ["React", "Node.js", "PostgreSQL"]
      }
    ]
  );
  const [certificates, setCertificates] = useState(
    user.certificates || [
      {
        id: "cert-1",
        title: "Meta Front-End Developer Professional Certificate",
        organization: "Coursera / Meta",
        issueDate: "A\u011Fustos 2024",
        code: "META-FE-982341"
      },
      {
        id: "cert-2",
        title: "TypeScript & Modern JavaScript Uzmanl\u0131\u011F\u0131",
        organization: "BTK Akademi",
        issueDate: "May\u0131s 2024"
      }
    ]
  );
  const [activeModal, setActiveModal] = useState(null);
  const [tempExpTitle, setTempExpTitle] = useState("");
  const [tempExpCompany, setTempExpCompany] = useState("");
  const [tempExpPeriod, setTempExpPeriod] = useState("");
  const [tempExpDesc, setTempExpDesc] = useState("");
  const [tempEduInst, setTempEduInst] = useState("");
  const [tempEduField, setTempEduField] = useState("");
  const [tempEduPeriod, setTempEduPeriod] = useState("");
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      firstName,
      lastName,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      summary,
      experiences,
      educations,
      projects,
      certificates
    };
    onUpdateProfile(updated);
    setIsEditingPersonalInfo(false);
    showToast("Ki\u015Fisel bilgiler ba\u015Far\u0131yla g\xFCncellendi.");
  };
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!tempExpTitle || !tempExpCompany) {
      return;
    }
    const newExp = {
      id: `exp-${Date.now()}`,
      title: tempExpTitle,
      company: tempExpCompany,
      period: tempExpPeriod || "2024 - G\xFCn\xFCm\xFCz",
      type: "Tam Zamanl\u0131",
      description: tempExpDesc || "Yeni g\xF6rev ve sorumluluklar ba\u015Far\u0131yla y\xFCr\xFCt\xFCld\xFC."
    };
    const updatedExps = [newExp, ...experiences];
    setExperiences(updatedExps);
    onUpdateProfile({ ...user, experiences: updatedExps });
    setActiveModal(null);
    setTempExpTitle("");
    setTempExpCompany("");
    setTempExpPeriod("");
    setTempExpDesc("");
    showToast("Yeni deneyim eklendi.");
  };
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!tempEduInst || !tempEduField) {
      return;
    }
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: tempEduInst,
      field: tempEduField,
      degree: "Lisans",
      period: tempEduPeriod || "2024"
    };
    const updatedEdus = [newEdu, ...educations];
    setEducations(updatedEdus);
    onUpdateProfile({ ...user, educations: updatedEdus });
    setActiveModal(null);
    setTempEduInst("");
    setTempEduField("");
    setTempEduPeriod("");
    showToast("Yeni e\u011Fitim bilgisi eklendi.");
  };
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#2F8F83]" />
          <span>{toastMessage}</span>
        </div>}

      {
    /* Top Profile Header Card */
  }
      <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#243B64] text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-xs">
              {firstName[0] || "U"}{lastName[0] || ""}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl lg:text-2xl font-bold text-[#202938] tracking-tight">
                  {firstName} {lastName}
                </h2>
                <span className="text-[11px] font-semibold text-[#2F8F83] bg-[#EBF5F4] px-2 py-0.5 rounded-full border border-[#2F8F83]/20">
                  Onaylı Profil
                </span>
              </div>
              <p className="text-sm font-medium text-[#5276A7] mt-0.5">
                {title}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#667085]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingPersonalInfo ? <Button
    variant="primary"
    size="sm"
    onClick={() => setIsEditingPersonalInfo(true)}
    className="gap-2"
  >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Bilgileri Düzenle</span>
              </Button> : <Button
    variant="outline"
    size="sm"
    onClick={() => setIsEditingPersonalInfo(false)}
    className="gap-1.5"
  >
                <X className="w-3.5 h-3.5" />
                <span>İptal</span>
              </Button>}
          </div>
        </div>

        {
    /* In-Place Edit Form for Personal Info */
  }
        {isEditingPersonalInfo && <form
    onSubmit={handleSavePersonalInfo}
    className="mt-6 pt-6 border-t border-[#E3E7ED] space-y-4 animate-in fade-in"
  >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormInput
    label="Ad"
    id="edit-firstname"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    required
  />
              <FormInput
    label="Soyad"
    id="edit-lastname"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    required
  />
              <FormInput
    label="Mesleki Unvan / Başlık"
    id="edit-title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />
              <FormInput
    label="E-posta"
    id="edit-email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
              <FormInput
    label="Telefon"
    id="edit-phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />
              <FormInput
    label="Konum / Şehir"
    id="edit-location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />
              <FormInput
    label="LinkedIn Profili"
    id="edit-linkedin"
    value={linkedin}
    onChange={(e) => setLinkedin(e.target.value)}
  />
              <FormInput
    label="GitHub Profili"
    id="edit-github"
    value={github}
    onChange={(e) => setGithub(e.target.value)}
  />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#202938] mb-1.5">
                Kısa Biyografi & Kariyer Özeti
              </label>
              <textarea
    rows={3}
    value={summary}
    onChange={(e) => setSummary(e.target.value)}
    className="w-full p-3 text-xs bg-white border border-[#E3E7ED] rounded-lg text-[#202938] focus:border-[#243B64] outline-none"
  />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
    type="button"
    variant="secondary"
    size="sm"
    onClick={() => setIsEditingPersonalInfo(false)}
  >
                Vazgeç
              </Button>
              <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Değişiklikleri Kaydet</span>
              </Button>
            </div>
          </form>}

        {
    /* Summary text display when not editing */
  }
        {!isEditingPersonalInfo && <div className="mt-6 pt-5 border-t border-[#E3E7ED]">
            <h4 className="text-xs font-semibold text-[#202938] mb-1">Kariyer Özeti</h4>
            <p className="text-xs text-[#667085] leading-relaxed max-w-4xl">
              {summary}
            </p>
          </div>}
      </div>

      {
    /* Main Grid: Left Column (Experience & Education & Projects), Right Column (CV Management & Certifications) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left Column (8 cols) */
  }
        <div className="lg:col-span-8 space-y-6">
          {
    /* Card: İş & Staj Deneyimleri */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#243B64]" />
                <h3 className="text-sm font-semibold text-[#202938]">
                  İş & Staj Deneyimleri ({experiences.length})
                </h3>
              </div>
              <button
    type="button"
    onClick={() => setActiveModal("experience")}
    className="inline-flex items-center gap-1 text-xs font-medium text-[#243B64] hover:text-[#1B2D4E] cursor-pointer"
  >
                <Plus className="w-3.5 h-3.5" />
                <span>Deneyim Ekle</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => <div
    key={exp.id}
    className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED] relative group"
  >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-[#202938]">{exp.title}</h4>
                      <div className="text-xs text-[#5276A7] font-medium mt-0.5">
                        {exp.company} · <span className="text-[#667085] font-normal">{exp.type}</span>
                      </div>
                      <div className="text-[11px] text-[#667085] mt-0.5">{exp.period}</div>
                    </div>

                    <button
    type="button"
    onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
    className="text-[#667085] hover:text-[#C74747] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
    title="Sil"
  >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>)}
            </div>
          </div>

          {
    /* Card: Eğitim Bilgileri */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#243B64]" />
                <h3 className="text-sm font-semibold text-[#202938]">
                  Eğitim Geçmişi ({educations.length})
                </h3>
              </div>
              <button
    type="button"
    onClick={() => setActiveModal("education")}
    className="inline-flex items-center gap-1 text-xs font-medium text-[#243B64] hover:text-[#1B2D4E] cursor-pointer"
  >
                <Plus className="w-3.5 h-3.5" />
                <span>Eğitim Ekle</span>
              </button>
            </div>

            <div className="space-y-3">
              {educations.map((edu) => <div
    key={edu.id}
    className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED] flex items-center justify-between group"
  >
                  <div>
                    <h4 className="text-xs font-semibold text-[#202938]">
                      {edu.institution}
                    </h4>
                    <div className="text-xs text-[#5276A7] mt-0.5">
                      {edu.field} · {edu.degree}
                    </div>
                    <div className="text-[11px] text-[#667085] mt-0.5">
                      {edu.period} {edu.grade && `\xB7 GNO: ${edu.grade}`}
                    </div>
                  </div>

                  <button
    type="button"
    onClick={() => setEducations(educations.filter((e) => e.id !== edu.id))}
    className="text-[#667085] hover:text-[#C74747] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
    title="Sil"
  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>)}
            </div>
          </div>

          {
    /* Card: Projeler & Portfolyo */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#243B64]" />
                <h3 className="text-sm font-semibold text-[#202938]">
                  Projeler & Portfolyo ({projects.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => <div
    key={proj.id}
    className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED]"
  >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[#202938]">{proj.name}</h4>
                  </div>
                  <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {proj.technologies.map((t) => <span
    key={t}
    className="text-[10px] px-2 py-0.5 bg-white border border-[#E3E7ED] rounded text-[#202938] font-medium"
  >
                        {t}
                      </span>)}
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {
    /* Right Column (4 cols): CV Management & Certifications */
  }
        <div className="lg:col-span-4 space-y-6">
          {
    /* Card: CV Yönetimi */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#243B64]" />
                <h3 className="text-sm font-semibold text-[#202938]">CV Yönetimi</h3>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64] shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#202938] truncate">
                    {user.cvFileName || "Mehmet_Akif_Yazilim_CV.pdf"}
                  </div>
                  <div className="text-[11px] text-[#667085] mt-0.5">
                    {user.cvFileSize || "1.4 MB"} · PDF
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E3E7ED] flex items-center justify-between text-xs">
                <button
    type="button"
    onClick={() => alert("CV indiriliyor...")}
    className="font-medium text-[#243B64] hover:underline flex items-center gap-1 cursor-pointer"
  >
                  <Download className="w-3.5 h-3.5" />
                  <span>İndir</span>
                </button>
                <span className="text-[11px] text-[#2F8F83] font-medium">Aktif Analiz</span>
              </div>
            </div>

            {
    /* Upload New CV Zone */
  }
            <div className="border border-dashed border-[#CBD3E1] hover:border-[#5276A7] bg-[#F7F8FA]/60 rounded-lg p-4 text-center cursor-pointer transition-colors">
              <UploadCloud className="w-5 h-5 text-[#5276A7] mx-auto mb-1.5" />
              <div className="text-xs font-medium text-[#202938]">Yeni Özgeçmiş Yükle</div>
              <p className="text-[10px] text-[#667085] mt-0.5">
                PDF veya DOCX (Maks 10 MB)
              </p>
            </div>
          </div>

          {
    /* Card: Sertifikalar */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E7ED] mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2F8F83]" />
                <h3 className="text-sm font-semibold text-[#202938]">
                  Sertifikalar ({certificates.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {certificates.map((cert) => <div
    key={cert.id}
    className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED]"
  >
                  <h4 className="text-xs font-semibold text-[#202938]">{cert.title}</h4>
                  <div className="text-[11px] text-[#5276A7] font-medium mt-0.5">
                    {cert.organization}
                  </div>
                  <div className="text-[10px] text-[#667085] mt-0.5">
                    {cert.issueDate} {cert.code && `\xB7 No: ${cert.code}`}
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {
    /* Experience Add Modal */
  }
      <Modal
    isOpen={activeModal === "experience"}
    onClose={() => setActiveModal(null)}
    title="Yeni Deneyim Ekle"
    subtitle="Staj veya iş deneyiminizi ekleyin."
  >
        <form onSubmit={handleAddExperience} className="space-y-4">
          <FormInput
    label="Pozisyon / Rol"
    id="exp-title-input"
    required
    placeholder="Örn: Frontend Geliştirici"
    value={tempExpTitle}
    onChange={(e) => setTempExpTitle(e.target.value)}
  />
          <FormInput
    label="Şirket / Kurum"
    id="exp-company-input"
    required
    placeholder="Örn: ABC Teknoloji"
    value={tempExpCompany}
    onChange={(e) => setTempExpCompany(e.target.value)}
  />
          <FormInput
    label="Çalışma Süresi"
    id="exp-period-input"
    placeholder="Örn: Ocak 2024 - Günümüz"
    value={tempExpPeriod}
    onChange={(e) => setTempExpPeriod(e.target.value)}
  />
          <div>
            <label className="block text-xs font-medium text-[#202938] mb-1.5">
              İş Tanımı & Başarılar
            </label>
            <textarea
    rows={3}
    placeholder="Yürüttüğünüz temel sorumlulukları özetleyin..."
    value={tempExpDesc}
    onChange={(e) => setTempExpDesc(e.target.value)}
    className="w-full p-2.5 text-xs bg-white border border-[#E3E7ED] rounded-lg text-[#202938] focus:border-[#243B64] outline-none"
  />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
    type="button"
    variant="secondary"
    size="sm"
    onClick={() => setActiveModal(null)}
  >
              İptal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Deneyimi Kaydet
            </Button>
          </div>
        </form>
      </Modal>

      {
    /* Education Add Modal */
  }
      <Modal
    isOpen={activeModal === "education"}
    onClose={() => setActiveModal(null)}
    title="Yeni Eğitim Bilgisi Ekle"
    subtitle="Üniversite veya yükseköğretim geçmişinizi ekleyin."
  >
        <form onSubmit={handleAddEducation} className="space-y-4">
          <FormInput
    label="Üniversite / Enstitü"
    id="edu-inst-input"
    required
    placeholder="Örn: İstanbul Teknik Üniversitesi"
    value={tempEduInst}
    onChange={(e) => setTempEduInst(e.target.value)}
  />
          <FormInput
    label="Bölüm / Program"
    id="edu-field-input"
    required
    placeholder="Örn: Yazılım Mühendisliği"
    value={tempEduField}
    onChange={(e) => setTempEduField(e.target.value)}
  />
          <FormInput
    label="Mezuniyet / Dönem"
    id="edu-period-input"
    placeholder="Örn: 2021 - 2025"
    value={tempEduPeriod}
    onChange={(e) => setTempEduPeriod(e.target.value)}
  />

          <div className="flex justify-end gap-2 pt-2">
            <Button
    type="button"
    variant="secondary"
    size="sm"
    onClick={() => setActiveModal(null)}
  >
              İptal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Eğitimi Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
};
export {
  CareerProfileView
};
