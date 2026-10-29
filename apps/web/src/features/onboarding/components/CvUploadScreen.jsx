import { useState, useRef } from "react";
import { Button } from "../../../shared/ui/Button.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  Sparkles,
  Briefcase,
  GraduationCap,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
const CvUploadScreen = ({
  user,
  onNavigate,
  onProfileComplete
}) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [manualRole, setManualRole] = useState(user.targetRole || "");
  const [manualExperience, setManualExperience] = useState(user.experienceLevel || "0-2 Y\u0131l (Junior)");
  const [manualEducation, setManualEducation] = useState(user.education || "Lisans \xD6\u011Frencisi / Yeni Mezun");
  const [manualSummary, setManualSummary] = useState(user.summary || "");
  const [skills, setSkills] = useState(
    user.skills.length > 0 ? user.skills : ["React", "TypeScript", "Git", "Problem \xC7\xF6zme", "REST API"]
  );
  const [newSkillInput, setNewSkillInput] = useState("");
  const popularSuggestedSkills = [
    "Python",
    "SQL",
    "Node.js",
    "Docker",
    "Figma / UI Tasar\u0131m\u0131",
    "Veri Analizi",
    "Agile / Scrum",
    "Tailwind CSS"
  ];
  const processUploadedFile = (uploadedFile) => {
    setIsAnalyzing(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
    setTimeout(() => {
      setIsAnalyzing(false);
      setExtractedData({
        fileName: uploadedFile.name,
        fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: "Bug\xFCn, " + (/* @__PURE__ */ new Date()).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        detectedRole: "Yaz\u0131l\u0131m & Web Geli\u015Ftirici",
        experienceLevel: "0-2 Y\u0131l (Junior)",
        education: "Bilgisayar M\xFChendisli\u011Fi Lisans, 2024",
        skills: [
          "React",
          "TypeScript",
          "JavaScript (ES6+)",
          "HTML5 / CSS3",
          "Tailwind CSS",
          "Git & GitHub",
          "RESTful API",
          "SQL / PostgreSQL",
          "Birim Testleri (Jest)"
        ],
        summary: "Modern web teknolojileri ve kullan\u0131c\u0131 deneyimi odakl\u0131 \xF6n y\xFCz geli\u015Ftirme alan\u0131nda hevesli, \xF6\u011Frenmeye a\xE7\u0131k ve analitik d\xFC\u015F\xFCnen yaz\u0131l\u0131m geli\u015Ftirici."
      });
      setSkills([
        "React",
        "TypeScript",
        "JavaScript (ES6+)",
        "HTML5 / CSS3",
        "Tailwind CSS",
        "Git & GitHub",
        "RESTful API",
        "SQL / PostgreSQL"
      ]);
    }, 1100);
  };
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      processUploadedFile(selected);
    }
  };
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      processUploadedFile(selected);
    }
  };
  const handleSampleCvLoad = (type) => {
    if (type === "software") {
      const dummyFile = new File(["dummy content"], "Mehmet_Akif_Yazilim_CV.pdf", { type: "application/pdf" });
      setFile(dummyFile);
      processUploadedFile({ name: "Mehmet_Akif_Yazilim_CV.pdf", size: 1.4 * 1024 * 1024 });
    } else {
      const dummyFile = new File(["dummy content"], "Veri_Analisti_Aday_CV.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      setFile(dummyFile);
      processUploadedFile({ name: "Veri_Analisti_Aday_CV.docx", size: 2.1 * 1024 * 1024 });
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };
  const handleAddSuggestedSkill = (s) => {
    if (!skills.includes(s)) {
      setSkills([...skills, s]);
    }
  };
  const handleFinalSave = () => {
    const updatedProfile = {
      ...user,
      targetRole: activeTab === "upload" && extractedData ? extractedData.detectedRole : manualRole || "Belirtilmedi",
      experienceLevel: activeTab === "upload" && extractedData ? extractedData.experienceLevel : manualExperience,
      education: activeTab === "upload" && extractedData ? extractedData.education : manualEducation,
      skills,
      cvFileName: file ? file.name : void 0,
      cvFileSize: extractedData ? extractedData.fileSize : void 0,
      summary: activeTab === "upload" && extractedData ? extractedData.summary : manualSummary
    };
    onProfileComplete(updatedProfile);
    setIsSuccessModalOpen(true);
  };
  return <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {
    /* Container max-w-4xl */
  }
      <div className="w-full max-w-4xl">
        {
    /* Stepper / Breadcrumb */
  }
        <div className="mb-6 p-4 bg-white rounded-xl border border-[#E3E7ED] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#EBF5F4] text-[#2F8F83] flex items-center justify-center text-xs font-semibold">
              ✓
            </div>
            <span className="text-xs font-medium text-[#202938]">1. Hesap Oluşturuldu</span>
          </div>

          <div className="hidden sm:block text-[#CBD3E1]">→</div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#243B64] text-white flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <span className="text-xs font-semibold text-[#243B64]">2. CV ve Kariyer Profili</span>
          </div>

          <div className="hidden sm:block text-[#CBD3E1]">→</div>

          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#F7F8FA] border border-[#E3E7ED] text-[#667085] flex items-center justify-center text-xs font-medium">
              3
            </div>
            <span className="text-xs font-medium text-[#667085]">3. Profil Tamamlandı</span>
          </div>
        </div>

        {
    /* Main Card Surface */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] shadow-sm p-6 sm:p-10 mb-8">
          {
    /* Header */
  }
          <div className="border-b border-[#E3E7ED] pb-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-semibold text-[#202938] tracking-tight">
                  Kariyer profilini tamamla
                </h1>
                <p className="text-sm text-[#667085] mt-1">
                  Yapay zeka analiz motorumuzun becerilerini haritalandırması için mevcut bir özgeçmiş yükle veya bilgilerini manuel olarak gir.
                </p>
              </div>
              {user.firstName && <div className="text-xs text-[#5276A7] font-medium bg-[#EEF2F6] px-3 py-1.5 rounded-lg border border-[#E3E7ED] self-start sm:self-auto">
                  Kullanıcı: {user.firstName} {user.lastName}
                </div>}
            </div>

            {
    /* Segmented Control / Tab Switcher (Functional buttons) */
  }
            <div className="mt-6 flex items-center gap-2 p-1 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg max-w-md">
              <button
    type="button"
    onClick={() => setActiveTab("upload")}
    className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${activeTab === "upload" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
                Özgeçmiş Yükle (Önerilen)
              </button>
              <button
    type="button"
    onClick={() => setActiveTab("manual")}
    className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${activeTab === "manual" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
                Manuel Profil Oluştur
              </button>
            </div>
          </div>

          {
    /* TAB 1: CV UPLOAD FLOW */
  }
          {activeTab === "upload" && <div className="space-y-6">
              {
    /* Dropzone */
  }
              {!extractedData && <div>
                  <div
    onDragOver={(e) => {
      e.preventDefault();
      setIsDragging(true);
    }}
    onDragLeave={() => setIsDragging(false)}
    onDrop={handleFileDrop}
    onClick={() => fileInputRef.current?.click()}
    className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-colors cursor-pointer ${isDragging ? "border-[#243B64] bg-[#EEF2F6]" : "border-[#CBD3E1] hover:border-[#5276A7] bg-[#F7F8FA]/60 hover:bg-[#F7F8FA]"}`}
  >
                    <input
    ref={fileInputRef}
    type="file"
    accept=".pdf,.docx,.doc"
    className="hidden"
    onChange={handleFileInputChange}
  />

                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E3E7ED] text-[#243B64] flex items-center justify-center mx-auto mb-4 shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>

                    <h3 className="text-sm font-semibold text-[#202938]">
                      Özgeçmişinizi buraya sürükleyin veya bilgisayarınızdan seçin
                    </h3>
                    <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                      PDF veya DOCX formatında, en fazla 10 MB boyutunda belgeler desteklenmektedir.
                    </p>

                    <div className="mt-4">
                      <span className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-[#243B64] bg-white border border-[#E3E7ED] rounded-lg shadow-xs hover:bg-[#F9FAFB]">
                        Dosya Seç
                      </span>
                    </div>
                  </div>
                </div>}

              {
    /* Uploading / Analyzing Progress State */
  }
              {isAnalyzing && <div className="p-6 rounded-xl bg-[#F7F8FA] border border-[#E3E7ED] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#202938] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2F8F83] animate-pulse" />
                      Yapay Zeka Analiz Motoru CV'nizi Ayrıştırıyor...
                    </span>
                    <span className="text-[#667085]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E3E7ED] rounded-full overflow-hidden">
                    <div
    className="h-full bg-[#243B64] transition-all duration-200"
    style={{ width: `${uploadProgress}%` }}
  />
                  </div>
                  <p className="text-[11px] text-[#667085]">
                    Yetkinlikler, eğitim geçmişi ve hedef pozisyon haritalandırılıyor.
                  </p>
                </div>}

              {
    /* Extracted Data Preview (When CV has been parsed) */
  }
              {extractedData && <div className="space-y-6">
                  {
    /* File Banner */
  }
                  <div className="p-4 rounded-xl bg-[#EEF2F6] border border-[#E3E7ED] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E3E7ED] flex items-center justify-center text-[#243B64] shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#202938]">{extractedData.fileName}</div>
                        <div className="text-xs text-[#667085] mt-0.5">
                          {extractedData.fileSize} · {extractedData.uploadDate} · <span className="text-[#2F8F83] font-medium">Başarıyla Analiz Edildi</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
    type="button"
    onClick={() => {
      setExtractedData(null);
      setFile(null);
    }}
    className="text-xs text-[#C74747] hover:bg-white px-2.5 py-1.5 rounded-md border border-transparent hover:border-[#E3E7ED] transition-colors flex items-center gap-1 cursor-pointer"
    title="Dosyayı kaldır"
  >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Kaldır</span>
                      </button>
                    </div>
                  </div>

                  {
    /* Analysis Breakdown */
  }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[#E3E7ED] bg-white">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#5276A7] mb-2">
                        <Briefcase className="w-3.5 h-3.5 text-[#243B64]" />
                        <span>Tespit Edilen Unvan & Deneyim</span>
                      </div>
                      <div className="text-base font-semibold text-[#202938]">
                        {extractedData.detectedRole}
                      </div>
                      <div className="text-xs text-[#667085] mt-1">
                        Seviye: {extractedData.experienceLevel}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E3E7ED] bg-white">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#5276A7] mb-2">
                        <GraduationCap className="w-3.5 h-3.5 text-[#243B64]" />
                        <span>Eğitim Geçmişi</span>
                      </div>
                      <div className="text-base font-semibold text-[#202938]">
                        {extractedData.education}
                      </div>
                      <div className="text-xs text-[#667085] mt-1">
                        Otomatik tespit edilen son akademik derece
                      </div>
                    </div>
                  </div>

                  {
    /* Skills Editor */
  }
                  <div className="p-5 rounded-xl border border-[#E3E7ED] bg-[#F7F8FA]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[#202938] flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#2F8F83]" />
                          <span>Çıkarılan Yetkinlikler ({skills.length})</span>
                        </h4>
                        <p className="text-xs text-[#667085] mt-0.5">
                          CV'nizden tespit edilen beceriler. İhtiyacınıza göre çıkarabilir veya yeni beceri ekleyebilirsiniz.
                        </p>
                      </div>
                    </div>

                    {
    /* Skill tags */
  }
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((skill) => <span
    key={skill}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-[#202938] border border-[#E3E7ED] shadow-xs"
  >
                          {skill}
                          <button
    type="button"
    onClick={() => handleRemoveSkill(skill)}
    className="text-[#667085] hover:text-[#C74747] p-0.5 rounded cursor-pointer"
    aria-label={`${skill} becerisini sil`}
  >
                            <X className="w-3 h-3" />
                          </button>
                        </span>)}
                    </div>

                    {
    /* Add Custom Skill */
  }
                    <div className="flex gap-2">
                      <input
    type="text"
    placeholder="Örn: Docker, GraphQL, Proje Yönetimi..."
    value={newSkillInput}
    onChange={(e) => setNewSkillInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    }}
    className="flex-1 px-3 py-2 text-xs bg-white text-[#202938] border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-1 focus:ring-[#243B64] outline-none"
  />
                      <Button
    type="button"
    variant="secondary"
    size="sm"
    onClick={handleAddSkill}
  >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Ekle
                      </Button>
                    </div>
                  </div>

                  {
    /* Summary / Objective */
  }
                  <div className="p-4 rounded-xl border border-[#E3E7ED] bg-white">
                    <label className="block text-xs font-medium text-[#202938] mb-1.5">
                      Özet & Kariyer Hedefi
                    </label>
                    <textarea
    rows={3}
    value={extractedData.summary}
    onChange={(e) => setExtractedData({ ...extractedData, summary: e.target.value })}
    className="w-full p-3 text-xs bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-[#202938] focus:border-[#243B64] outline-none"
  />
                  </div>
                </div>}
            </div>}

          {
    /* TAB 2: MANUAL PROFILE SETUP FLOW */
  }
          {activeTab === "manual" && <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#202938] mb-1.5">
                    Hedeflenen Pozisyon / Rol
                  </label>
                  <input
    type="text"
    placeholder="Örn: Yazılım Geliştirici, Veri Analisti, Ürün Yöneticisi"
    value={manualRole}
    onChange={(e) => setManualRole(e.target.value)}
    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none"
  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#202938] mb-1.5">
                    Deneyim Düzeyi
                  </label>
                  <select
    value={manualExperience}
    onChange={(e) => setManualExperience(e.target.value)}
    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none text-[#202938]"
  >
                    <option value="Öğrenci / Yeni Mezun">Öğrenci / Yeni Mezun</option>
                    <option value="0-2 Yıl (Junior)">0-2 Yıl (Junior)</option>
                    <option value="3-5 Yıl (Mid-Level)">3-5 Yıl (Mid-Level)</option>
                    <option value="5+ Yıl (Senior)">5+ Yıl (Senior)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#202938] mb-1.5">
                  Eğitim Durumu
                </label>
                <input
    type="text"
    placeholder="Örn: Bilgisayar Mühendisliği Lisans, 4. Sınıf"
    value={manualEducation}
    onChange={(e) => setManualEducation(e.target.value)}
    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E3E7ED] rounded-lg focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none"
  />
              </div>

              {
    /* Skills section */
  }
              <div className="p-4 rounded-xl border border-[#E3E7ED] bg-[#F7F8FA]">
                <label className="block text-xs font-medium text-[#202938] mb-1">
                  En Çok Güvendiğiniz Beceriler
                </label>
                <p className="text-xs text-[#667085] mb-3">
                  Kariyer eşleşmelerinde değerlendirilecek temel teknik ve sosyal yetkinlikleriniz.
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill) => <span
    key={skill}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-[#202938] border border-[#E3E7ED] shadow-xs"
  >
                      {skill}
                      <button
    type="button"
    onClick={() => handleRemoveSkill(skill)}
    className="text-[#667085] hover:text-[#C74747] p-0.5 rounded cursor-pointer"
    aria-label={`${skill} becerisini sil`}
  >
                        <X className="w-3 h-3" />
                      </button>
                    </span>)}
                </div>

                <div className="flex gap-2 mb-3">
                  <input
    type="text"
    placeholder="Yeni beceri yazın..."
    value={newSkillInput}
    onChange={(e) => setNewSkillInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    }}
    className="flex-1 px-3 py-2 text-xs bg-white text-[#202938] border border-[#E3E7ED] rounded-lg focus:border-[#243B64] outline-none"
  />
                  <Button
    type="button"
    variant="secondary"
    size="sm"
    onClick={handleAddSkill}
  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Ekle
                  </Button>
                </div>

                {
    /* Popular suggestions */
  }
                <div className="pt-2 border-t border-[#E3E7ED]">
                  <span className="text-[11px] text-[#667085] block mb-1.5">Önerilen Beceriler (Tıklayarak Ekleyin):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSuggestedSkills.map((s) => <button
    key={s}
    type="button"
    onClick={() => handleAddSuggestedSkill(s)}
    disabled={skills.includes(s)}
    className={`text-[11px] px-2 py-1 rounded-md transition-colors cursor-pointer ${skills.includes(s) ? "bg-[#E3E7ED]/50 text-[#667085] opacity-50 cursor-not-allowed" : "bg-white hover:bg-[#EEF2F6] text-[#243B64] border border-[#E3E7ED]"}`}
  >
                        + {s}
                      </button>)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#202938] mb-1.5">
                  Kariyer Hedefi / Kısa Açıklama
                </label>
                <textarea
    rows={3}
    placeholder="Kısa ve orta vadede hangi uzmanlık alanına odaklanmak istiyorsunuz?"
    value={manualSummary}
    onChange={(e) => setManualSummary(e.target.value)}
    className="w-full p-3 text-sm bg-white border border-[#E3E7ED] rounded-lg text-[#202938] focus:border-[#243B64] focus:ring-2 focus:ring-[#243B64]/15 outline-none"
  />
              </div>
            </div>}

          {
    /* Bottom Security Note & Action Buttons */
  }
          <div className="mt-8 pt-6 border-t border-[#E3E7ED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#667085]">
              <ShieldCheck className="w-4 h-4 text-[#2F8F83] shrink-0" />
              <span>Verileriniz KVKK standartlarına uygun şifreli ortamda analiz edilir.</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
    type="button"
    variant="ghost"
    size="md"
    onClick={() => handleFinalSave()}
  >
                Daha sonra tamamla
              </Button>

              <Button
    type="button"
    variant="primary"
    size="md"
    onClick={handleFinalSave}
    className="gap-2"
  >
                <span>Profili Kaydet ve Tamamla</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {
    /* Completion Modal */
  }
      <Modal
    isOpen={isSuccessModalOpen}
    onClose={() => setIsSuccessModalOpen(false)}
    title="Kariyer Profiliniz Hazır"
    subtitle="Özgeçmişiniz ve yetkinlik haritanız başarıyla sisteme kaydedildi."
    maxWidth="lg"
  >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#EBF5F4] border border-[#2F8F83]/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2F8F83] shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-semibold text-[#202938]">Profil Kurulumu Tamamlandı</div>
              <div className="text-[#667085] mt-1">
                Yapay zeka analiz motorumuz profilinizi oluşturdu. Artık size özel beceri haritalarını inceleyebilir ve kariyer hedeflerinize uygun fırsatları takip edebilirsiniz.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED] text-xs space-y-2">
            <div className="flex justify-between border-b border-[#E3E7ED] pb-1.5">
              <span className="text-[#667085]">Kullanıcı:</span>
              <span className="font-medium text-[#202938]">{user.firstName} {user.lastName || ""}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E7ED] pb-1.5">
              <span className="text-[#667085]">E-posta:</span>
              <span className="font-medium text-[#202938]">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3E7ED] pb-1.5">
              <span className="text-[#667085]">Hedef Rol:</span>
              <span className="font-medium text-[#202938]">
                {activeTab === "upload" && extractedData ? extractedData.detectedRole : manualRole || "Genel Yaz\u0131l\u0131m Geli\u015Ftirici"}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#E3E7ED] pb-1.5">
              <span className="text-[#667085]">Yüklenen CV:</span>
              <span className="font-medium text-[#202938]">{file ? file.name : "Manuel Profil Giri\u015Fi"}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#667085]">Kayıtlı Beceriler:</span>
              <span className="font-medium text-[#202938]">{skills.slice(0, 5).join(", ")}{skills.length > 5 ? ` (+${skills.length - 5})` : ""}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3E7ED] flex items-center justify-between">
            <button
    type="button"
    onClick={() => {
      setIsSuccessModalOpen(false);
      onNavigate("login");
    }}
    className="text-xs text-[#5276A7] hover:underline cursor-pointer"
  >
              Giriş Ekranına Dön
            </button>
            <Button
    variant="primary"
    size="sm"
    onClick={() => {
      setIsSuccessModalOpen(false);
      onNavigate("app");
    }}
    className="gap-1.5"
  >
              <span>Dashboard'a İlerle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>;
};
export {
  CvUploadScreen
};
