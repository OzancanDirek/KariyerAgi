import { useState, useMemo } from "react";
import { initialSkillsData } from "../../data/skillsData.js";
import { Button } from "../../../../shared/ui/Button.jsx";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Award,
  Layers,
  Target,
  Edit3,
  Search,
  Check
} from "lucide-react";
const CvAnalysisView = ({
  user,
  skillsData = initialSkillsData,
  onNavigate
}) => {
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("all");
  const [skillSearch, setSkillSearch] = useState("");
  const analysis = user.cvAnalysis || {
    overallScore: 84,
    atsScore: 88,
    contentDepth: 79,
    skillMatch: 86,
    formattingScore: 92,
    strengths: [
      "Modern \xF6n y\xFCz teknolojilerinde (React, TypeScript, Tailwind) g\xFC\xE7l\xFC anahtar kelime e\u015Fle\u015Fmesi.",
      "Kronolojik ve okunabilir e\u011Fitim ve staj deneyimi format\u0131.",
      "A\xE7\u0131k kaynak ve portfolyo proje ba\u011Flant\u0131lar\u0131n\u0131n bulunmas\u0131.",
      "ATS taray\u0131c\u0131lar\u0131 i\xE7in optimize edilmi\u015F standart PDF ba\u015Fl\u0131k hiyerar\u015Fisi."
    ],
    weaknesses: [
      "\u0130\u015F deneyimi maddelerinde \xF6l\xE7\xFClebilir ba\u015Far\u0131 metrikleri (% art\u0131\u015F, kullan\u0131c\u0131 say\u0131s\u0131, verimlilik) eksik.",
      "Hedef pozisyon i\xE7in aranan Next.js, CI/CD ve Birim Testi (Jest/Cypress) anahtar kelimeleri eksik.",
      "Kariyer \xF6zetinde sekt\xF6r odakl\u0131 g\xFC\xE7l\xFC eylem fiilleri daha belirgin hale getirilebilir."
    ],
    detectedKeywords: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Git",
      "RESTful API",
      "SQL",
      "Birim Testleri"
    ],
    missingKeywords: ["Next.js", "Docker", "CI/CD Pipeline", "GraphQL", "Jest / Vitest"],
    sectionScores: [
      {
        section: "Ki\u015Fisel & \u0130leti\u015Fim",
        score: 95,
        feedback: "T\xFCm gerekli ileti\u015Fim ve portfolyo linkleri eksiksiz yer al\u0131yor."
      },
      {
        section: "Deneyim B\xF6l\xFCm\xFC",
        score: 78,
        feedback: "G\xF6rev tan\u0131mlar\u0131 a\xE7\u0131k ancak say\u0131sal ba\u015Far\u0131 g\xF6stergeleri eklenebilir."
      },
      {
        section: "E\u011Fitim Ge\xE7mi\u015Fi",
        score: 92,
        feedback: "\xDCniversite ve derece bilgisi standartlara uygun listelenmi\u015F."
      },
      {
        section: "Teknik Yetkinlikler",
        score: 86,
        feedback: "Temel beceriler mevcut, eksik 3 sekt\xF6r anahtar kelimesi eklenebilir."
      },
      {
        section: "Projeler & Portfolyo",
        score: 83,
        feedback: "Projelerin mimari detaylar\u0131 ve kullan\u0131lan teknolojiler a\xE7\u0131k\xE7a belirtilmi\u015F."
      }
    ]
  };
  const allSkills = skillsData && skillsData.length > 0 ? skillsData : initialSkillsData;
  const filteredSkills = useMemo(() => {
    return allSkills.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(skillSearch.toLowerCase()) || s.categoryLabel.toLowerCase().includes(skillSearch.toLowerCase());
      const matchCat = skillCategoryFilter === "all" || s.category === skillCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [allSkills, skillSearch, skillCategoryFilter]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {
    /* Header Banner */
  }
      <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Modül 03 · CV Analizi
            </span>
            <span className="text-xs text-[#667085]">AI CV Analiz Motoru</span>
          </div>
          <h2 className="text-2xl font-bold text-[#202938] tracking-tight">
            CV Analiz Sonuçları ve Değerlendirme
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-2xl">
            <strong>{user.cvFileName || "Mehmet_Akif_Yazilim_CV.pdf"}</strong> dosyanız yapay zeka tarafından 12 farklı kriterde değerlendirildi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
    variant="primary"
    size="sm"
    onClick={() => onNavigate("cv-builder")}
    className="gap-2"
  >
            <Edit3 className="w-3.5 h-3.5" />
            <span>CV'yi Düzenle</span>
          </Button>
        </div>
      </div>

      {
    /* Top Scores Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {
    /* Overall Score */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>Genel CV Puanı</span>
            <Award className="w-4 h-4 text-[#243B64]" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-[#243B64]">
              {analysis.overallScore}
            </span>
            <span className="text-xs text-[#667085]">/ 100</span>
          </div>
          <div className="w-full h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden mt-2">
            <div
    className="h-full bg-[#243B64] rounded-full"
    style={{ width: `${analysis.overallScore}%` }}
  />
          </div>
          <div className="text-[11px] text-[#2F8F83] font-semibold mt-2">
            İyi Seviye · Rekabetçi
          </div>
        </div>

        {
    /* ATS Score */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>ATS Uyumluluk Skoru</span>
            <FileText className="w-4 h-4 text-[#2F8F83]" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-[#2F8F83]">
              %{analysis.atsScore}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden mt-2">
            <div
    className="h-full bg-[#2F8F83] rounded-full"
    style={{ width: `${analysis.atsScore}%` }}
  />
          </div>
          <div className="text-[11px] text-[#667085] mt-2">
            Otomatik filtreleri sorunsuz geçer
          </div>
        </div>

        {
    /* Content Depth */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>İçerik Derinliği</span>
            <Layers className="w-4 h-4 text-[#5276A7]" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-[#202938]">
              %{analysis.contentDepth}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden mt-2">
            <div
    className="h-full bg-[#5276A7] rounded-full"
    style={{ width: `${analysis.contentDepth}%` }}
  />
          </div>
          <div className="text-[11px] text-[#C74747] font-medium mt-2">
            Metrikler güçlendirilebilir
          </div>
        </div>

        {
    /* Skill Match */
  }
        <div className="bg-white rounded-xl border border-[#E3E7ED] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>Hedef Rol Uyum Skoru</span>
            <Target className="w-4 h-4 text-[#243B64]" />
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-[#243B64]">
              %{analysis.skillMatch}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden mt-2">
            <div
    className="h-full bg-[#243B64] rounded-full"
    style={{ width: `${analysis.skillMatch}%` }}
  />
          </div>
          <div className="text-[11px] text-[#5276A7] font-medium mt-2">
            {user.targetRole || "Frontend Geli\u015Ftirici"} ile uyumlu
          </div>
        </div>
      </div>

      {
    /* Main Analysis Body: Strengths vs Weaknesses & Keywords */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left Column (7 cols): Güçlü & Geliştirilmesi Gereken Alanlar */
  }
        <div className="lg:col-span-7 space-y-6">
          {
    /* Strengths */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E3E7ED] mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#2F8F83]" />
              <h3 className="text-sm font-bold text-[#202938]">
                Güçlü Yönler (Tespit Edilen Avantajlar)
              </h3>
            </div>
            <ul className="space-y-3">
              {analysis.strengths.map((item, idx) => <li key={idx} className="flex items-start gap-2.5 text-xs text-[#202938] leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-[#EBF5F4] text-[#2F8F83] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>)}
            </ul>
          </div>

          {
    /* Weaknesses / Opportunities */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E3E7ED] mb-4">
              <AlertTriangle className="w-4 h-4 text-[#C74747]" />
              <h3 className="text-sm font-bold text-[#202938]">
                Geliştirilmesi Gereken Alanlar
              </h3>
            </div>
            <ul className="space-y-3">
              {analysis.weaknesses.map((item, idx) => <li key={idx} className="flex items-start gap-2.5 text-xs text-[#202938] leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-[#FDF2F2] text-[#C74747] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    !
                  </span>
                  <span>{item}</span>
                </li>)}
            </ul>
          </div>

          {
    /* Section Breakdown Scores */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#202938] mb-4 pb-3 border-b border-[#E3E7ED]">
              Bölüm Bazlı Detaylı Puanlama
            </h3>
            <div className="space-y-4">
              {analysis.sectionScores.map((s, idx) => <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#202938]">{s.section}</span>
                    <span className="font-bold text-[#243B64]">%{s.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden">
                    <div
    className={`h-full rounded-full ${s.score >= 90 ? "bg-[#2F8F83]" : s.score >= 80 ? "bg-[#243B64]" : "bg-[#5276A7]"}`}
    style={{ width: `${s.score}%` }}
  />
                  </div>
                  <p className="text-[11px] text-[#667085]">{s.feedback}</p>
                </div>)}
            </div>
          </div>
        </div>

        {
    /* Right Column (5 cols): Missing Keywords & Detected Skills Listing */
  }
        <div className="lg:col-span-5 space-y-6">
          {
    /* Missing Keywords (Critical) */
  }
          <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs">
            <div className="pb-3 border-b border-[#E3E7ED] mb-4">
              <h3 className="text-sm font-bold text-[#202938] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C74747]" />
                <span>Eksik Anahtar Kelimeler ({analysis.missingKeywords.length})</span>
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                {user.targetRole || "Frontend Geli\u015Ftirici"} ilanlarında en çok aranan ancak CV'nizde yer almayan kelimeler:
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {analysis.missingKeywords.map((kw) => <span
    key={kw}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDF2F2] border border-[#C74747]/20 text-xs font-semibold text-[#C74747]"
  >
                  <span>+ {kw}</span>
                </span>)}
            </div>

            <p className="text-[11px] text-[#667085] leading-relaxed">
              Bu anahtar kelimeleri CV Oluşturucu ile deneyim ve proje açıklamalarınıza ekleyerek genel skorunuzu <strong>+10 puan</strong> artırabilirsiniz.
            </p>
          </div>

          {
    /* Action Card to CV Builder */
  }
          <div className="p-5 rounded-xl bg-[#243B64] text-white shadow-sm space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5276A7] bg-white/10 px-2 py-0.5 rounded">
                Sıradaki Adım
              </span>
              <h4 className="text-base font-bold text-white mt-1.5">
                CV'nizi Yeniden Düzenleyin
              </h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Yapay zeka analiz raporundaki eksiklikleri iki sütunlu editörde canlı önizleyerek doğrudan düzenleyin.
              </p>
            </div>

            <Button
    variant="teal"
    size="sm"
    onClick={() => onNavigate("cv-builder")}
    className="w-full justify-center gap-2 mt-2"
  >
              <span>CV Oluşturucuya Geç</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {
    /* Full Dedicated Section: Tespit Edilen Beceriler (CV'den Ayrıştırılan Tüm Beceriler Listesi) */
  }
      <div className="bg-white rounded-xl border border-[#E3E7ED] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E7ED]">
          <div>
            <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2F8F83]" />
              <span>Tespit Edilen Beceriler ve Yetkinlik Seviyeleri ({filteredSkills.length})</span>
            </h3>
            <p className="text-xs text-[#667085] mt-1">
              Özgeçmişinizden, projelerinizden ve eğitim geçmişinizden doğrulanarak çıkarılan yetkinlik listesi:
            </p>
          </div>

          {
    /* Search & Filter inside Detected Skills */
  }
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
    type="text"
    value={skillSearch}
    onChange={(e) => setSkillSearch(e.target.value)}
    placeholder="Becerilerde ara..."
    className="pl-8 pr-3 py-1.5 text-xs bg-[#F7F8FA] border border-[#CBD5E1] rounded-lg text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  />
            </div>

            <select
    value={skillCategoryFilter}
    onChange={(e) => setSkillCategoryFilter(e.target.value)}
    className="bg-[#F7F8FA] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  >
              <option value="all">Tüm Kategoriler</option>
              <option value="frontend">Ön Yüz (Frontend)</option>
              <option value="programming">Programlama</option>
              <option value="backend">Arka Yüz (Backend)</option>
              <option value="database">Veri Tabanı</option>
              <option value="devops">DevOps & Araçlar</option>
              <option value="design">Tasarım & UI/UX</option>
            </select>
          </div>
        </div>

        {
    /* Skills Cards Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map((skill) => <div
    key={skill.id}
    className="p-3.5 rounded-lg border border-[#E3E7ED] bg-[#F7F8FA] hover:bg-white hover:border-[#CBD5E1] transition-all space-y-2"
  >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#202938]">{skill.name}</h4>
                  <span className="text-[11px] text-[#667085]">{skill.categoryLabel}</span>
                </div>
                <span
    className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${skill.status === "mastered" ? "bg-[#EBF5F4] text-[#2F8F83] border border-[#2F8F83]/30" : skill.status === "learning" ? "bg-[#EEF2F6] text-[#5276A7] border border-[#CBD5E1]" : "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"}`}
  >
                  {skill.statusLabel}
                </span>
              </div>

              {
    /* Progress bar */
  }
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#667085]">Yetkinlik: <strong>{skill.levelLabel}</strong></span>
                  <span className="font-bold text-[#243B64]">%{skill.percentage}</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
    className={`h-full rounded-full ${skill.status === "mastered" ? "bg-[#243B64]" : skill.status === "learning" ? "bg-[#5276A7]" : "bg-[#D97706]"}`}
    style={{ width: `${skill.percentage}%` }}
  />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-[#667085] border-t border-[#E3E7ED]/60">
                <span className="truncate max-w-[200px]">Kaynak: {skill.detectedSource || "CV Ayr\u0131\u015Ft\u0131rmas\u0131"}</span>
                <span className="text-[#2F8F83] font-medium flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                  Doğrulandı
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export {
  CvAnalysisView
};
