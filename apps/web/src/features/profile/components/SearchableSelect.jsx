import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

function searchable(value) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

function displayName(value) {
  return value.toLocaleLowerCase('tr-TR').replace(/(^|[\s-])\p{L}/gu, (part) => part.toLocaleUpperCase('tr-TR'));
}

export function SearchableSelect({ label, value, options, onChange, placeholder = 'Seçiniz', disabled = false, required = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const root = useRef(null);
  const searchInput = useRef(null);
  const filtered = useMemo(() => options.filter((option) => searchable(option).includes(searchable(query))), [options, query]);

  useEffect(() => {
    function handlePointer(event) {
      if (root.current && !root.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      searchInput.current?.focus();
    }
  }, [open]);

  return <div ref={root} className="relative">
    <label className="mb-1 block text-sm font-medium">{label}{required && <span className="text-[#B42318]"> *</span>}</label>
    <button type="button" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} onClick={() => { setQuery(''); setOpen((current) => !current); }} className="flex w-full items-center justify-between rounded-xl border border-[#D8DEE8] bg-white px-4 py-3 text-left text-sm text-[#202938] disabled:bg-[#F7F8FA] disabled:text-[#98A2B3]">
      <span className="truncate">{value ? displayName(value) : placeholder}</span><ChevronDown size={18} className="ml-2 shrink-0 text-[#667085]" />
    </button>
    {open && <div className="absolute z-20 mt-1 w-full rounded-xl border border-[#D8DEE8] bg-white p-2 shadow-xl">
      <div className="flex items-center gap-2 border-b border-[#E3E7ED] px-2 pb-2 text-[#667085]"><Search size={16} /><input ref={searchInput} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Listede ara..." className="w-full bg-transparent text-sm text-[#202938] outline-none" /></div>
      <div role="listbox" aria-label={label} className="mt-2 max-h-56 overflow-y-auto overscroll-contain">
        {filtered.length === 0 && <p className="px-3 py-4 text-sm text-[#667085]">Sonuç bulunamadı.</p>}
        {filtered.map((option) => <button key={option} type="button" role="option" aria-selected={option.localeCompare(value, 'tr', { sensitivity: 'base' }) === 0} onClick={() => { onChange(option); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[#202938] hover:bg-[#EDF5F3] focus:bg-[#EDF5F3] focus:outline-none"><span>{displayName(option)}</span>{option.localeCompare(value, 'tr', { sensitivity: 'base' }) === 0 && <Check size={15} className="text-[#2F8F83]" />}</button>)}
      </div>
    </div>}
  </div>;
}
