import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { roadmapApi } from '../roadmap/roadmapApi.js';
import { learningResourceApi } from './learningResourceApi.js';
import { customCareerApi } from './customCareerApi.js';

const types = { dokumantasyon: 'Dokümantasyon', kurs: 'Kurs', makale: 'Makale', video: 'Video', uygulama: 'Uygulama' };
const levels = { baslangic: 'Başlangıç', orta: 'Orta', ileri: 'İleri' };

function ResourceList({ items, exercise }) {
  return <div className="mt-5 space-y-3">
    {items.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 rounded-xl border border-[#E2E9F0] p-4 transition hover:border-[#8FC8BC] hover:bg-[#F8FCFB]"><BookOpen size={20} className="mt-0.5 shrink-0 text-[#2E9485]" /><div className="min-w-0 flex-1"><p className="font-semibold text-[#263D63] group-hover:text-[#237D71]">{item.title}</p><p className="mt-1 text-xs text-[#738299]">{item.provider} · {types[item.type] ?? item.type} · {levels[item.level] ?? item.level} · {item.language?.toUpperCase()} · {item.paid ? 'Ücretli' : 'Ücretsiz'}</p></div><ArrowUpRight size={17} className="shrink-0 text-[#7890AB]" /></a>)}
    {items.length === 0 && <div className="rounded-xl bg-[#F7F9FB] p-4 text-sm text-[#66758D]"><p>Bu beceri için henüz incelenmiş kaynak eklenmedi.</p>{exercise && <p className="mt-2"><strong>Başlamak için:</strong> {exercise}</p>}</div>}
  </div>;
}

function CatalogGroup({ skill, items }) {
  return <section className="rounded-[24px] border border-[#E0E6EE] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className={`rounded-xl p-2 ${skill.selected ? 'bg-[#EAF6F2] text-[#258F80]' : 'bg-[#EDF2FA] text-[#4D70A5]'}`}>{skill.selected ? <CheckCircle2 size={20} /> : <Sparkles size={20} />}</span><h2 className="text-lg font-bold text-[#243B64]">{skill.name}</h2></div><p className="mt-2 text-xs text-[#77879C]">{skill.category} · {skill.required ? 'Temel beceri' : 'Destekleyici beceri'} · {skill.selected ? 'Kaydettiğin beceri' : 'Öğrenme önerisi'}</p></div><span className="rounded-full bg-[#F1F4F8] px-2.5 py-1 text-xs font-semibold text-[#61738D]">{items.length} kaynak</span></div><ResourceList items={items} /></section>;
}

export function LearningResourcesScreen({ runAuthenticated, onOpenRoadmap }) {
  const [roadmap, setRoadmap] = useState(null);
  const [resources, setResources] = useState([]);
  const [career, setCareer] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [mode, setMode] = useState('catalog');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [nextRoadmap, nextResources, latestCareer] = await runAuthenticated((token) => Promise.all([roadmapApi.get(token, roleId), learningResourceApi.list(token), customCareerApi.latest(token)]));
        if (active) {
          setRoadmap(nextRoadmap);
          setResources(nextResources);
          setCareer(latestCareer);
          if (latestCareer?.status === 'draft') {
            setSelectedIndexes(latestCareer.suggestedSkills.map((_, index) => index));
          }
        }
      } catch (failure) {
        if (active) { setError(failure.message); }
      } finally {
        if (active) { setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [runAuthenticated, roleId, retry]);

  const groups = useMemo(() => {
    if (!roadmap) { return []; }
    const bySkill = new Map();
    for (const resource of resources) {
      const list = bySkill.get(resource.skillId) ?? [];
      list.push(resource);
      bySkill.set(resource.skillId, list);
    }
    return [...roadmap.skills].sort((a, b) => Number(a.selected) - Number(b.selected) || Number(b.required) - Number(a.required)).map((skill) => ({ skill, items: bySkill.get(skill.id) ?? [] }));
  }, [roadmap, resources]);

  async function generateDraft() {
    setWorking(true);
    setError('');
    try {
      const result = await runAuthenticated((token) => customCareerApi.createDraft(token, customTitle.trim()));
      setCareer(result);
      setSelectedIndexes(result.suggestedSkills.map((_, index) => index));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setWorking(false);
    }
  }

  async function confirmSkills() {
    setWorking(true);
    setError('');
    try {
      const result = await runAuthenticated((token) => customCareerApi.confirm(token, career.id, selectedIndexes));
      setCareer(result);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setWorking(false);
    }
  }

  function changeSelection(index) {
    setSelectedIndexes((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  const showCareer = career && career.title.toLocaleLowerCase('tr-TR') === customTitle.trim().toLocaleLowerCase('tr-TR');
  const resourceCount = groups.reduce((count, group) => count + group.items.length, 0);

  return <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#319688]">Modül 05 · Eğitim ve Kaynaklar</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#21375E] sm:text-4xl">Öğrenme kütüphanen</h1><p className="mt-3 max-w-2xl text-[#65748B]">Hedef mesleğinin becerilerine uygun, incelenmiş kaynaklar ve uygulanabilir çalışma adımları.</p></div><button type="button" onClick={onOpenRoadmap} className="rounded-xl border border-[#D9E1EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#28416D]">Yol haritama dön <ArrowUpRight size={16} className="ml-1 inline" /></button></div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button type="button" onClick={() => setRetry((value) => value + 1)} className="ml-2 font-semibold underline">Tekrar dene</button></div>}
    {loading && <div className="rounded-2xl border border-[#E0E6EE] bg-white p-8 text-[#66758D]">Kaynaklar yükleniyor...</div>}
    {!loading && roadmap && <>
      <section className="rounded-[28px] bg-[#233B65] p-6 text-white shadow-lg sm:p-8"><div className="flex items-center gap-2 text-sm font-semibold text-[#96DACE]"><BookOpen size={19} /> KİŞİSEL ÖĞRENME ROTASI</div><div className="mt-5 flex flex-wrap items-end justify-between gap-5"><div className="w-full max-w-lg"><label htmlFor="resources-role" className="block text-sm text-[#C9D4E7]">Hedef meslek</label><select id="resources-role" value={mode === 'custom' ? 'custom' : roadmap.roleId ?? ''} onChange={(event) => { if (event.target.value === 'custom') { setMode('custom'); setCustomTitle(career?.title ?? ''); } else { setMode('catalog'); setRoleId(event.target.value); } }} className="mt-2 w-full rounded-xl bg-white px-4 py-3 font-semibold text-[#243B64]"><option value="" disabled>Meslek seç</option>{roadmap.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}<option value="custom">Listede olmayan mesleğim…</option></select></div><p className="text-sm text-[#CDD9E9]">{mode === 'catalog' ? `${groups.filter(({ skill }) => !skill.selected).length} öğrenilecek beceri · ${resourceCount} kaynak` : 'Mesleğine özel becerileri birlikte belirle'}</p></div></section>
      {mode === 'catalog' && <><div className="mt-7 grid gap-5 lg:grid-cols-2">{groups.map(({ skill, items }) => <CatalogGroup key={skill.id} skill={skill} items={items} />)}</div>{groups.length === 0 && <div className="mt-7 rounded-2xl border border-[#E0E6EE] bg-white p-8 text-[#65748B]">Bu meslek için beceriler henüz tanımlanmadı. Listede olmayan meslek seçeneğini kullanabilirsin.</div>}</>}
      {mode === 'custom' && <><section className="mt-7 rounded-[24px] border border-[#E0E6EE] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-2"><Sparkles size={21} className="text-[#2E9485]" /><h2 className="text-xl font-bold text-[#243B64]">Kendi mesleğim</h2></div><p className="mt-2 max-w-2xl text-sm text-[#65748B]">Mesleğini yaz; yapay zekâ beceri ve küçük çalışma önerileri hazırlasın. Önerileri sen seçtikten sonra varsa katalogdaki incelenmiş kaynaklar gösterilir.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input aria-label="Meslek adı" value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} maxLength={100} placeholder="Örneğin: Restoratör" className="min-w-0 flex-1 rounded-xl border border-[#D9E1EB] px-4 py-3 text-[#243B64]" /><button type="button" disabled={working || customTitle.trim().length < 3} onClick={generateDraft} className="rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white disabled:opacity-50">{working ? 'Hazırlanıyor…' : showCareer ? 'Yeni taslak hazırla' : 'Beceri taslağı oluştur'}</button></div><p className="mt-3 text-xs text-[#8593A6]">Günlük en fazla 2 taslak oluşturulabilir. Meslek adı ve kaydettiğin beceriler öneri için Gemini’ye gönderilir.</p>{career && !showCareer && <button type="button" onClick={() => setCustomTitle(career.title)} className="mt-3 text-sm font-semibold text-[#2E9485] underline">Kaydettiğim “{career.title}” taslağını aç</button>}</section>
        {showCareer && career.status === 'draft' && <section className="mt-6 rounded-[24px] border border-[#D8E8E3] bg-[#F3FAF8] p-5 sm:p-7"><h2 className="text-xl font-bold text-[#243B64]">Becerileri onayla</h2><p className="mt-2 text-sm text-[#65748B]">Bunlar yapay zekâ önerisidir. Mesleğine uygun gördüklerini seç; kaydettikten sonra öğrenme alanında görünür.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{career.suggestedSkills.map((skill, index) => <label key={`${skill.name}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#DCE9E5] bg-white p-4"><input type="checkbox" checked={selectedIndexes.includes(index)} onChange={() => changeSelection(index)} className="mt-1 accent-[#2E9485]" /><span><strong className="text-[#243B64]">{skill.name}</strong><span className="mt-1 block text-sm text-[#65748B]">{skill.reason}</span></span></label>)}</div><button type="button" disabled={working || selectedIndexes.length === 0} onClick={confirmSkills} className="mt-5 rounded-xl bg-[#2E9485] px-5 py-3 font-semibold text-white disabled:opacity-50">Seçtiklerimi kaydet</button></section>}
        {showCareer && career.status === 'confirmed' && <div className="mt-7 grid gap-5 lg:grid-cols-2">{career.confirmedSkills.map((skill) => <section key={skill.name} className="rounded-[24px] border border-[#E0E6EE] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-2"><Sparkles size={20} className="text-[#2E9485]" /><h2 className="text-lg font-bold text-[#243B64]">{skill.name}</h2></div><p className="mt-3 text-sm text-[#65748B]">{skill.reason}</p><ResourceList items={resources.filter((item) => item.skillId === skill.catalogSkillId)} exercise={skill.exercise} /></section>)}</div>}
      </>}
    </>}
  </main>;
}
