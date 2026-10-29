import { ArrowLeft, Award, BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { ExperienceManager } from './ExperienceManager.jsx';
import { EducationManager } from './EducationManager.jsx';
import { CertificateManager } from './CertificateManager.jsx';
import { FolderGit2 } from 'lucide-react';
import { ProjectManager } from './ProjectManager.jsx';
import { FileText } from 'lucide-react';
import { CvManager } from './CvManager.jsx';

const pages = {
  experiences: { title: 'İş ve Staj Deneyimlerim', description: 'Tüm deneyimlerini buradan yönetebilirsin.', icon: BriefcaseBusiness, component: ExperienceManager },
  educations: { title: 'Eğitim Geçmişim', description: 'Okullarını ve eğitim bilgilerini burada görebilirsin.', icon: GraduationCap, component: EducationManager },
  cv: { title: 'CV Dosyalarım', description: 'CV dosyalarını yükle, indir ve birincil CV’ni seç.', icon: FileText, component: CvManager },
  projects: { title: 'Projelerim', description: 'Tüm projelerini ve portfolyo bağlantılarını yönet.', icon: FolderGit2, component: ProjectManager },
  certificates: { title: 'Sertifikalarım', description: 'Sertifikalarını ve yüklediğin belgeleri burada yönetebilirsin.', icon: Award, component: CertificateManager },
};

export function ProfileRecordsScreen({ kind, runAuthenticated, onBack }) {
  const page = pages[kind];
  if (!page) {
    return null;
  }
  const Icon = page.icon;
  const Manager = page.component;

  return <div className="min-h-screen bg-[#F7F8FA] px-5 py-8 text-[#202938] sm:px-8">
    <main className="mx-auto max-w-5xl">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#5276A7] hover:bg-white"><ArrowLeft size={17} />Kariyer profilime dön</button>
      <div className="mt-5 rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4 border-b border-[#E3E7ED] pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF4FA] text-[#243B64]"><Icon size={24} /></div>
          <div><h1 className="text-xl font-bold text-[#243B64]">{page.title}</h1><p className="mt-1 text-sm text-[#667085]">{page.description}</p></div>
        </div>
        <div className="pt-3"><Manager runAuthenticated={runAuthenticated} /></div>
      </div>
    </main>
  </div>;
}
