import { useState } from "react";
import { Button } from "../../../../shared/ui/Button.jsx";
import { FormInput } from "../../../../shared/ui/FormInput.jsx";
import {
  Save,
  CheckCircle2,
  Plus,
  Printer,
  ChevronDown,
  ChevronUp
} from "lucide-react";
const CvBuilderView = ({
  user,
  onUpdateUser
}) => {
  const [template, setTemplate] = useState(user.selectedTemplate || "modern");
  const [toastMessage, setToastMessage] = useState(null);
  const [fullName, setFullName] = useState(`${user.firstName} ${user.lastName}`);
  const [title, setTitle] = useState(user.title || user.targetRole || "Frontend & Web Geli\u015Ftirici");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "+90 (555) 012 34 56");
  const [location, setLocation] = useState(user.location || "\u0130stanbul, T\xFCrkiye");
  const [linkedin, setLinkedin] = useState(user.linkedin || "linkedin.com/in/mehmetakiftutal");
  const [github, setGithub] = useState(user.github || "github.com/mehmetakiftutal");
  const [summary, setSummary] = useState(
    user.summary || "Modern web teknolojileri, React ve TypeScript ekosisteminde \xF6l\xE7eklenebilir ve eri\u015Filebilir aray\xFCzler geli\u015Ftiren, analitik ve kullan\u0131c\u0131 odakl\u0131 d\xFC\u015F\xFCnen yaz\u0131l\u0131m geli\u015Ftirici."
  );
  const [skills, setSkills] = useState(
    user.skills.length > 0 ? user.skills : ["React", "TypeScript", "Tailwind CSS", "Git", "REST API", "SQL"]
  );
  const [newSkillInput, setNewSkillInput] = useState("");
  const [experiences, setExperiences] = useState(
    user.experiences || [
      {
        id: "b-exp-1",
        title: "\xD6n Y\xFCz Geli\u015Ftirici Stajyeri",
        company: "Teknoloji Ar-Ge A.\u015E.",
        period: "Temmuz 2024 - Eyl\xFCl 2024",
        type: "Staj",
        description: "React ve Tailwind CSS kullan\u0131larak kurum i\xE7i y\xF6netim paneli mod\xFClleri geli\u015Ftirildi. RESTful API entegrasyonu tamamland\u0131."
      },
      {
        id: "b-exp-2",
        title: "Web Aray\xFCz Geli\u015Ftirici (Serbest)",
        company: "Akademik Portallar",
        period: "2023 - 2024",
        type: "Yar\u0131 Zamanl\u0131",
        description: "\xD6\u011Frenci kul\xFCpleri ve konferans siteleri i\xE7in responsive, SEO uyumlu web aray\xFCzleri kodland\u0131."
      }
    ]
  );
  const [educations, setEducations] = useState(
    user.educations || [
      {
        id: "b-edu-1",
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
        id: "b-proj-1",
        name: "CareerPath \u2014 Kariyer Platformu",
        description: "Yapay zeka destekli CV analizi ve kariyer haritas\u0131 olu\u015Fturan web platformu.",
        technologies: ["React", "TypeScript", "Tailwind CSS"]
      },
      {
        id: "b-proj-2",
        name: "Ak\u0131ll\u0131 G\xF6rev Planlay\u0131c\u0131",
        description: "\xD6\u011Frenciler i\xE7in takvim entegrasyonlu g\xF6rev takip sistemi.",
        technologies: ["React", "PostgreSQL"]
      }
    ]
  );
  const [openSection, setOpenSection] = useState("personal");
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleSave = () => {
    const parts = fullName.trim().split(" ");
    const fName = parts[0] || user.firstName;
    const lName = parts.slice(1).join(" ") || user.lastName;
    const updated = {
      ...user,
      firstName: fName,
      lastName: lName,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      summary,
      skills,
      experiences,
      educations,
      projects,
      selectedTemplate: template
    };
    onUpdateUser(updated);
    showToast("CV de\u011Fi\u015Fiklikleri ba\u015Far\u0131yla kaydedildi.");
  };
  const handleExportPdf = () => {
    window.print();
  };
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
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
    /* Header Bar */
  }
      <div className="bg-white rounded-xl border border-[#E3E7ED] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Modül 03 · Ekran 2
            </span>
            <span className="text-xs text-[#667085]">Canlı CV Editörü</span>
          </div>
          <h2 className="text-xl font-bold text-[#202938] tracking-tight">
            CV Oluşturma ve Düzenleme (CV Builder)
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {
    /* Template Selector */
  }
          <div className="flex items-center gap-1 p-1 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs">
            <span className="text-[#667085] px-2 font-medium hidden md:inline">Şablon:</span>
            {["modern", "classic", "minimal"].map((t) => <button
    key={t}
    type="button"
    onClick={() => setTemplate(t)}
    className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${template === t ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
                {t}
              </button>)}
          </div>

          <Button variant="secondary" size="sm" onClick={handleExportPdf} className="gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF Yazdır / İndir</span>
          </Button>

          <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Kaydet</span>
          </Button>
        </div>
      </div>

      {
    /* Two-Column Editor Layout: Left Column (Editor Form) + Right Column (Live CV Preview) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {
    /* Left Column (5 cols): Editable Form Accordion */
  }
        <div className="lg:col-span-5 space-y-4">
          {
    /* 1. Kişisel Bilgiler Section */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] shadow-xs overflow-hidden">
            <button
    type="button"
    onClick={() => setOpenSection(openSection === "personal" ? "experience" : "personal")}
    className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs text-[#202938] bg-[#F7F8FA] border-b border-[#E3E7ED] cursor-pointer"
  >
              <span>1. Kişisel Bilgiler & İletişim</span>
              {openSection === "personal" ? <ChevronUp className="w-4 h-4 text-[#667085]" /> : <ChevronDown className="w-4 h-4 text-[#667085]" />}
            </button>

            {openSection === "personal" && <div className="p-4 space-y-3 animate-in fade-in">
                <FormInput
    label="Ad Soyad"
    id="b-fullname"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
  />
                <FormInput
    label="Mesleki Unvan"
    id="b-title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
    label="E-posta"
    id="b-email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
                  <FormInput
    label="Telefon"
    id="b-phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />
                </div>
                <FormInput
    label="Konum / Şehir"
    id="b-loc"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
    label="LinkedIn"
    id="b-linkedin"
    value={linkedin}
    onChange={(e) => setLinkedin(e.target.value)}
  />
                  <FormInput
    label="GitHub"
    id="b-github"
    value={github}
    onChange={(e) => setGithub(e.target.value)}
  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202938] mb-1">
                    Kariyer Özeti (Hakkımda)
                  </label>
                  <textarea
    rows={3}
    value={summary}
    onChange={(e) => setSummary(e.target.value)}
    className="w-full p-2.5 text-xs bg-white border border-[#E3E7ED] rounded-lg text-[#202938] focus:border-[#243B64] outline-none"
  />
                </div>
              </div>}
          </div>

          {
    /* 2. İş Deneyimleri Section */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] shadow-xs overflow-hidden">
            <button
    type="button"
    onClick={() => setOpenSection(openSection === "experience" ? "education" : "experience")}
    className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs text-[#202938] bg-[#F7F8FA] border-b border-[#E3E7ED] cursor-pointer"
  >
              <span>2. İş & Staj Deneyimleri ({experiences.length})</span>
              {openSection === "experience" ? <ChevronUp className="w-4 h-4 text-[#667085]" /> : <ChevronDown className="w-4 h-4 text-[#667085]" />}
            </button>

            {openSection === "experience" && <div className="p-4 space-y-4 animate-in fade-in">
                {experiences.map((exp, idx) => <div key={exp.id} className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E3E7ED] space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-[#5276A7]">Deneyim #{idx + 1}</span>
                      <button
    type="button"
    onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
    className="text-[#C74747] hover:underline text-[11px] cursor-pointer"
  >
                        Sil
                      </button>
                    </div>
                    <input
    type="text"
    placeholder="Pozisyon (örn: Frontend Geliştirici)"
    value={exp.title}
    onChange={(e) => {
      const updated = [...experiences];
      updated[idx].title = e.target.value;
      setExperiences(updated);
    }}
    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                    <div className="grid grid-cols-2 gap-2">
                      <input
    type="text"
    placeholder="Şirket adı"
    value={exp.company}
    onChange={(e) => {
      const updated = [...experiences];
      updated[idx].company = e.target.value;
      setExperiences(updated);
    }}
    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                      <input
    type="text"
    placeholder="Dönem (örn: 2023 - 2024)"
    value={exp.period}
    onChange={(e) => {
      const updated = [...experiences];
      updated[idx].period = e.target.value;
      setExperiences(updated);
    }}
    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                    </div>
                    <textarea
    rows={2}
    placeholder="Açıklama ve sorumluluklar..."
    value={exp.description}
    onChange={(e) => {
      const updated = [...experiences];
      updated[idx].description = e.target.value;
      setExperiences(updated);
    }}
    className="w-full p-2 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                  </div>)}

                <button
    type="button"
    onClick={() => setExperiences([
      ...experiences,
      {
        id: `exp-${Date.now()}`,
        title: "",
        company: "",
        period: "",
        type: "Tam Zamanl\u0131",
        description: ""
      }
    ])}
    className="w-full py-2 text-xs font-semibold text-[#243B64] bg-[#EEF2F6] hover:bg-[#E3E9F2] rounded-lg border border-[#CBD5E1] flex items-center justify-center gap-1.5 cursor-pointer"
  >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Deneyim Ekle</span>
                </button>
              </div>}
          </div>

          {
    /* 3. Eğitim Bilgileri Section */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] shadow-xs overflow-hidden">
            <button
    type="button"
    onClick={() => setOpenSection(openSection === "education" ? "projects" : "education")}
    className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs text-[#202938] bg-[#F7F8FA] border-b border-[#E3E7ED] cursor-pointer"
  >
              <span>3. Eğitim Bilgileri ({educations.length})</span>
              {openSection === "education" ? <ChevronUp className="w-4 h-4 text-[#667085]" /> : <ChevronDown className="w-4 h-4 text-[#667085]" />}
            </button>

            {openSection === "education" && <div className="p-4 space-y-3 animate-in fade-in">
                {educations.map((edu, idx) => <div key={edu.id} className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E3E7ED] space-y-2">
                    <input
    type="text"
    placeholder="Üniversite"
    value={edu.institution}
    onChange={(e) => {
      const updated = [...educations];
      updated[idx].institution = e.target.value;
      setEducations(updated);
    }}
    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                    <div className="grid grid-cols-2 gap-2">
                      <input
    type="text"
    placeholder="Bölüm"
    value={edu.field}
    onChange={(e) => {
      const updated = [...educations];
      updated[idx].field = e.target.value;
      setEducations(updated);
    }}
    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                      <input
    type="text"
    placeholder="Dönem"
    value={edu.period}
    onChange={(e) => {
      const updated = [...educations];
      updated[idx].period = e.target.value;
      setEducations(updated);
    }}
    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded"
  />
                    </div>
                  </div>)}
              </div>}
          </div>

          {
    /* 4. Teknik & Sosyal Beceriler Section */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] shadow-xs overflow-hidden">
            <button
    type="button"
    onClick={() => setOpenSection(openSection === "skills" ? "personal" : "skills")}
    className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs text-[#202938] bg-[#F7F8FA] border-b border-[#E3E7ED] cursor-pointer"
  >
              <span>4. Beceriler & Yetkinlikler ({skills.length})</span>
              {openSection === "skills" ? <ChevronUp className="w-4 h-4 text-[#667085]" /> : <ChevronDown className="w-4 h-4 text-[#667085]" />}
            </button>

            {openSection === "skills" && <div className="p-4 space-y-3 animate-in fade-in">
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => <span
    key={skill}
    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EEF2F6] text-[#243B64] text-xs font-medium rounded border border-[#CBD5E1]"
  >
                      <span>{skill}</span>
                      <button
    type="button"
    onClick={() => handleRemoveSkill(skill)}
    className="hover:text-[#C74747] ml-1"
  >
                        ×
                      </button>
                    </span>)}
                </div>

                <div className="flex gap-2">
                  <input
    type="text"
    placeholder="Yeni beceri ekle (örn: Docker)..."
    value={newSkillInput}
    onChange={(e) => setNewSkillInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    }}
    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E3E7ED] rounded-lg"
  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                    Ekle
                  </Button>
                </div>
              </div>}
          </div>
        </div>

        {
    /* Right Column (7 cols): Live High-Fidelity A4 CV Document Preview */
  }
        <div className="lg:col-span-7 bg-[#EEF2F6] p-4 sm:p-6 rounded-2xl border border-[#E3E7ED] sticky top-24">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-3 px-2">
            <span className="font-semibold text-[#202938]">Canlı Önizleme (A4 Standart Belge)</span>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-[#E3E7ED]">
              Şablon: {template.toUpperCase()}
            </span>
          </div>

          {
    /* White A4 Paper Sheet Simulation */
  }
          <div
    id="cv-printable-document"
    className="bg-white rounded-lg shadow-md border border-[#CBD5E1] p-8 sm:p-10 text-[#202938] min-h-[750px] transition-all font-sans"
  >
            {
    /* Header of Resume */
  }
            <div className={`border-b pb-5 mb-5 ${template === "modern" ? "border-[#243B64]/30" : "border-[#E3E7ED]"}`}>
              <h1 className="text-2xl font-bold tracking-tight text-[#243B64]">
                {fullName || "Ad Soyad"}
              </h1>
              <p className="text-sm font-semibold text-[#5276A7] mt-0.5">
                {title || "Mesleki Unvan"}
              </p>

              {
    /* Contact meta strip */
  }
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-[#667085]">
                {email && <span>{email}</span>}
                {phone && <span>· {phone}</span>}
                {location && <span>· {location}</span>}
                {linkedin && <span>· {linkedin}</span>}
                {github && <span>· {github}</span>}
              </div>
            </div>

            {
    /* Summary */
  }
            {summary && <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#243B64] mb-1.5 border-b border-[#E3E7ED] pb-0.5">
                  Özet / Profil
                </h3>
                <p className="text-xs text-[#202938] leading-relaxed">
                  {summary}
                </p>
              </div>}

            {
    /* Experience */
  }
            {experiences.length > 0 && <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#243B64] mb-2 border-b border-[#E3E7ED] pb-0.5">
                  İş & Staj Deneyimleri
                </h3>
                <div className="space-y-3">
                  {experiences.map((exp) => <div key={exp.id}>
                      <div className="flex items-center justify-between text-xs font-bold text-[#202938]">
                        <span>{exp.title}</span>
                        <span className="text-[11px] text-[#667085] font-normal">{exp.period}</span>
                      </div>
                      <div className="text-xs text-[#5276A7] font-medium">{exp.company}</div>
                      <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>)}
                </div>
              </div>}

            {
    /* Education */
  }
            {educations.length > 0 && <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#243B64] mb-2 border-b border-[#E3E7ED] pb-0.5">
                  Eğitim Bilgisi
                </h3>
                <div className="space-y-2">
                  {educations.map((edu) => <div key={edu.id} className="text-xs">
                      <div className="flex items-center justify-between font-bold text-[#202938]">
                        <span>{edu.institution}</span>
                        <span className="text-[11px] text-[#667085] font-normal">{edu.period}</span>
                      </div>
                      <div className="text-xs text-[#5276A7]">
                        {edu.field} · {edu.degree} {edu.grade && `(GNO: ${edu.grade})`}
                      </div>
                    </div>)}
                </div>
              </div>}

            {
    /* Projects */
  }
            {projects.length > 0 && <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#243B64] mb-2 border-b border-[#E3E7ED] pb-0.5">
                  Projeler
                </h3>
                <div className="space-y-2.5">
                  {projects.map((proj) => <div key={proj.id} className="text-xs">
                      <div className="font-bold text-[#202938]">{proj.name}</div>
                      <p className="text-xs text-[#667085] mt-0.5">{proj.description}</p>
                      <div className="text-[10px] text-[#5276A7] mt-0.5">
                        Teknolojiler: {proj.technologies.join(", ")}
                      </div>
                    </div>)}
                </div>
              </div>}

            {
    /* Skills */
  }
            {skills.length > 0 && <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#243B64] mb-2 border-b border-[#E3E7ED] pb-0.5">
                  Teknik Beceriler
                </h3>
                <p className="text-xs text-[#202938] leading-relaxed">
                  {skills.join(" \xB7 ")}
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export {
  CvBuilderView
};
