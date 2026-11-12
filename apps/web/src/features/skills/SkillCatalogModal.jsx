import { useMemo, useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { Modal } from '../../shared/ui/Modal.jsx';

export function SkillCatalogModal({ isOpen, onClose, categories, skills, busy, error, onAdd, onAddCustom }) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [customName, setCustomName] = useState('');
  const [customCategoryId, setCustomCategoryId] = useState('');
  const catalog = useMemo(() => skills.filter((skill) => !skill.custom), [skills]);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('tr-TR');
    return catalog.filter((skill) => (categoryId === 'all' || skill.categoryId === categoryId)
      && skill.name.toLocaleLowerCase('tr-TR').includes(term));
  }, [catalog, categoryId, query]);
  const counts = useMemo(() => {
    const result = new Map();
    for (const skill of catalog) {
      result.set(skill.categoryId, (result.get(skill.categoryId) || 0) + 1);
    }
    return result;
  }, [catalog]);

  async function submitCustom(event) {
    event.preventDefault();
    const name = customName.trim();
    if (!name) {
      return;
    }
    if (await onAddCustom(name, customCategoryId)) {
      setCustomName('');
      setCustomCategoryId('');
      onClose();
    }
  }

  return <Modal isOpen={isOpen} onClose={onClose} title="Beceri ekle" subtitle="Bir kategori seç veya beceri adıyla ara." maxWidth="2xl">
    <div className="space-y-5">
      <label className="flex items-center gap-3 rounded-xl border border-[#D9E3EC] bg-[#F8FAFC] px-4 py-3 text-[#6B7F96] focus-within:border-[#2E9387] focus-within:ring-2 focus-within:ring-[#2E9387]/15">
        <Search size={19} aria-hidden="true" />
        <input value={query} onChange={(event) => { setQuery(event.target.value); setCategoryId('all'); }} placeholder="Beceri ara: satış, finans, tasarım..." aria-label="Katalogda beceri ara" className="w-full bg-transparent text-sm text-[#243B64] outline-none placeholder:text-[#93A0AF]" />
      </label>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 md:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="Beceri kategorileri" className="max-h-[390px] space-y-1 overflow-y-auto rounded-xl border border-[#E2E9F0] bg-[#F8FAFC] p-2">
          <button type="button" onClick={() => setCategoryId('all')} aria-pressed={categoryId === 'all'} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${categoryId === 'all' ? 'bg-[#243B64] text-white' : 'text-[#485B73] hover:bg-white'}`}><span>Tüm beceriler</span><span className="text-xs opacity-70">{catalog.length}</span></button>
          {categories.filter((category) => counts.has(category.id)).map((category) => <button key={category.id} type="button" onClick={() => { setCategoryId(category.id); setQuery(''); }} aria-pressed={categoryId === category.id} className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold ${categoryId === category.id ? 'bg-[#243B64] text-white' : 'text-[#5B6C82] hover:bg-white'}`}><span>{category.name}</span><span className="shrink-0 opacity-65">{counts.get(category.id)}</span></button>)}
        </nav>
        <section aria-label="Beceri sonuçları" className="max-h-[390px] min-h-[220px] overflow-y-auto rounded-xl border border-[#E2E9F0] p-3">
          <div className="mb-3 flex items-center justify-between border-b border-[#E9EDF2] px-1 pb-3"><h4 className="text-sm font-bold text-[#243B64]">{categoryId === 'all' ? 'Tüm beceriler' : categories.find((category) => category.id === categoryId)?.name}</h4><span className="text-xs text-[#7A8BA0]">{filtered.length} beceri</span></div>
          {filtered.length ? <div className="grid gap-2 sm:grid-cols-2">{filtered.map((skill) => <button key={skill.id} type="button" onClick={() => onAdd(skill)} disabled={Boolean(busy) || skill.selected} className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${skill.selected ? 'border-[#B9DAD2] bg-[#EFF8F5] text-[#247C70]' : 'border-[#E1E8EF] bg-white text-[#344963] hover:border-[#A9CBC6] hover:bg-[#F5FAF8]'} disabled:cursor-default`}><span className="min-w-0 break-words font-medium">{skill.name}</span>{skill.selected ? <Check className="shrink-0" size={16} aria-label="Kaydedildi" /> : <Plus className="shrink-0 text-[#2E9387]" size={16} aria-hidden="true" />}</button>)}</div> : <p className="px-2 py-12 text-center text-sm text-[#7A8BA0]">Bu aramada beceri bulunamadı. Aşağıdan kendi becerini ekleyebilirsin.</p>}
        </section>
      </div>
      <form onSubmit={submitCustom} className="rounded-xl border border-[#DCE9E8] bg-[#F3FAF8] p-4"><label htmlFor="custom-skill-name" className="mb-2 block text-sm font-bold text-[#243B64]">Katalogda yok mu?</label><div className="flex flex-col gap-2 sm:flex-row"><input id="custom-skill-name" value={customName} onChange={(event) => setCustomName(event.target.value)} maxLength={80} placeholder="Beceri adını yaz" className="min-w-0 flex-1 rounded-lg border border-[#D1DFDF] bg-white px-3 py-2 text-sm text-[#243B64] outline-none focus:border-[#2E9387]" /><select aria-label="Yeni becerinin alanı" value={customCategoryId} onChange={(event) => setCustomCategoryId(event.target.value)} className="rounded-lg border border-[#D1DFDF] bg-white px-3 py-2 text-sm text-[#243B64]"><option value="">Alan seç</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><button type="submit" disabled={Boolean(busy) || !customName.trim() || !customCategoryId} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Plus size={16} />Beceriyi ekle</button></div></form>
    </div>
  </Modal>;
}
