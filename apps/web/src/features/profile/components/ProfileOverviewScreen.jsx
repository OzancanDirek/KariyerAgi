import { useEffect, useState } from 'react';
import {
  ArrowRight, Award, BriefcaseBusiness, FileText, FolderGit2, GraduationCap,
  LayoutDashboard, LogOut, Mail, MapPin, Pencil, Phone, Target, UserRound,
} from 'lucide-react';
import { profileApi } from '../api/profileApi.js';
import { careerProfileApi } from '../api/careerProfileApi.js';
import { ExperienceManager } from './ExperienceManager.jsx';
import { EducationManager } from './EducationManager.jsx';
import { CertificateManager } from './CertificateManager.jsx';
import { ProjectManager } from './ProjectManager.jsx';
import { CvManager } from './CvManager.jsx';
import { PROFILE_OVERVIEW_LIMIT } from './profileRecordPreview.js';
import { Logo } from '../../../shared/ui/Logo.jsx';

const futureModules = [
  ['Modül 03 · AI CV Merkezi', 'CV Analiz Raporu'],
  ['Modül 04 · Beceri Haritası', 'Beceri Haritası'],
  ['Modül 05 · Yol Haritası', 'Kariyer Yol Haritası'],
  ['Modül 06 · İş İlanları', 'İş İlanları & Eşleşme'],
];

function Sidebar({ onHome, onGoals, onLogout }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-[#E3E7ED] bg-white lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-[#E3E7ED] px-6 py-6"><Logo size="md" showSubtitle /></div>
      <nav className="flex-1 space-y-8 px-4 py-7" aria-label="Ana menü">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">Modül 02 · Kariyer & Profil</p>
          <div className="mt-4 space-y-1">
            <button type="button" onClick={onHome} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#52627A] hover:bg-[#F2F5F8]"><LayoutDashboard size={18} />Ana Dashboard</button>
            <span aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#243B64] px-3 py-2.5 text-sm font-semibold text-white"><UserRound size={18} />Kariyer Profilim<ArrowRight size={15} className="ml-auto" /></span>
            <button type="button" onClick={onGoals} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#52627A] hover:bg-[#F2F5F8]"><Target size={18} />Kariyer Hedeflerim</button>
          </div>
        </div>
        {futureModules.map(([heading, item]) => <div key={heading}>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#77849A]">{heading}</p>
          <p className="mt-3 px-3 text-sm text-[#A5AFBD]">{item}</p>
        </div>)}
      </nav>
      <button type="button" onClick={onLogout} className="mx-4 mb-5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#52627A] hover:bg-[#F2F5F8]"><LogOut size={18} />Çıkış yap</button>
    </aside>
  );
}

function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 border-b border-[#E3E7ED] pb-4 text-[#243B64]"><Icon size={18} /><h2 className="text-sm font-semibold text-[#202938]">{title}</h2></div>
      <div className="pt-3">{children}</div>
    </section>
  );
}

function EmptyState({ text }) {
  return <p className="rounded-xl border border-dashed border-[#D8DEE8] bg-[#FAFBFC] px-4 py-8 text-center text-sm leading-6 text-[#8894A6]">{text}</p>;
}

function Contact({ icon: Icon, children }) {
  if (!children) {
    return null;
  }

  return <span className="inline-flex items-center gap-1.5"><Icon size={15} />{children}</span>;
}

