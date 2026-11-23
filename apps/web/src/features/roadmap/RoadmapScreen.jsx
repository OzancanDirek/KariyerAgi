import i18n from '../../i18n.js';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronRight, Compass, Lightbulb, Sparkles, Target } from 'lucide-react';
import { roadmapApi } from './roadmapApi.js';
import { RoadmapTaskBoard } from './RoadmapTaskBoard.jsx';

function roleFromUrl() {
  const query = window.location.hash.split('?')[1] ?? '';
  const roleId = new URLSearchParams(query).get('roleId');
  return /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(roleId ?? '') ? roleId : null;
}

function SkillCard({ skill, index, onOpenSkills }) {
  return <div className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${skill.selected ? 'border-[#B8DDD6] bg-[#F2FAF8]' : 'border-[#DBE3ED] bg-white hover:border-[#9CB1D1]'}`}>
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${skill.selected ? 'bg-[#D5EEE8] text-[#238976]' : 'bg-[#EDF2F8] text-[#28416D]'}`}>{skill.selected ? <Check size={20} /> : String(index + 1).padStart(2, '0')}</span>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#233653]">{skill.name}</h3>{skill.suggestedFromCv && !skill.selected && <span className="rounded-full bg-[#FFF2E5] px-2 py-0.5 text-[11px] font-bold text-[#AD651C]">{i18n.t("CV'nde görüldü")}</span>}</div><p className="mt-1 text-xs text-[#7C8BA0]">{skill.category} · {i18n.t(skill.required ? 'Temel beceri' : 'Destekleyici beceri')}</p></div>
    {!skill.selected && <button type="button" onClick={onOpenSkills} className="shrink-0 rounded-lg p-2 text-[#28416D] hover:bg-[#EDF2F8]" aria-label={`${skill.name} becerisini haritada incele`} title={i18n.t("Beceri haritasında incele")}><ArrowRight size={18} /></button>}
  </div>;
}

