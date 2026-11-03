import { useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Plus, Sparkles } from 'lucide-react';
import { SkillCatalogModal } from './SkillCatalogModal.jsx';
import { SkillGraph } from './SkillGraph.jsx';
import { skillsApi } from './skillsApi.js';

const views = [
  ['all', 'Tüm harita'],
  ['saved', 'Kaydettiklerim'],
  ['cv', 'CV keşifleri'],
];

export function SkillMapScreen({ runAuthenticated }) {
  const [map, setMap] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [view, setView] = useState('all');
  const requestVersion = useRef(0);
  const mutationInProgress = useRef(false);

  async function load() {
    const version = ++requestVersion.current;
    try {
      setError('');
      const result = await runAuthenticated((token) => skillsApi.getMap(token));
      if (version === requestVersion.current) {
        setMap(result);
      }
    } catch (failure) {
      if (version === requestVersion.current) {
        setError(failure.message);
      }
    }
  }

  useEffect(() => { load(); }, []);

  async function perform(skill, action) {
    if (mutationInProgress.current) {
      return;
    }

    mutationInProgress.current = true;
    setBusy(skill.id);
    try {
      await runAuthenticated((token) => {
        if (action === 'dismiss') return skillsApi.dismiss(token, skill.unmatched ? { name: skill.name } : { skillId: skill.id });
        if (action === 'remove') return skillsApi.remove(token, skill.selectionId);
        if (skill.unmatched) return skillsApi.addCustom(token, skill.name);
        return skillsApi.add(token, skill.id);
      });
      await load();
    } catch (failure) {
      setError(failure.message);
      return true;
    } finally {
      mutationInProgress.current = false;
      setBusy('');
    }
  }

  async function addNamedSkill(name) {
    if (mutationInProgress.current) {
      return false;
    }
    if (!name || name.length > 80) {
      setError('Beceri adı 1 ile 80 karakter arasında olmalıdır.');
      return false;
    }

    mutationInProgress.current = true;
    setBusy('custom');
    try {
      setError('');
      await runAuthenticated((token) => skillsApi.addCustom(token, name));
      await load();
      return true;
    } catch (failure) {
      setError(failure.message);
      return false;
    } finally {
      mutationInProgress.current = false;
      setBusy('');
    }
  }

  const savedCount = map?.skills.filter((skill) => skill.selected).length || 0;
  const graphSkills = useMemo(() => {
    if (!map) return [];
    const catalogSkills = map.skills.filter((skill) => skill.selected || skill.suggestedFromCv);
    const cvOnly = map.unmatchedCvSkills.map((name) => ({ id: `cv:${name}`, name, selected: false, suggestedFromCv: true, unmatched: true }));
    const all = [...catalogSkills, ...cvOnly];
    if (view === 'saved') return all.filter((skill) => skill.selected);
    if (view === 'cv') return all.filter((skill) => skill.suggestedFromCv && !skill.selected);
    return all;
  }, [map, view]);
  const cvCount = map ? map.skills.filter((skill) => skill.suggestedFromCv && !skill.selected).length + map.unmatchedCvSkills.length : 0;
  const shownCategoryCount = new Set(graphSkills.filter((skill) => !skill.unmatched).map((skill) => skill.categoryId || 'other')).size;

  return <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
    <section className="relative overflow-hidden rounded-[28px] border border-[#DDE7F2] bg-white p-6 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-2xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E8F7F3] px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[#238274]"><Sparkles size={14} />Modül 04 · Beceri Ağacı</div><h1 className="text-3xl font-bold tracking-tight text-[#172F53] sm:text-4xl">Becerilerin <span className="text-[#2C9B8C]">bir arada.</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#63748B]">Kaydettiğin ve CV’nden keşfedilen becerileri alanlarına ayrılmış dallarda gör. Kartlardaki düğmelerle beceri ekle veya kaldır; ağacını kendine göre büyüt.</p></div>
        <button type="button" onClick={() => setCatalogOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(36,59,100,.18)] transition hover:-translate-y-0.5 hover:bg-[#1B2F52]"><Plus size={18} />Beceri ekle</button>
      </div>
      <div className="relative mt-7 flex flex-wrap gap-3 border-t border-[#E7ECF2] pt-5"><div className="rounded-xl bg-[#F2F6FA] px-4 py-3"><span className="text-2xl font-bold text-[#243B64]">{savedCount}</span><span className="ml-2 text-xs font-semibold text-[#667085]">kayıtlı beceri</span></div><div className="rounded-xl bg-[#FDF4E8] px-4 py-3"><span className="text-2xl font-bold text-[#B66C21]">{cvCount}</span><span className="ml-2 text-xs font-semibold text-[#8C7255]">CV keşfi</span></div><div className="rounded-xl bg-[#EBF7F4] px-4 py-3"><span className="text-2xl font-bold text-[#278B7E]">{shownCategoryCount}</span><span className="ml-2 text-xs font-semibold text-[#5E817C]">beceri alanı</span></div></div>
    </section>

    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {!map && !error && <p role="status" className="text-sm text-[#667085]">Beceri haritan yükleniyor...</p>}
    {map && <>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-[#243B64]">Haritanı keşfet</h2><p className="mt-0.5 text-xs text-[#77849A]">CV’den gelen beceriler öneridir; kayıtlı becerilerin ayrı işaretlenir.</p></div><div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#E0E7EE] bg-white p-1">{views.map(([key, label]) => <button key={key} type="button" onClick={() => setView(key)} aria-pressed={view === key} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${view === key ? 'bg-[#243B64] text-white shadow-sm' : 'text-[#667085] hover:bg-[#F2F5F8]'}`}>{label}</button>)}</div></div>
      {graphSkills.length === 0 ? <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-white px-6 py-20 text-center"><Compass size={42} className="mx-auto text-[#78A9AA]" /><h2 className="mt-4 text-lg font-semibold text-[#243B64]">Bu görünümde henüz beceri yok</h2><p className="mt-2 text-sm text-[#667085]">Katalogdan bir beceri ekleyerek kendi ağacını oluşturmaya başlayabilirsin.</p><button type="button" onClick={() => setCatalogOpen(true)} className="mt-5 rounded-lg bg-[#243B64] px-4 py-2.5 text-sm font-semibold text-white">Beceri seç</button></div> : <SkillGraph skills={graphSkills} categories={map.categories} onAdd={(skill) => perform(skill, 'add')} onRemove={(skill) => perform(skill, 'remove')} onDismiss={(skill) => perform(skill, 'dismiss')} busyId={busy} />}
    </>}

    <SkillCatalogModal isOpen={catalogOpen} onClose={() => setCatalogOpen(false)} categories={map?.categories || []} skills={map?.skills || []} busy={busy} error={error} onAdd={(skill) => perform(skill, 'add')} onAddCustom={addNamedSkill} />
  </main>;
}
