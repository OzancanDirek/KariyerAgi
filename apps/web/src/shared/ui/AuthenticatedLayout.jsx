import { ArrowRight, Award, BookOpen, BriefcaseBusiness, Compass, FileText, FolderGit2, GraduationCap, LayoutDashboard, LogOut, Network, Target, UserRound } from 'lucide-react';
import { Logo } from './Logo.jsx';

const recordTitles = {
  experiences: ['İş ve Staj Deneyimlerim', BriefcaseBusiness],
  educations: ['Eğitim Geçmişim', GraduationCap],
  projects: ['Projelerim', FolderGit2],
  certificates: ['Sertifikalarım', Award],
  cv: ['CV Dosyalarım', FileText],
};

function NavigationButton({ icon: Icon, label, active, onClick }) {
  return <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active ? 'bg-[#243B64] font-semibold text-white' : 'text-[#52627A] hover:bg-[#F2F5F8]'}`}><Icon size={18} />{label}{active && <ArrowRight size={15} className="ml-auto" />}</button>;
}

export function AuthenticatedLayout({ screen, role, user, onNavigate, onLogout, children }) {
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'Hesabım';
  const recordKind = screen.startsWith('records-') ? screen.slice('records-'.length) : null;
  const title = screen === 'company' ? 'Şirketim' : screen === 'employer-jobs' ? 'İş İlanlarım' : screen === 'company-review' ? 'Şirket İncelemeleri' : screen === 'dashboard' ? 'Ana Dashboard'
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
      <nav className="flex-1 space-y-8 px-4 py-7" aria-label="Ana menü">
        {role === 'isveren' || role === 'yonetici' ? <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{role === 'isveren' ? 'İşveren alanı' : 'Yönetim alanı'}</p><div className="mt-4 space-y-1">{role === 'isveren' ? <><NavigationButton icon={BriefcaseBusiness} label="Şirketim" active={screen === 'company'} onClick={() => onNavigate('company')} /><NavigationButton icon={FileText} label="İş İlanlarım" active={screen === 'employer-jobs'} onClick={() => onNavigate('employer-jobs')} /></> : <NavigationButton icon={BriefcaseBusiness} label="Şirket İncelemeleri" active={screen === 'company-review'} onClick={() => onNavigate('company-review')} />}</div></div> : <>
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 02 · Kariyer & Profil</p>
          <div className="mt-4 space-y-1">
            <NavigationButton icon={LayoutDashboard} label="Ana Dashboard" active={screen === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavigationButton icon={UserRound} label="Kariyer Profilim" active={screen === 'profile-overview' || screen === 'profile-edit' || Boolean(recordKind)} onClick={() => onNavigate('profile-overview')} />
            <NavigationButton icon={Target} label="Kariyer Hedeflerim" active={screen === 'career-goals'} onClick={() => onNavigate('career-goals')} />
          </div>
        </div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 03 · AI CV Merkezi</p><div className="mt-4 space-y-1"><NavigationButton icon={FileText} label="CV Analiz Raporu" active={screen === 'cv-analysis'} onClick={() => onNavigate('cv-analysis')} /><NavigationButton icon={FileText} label="CV Oluşturucu" active={screen === 'cv-builder'} onClick={() => onNavigate('cv-builder')} /></div></div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 04 · Beceri Haritası</p><div className="mt-4"><NavigationButton icon={Network} label="Beceri Haritam" active={screen === 'skill-map'} onClick={() => onNavigate('skill-map')} /></div></div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 05 · Yol Haritası</p><div className="mt-4"><NavigationButton icon={Compass} label="Kariyer Yol Haritam" active={screen === 'roadmap'} onClick={() => onNavigate('roadmap')} /><NavigationButton icon={BookOpen} label="Eğitim ve Kaynaklar" active={screen === 'learning-resources'} onClick={() => onNavigate('learning-resources')} /></div></div>
        <div><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 06 · İş İlanları</p><div className="mt-4"><NavigationButton icon={BriefcaseBusiness} label="İş İlanları ve Başvurularım" active={screen === 'candidate-jobs'} onClick={() => onNavigate('candidate-jobs')} /></div></div>
        </>}
      </nav>
      <button type="button" onClick={onLogout} className="mx-4 mb-5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#52627A] hover:bg-[#F2F5F8]"><LogOut size={18} />Çıkış yap</button>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="border-b border-[#E3E7ED] bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"><div className="lg:hidden"><Logo size="sm" /></div><div className="hidden lg:block"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5276A7]">{role === 'isveren' ? 'Modül 07 · İşveren' : role === 'yonetici' ? 'Yönetim' : screen === 'roadmap' || screen === 'learning-resources' ? 'Modül 05 · Yol Haritası' : screen === 'skill-map' ? 'Modül 04 · Beceri Haritası' : screen === 'candidate-jobs' ? 'Modül 06 · İş İlanları' : screen === 'cv-analysis' || screen === 'cv-builder' ? 'Modül 03 · AI CV Merkezi' : 'Modül 02 · Kariyer & Profil'}</p><p className="mt-1 text-lg font-semibold text-[#243B64]">{title}</p></div><div className="flex items-center gap-2"><span className="hidden rounded-lg bg-[#243B64] px-3 py-2 text-xs font-semibold text-white sm:inline-flex">{displayName}</span><button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-3 py-2 text-sm font-semibold text-[#52627A] hover:bg-[#F7F8FA]" aria-label="Çıkış yap"><LogOut size={17} /><span className="hidden sm:inline">Çıkış yap</span></button></div></div>
        {role === 'isveren' || role === 'yonetici' ? <nav className="flex gap-2 px-5 pb-3 lg:hidden sm:px-8" aria-label="Mobil menü">{role === 'isveren' ? <><NavigationButton icon={BriefcaseBusiness} label="Şirketim" active={screen === 'company'} onClick={() => onNavigate('company')} /><NavigationButton icon={FileText} label="İş İlanlarım" active={screen === 'employer-jobs'} onClick={() => onNavigate('employer-jobs')} /></> : <NavigationButton icon={BriefcaseBusiness} label="Şirket İncelemeleri" active={screen === 'company-review'} onClick={() => onNavigate('company-review')} />}</nav> : <nav className="flex gap-2 overflow-x-auto px-5 pb-3 lg:hidden sm:px-8" aria-label="Mobil menü"><NavigationButton icon={LayoutDashboard} label="Ana sayfa" active={screen === 'dashboard'} onClick={() => onNavigate('dashboard')} /><NavigationButton icon={UserRound} label="Profilim" active={screen === 'profile-overview' || screen === 'profile-edit' || Boolean(recordKind)} onClick={() => onNavigate('profile-overview')} /><NavigationButton icon={Target} label="Hedeflerim" active={screen === 'career-goals'} onClick={() => onNavigate('career-goals')} /><NavigationButton icon={FileText} label="CV analizi" active={screen === 'cv-analysis'} onClick={() => onNavigate('cv-analysis')} /><NavigationButton icon={FileText} label="CV oluştur" active={screen === 'cv-builder'} onClick={() => onNavigate('cv-builder')} /><NavigationButton icon={Network} label="Becerilerim" active={screen === 'skill-map'} onClick={() => onNavigate('skill-map')} /><NavigationButton icon={Compass} label="Yol haritam" active={screen === 'roadmap'} onClick={() => onNavigate('roadmap')} /><NavigationButton icon={BookOpen} label="Kaynaklar" active={screen === 'learning-resources'} onClick={() => onNavigate('learning-resources')} /><NavigationButton icon={BriefcaseBusiness} label="İş ilanları" active={screen === 'candidate-jobs'} onClick={() => onNavigate('candidate-jobs')} /></nav>}
      </header>
      {children}
    </div>
  </div>;
}