export function RoadmapScreen({ runAuthenticated, selectedRoleId, onSelectRole, onOpenSkills, onOpenGoals, onOpenResources, onOpenCustomCareer }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [roleId, setRoleId] = useState(() => roleFromUrl() || selectedRoleId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [planProgress, setPlanProgress] = useState(null);

  useEffect(() => {
    function syncRole() {
      setRoleId(roleFromUrl() || selectedRoleId);
    }

    window.addEventListener('hashchange', syncRole);
    return () => window.removeEventListener('hashchange', syncRole);
  }, [selectedRoleId]);

  function changeRole(nextRoleId) {
    if (nextRoleId === 'custom') {
      onOpenCustomCareer();
      return;
    }
    window.location.hash = `/roadmap?roleId=${encodeURIComponent(nextRoleId)}`;
    setRoleId(nextRoleId);
    onSelectRole(nextRoleId);
  }

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await runAuthenticated((token) => roadmapApi.get(token, roleId));
        if (active) {
          setData(result);
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
    load();
    return () => { active = false; };
  }, [runAuthenticated, roleId, retry]);

  const required = useMemo(() => data?.skills.filter((skill) => skill.required) ?? [], [data]);
  const optional = useMemo(() => data?.skills.filter((skill) => !skill.required) ?? [], [data]);
  const currentPlan = planProgress?.roleId === data?.roleId ? planProgress : null;
  const progress = currentPlan?.total ? Math.round(currentPlan.completed / currentPlan.total * 100) : 0;
  const updatePlanProgress = useCallback((updatedRoleId, counts) => {
    setPlanProgress({ roleId: updatedRoleId, ...counts });
  }, []);
  const selectedRole = data?.roles.find((role) => role.id === data.roleId);

  return <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#319688]">{t("Kariyer Yol Haritası")}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#21375E] sm:text-4xl">{t('Hedefine giden yol')}</h1><p className="mt-3 max-w-2xl text-[#65748B]">{t("Hedef rol için gereken becerilerle kaydettiklerini karşılaştır. Haftalık görevlerini tamamladıkça planındaki ilerlemeyi takip et.")}</p></div><button type="button" onClick={onOpenGoals} className="rounded-xl border border-[#D9E1EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#28416D] hover:bg-[#F1F5F9]">{t('Kariyer hedeflerim')} <ChevronRight size={16} className="ml-1 inline" /></button></div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button type="button" onClick={() => setRetry((value) => value + 1)} className="ml-2 font-semibold underline">{t('Tekrar dene')}</button></div>}
    {loading && <div className="rounded-2xl border border-[#E0E6EE] bg-white p-8 text-[#66758D]">{t("Yol haritası yükleniyor...")}</div>}
    {!loading && data && <>
        {data.roles.length === 0 ? <div className="rounded-2xl border border-[#E0E6EE] bg-white p-8"><p className="font-semibold text-[#243B64]">{t("Henüz rol gereksinimi tanımlanmadı.")}</p><button type="button" onClick={onOpenCustomCareer} className="mt-3 font-semibold text-[#28416D] underline">{t("Listede olmayan mesleğimi yaz")}</button></div> : <>
        <section className="relative overflow-hidden rounded-[28px] bg-[#233B65] p-6 text-white shadow-lg sm:p-8"><div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" /><div className="absolute right-12 top-16 h-44 w-44 rounded-full border border-white/10" /><div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]"><div><div className="flex items-center gap-2 text-sm font-semibold text-[#96DACE]"><Compass size={19} /> {i18n.t("KİŞİSEL ROTA")}</div><label htmlFor="roadmap-role" className="mt-5 block text-sm text-[#C9D4E7]">{t("İncelenen rol")}</label><select id="roadmap-role" value={data.roleId ?? ''} onChange={(event) => changeRole(event.target.value)} className="mt-2 w-full max-w-lg rounded-xl border border-white/25 bg-white px-4 py-3 font-semibold text-[#243B64]"><option value="" disabled>{data.targetTitle ? `${data.targetTitle} · Katalogda henüz yok` : i18n.t("Rol seç")}</option>{data.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}<option value="custom">{i18n.t("Listede olmayan mesleğim…")}</option></select><p className="mt-3 max-w-lg text-sm text-[#C7D5E8]">{selectedRole?.description}</p>{data.targetTitle && <p className="mt-3 text-xs text-[#9FB3D0]">{i18n.t("Profilindeki hedef:")} {data.targetTitle}</p>}</div><div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><p className="text-sm text-[#CDD9E9]">{t("Haftalık planda ilerleme")}</p><div className="mt-3 flex items-end gap-2"><span className="text-5xl font-bold">%{progress}</span><span className="mb-1 text-sm text-[#C9D4E7]">{currentPlan ? `${currentPlan.completed} / ${currentPlan.total} ${t('görev')}` : data.roleId ? i18n.t("Yükleniyor...") : i18n.t("Henüz plan yok")}</span></div><div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-[#70D6BE] transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-4 text-xs leading-relaxed text-[#D2DEED]">{i18n.t("Bu oran tamamlandı olarak işaretlediğin aktif plan görevlerine göre hesaplanır; beceri kazanımını veya işe alınma olasılığını ölçmez.")}</p></div></div></section>
        {data.skills.length === 0 ? <div className="mt-7 rounded-2xl border border-[#E0E6EE] bg-white p-8 text-[#65748B]">{data.roleId ? i18n.t("Bu rol için henüz katalog becerisi tanımlanmadı.") : data.targetTitle ? <><p>{data.targetTitle} {i18n.t("için becerilerini onaylayıp kişisel haftalık planını oluşturabilirsin.")}</p><button type="button" onClick={onOpenResources} className="mt-4 rounded-xl bg-[#243B64] px-4 py-2 font-semibold text-white">{t("Mesleğimin becerilerini belirle")}</button></> : i18n.t("Yol haritasını görmek için önce bir hedef meslek seç.")}</div> : <div className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_1fr]"><section className="rounded-[24px] border border-[#E0E6EE] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#EAF3F0] p-2 text-[#258F80]"><Target size={21} /></span><div><h2 className="text-xl font-bold text-[#243B64]">{t('Temel beceriler')}</h2><p className="text-sm text-[#77879C]">{t("Rol için tanımlanan öğrenme sırası")}</p></div></div><div className="mt-6 space-y-3">{required.map((skill, index) => <SkillCard key={skill.id} skill={skill} index={index} onOpenSkills={onOpenSkills} />)}</div></section><div className="space-y-6"><section className="rounded-[24px] border border-[#E0E6EE] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#EDF2FA] p-2 text-[#4D70A5]"><Sparkles size={21} /></span><h2 className="text-xl font-bold text-[#243B64]">{t('Destekleyici beceriler')}</h2></div><div className="mt-6 space-y-3">{optional.length ? optional.map((skill, index) => <SkillCard key={skill.id} skill={skill} index={index} onOpenSkills={onOpenSkills} />) : <p className="text-sm text-[#77879C]">{t("Bu rol için ek beceri tanımlanmadı.")}</p>}</div></section><section className="rounded-[24px] border border-[#CDE4DD] bg-[#EAF6F2] p-6"><Lightbulb className="text-[#25917E]" size={24} /><h2 className="mt-4 text-lg font-bold text-[#243B64]">{t('Bir beceriye zaten sahip misin?')}</h2><p className="mt-2 text-sm leading-relaxed text-[#5F7386]">{t("Beceri haritasından kaydet. CV analizinde görülen beceriler sen onaylayana kadar öneri olarak kalır.")}</p><button type="button" onClick={onOpenSkills} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1C3154]">{t('Beceri haritama git')} <ArrowRight size={16} /></button></section></div></div>}
        {data.roleId && <RoadmapTaskBoard key={data.roleId} roleId={data.roleId} runAuthenticated={runAuthenticated} missingCount={data.skills.filter((skill) => !skill.selected).length} onTasksChange={updatePlanProgress} />}
      </>}
    </>}
  </main>;
}
