import { useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, Building2, LogOut, MapPin, Pencil, Target } from 'lucide-react';
import { careerProfileApi } from '../api/careerProfileApi.js';
import { Logo } from '../../../shared/ui/Logo.jsx';

const seniorityLabels = {
  stajyer: 'Stajyer', baslangic: 'Başlangıç', orta: 'Orta', kidemli: 'Kıdemli', lider: 'Lider',
};
const workModelLabels = { uzaktan: 'Uzaktan', hibrit: 'Hibrit', ofis: 'Ofis' };

function DetailCard({ icon: Icon, title, value, empty = 'Henüz belirtilmedi' }) {
  return (
    <div className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2F6] text-[#243B64]"><Icon size={20} /></div>
      <h2 className="mt-5 text-sm font-medium text-[#667085]">{title}</h2>
      <p className="mt-1 text-lg font-semibold text-[#243B64]">{value || empty}</p>
    </div>
  );
}

export function CareerGoalsScreen({ runAuthenticated, onHome, onProfile, onEdit, onLogout }) {
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadGoals() {
      try {
        const result = await runAuthenticated(careerProfileApi.getCareerProfile);
        if (active) {
          setCareer(result);
        }
      } catch (failure) {
        if (active && failure.code !== 'CAR-001') {
          setError(failure.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadGoals();
    return () => {
      active = false;
    };
  }, []);

  const hasGoals = Boolean(career?.targetTitle || career?.targetIndustry || career?.targetSeniority || career?.careerNotes || career?.workModels?.length || career?.preferredLocations?.length);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938]">
      <header className="border-b border-[#E3E7ED] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Logo size="md" />
          <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-4 py-2 text-sm font-medium text-[#243B64] hover:bg-[#F7F8FA]"><LogOut size={16} />Çıkış yap</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm" aria-label="Sayfa yolu">
          <button type="button" onClick={onHome} className="text-[#667085] hover:text-[#243B64]">Ana sayfa</button>
          <span className="text-[#98A2B3]">/</span>
          <button type="button" onClick={onProfile} className="text-[#667085] hover:text-[#243B64]">Kariyer Profilim</button>
          <span className="text-[#98A2B3]">/</span>
          <span aria-current="page" className="font-semibold text-[#243B64]">Kariyer Hedeflerim</span>
        </nav>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F2F0] text-[#2F8F83]"><Target size={24} /></div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F8F83]">Modül 02 · Kariyer & Profil</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#243B64] sm:text-4xl">Kariyer Hedeflerim</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">Hedeflediğin rolü ve çalışma tercihlerini burada görebilirsin.</p>
          </div>
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg bg-[#243B64] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1B2D4E]"><Pencil size={16} />Hedefleri düzenle</button>
        </div>
        {loading && <p role="status" className="rounded-2xl bg-white p-7 text-sm text-[#667085]">Kariyer hedeflerin yükleniyor...</p>}
        {error && <p role="alert" className="rounded-xl border border-[#EFCACA] bg-[#FFF5F5] p-5 text-sm text-[#B42318]">{error}</p>}
        {!loading && !error && !hasGoals && <section className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center"><Target size={30} className="mx-auto text-[#5276A7]" /><h2 className="mt-4 text-xl font-semibold text-[#243B64]">Henüz bir kariyer hedefi eklemedin</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">Hedeflediğin unvanı, sektörü ve çalışma tercihlerini profil formunda belirleyebilirsin.</p><button type="button" onClick={onEdit} className="mt-6 rounded-lg bg-[#243B64] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1B2D4E]">Hedef ekle</button></section>}
        {!loading && !error && hasGoals && <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DetailCard icon={Target} title="Hedef unvan" value={career.targetTitle} />
            <DetailCard icon={Building2} title="Hedef sektör" value={career.targetIndustry} />
            <DetailCard icon={BriefcaseBusiness} title="Hedef kıdem" value={seniorityLabels[career.targetSeniority]} />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-base font-semibold text-[#243B64]"><BriefcaseBusiness size={18} />Çalışma modelleri</h2><div className="mt-5 flex flex-wrap gap-2">{career.workModels?.length ? career.workModels.map((model) => <span key={model} className="rounded-full bg-[#EBF5F4] px-3 py-1.5 text-sm font-medium text-[#27796F]">{workModelLabels[model] || model}</span>) : <p className="text-sm text-[#667085]">Henüz belirtilmedi</p>}</div></section>
            <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-base font-semibold text-[#243B64]"><MapPin size={18} />Tercih edilen konumlar</h2><div className="mt-5 flex flex-wrap gap-2">{career.preferredLocations?.length ? career.preferredLocations.map((location) => <span key={location} className="rounded-full bg-[#EEF2F6] px-3 py-1.5 text-sm font-medium text-[#243B64]">{location}</span>) : <p className="text-sm text-[#667085]">Henüz belirtilmedi</p>}</div></section>
          </div>
          <section className="mt-5 rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm"><h2 className="text-base font-semibold text-[#243B64]">Kariyer notları</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#52627A]">{career.careerNotes || 'Henüz not eklenmedi.'}</p></section>
        </>}
        <button type="button" onClick={onProfile} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#5276A7] hover:text-[#243B64]"><ArrowLeft size={17} />Kariyer profiline dön</button>
      </main>
    </div>
  );
}