export function ProfileOverviewScreen({ runAuthenticated, onHome, onEdit, onOpenGoals, onOpenRecords, onLogout }) {
  const [personal, setPersonal] = useState(null);
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfiles() {
      try {
        const person = await runAuthenticated(profileApi.getProfile);
        if (active) {
          setPersonal(person);
        }
        try {
          const candidate = await runAuthenticated(careerProfileApi.getCareerProfile);
          if (active) {
            setCareer(candidate);
          }
        } catch (failure) {
          if (active && failure.code !== 'CAR-001') {
            setError(failure.message);
          }
        }
      } catch (failure) {
        if (active) {
          setError(failure.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfiles();
    return () => {
      active = false;
    };
  }, []);

  const firstName = personal?.firstName || '';
  const lastName = personal?.lastName || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toLocaleUpperCase('tr-TR') || 'CP';

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938] lg:flex">
      <Sidebar onHome={onHome} onGoals={onOpenGoals} onLogout={onLogout} />
      <div className="min-w-0 flex-1">
        <header className="border-b border-[#E3E7ED] bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="lg:hidden"><Logo size="sm" /></div>
            <div className="hidden lg:block"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5276A7]">Modül 02 · Profil</p><p className="mt-1 text-lg font-semibold text-[#243B64]">Kariyer Profilim</p></div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#243B64] px-3 py-2 text-xs font-semibold text-white">Modül 02</span>
              <button type="button" onClick={onHome} className="rounded-lg border border-[#E3E7ED] px-3 py-2 text-xs font-medium text-[#52627A] hover:bg-[#F7F8FA] lg:hidden">Ana sayfa</button>
              <button type="button" onClick={onLogout} className="rounded-lg border border-[#E3E7ED] p-2 text-[#52627A] hover:bg-[#F7F8FA] lg:hidden" aria-label="Çıkış yap"><LogOut size={17} /></button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 lg:py-10">
          {loading && <p role="status" className="rounded-2xl bg-white p-8 text-sm text-[#667085]">Profil bilgilerin yükleniyor...</p>}
          {error && <p role="alert" className="rounded-xl border border-[#EFCACA] bg-[#FFF5F5] px-5 py-4 text-sm text-[#B42318]">{error}</p>}

          {personal && <>
            <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#243B64] text-xl font-bold text-white shadow-sm">
                    {personal.photoUrl ? <img src={personal.photoUrl} alt="Profil fotoğrafı" className="h-full w-full object-cover" /> : initials}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#202938]">{`${firstName} ${lastName}`.trim() || 'Profilim'}</h1>
                    <p className="mt-1 text-sm font-medium text-[#5276A7]">{career?.title || 'Henüz unvan eklenmedi'}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#667085]">
                      <Contact icon={MapPin}>{personal.location}</Contact>
                      <Contact icon={Mail}>{personal.email}</Contact>
                      <Contact icon={Phone}>{personal.phone}</Contact>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={onEdit} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243B64] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1B2D4E]"><Pencil size={16} />Bilgileri Düzenle</button>
              </div>
              <div className="mt-7 border-t border-[#E3E7ED] pt-6">
                <h2 className="text-sm font-semibold">Kariyer Özeti</h2>
                <p className="mt-2 max-w-4xl text-sm leading-7 text-[#667085]">{career?.summary || 'Henüz kariyer özeti eklenmedi. Bilgileri Düzenle bölümünden kendini anlatabilirsin.'}</p>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
              <div className="space-y-6">
                <SectionCard icon={BriefcaseBusiness} title="İş & Staj Deneyimleri"><ExperienceManager runAuthenticated={runAuthenticated} previewLimit={PROFILE_OVERVIEW_LIMIT} onShowAll={() => onOpenRecords('experiences')} /></SectionCard>
                <SectionCard icon={GraduationCap} title="Eğitim Geçmişi"><EducationManager runAuthenticated={runAuthenticated} previewLimit={PROFILE_OVERVIEW_LIMIT} onShowAll={() => onOpenRecords('educations')} /></SectionCard>
                <SectionCard icon={FolderGit2} title="Projeler & Portfolyo"><ProjectManager runAuthenticated={runAuthenticated} previewLimit={PROFILE_OVERVIEW_LIMIT} onShowAll={() => onOpenRecords('projects')} />{career?.portfolioUrl && <a href={career.portfolioUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#243B64] hover:underline">Portfolyomu aç <ArrowRight size={15} /></a>}</SectionCard>
              </div>
              <div className="space-y-6">
                <SectionCard icon={FileText} title="CV Yönetimi"><CvManager runAuthenticated={runAuthenticated} previewLimit={PROFILE_OVERVIEW_LIMIT} onShowAll={() => onOpenRecords('cv')} /></SectionCard>
                <SectionCard icon={Award} title="Sertifikalar"><CertificateManager runAuthenticated={runAuthenticated} previewLimit={PROFILE_OVERVIEW_LIMIT} onShowAll={() => onOpenRecords('certificates')} /></SectionCard>
                <SectionCard icon={Target} title="Kariyer Hedefleri"><p className="text-xs text-[#667085]">Hedef unvan</p><p className="mt-1 text-sm font-semibold">{career?.targetTitle || 'Henüz belirlenmedi'}</p><p className="mt-4 text-xs text-[#667085]">Hedef sektör</p><p className="mt-1 text-sm font-semibold">{career?.targetIndustry || 'Henüz belirlenmedi'}</p><button type="button" onClick={onOpenGoals} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#243B64] hover:underline">Tüm hedeflerimi gör <ArrowRight size={15} /></button></SectionCard>
              </div>
            </div>
          </>}
        </main>
      </div>
    </div>
  );
}
