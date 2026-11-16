import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, FileText, Network, Target } from 'lucide-react';
import { careerProfileApi } from '../profile/api/careerProfileApi.js';
import { cvApi } from '../profile/api/cvApi.js';
import { skillsApi } from '../skills/skillsApi.js';
import { WelcomeDashboard } from '../dashboard/components/WelcomeDashboard.jsx';

const steps = [
  { key: 'goal', title: 'Hedef mesleğini belirle', detail: 'Yol haritanı kişiselleştirmek için hedeflediğin pozisyonu kaydet.', screen: 'career-goals', icon: Target },
  { key: 'cv', title: 'CV dosyanı ekle', detail: 'PDF özgeçmişini hesabına yükle. Yapay zekâ analizi isteğe bağlıdır.', screen: 'records-cv', icon: FileText },
  { key: 'skills', title: 'Becerilerini seç', detail: 'Sahip olduğun becerileri işaretle; gelişim önerileri buna göre hazırlanır.', screen: 'skill-map', icon: Network },
];

export function CandidateStartScreen({ user, runAuthenticated, onNavigate, showWhenComplete = false }) {
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      runAuthenticated(careerProfileApi.getCareerProfile),
      runAuthenticated(cvApi.list),
      runAuthenticated(skillsApi.getMap),
    ]).then(([profile, cvs, skills]) => {
      if (!active) { return; }
      if ([profile, cvs, skills].some((result) => result.status === 'rejected')) {
        setError('Başlangıç adımları şu anda yüklenemedi. İstersen menüden devam edebilirsin.');
        return;
      }
      setDone({ goal: Boolean(profile.value.targetTitle?.trim()), cv: cvs.value.length > 0, skills: skills.value.skills.some((skill) => skill.selected) });
    });
    return () => { active = false; };
  }, [runAuthenticated]);

  if (done && Object.values(done).every(Boolean) && !showWhenComplete) {
    return <WelcomeDashboard user={user} onOpenProfile={() => onNavigate('profile-overview')} onOpenGoals={() => onNavigate('career-goals')} />;
  }

  const completed = done ? Object.values(done).filter(Boolean).length : 0;
  return <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8"><div className="rounded-[28px] bg-[#243B64] p-7 text-white sm:p-10"><p className="text-sm font-bold uppercase tracking-widest text-[#9AD8CE]">İlk adımlar</p><h1 className="mt-4 text-3xl font-bold sm:text-4xl">Kariyer yolculuğunu başlat</h1><p className="mt-3 max-w-2xl text-[#D3DEEF]">Üç kısa adımda hedefini, özgeçmişini ve becerilerini ekle. Hepsini aynı anda tamamlamak zorunda değilsin.</p><p className="mt-6 text-sm font-semibold">{done ? `${completed} / 3 adım tamamlandı` : 'Adımlar yükleniyor…'}</p><div className="mt-3 h-2.5 max-w-xl overflow-hidden rounded-full bg-white/20"><div className="h-full bg-[#70D6BE]" style={{ width: `${completed / 3 * 100}%` }} /></div></div>
    {error && <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-4 text-amber-900">{error}</p>}
    <div className="mt-7 grid gap-4">{steps.map(({ key, title, detail, screen, icon: Icon }, index) => <section key={key} className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#DDE6EF] bg-white p-5 shadow-sm sm:p-6"><span className={`flex h-12 w-12 items-center justify-center rounded-xl ${done?.[key] ? 'bg-[#E6F6F1] text-[#238976]' : 'bg-[#EDF2F8] text-[#28416D]'}`}><Icon size={23} /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wider text-[#7F8EA3]">Adım {index + 1}</p><h2 className="mt-1 text-lg font-bold text-[#243B64]">{title}</h2><p className="mt-1 text-sm text-[#66758D]">{detail}</p></div><span className="flex items-center gap-1 text-sm font-semibold text-[#238976]">{done?.[key] ? <><CheckCircle2 size={17} />Tamamlandı</> : <><Circle size={17} />Bekliyor</>}</span><button type="button" onClick={() => onNavigate(screen)} className="inline-flex items-center gap-2 rounded-xl border border-[#CAD7E7] px-4 py-2.5 text-sm font-semibold text-[#243B64]">{done?.[key] ? 'Görüntüle' : 'Başla'} <ArrowRight size={16} /></button></section>)}</div>
    {done && completed === 3 && <button type="button" onClick={() => onNavigate('roadmap')} className="mt-7 rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white">Yol haritamı aç</button>}
  </main>;
}
