import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Plus, Trash2 } from 'lucide-react';
import { roadmapTaskApi } from './roadmapApi.js';

const types = { arastirma: 'Araştırma', pratik: 'Pratik', proje: 'Proje' };
const priorities = { yuksek: 'Yüksek öncelik', orta: 'Orta öncelik', dusuk: 'Düşük öncelik' };

export function RoadmapTaskBoard({ roleId, runAuthenticated, missingCount, onTasksChange }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [week, setWeek] = useState(0);
  const [status, setStatus] = useState('all');
  const [weeks, setWeeks] = useState(4);
  const [weeklyHours, setWeeklyHours] = useState(4);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    runAuthenticated((token) => roadmapTaskApi.list(token, roleId)).then((result) => {
      if (active) { setTasks(result); }
    }).catch((failure) => {
      if (active) { setError(failure.message); }
    }).finally(() => {
      if (active) { setLoading(false); }
    });
    return () => { active = false; };
  }, [roleId, runAuthenticated]);

  const availableWeeks = useMemo(() => [...new Set(tasks.map((task) => task.week))].sort((a, b) => a - b), [tasks]);
  const filtered = tasks.filter((task) => (week === 0 || task.week === week) && (status === 'all' || (status === 'done') === task.completed));
  const done = tasks.filter((task) => task.completed).length;

  useEffect(() => {
    if (!loading) {
      onTasksChange(roleId, { completed: done, total: tasks.length });
    }
  }, [roleId, loading, done, tasks.length, onTasksChange]);

  async function update(action, onSuccess) {
    setWorking(true);
    setError('');
    try {
      const result = await runAuthenticated(action);
      onSuccess(result);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setWorking(false);
    }
  }

  function createPlan() {
    if (tasks.length > 0 && !window.confirm('Mevcut planın arşivlenip yapay zekâ ile yeni bir plan oluşturulsun mu?')) {
      return;
    }
    update((token) => roadmapTaskApi.createPlan(token, roleId, { weeks, weeklyHours }), setTasks);
  }

  function toggle(task) {
    update((token) => roadmapTaskApi.setCompleted(token, roleId, task.id, !task.completed), () => {
      setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !task.completed } : item));
    });
  }

  function remove(task) {
    if (!window.confirm(`“${task.title}” görevini planından kaldırmak istiyor musun?`)) { return; }
    update((token) => roadmapTaskApi.delete(token, roleId, task.id), () => {
      setTasks((current) => current.filter((item) => item.id !== task.id));
    });
  }

  return <section className="mt-7 rounded-[24px] border border-[#DCE5EE] bg-white p-5 shadow-sm sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5EBF2] pb-5"><div><div className="flex items-center gap-2 text-[#263D66]"><CalendarDays size={22} /><h2 className="text-xl font-bold">Haftalık çalışma planın</h2></div><p className="mt-2 text-sm text-[#75859B]">Gemini, hedef rolün ve eksik becerilerin için somut görevler önerir. Görev bitince beceri otomatik kazanılmış sayılmaz.</p></div>{tasks.length > 0 && <span className="rounded-full bg-[#EAF6F2] px-3 py-1 text-sm font-semibold text-[#238B7D]">{done} / {tasks.length} tamamlandı</span>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl bg-[#F4F7FA] p-4"><label className="text-xs font-semibold text-[#4D617F]">Plan süresi<select value={weeks} onChange={(event) => setWeeks(Number(event.target.value))} className="mt-1 block rounded-lg border border-[#D6E0EB] bg-white px-3 py-2 text-sm text-[#243B64]">{[2, 3, 4, 5, 6, 7, 8].map((value) => <option key={value} value={value}>{value} hafta</option>)}</select></label><label className="text-xs font-semibold text-[#4D617F]">Haftalık zaman<select value={weeklyHours} onChange={(event) => setWeeklyHours(Number(event.target.value))} className="mt-1 block rounded-lg border border-[#D6E0EB] bg-white px-3 py-2 text-sm text-[#243B64]">{[2, 4, 6, 8, 10, 12, 16, 20].map((value) => <option key={value} value={value}>{value} saat</option>)}</select></label>{tasks.length > 0 && <button type="button" disabled={working || missingCount === 0} onClick={createPlan} className="ml-auto rounded-xl bg-[#243B64] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{working ? 'Plan hazırlanıyor...' : 'Gemini ile yeniden oluştur'}</button>}</div>
    {loading ? <p className="py-8 text-sm text-[#75859B]">Görevler yükleniyor...</p> : tasks.length === 0 ? <div className="py-9 text-center"><p className="font-semibold text-[#263D66]">{missingCount ? 'Henüz yapay zekâ planı oluşturmadın.' : 'Bu rolün tanımlı becerilerini kaydetmişsin.'}</p>{missingCount > 0 && <button type="button" disabled={working} onClick={createPlan} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Plus size={17} /> Gemini ile plan oluştur</button>}</div> : <><div className="flex flex-wrap items-center justify-between gap-3 py-5"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setWeek(0)} className={`rounded-lg px-3 py-2 text-sm ${week === 0 ? 'bg-[#243B64] text-white' : 'bg-[#F1F4F8] text-[#63748E]'}`}>Tüm haftalar</button>{availableWeeks.map((number) => <button key={number} type="button" onClick={() => setWeek(number)} className={`rounded-lg px-3 py-2 text-sm ${week === number ? 'bg-[#243B64] text-white' : 'bg-[#F1F4F8] text-[#63748E]'}`}>Hafta {number}</button>)}</div><div className="flex gap-1 rounded-lg bg-[#F1F4F8] p-1">{[['all', 'Tümü'], ['open', 'Yapılacaklar'], ['done', 'Tamamlanan']].map(([value, label]) => <button key={value} type="button" onClick={() => setStatus(value)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${status === value ? 'bg-white text-[#243B64] shadow-sm' : 'text-[#71829B]'}`}>{label}</button>)}</div></div><div className="space-y-3">{filtered.length ? filtered.map((task) => <article key={task.id} className={`flex gap-4 rounded-2xl border p-4 sm:p-5 ${task.completed ? 'border-[#DCE8E4] bg-[#F7FBF9]' : 'border-[#E0E6EF] bg-white'}`}><button type="button" disabled={working} onClick={() => toggle(task)} aria-label={task.completed ? `${task.title} görevini yapılacak olarak işaretle` : `${task.title} görevini tamamla`} className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${task.completed ? 'border-[#2C9A8B] bg-[#2C9A8B] text-white' : 'border-[#B6C3D3] bg-white'}`}>{task.completed && <Check size={16} />}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-md bg-[#EDF2F8] px-2 py-1 text-[#34527E]">Hafta {task.week}</span><span className="rounded-md bg-[#F4F6F8] px-2 py-1 text-[#64748B]">{types[task.type] ?? task.type}</span><span className="rounded-md bg-[#FFF0EC] px-2 py-1 text-[#B7584E]">{priorities[task.priority] ?? task.priority}</span><span className="rounded-md bg-[#EDF8F5] px-2 py-1 text-[#287F72]">{task.estimatedHours} saat</span><span className="px-1 py-1 font-normal text-[#8592A7]">{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div><h3 className={`mt-3 font-bold ${task.completed ? 'text-[#8A99AA] line-through' : 'text-[#263D66]'}`}>{task.title}</h3><p className="mt-1 text-sm leading-relaxed text-[#74849A]">{task.description}</p><p className="mt-2 text-xs font-semibold text-[#547AB0]">İlgili beceri: {task.skillName}</p></div><button type="button" disabled={working} onClick={() => remove(task)} aria-label={`${task.title} görevini sil`} className="h-9 w-9 shrink-0 rounded-lg text-[#94A4B8] hover:bg-red-50 hover:text-red-600"><Trash2 size={18} className="mx-auto" /></button></article>) : <p className="py-6 text-center text-sm text-[#75859B]">Bu filtrede görev yok.</p>}</div></>}
  </section>;
}
