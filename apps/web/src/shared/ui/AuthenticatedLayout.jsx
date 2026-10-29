import { ArrowRight, Award, BriefcaseBusiness, FileText, FolderGit2, GraduationCap, LayoutDashboard, LogOut, Target, UserRound } from 'lucide-react';
import { Logo } from './Logo.jsx';

const futureModules = [
  ['Modül 03 · AI CV Merkezi', 'CV Analiz Raporu'],
  ['Modül 04 · Beceri Haritası', 'Beceri Haritası'],
  ['Modül 05 · Yol Haritası', 'Kariyer Yol Haritası'],
  ['Modül 06 · İş İlanları', 'İş İlanları & Eşleşme'],
];

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

export function AuthenticatedLayout({ screen, onNavigate, onLogout, children }) {
  const recordKind = screen.startsWith('records-') ? screen.slice('records-'.length) : null;
  const title = screen === 'dashboard' ? 'Ana Dashboard'
    : screen === 'career-goals' ? 'Kariyer Hedeflerim'
      : screen === 'profile-edit' ? 'Profil Bilgilerimi Düzenle'
        : recordTitles[recordKind]?.[0] || 'Kariyer Profilim';

  return <div className="min-h-screen bg-[#F7F8FA] text-[#202938] lg:flex">
    <aside className="hidden w-72 shrink-0 border-r border-[#E3E7ED] bg-white lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-[#E3E7ED] px-6 py-6"><Logo size="md" showSubtitle /></div>
      <nav className="flex-1 space-y-8 px-4 py-7" aria-label="Ana menü">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 02 · Kariyer & Profil</p>
          <div className="mt-4 space-y-1">
            <NavigationButton icon={LayoutDashboard} label="Ana Dashboard" active={screen === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavigationButton icon={UserRound} label="Kariyer Profilim" active={screen === 'profile-overview' || screen === 'profile-edit' || Boolean(recordKind)} onClick={() => onNavigate('profile-overview')} />
            <NavigationButton icon={Target} label="Kariyer Hedeflerim" active={screen === 'career-goals'} onClick={() => onNavigate('career-goals')} />
          </div>
        </div>
        {futureModules.map(([heading, item]) => <div key={heading}><p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{heading}</p><p className="mt-3 px-3 text-sm text-[#A5AFBD]">{item}</p></div>)}
      </nav>
      <button type="button" onClick={onLogout} className="mx-4 mb-5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#52627A] hover:bg-[#F2F5F8]"><LogOut size={18} />Çıkış yap</button>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="border-b border-[#E3E7ED] bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"><div className="lg:hidden"><Logo size="sm" /></div><div className="hidden lg:block"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5276A7]">Modül 02 · Kariyer & Profil</p><p className="mt-1 text-lg font-semibold text-[#243B64]">{title}</p></div><div className="flex items-center gap-2"><span className="hidden rounded-lg bg-[#243B64] px-3 py-2 text-xs font-semibold text-white sm:inline-flex">Modül 02</span><button type="button" onClick={onLogout} className="rounded-lg border border-[#E3E7ED] p-2 text-[#52627A] hover:bg-[#F7F8FA] lg:hidden" aria-label="Çıkış yap"><LogOut size={17} /></button></div></div>
        <nav className="flex gap-2 overflow-x-auto px-5 pb-3 lg:hidden sm:px-8" aria-label="Mobil menü"><NavigationButton icon={LayoutDashboard} label="Ana sayfa" active={screen === 'dashboard'} onClick={() => onNavigate('dashboard')} /><NavigationButton icon={UserRound} label="Profilim" active={screen === 'profile-overview' || screen === 'profile-edit' || Boolean(recordKind)} onClick={() => onNavigate('profile-overview')} /><NavigationButton icon={Target} label="Hedeflerim" active={screen === 'career-goals'} onClick={() => onNavigate('career-goals')} /></nav>
      </header>
      {children}
    </div>
  </div>;
}
