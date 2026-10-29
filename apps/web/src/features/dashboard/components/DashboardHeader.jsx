import { useState } from "react";
import { Modal } from "../../../shared/ui/Modal.jsx";
import {
  Bell,
  CheckCircle2,
  X,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
const DashboardHeader = ({
  currentView,
  onViewChange,
  user
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);
  const [selectedPromptModule, setSelectedPromptModule] = useState("mod7");
  const [copied, setCopied] = useState(false);
  const figmaPromptMod7 = `Design Module 07 of CareerPath, an AI-powered career platform. Create exactly 3 desktop screens: Company Profile, Create Job Listing, and Applicant Management.
Maintain the existing professional light SaaS design: navy #243B64, white #FFFFFF, background #F7F8FA, text #202938, subtle gray borders, and restrained blue accents. Use Inter typography, consistent spacing, subtle shadows, and realistic React + PrimeReact components. Avoid dark mode, excessive gradients, and decorative AI visuals.
Screen 1 \u2014 Company Profile:
Create an employer company profile page with logo upload, company name, industry, website, company description, location, and an Edit Profile action. Include a clean employer sidebar with Dashboard, Company Profile, Job Listings, Applicants, and Settings.
Screen 2 \u2014 Create Job Listing:
Create a structured form with job title, description, responsibilities, required skills, preferred qualifications, experience level, employment type, location, work model, and salary range. Include Save Draft, Preview, and Publish Job buttons. Use realistic form controls and clear field labels.
Screen 3 \u2014 Applicant Management:
Display a searchable, filterable applicant table with candidate name, job title, application date, AI match percentage, and application status. Include actions to view the CV, inspect matching and missing skills, and update the application status. Use clear status tags and a professional layout.
Use Turkish interface text. Use PrimeReact components such as Card, DataTable, InputText, Dropdown, MultiSelect, InputNumber, Button, Tag, and Dialog. Use Auto Layout, reusable components, and consistent navigation. Create exactly 3 editable desktop frames at 1440px width. Prioritize usability, realistic functionality, and visual consistency with previous CareerPath modules.`;
  const figmaPromptMod6 = `Design Module 06 of CareerPath, an AI-powered career platform. Create 2 desktop screens: Job Listings and Job Details & AI Match Analysis with direct external career links (direct navigation to job postings, no in-app application flow).
Use a professional light SaaS design consistent with previous modules. Colors: navy #243B64, white #FFFFFF, background #F7F8FA, text #202938, light gray borders, and restrained blue accents. Use Inter typography, consistent spacing, subtle shadows, and realistic React + PrimeReact components. Avoid dark mode, excessive gradients, and decorative AI visuals.
Screen 1 \u2014 Job Listings:
Create a searchable job board with job cards showing position, company, location, salary range, work model, and AI match percentage. Include filters for job category, location, experience level, and remote/hybrid/office work. Provide a primary \u201C\u0130lana Git\u201D direct external action and \u201CDetay & Analiz\u201D view.
Screen 2 \u2014 Job Details & AI Match Analysis:
Display company information, verified portal badge, job description, responsibilities, and required qualifications. Include a prominent compatibility score, matching skills, missing skills, and clear explanations for the score. Provide \u201C\u0130lana Git (Resm\xEE Sayfada A\xE7)\u201D external link action and \u201C\u0130lan\u0131 Kaydet\u201D bookmarking.
Use Turkish interface text and realistic sample data. Use PrimeReact components such as Card, Tag, ProgressBar, InputText, Dropdown, Button, and TabView. Create editable desktop frames at 1440px width. Use Auto Layout, reusable components, and the existing CareerPath navigation. Prioritize usability, clear visual hierarchy, and implementation feasibility.`;
  const figmaPromptMod5 = `Design Module 05 of CareerPath, an AI-powered career development platform. Create exactly 3 desktop screens: Career Roadmap, Learning Recommendations, and My Development Plan.
Use the existing professional light SaaS design: navy #243B64, white #FFFFFF, background #F7F8FA, text #202938, subtle gray borders, and restrained blue accents. Use Inter typography, consistent spacing, moderate corner radii, and minimal shadows. Avoid dark mode, excessive gradients, and decorative AI visuals.
Screen 1 \u2014 Career Roadmap:
Show the user's target role, current skill level, and a visual roadmap with ordered milestones. Each milestone should display its title, required skills, status, and completion progress. Include completed, in-progress, and upcoming stages.
Screen 2 \u2014 Learning Recommendations:
Display recommended courses and learning resources in searchable cards. Include title, provider, related skill, difficulty, estimated duration, price status, and an external resource link. Add category and difficulty filters. Use realistic sample data without inventing specific real course URLs.
Screen 3 \u2014 My Development Plan:
Create a practical task and progress tracker with weekly goals, deadlines, related skills, completion checkboxes, and overall progress. Allow users to add tasks and mark activities as complete.
Use Turkish UI text. Design for React and PrimeReact with reusable Card, ProgressBar, Tag, Button, Checkbox, Dropdown, InputText, and Timeline-style components. Maintain the existing CareerPath navigation and visual identity. Use Auto Layout and create exactly 3 editable desktop frames at 1440px width. Prioritize realistic frontend implementation, clear hierarchy, and usability.`;
  const figmaPromptMod4 = `Design Module 04 of CareerPath, an AI-powered career and skills tracking platform. Create exactly 3 desktop screens: Knowledge Graph, Skill Tracking, and Skill Details.
Maintain the previous modules' professional light SaaS design. Use navy #243B64, white #FFFFFF, background #F7F8FA, text #202938, light gray borders, and restrained blue accents. Use Inter typography, subtle shadows, consistent spacing, and practical components. Avoid dark mode, excessive gradients, and decorative AI visuals.
Screen 1 \u2014 Knowledge Graph:
Create an interactive skills network visualization with connected nodes, category filters (programming, database, tools, frontend, backend), a node click interaction to inspect skill details, and a clear visual distinction between mastered skills and skill gaps to improve. Include filter chips, zoom controls, and a quick summary side panel.
Screen 2 \u2014 Skill Tracking:
Create a comprehensive skill table and card grid with skill name, category, proficiency level (Beginner, Intermediate, Advanced), progress bar, last updated date, and evidence indicators (CV, Project, Certificate). Include search, category tabs, level filter, and sorting.
Screen 3 \u2014 Skill Details:
Provide a deep-dive view for a selected skill showing its detection source, linked projects, linked education/courses, level progression history timeline, verified evidence cards, and recommended next steps or learning resources. Include an action to update proficiency or add new evidence.

Design practical layouts using components that can be implemented with React and PrimeReact: Menubar/Sidebar, Card, Tag, ProgressBar, Badge, Timeline, TabView, DataTable, and Dialog. Create exactly 3 desktop frames at 1440px width. Prioritize usability, visual consistency, and real frontend feasibility.`;
  const figmaPromptMod3 = `Design Module 03 of CareerPath, an AI-powered career development platform. Create exactly 3 desktop screens: CV Analysis Results, CV Builder, and CV Improvement Recommendations.

Use a professional light SaaS design consistent with previous modules. Colors: navy #243B64, white #FFFFFF, background #F7F8FA, text #202938, subtle gray borders, and restrained blue accents. Use Inter typography, clean spacing, subtle shadows, and realistic UI components. Avoid dark mode, excessive gradients, decorative illustrations, and generic AI aesthetics.

Screen 1 \u2014 CV Analysis Results:
Display an overall CV score, strengths, weaknesses, detected skills, missing keywords, education and experience summaries, and actionable recommendations. Use progress bars, compact cards, and clear visual hierarchy. Include a \u201CCV'yi D\xFCzenle\u201D button.

Screen 2 \u2014 CV Builder:
Create a practical two-column editor. On the left, provide editable sections for personal information, education, experience, projects, and skills. On the right, show a live professional CV preview. Include template selection, save, and PDF export buttons. Use realistic form fields and a clean document layout.

Screen 3 \u2014 CV Improvement Recommendations:
Show specific recommendations grouped by CV section. Each recommendation should include the current issue, a suggested improvement, and buttons to accept or edit the suggestion. Include a clear indication that AI suggestions require user review.

Use Turkish UI text. Design all screens for implementation with React and PrimeReact components such as Card, InputText, Button, ProgressBar, Tag, Tabs, Dialog, and Dropdown. Use reusable components, Auto Layout, and consistent navigation. Create exactly 3 editable desktop frames at 1440px width. Prioritize realistic functionality, readability, and professional presentation.`;
  const figmaPromptMod2 = `Design Module 02 of CareerPath, an AI-powered career and skills tracking web application. Create exactly 3 desktop screens: Career Dashboard, Career Profile, and Career Goals.
Use a professional light SaaS design consistent with the previous login, registration, and CV upload screens. Use navy #243B64, white #FFFFFF, background #F7F8FA, text #202938, subtle gray borders, and restrained blue accents. Use Inter typography, clean spacing, moderate rounded corners, and minimal shadows. Avoid dark mode, excessive gradients, decorative illustrations, and generic AI aesthetics.
Screen 1 \u2014 Career Dashboard:
Create a personalized welcome section, profile completion progress bar, CV status card, career goal summary, skills overview, and recent activity. Include a clean left sidebar with Dashboard, Kariyer Profilim, Becerilerim, Kariyer Hedeflerim, \u0130\u015F \u0130lanlar\u0131, Etkinlikler, and Ayarlar. Use realistic sample data and compact, well-aligned cards.
Screen 2 \u2014 Career Profile:
Create an editable profile page with personal information, education, experience, projects, certifications, and CV management sections. Include clear Edit buttons, form fields, save and cancel actions, and a profile completion indicator.
Screen 3 \u2014 Career Goals:
Allow users to select a target job title, industry, preferred location, and work model (remote, hybrid, office). Use searchable dropdowns, selectable cards, and a primary \u201CHedeflerimi Kaydet\u201D button. Show a small summary of the selected career goal.
Use Turkish UI text. Design practical layouts using components that can be implemented with React and PrimeReact: Menubar or Sidebar, Card, InputText, Dropdown, Button, ProgressBar, Tag, and Divider. Use Auto Layout, reusable components, consistent spacing, and realistic form states. Create exactly 3 editable desktop frames at 1440px width. Prioritize usability, visual consistency, and real frontend feasibility.`;
  const activePromptText = selectedPromptModule === "mod7" ? figmaPromptMod7 : selectedPromptModule === "mod6" ? figmaPromptMod6 : selectedPromptModule === "mod5" ? figmaPromptMod5 : selectedPromptModule === "mod4" ? figmaPromptMod4 : selectedPromptModule === "mod3" ? figmaPromptMod3 : figmaPromptMod2;
  const handleCopyFigmaPrompt = () => {
    navigator.clipboard.writeText(activePromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const isModule7 = currentView === "company-profile" || currentView === "create-job" || currentView === "applicant-management";
  const isModule6 = currentView === "job-listings" || currentView === "job-details" || currentView === "jobs";
  const isModule5 = currentView === "career-roadmap" || currentView === "learning-recommendations";
  const isModule4 = currentView === "knowledge-graph" || currentView === "skills";
  const isModule3 = currentView === "cv-analysis" || currentView === "cv-builder";
  const viewTitles = {
    dashboard: {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 02",
      title: "Ana Dashboard (Career Dashboard)",
      subtitle: "Kariyer geli\u015Fimi, profil durumu ve yapay zeka analiz \xF6zeti."
    },
    profile: {
      screenNum: "Ekran 2",
      moduleTag: "Mod\xFCl 02",
      title: "Kariyer Profilim (Career Profile)",
      subtitle: "\u0130leti\u015Fim, e\u011Fitim, i\u015F deneyimi ve CV belgelerinizin tam y\xF6netimi."
    },
    goals: {
      screenNum: "Ekran 3",
      moduleTag: "Mod\xFCl 02",
      title: "Kariyer Hedeflerim (Career Goals)",
      subtitle: "Hedeflenen pozisyon, \xE7al\u0131\u015Fma modeli ve sekt\xF6r tercihlerinizi belirleyin."
    },
    "cv-analysis": {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 03",
      title: "CV Analiz Sonu\xE7lar\u0131 (CV Analysis Results)",
      subtitle: "Genel CV skoru, g\xFC\xE7l\xFC/zay\u0131f y\xF6nler ve eksik anahtar kelime haritas\u0131."
    },
    "cv-builder": {
      screenNum: "Ekran 2",
      moduleTag: "Mod\xFCl 03",
      title: "CV Olu\u015Fturma ve D\xFCzenleme (CV Builder)",
      subtitle: "Sol edit\xF6r ve sa\u011F tarafta anl\u0131k g\xFCncellenen canl\u0131 A4 belge \xF6nizlemesi."
    },
    "cv-improvements": {
      screenNum: "Ekran 3",
      moduleTag: "Mod\xFCl 03",
      title: "CV \u0130yile\u015Ftirme \xD6nerileri (Smart Content Enhancement)",
      subtitle: "B\xF6l\xFCm bazl\u0131 zay\u0131f ifadeleri profesyonel ba\u015Far\u0131 c\xFCmlelerine d\xF6n\xFC\u015Ft\xFCrme."
    },
    "knowledge-graph": {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 04",
      title: "Beceri Haritas\u0131 (Knowledge Graph)",
      subtitle: "Becerileri birbirine ba\u011Fl\u0131 d\xFC\u011F\xFCmlerle g\xF6steren etkile\u015Fimli yetkinlik haritas\u0131."
    },
    "skill-tracking": {
      screenNum: "Ekran 2",
      moduleTag: "Mod\xFCl 04",
      title: "Beceri Listesi ve Seviye Takibi (Skill Tracking)",
      subtitle: "T\xFCm yetkinliklerin seviye, ilerleme ve kan\u0131t g\xF6stergeleriyle detayl\u0131 tablosu."
    },
    "skill-details": {
      screenNum: "Ekran 3",
      moduleTag: "Mod\xFCl 04",
      title: "Beceri Detaylar\u0131 ve Geli\u015Fim Ge\xE7mi\u015Fi (Skill Details)",
      subtitle: "Tespit kayna\u011F\u0131, ilgili e\u011Fitim ve projeler, seviye de\u011Fi\u015Fim zaman \xE7izelgesi."
    },
    "career-roadmap": {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 05",
      title: "Kariyer Yol Haritas\u0131 (Career Roadmap)",
      subtitle: "Hedef mesle\u011Fe giden a\u015Famalar, kilometre ta\u015Flar\u0131 ve tamamlanmas\u0131 gereken ad\u0131mlar."
    },
    "learning-recommendations": {
      screenNum: "Ekran 2",
      moduleTag: "Mod\xFCl 05",
      title: "E\u011Fitim & Kaynak \xD6nerileri (Learning Recommendations)",
      subtitle: "Eksik becerilere uygun kurslar, zorluk dereceleri, s\xFCreleri ve \xFCcret durumlar\u0131."
    },
    "development-plan": {
      screenNum: "Ekran 3",
      moduleTag: "Mod\xFCl 05",
      title: "Geli\u015Fim Plan\u0131m (My Development Plan)",
      subtitle: "Haftal\u0131k hedefler, biti\u015F tarihleri, tamamlanma onaylar\u0131 ve canl\u0131 ilerleme takibi."
    },
    "job-listings": {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 06",
      title: "\u0130\u015F \u0130lanlar\u0131 ve AI E\u015Fle\u015Ftirme (Job Listings)",
      subtitle: "Teknik becerilerinizle e\u015Fle\u015Fen a\xE7\u0131k pozisyonlar ve do\u011Frudan ilana gitme."
    },
    "job-details": {
      screenNum: "Ekran 2",
      moduleTag: "Mod\xFCl 06",
      title: "\u0130lan Detay\u0131 ve Uyum Analizi (Job Details & Match)",
      subtitle: "E\u015Fle\u015Fen ve eksik yetkinlikler, uyum skoru analizi ve resm\xEE ilan sayfas\u0131."
    },
    "company-profile": {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 07",
      title: "\u015Eirket Profili (Company Profile)",
      subtitle: "\u0130\u015Fveren marka kimli\u011Fi, faaliyet merkezleri ve \u015Firket genel bak\u0131\u015F\u0131."
    },
    "create-job": {
      screenNum: "Ekran 2",
      moduleTag: "Mod\xFCl 07",
      title: "\u0130\u015F \u0130lan\u0131 Olu\u015Fturma (Create Job Listing)",
      subtitle: "Pozisyon gereksinimleri, aranan beceriler, \xE7al\u0131\u015Fma modeli ve maa\u015F aral\u0131\u011F\u0131."
    },
    "applicant-management": {
      screenNum: "Ekran 3",
      moduleTag: "Mod\xFCl 07",
      title: "Aday Y\xF6netimi (Applicant Management)",
      subtitle: "Ba\u015Fvuran adaylar, CV \xF6zetleri, AI e\u015Fle\u015Fme y\xFCzdeleri ve a\u015Fama takibi."
    },
    skills: {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 04",
      title: "Becerilerim & Yetkinlikler",
      subtitle: "CV ve deneyimlerinizden \xE7\u0131kar\u0131lan do\u011Frulanm\u0131\u015F yetkinlik havuzu."
    },
    jobs: {
      screenNum: "Ekran 1",
      moduleTag: "Mod\xFCl 06",
      title: "\u0130\u015F \u0130lanlar\u0131 & E\u015Fle\u015Fmeler",
      subtitle: "Becerilerinizle uyumlu a\xE7\u0131k pozisyonlar."
    },
    events: {
      screenNum: "Mod\xFCl 07",
      moduleTag: "Gelecek",
      title: "Kariyer Etkinlikleri",
      subtitle: "Seminerler, webinarlar ve m\xFClakat at\xF6lyeleri."
    },
    settings: {
      screenNum: "Ayarlar",
      moduleTag: "Hesap",
      title: "Hesap Ayarlar\u0131",
      subtitle: "G\xFCvenlik, bildirim ve gizlilik tercihleri."
    }
  };
  const currentInfo = viewTitles[currentView] || viewTitles.dashboard;
  const notifications = [
    {
      id: 1,
      title: "CV Analizi Tamamland\u0131",
      desc: `${user.cvFileName || "\xD6zge\xE7mi\u015F"} analiz edildi: 84 Puan. 4 iyile\u015Ftirme \xF6nerisi haz\u0131r.`,
      time: "\u015Eimdi",
      unread: true
    },
    {
      id: 2,
      title: "Profil Dolulu\u011Fu",
      desc: "Hedeflerinizi tamamlayarak %85 oran\u0131na ula\u015Ft\u0131n\u0131z.",
      time: "1 saat \xF6nce",
      unread: false
    }
  ];
  return <header className="bg-white border-b border-[#E3E7ED] px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#667085] mb-0.5">
          <span className="font-bold text-[#243B64] bg-[#EEF2F6] px-2 py-0.5 rounded text-[10px]">
            {currentInfo.moduleTag} · {currentInfo.screenNum}
          </span>
          <span>CareerPath</span>
          <span>/</span>
          <span className="text-[#243B64] font-medium truncate max-w-xs">{currentInfo.title}</span>
        </div>
        <h1 className="text-lg lg:text-xl font-bold text-[#202938] tracking-tight">
          {currentInfo.title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {
    /* Dynamic Contextual Tabs for the active module */
  }
        {isModule7 ? <div className="hidden sm:flex items-center gap-1 p-1 bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => onViewChange("company-profile")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "company-profile" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              1. Şirket Profili
            </button>
            <button
    type="button"
    onClick={() => onViewChange("create-job")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "create-job" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              2. İlan Oluştur
            </button>
            <button
    type="button"
    onClick={() => onViewChange("applicant-management")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "applicant-management" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              3. Aday Yönetimi
            </button>
          </div> : isModule6 ? <div className="hidden sm:flex items-center gap-1 p-1 bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => onViewChange("job-listings")}
    className="px-3 py-1.5 rounded-md font-bold bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] cursor-pointer"
  >
              İş İlanları & Eşleşme
            </button>
          </div> : isModule5 ? <div className="hidden sm:flex items-center gap-1 p-1 bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => onViewChange("career-roadmap")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "career-roadmap" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              1. Yol Haritası & Plan
            </button>
            <button
    type="button"
    onClick={() => onViewChange("learning-recommendations")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "learning-recommendations" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              2. Eğitim Önerileri
            </button>
          </div> : isModule4 ? <div className="hidden sm:flex items-center gap-1 p-1 bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => onViewChange("knowledge-graph")}
    className="px-3 py-1.5 rounded-md font-bold bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] cursor-pointer"
  >
              Beceri Haritası (Knowledge Graph)
            </button>
          </div> : isModule3 ? <div className="hidden sm:flex items-center gap-1 p-1 bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => onViewChange("cv-analysis")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "cv-analysis" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              1. CV Analiz Raporu
            </button>
            <button
    type="button"
    onClick={() => onViewChange("cv-builder")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "cv-builder" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              2. CV Editör
            </button>
          </div> : <div className="hidden sm:flex items-center gap-1 p-1 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => onViewChange("dashboard")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "dashboard" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              1. Dashboard
            </button>
            <button
    type="button"
    onClick={() => onViewChange("profile")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "profile" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              2. Profil
            </button>
            <button
    type="button"
    onClick={() => onViewChange("goals")}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentView === "goals" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED] font-bold" : "text-[#667085] hover:text-[#202938]"}`}
  >
              3. Hedefler
            </button>
          </div>}

        {
    /* Quick Module Switcher Segmented Control */
  }
        <div className="hidden md:flex items-center gap-1 border border-[#E3E7ED] rounded-lg p-0.5 bg-[#F7F8FA] text-xs">
          <button
    type="button"
    onClick={() => onViewChange("dashboard")}
    className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${!isModule3 && !isModule4 && !isModule5 ? "bg-[#243B64] text-white shadow-2xs font-semibold" : "text-[#667085] hover:text-[#202938]"}`}
  >
            Modül 02
          </button>
          <button
    type="button"
    onClick={() => onViewChange("cv-analysis")}
    className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${isModule3 ? "bg-[#243B64] text-white shadow-2xs font-semibold" : "text-[#667085] hover:text-[#202938]"}`}
  >
            Modül 03
          </button>
          <button
    type="button"
    onClick={() => onViewChange("knowledge-graph")}
    className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${isModule4 ? "bg-[#243B64] text-white shadow-2xs font-semibold" : "text-[#667085] hover:text-[#202938]"}`}
  >
            Modül 04
          </button>
          <button
    type="button"
    onClick={() => onViewChange("career-roadmap")}
    className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${isModule5 ? "bg-[#243B64] text-white shadow-2xs font-semibold" : "text-[#667085] hover:text-[#202938]"}`}
  >
            Modül 05
          </button>
          <button
    type="button"
    onClick={() => onViewChange("job-listings")}
    className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${isModule6 ? "bg-[#243B64] text-white shadow-2xs font-semibold" : "text-[#667085] hover:text-[#202938]"}`}
  >
            Modül 06
          </button>
          <button
    type="button"
    onClick={() => onViewChange("company-profile")}
    className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${isModule7 ? "bg-[#243B64] text-white shadow-2xs font-semibold" : "text-[#667085] hover:text-[#202938]"}`}
  >
            Modül 07
          </button>
        </div>

        {
    /* Figma Prompt Button */
  }
        <button
    type="button"
    onClick={() => setShowFigmaModal(true)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#243B64] bg-[#EEF2F6] hover:bg-[#E3E9F2] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer shadow-2xs"
    title="Figma promptunu görüntüle ve kopyala"
  >
          <Sparkles className="w-3.5 h-3.5 text-[#2F8F83]" />
          <span className="hidden sm:inline">Figma Promptu</span>
        </button>

        {
    /* Notifications Dropdown */
  }
        <div className="relative">
          <button
    type="button"
    onClick={() => setShowNotifications(!showNotifications)}
    className="w-9 h-9 rounded-lg border border-[#E3E7ED] hover:border-[#CBD3E1] flex items-center justify-center text-[#5276A7] hover:text-[#202938] hover:bg-[#F7F8FA] transition-colors relative cursor-pointer"
    aria-label="Bildirimler"
  >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2F8F83]" />
          </button>

          {showNotifications && <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E3E7ED] rounded-xl shadow-lg p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3E7ED] px-1">
                <span className="text-xs font-semibold text-[#202938]">Bildirimler</span>
                <button
    onClick={() => setShowNotifications(false)}
    className="text-[#667085] hover:text-[#202938] p-1 cursor-pointer"
  >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {notifications.map((n) => <div
    key={n.id}
    className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E3E7ED]/70 text-xs"
  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#202938] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F83]" />
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#667085]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1 leading-normal">
                      {n.desc}
                    </p>
                  </div>)}
              </div>
            </div>}
        </div>
      </div>

      {
    /* Figma Prompt Modal */
  }
      <Modal
    isOpen={showFigmaModal}
    onClose={() => setShowFigmaModal(false)}
    title="Figma Tasarım Promptları"
    subtitle="Seçtiğiniz modüle ait promptu kopyalayarak doğrudan Figma AI veya Claude / ChatGPT'ye aktarabilirsiniz."
    maxWidth="lg"
  >
        <div className="space-y-4">
          {
    /* Module Selector in Modal */
  }
          <div className="flex flex-col sm:flex-row items-center gap-1.5 p-1 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg">
            <button
    type="button"
    onClick={() => setSelectedPromptModule("mod7")}
    className={`w-full sm:flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${selectedPromptModule === "mod7" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
              Modül 07: İşveren (Yeni)
            </button>
            <button
    type="button"
    onClick={() => setSelectedPromptModule("mod6")}
    className={`w-full sm:flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${selectedPromptModule === "mod6" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
              Modül 06: İş İlanı
            </button>
            <button
    type="button"
    onClick={() => setSelectedPromptModule("mod5")}
    className={`w-full sm:flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${selectedPromptModule === "mod5" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
              Modül 05: Yol Haritası
            </button>
            <button
    type="button"
    onClick={() => setSelectedPromptModule("mod4")}
    className={`w-full sm:flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${selectedPromptModule === "mod4" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
              Modül 04: Knowledge Graph
            </button>
            <button
    type="button"
    onClick={() => setSelectedPromptModule("mod3")}
    className={`w-full sm:flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${selectedPromptModule === "mod3" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
              Modül 03: AI CV
            </button>
            <button
    type="button"
    onClick={() => setSelectedPromptModule("mod2")}
    className={`w-full sm:flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${selectedPromptModule === "mod2" ? "bg-white text-[#243B64] shadow-xs border border-[#E3E7ED]" : "text-[#667085] hover:text-[#202938]"}`}
  >
              Modül 02: Dashboard
            </button>
          </div>

          <div className="p-3 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg">
            <pre className="text-xs text-[#202938] font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {activePromptText}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E3E7ED]">
            <span className="text-xs text-[#667085]">
              React + PrimeReact standart bileşenleriyle %100 uyumlu
            </span>
            <button
    type="button"
    onClick={handleCopyFigmaPrompt}
    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#243B64] hover:bg-[#1B2D4E] rounded-lg transition-colors cursor-pointer shadow-xs"
  >
              {copied ? <>
                  <Check className="w-4 h-4 text-[#2F8F83]" />
                  <span>Kopyalandı!</span>
                </> : <>
                  <Copy className="w-4 h-4" />
                  <span>Promptu Kopyala</span>
                </>}
            </button>
          </div>
        </div>
      </Modal>
    </header>;
};
export {
  DashboardHeader
};
