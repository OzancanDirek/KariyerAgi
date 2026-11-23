import i18n from '../../i18n.js';
import { ArrowRight, Award, BookOpen, BriefcaseBusiness, Compass, FileText, FolderGit2, GraduationCap, LayoutDashboard, LogOut, Network, Target, UserRound, Users } from 'lucide-react';
import { useState } from 'react';
import { AccountClosureDialog } from '../../features/auth/components/AccountClosureDialog.jsx';
import { Logo } from './Logo.jsx';
import { LanguageSwitch } from './LanguageSwitch.jsx';
import { useTranslation } from 'react-i18next';

const recordTitles = {
  experiences: ['İş ve Staj Deneyimlerim', BriefcaseBusiness],
  educations: ['Eğitim Geçmişim', GraduationCap],
  projects: ['Projelerim', FolderGit2],
  certificates: ['Sertifikalarım', Award],
  cv: ['CV Dosyalarım', FileText],
};

function NavigationButton({ icon: Icon, label, active, onClick }) {
  const { t } = useTranslation();
  return <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active ? 'bg-[#243B64] font-semibold text-white' : 'text-[#52627A] hover:bg-[#F2F5F8]'}`}><Icon size={18} />{t(label)}{active && <ArrowRight size={15} className="ml-auto" />}</button>;
}

export function AuthenticatedLayout({ screen, role, user, onNavigate, onLogout, runAuthenticated, children }) {
  const { t } = useTranslation();
  const [showClosure, setShowClosure] = useState(false);
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || t('Hesabım');
  const recordKind = screen.startsWith('records-') ? screen.slice('records-'.length) : null;
  const title = screen === 'company' ? 'Şirketim' : screen === 'employer-jobs' ? 'İş İlanlarım' : screen === 'employer-candidates' ? 'Aday Yönetimi' : screen === 'company-review' ? 'Şirket İncelemeleri' : screen === 'resource-management' ? 'Eğitim Kaynakları' : screen === 'dashboard' ? 'Ana Dashboard'
    : screen === 'career-goals' ? 'Kariyer Hedeflerim'
      : screen === 'cv-analysis' ? 'CV Analiz Raporu'
      : screen === 'cv-builder' ? 'CV Oluşturucu'
      : screen === 'skill-map' ? 'Beceri Haritam'
      : screen === 'roadmap' ? 'Kariyer Yol Haritam'
      : screen === 'learning-resources' ? 'Eğitim ve Kaynaklar'
      : screen === 'candidate-jobs' ? 'İş İlanları'
      : screen === 'profile-edit' ? 'Profil Bilgilerimi Düzenle'
        : recordTitles[recordKind]?.[0] || 'Kariyer Profilim';

  return <div className="min-h-screen bg-[#F7F8FA] text-[#202938] lg:flex">
    <aside className="hidden w-72 shrink-0 border-r border-[#E3E7ED] bg-white lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-[#E3E7ED] px-6 py-6"><Logo size="md" showSubtitle /></div>
      <nav className="flex-1 space-y-8 px-4 py-7" aria-label={i18n.t("Ana menü")}>
        {role === 'isveren' || role === 'yonetici' ? <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{t(role === 'isveren' ? i18n.t("İşveren alanı") : i18n.t("Yönetim alanı"))}</p><div className="mt-4 space-y-1">{role === 'isveren' ? <><NavigationButton icon={BriefcaseBusiness} label={i18n.t("Şirketim")} active={screen === 'company'} onClick={() => onNavigate('company')} /><NavigationButton icon={FileText} label={i18n.t("İş İlanlarım")} active={screen === 'employer-jobs'} onClick={() => onNavigate('employer-jobs')} /><NavigationButton icon={Users} label={i18n.t("Aday Yönetimi")} active={screen === 'employer-candidates'} onClick={() => onNavigate('employer-candidates')} /></> : <><NavigationButton icon={BriefcaseBusiness} label={i18n.t("Şirket İncelemeleri")} active={screen === 'company-review'} onClick={() => onNavigate('company-review')} /><NavigationButton icon={BookOpen} label={i18n.t("Eğitim Kaynakları")} active={screen === 'resource-management'} onClick={() => onNavigate('resource-management')} /></>}</div></div> : <>
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{t('Kariyer ve Profil')}</p>
          <div className="mt-4 space-y-1">
            <NavigationButton icon={LayoutDashboard} label="Ana Dashboard" active={screen === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavigationButton icon={UserRound} label="Kariyer Profilim" active={screen === 'profile-overview' || screen === 'profile-edit' || Boolean(recordKind)} onClick={() => onNavigate('profile-overview')} />
            <NavigationButton icon={Target} label="Kariyer Hedeflerim" active={screen === 'career-goals'} onClick={() => onNavigate('career-goals')} />
          </div>
        </div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{t('CV Merkezi')}</p><div className="mt-4 space-y-1"><NavigationButton icon={FileText} label="CV Analiz Raporu" active={screen === 'cv-analysis'} onClick={() => onNavigate('cv-analysis')} /><NavigationButton icon={FileText} label={i18n.t("CV Oluşturucu")} active={screen === 'cv-builder'} onClick={() => onNavigate('cv-builder')} /></div></div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{t("Beceri Haritası")}</p><div className="mt-4"><NavigationButton icon={Network} label="Beceri Haritam" active={screen === 'skill-map'} onClick={() => onNavigate('skill-map')} /></div></div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{t("Yol Haritası")}</p><div className="mt-4"><NavigationButton icon={Compass} label="Kariyer Yol Haritam" active={screen === 'roadmap'} onClick={() => onNavigate('roadmap')} /><NavigationButton icon={BookOpen} label={i18n.t("Eğitim ve Kaynaklar")} active={screen === 'learning-resources'} onClick={() => onNavigate('learning-resources')} /></div></div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{t("İş İlanları")}</p><div className="mt-4"><NavigationButton icon={BriefcaseBusiness} label={i18n.t("İş İlanları ve Başvurularım")} active={screen === 'candidate-jobs'} onClick={() => onNavigate('candidate-jobs')} /></div></div>
        </>}
      </nav>
      <div className="mx-4 mb-5 space-y-1"><button type="button" onClick={() => setShowClosure(true)} className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#7A8495] hover:bg-[#FFF1F1] hover:text-red-700">{t("Hesabımı kapat")}</button><button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#52627A] hover:bg-[#F2F5F8]"><LogOut size={18} />{t("Çıkış yap")}</button></div>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="border-b border-[#E3E7ED] bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"><div className="lg:hidden"><Logo size="sm" /></div><div className="hidden lg:block"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5276A7]">{role === 'isveren' ? i18n.t("İşveren") : role === 'yonetici' ? i18n.t("Yönetim") : screen === 'roadmap' || screen === 'learning-resources' ? i18n.t("Yol Haritası") : screen === 'skill-map' ? i18n.t("Beceri Haritası") : screen === 'candidate-jobs' ? i18n.t("İş İlanları") : screen === 'cv-analysis' || screen === 'cv-builder' ? 'CV Merkezi' : 'Kariyer ve Profil'}</p><p className="mt-1 text-lg font-semibold text-[#243B64]">{t(title)}</p></div><div className="flex items-center gap-2"><LanguageSwitch /><span className="hidden rounded-lg bg-[#243B64] px-3 py-2 text-xs font-semibold text-white sm:inline-flex">{displayName}</span><button type="button" onClick={() => setShowClosure(true)} className="rounded-lg px-2 py-2 text-xs text-[#7A8495] hover:text-red-700 lg:hidden">{t("Hesabı kapat")}</button><button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-3 py-2 text-sm font-semibold text-[#52627A] hover:bg-[#F7F8FA]" aria-label={i18n.t("Çıkış yap")}><LogOut size={17} /><span className="hidden sm:inline">{t("Çıkış yap")}</span></button></div></div>
        {role === 'isveren' || role === 'yonetici' ? <nav className="flex gap-2 overflow-x-auto px-5 pb-3 lg:hidden sm:px-8" aria-label={i18n.t("Mobil menü")}>{role === 'isveren' ? <><NavigationButton icon={BriefcaseBusiness} label={i18n.t("Şirketim")} active={screen === 'company'} onClick={() => onNavigate('company')} /><NavigationButton icon={FileText} label={i18n.t("İş İlanlarım")} active={screen === 'employer-jobs'} onClick={() => onNavigate('employer-jobs')} /><NavigationButton icon={Users} label={i18n.t("Aday Yönetimi")} active={screen === 'employer-candidates'} onClick={() => onNavigate('employer-candidates')} /></> : <><NavigationButton icon={BriefcaseBusiness} label={i18n.t("Şirket İncelemeleri")} active={screen === 'company-review'} onClick={() => onNavigate('company-review')} /><NavigationButton icon={BookOpen} label={i18n.t("Eğitim Kaynakları")} active={screen === 'resource-management'} onClick={() => onNavigate('resource-management')} /></>}</nav> : <nav className="flex gap-2 overflow-x-auto px-5 pb-3 lg:hidden sm:px-8" aria-label={i18n.t("Mobil menü")}><NavigationButton icon={LayoutDashboard} label="Ana sayfa" active={screen === 'dashboard'} onClick={() => onNavigate('dashboard')} /><NavigationButton icon={UserRound} label="Profilim" active={screen === 'profile-overview' || screen === 'profile-edit' || Boolean(recordKind)} onClick={() => onNavigate('profile-overview')} /><NavigationButton icon={Target} label="Hedeflerim" active={screen === 'career-goals'} onClick={() => onNavigate('career-goals')} /><NavigationButton icon={FileText} label="CV analizi" active={screen === 'cv-analysis'} onClick={() => onNavigate('cv-analysis')} /><NavigationButton icon={FileText} label={i18n.t("CV oluştur")} active={screen === 'cv-builder'} onClick={() => onNavigate('cv-builder')} /><NavigationButton icon={Network} label="Becerilerim" active={screen === 'skill-map'} onClick={() => onNavigate('skill-map')} /><NavigationButton icon={Compass} label="Yol haritam" active={screen === 'roadmap'} onClick={() => onNavigate('roadmap')} /><NavigationButton icon={BookOpen} label="Kaynaklar" active={screen === 'learning-resources'} onClick={() => onNavigate('learning-resources')} /><NavigationButton icon={BriefcaseBusiness} label={i18n.t("İş ilanları")} active={screen === 'candidate-jobs'} onClick={() => onNavigate('candidate-jobs')} /></nav>}
      </header>
      {children}
      {showClosure && <AccountClosureDialog runAuthenticated={runAuthenticated} onClosed={onLogout} onClose={() => setShowClosure(false)} />}
    </div>
  </div>;
}
