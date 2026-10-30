import { useEffect, useState } from 'react';
import {
  ArrowRight, Award, BriefcaseBusiness, FileText, FolderGit2, GraduationCap,
  Mail, MapPin, Pencil, Phone, Target,
} from 'lucide-react';
import { profileApi } from '../api/profileApi.js';
import { careerProfileApi } from '../api/careerProfileApi.js';
import { ExperienceManager } from './ExperienceManager.jsx';
import { EducationManager } from './EducationManager.jsx';
import { CertificateManager } from './CertificateManager.jsx';
import { ProjectManager } from './ProjectManager.jsx';
import { CvManager } from './CvManager.jsx';
import { PROFILE_OVERVIEW_LIMIT } from './profileRecordPreview.js';
import { useProfilePhoto } from '../hooks/useProfilePhoto.js';

function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 border-b border-[#E3E7ED] pb-4 text-[#243B64]"><Icon size={18} /><h2 className="text-sm font-semibold text-[#202938]">{title}</h2></div>
      <div className="pt-3">{children}</div>
    </section>
  );
}

function Contact({ icon: Icon, children }) {
  if (!children) {
    return null;
  }

  return <span className="inline-flex items-center gap-1.5"><Icon size={15} />{children}</span>;
}

export function ProfileOverviewScreen({ runAuthenticated, onEdit, onOpenGoals, onOpenRecords }) {
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
  const photoSource = useProfilePhoto(personal, runAuthenticated);

  return (
    <div className="text-[#202938]">
        <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 lg:py-10">
          {loading && <p role="status" className="rounded-2xl bg-white p-8 text-sm text-[#667085]">Profil bilgilerin yükleniyor...</p>}
          {error && <p role="alert" className="rounded-xl border border-[#EFCACA] bg-[#FFF5F5] px-5 py-4 text-sm text-[#B42318]">{error}</p>}

          {personal && <>
            <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#243B64] text-xl font-bold text-white shadow-sm">
                    {photoSource ? <img src={photoSource} alt="Profil fotoğrafı" className="h-full w-full object-cover" /> : initials}
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
  );
}
