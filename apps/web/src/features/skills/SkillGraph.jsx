import { useMemo, useRef, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { layoutSkillGraph } from './skillGraphLayout.js';

export function SkillGraph({ skills, categories, onAdd, onRemove, onDismiss, busyId }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null);
  const layout = useMemo(() => layoutSkillGraph(skills, categories), [skills, categories]);

  function beginPan(event) {
    if (event.target.closest('[role="button"]')) return;
    drag.current = { x: event.clientX, y: event.clientY, pan };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePan(event) {
    if (!drag.current) return;
    const scale = layout.width / event.currentTarget.getBoundingClientRect().width;
    setPan({ x: drag.current.pan.x + (event.clientX - drag.current.x) * scale, y: drag.current.pan.y + (event.clientY - drag.current.y) * scale });
  }

  function reset() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  return <div className="overflow-hidden rounded-[28px] border border-[#DDE7F0] bg-white shadow-[0_18px_55px_rgba(30,56,83,0.09)]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EDF3] bg-white px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5F2] text-[#238274]">✦</span><div><h2 className="text-sm font-bold text-[#243B64] sm:text-base">Beceri ağacım <span className="font-normal text-[#7A8BA0]">· {skills.length} beceri</span></h2><p className="text-xs text-[#8A97A9]">Kartlardan beceri ekle, kaldır veya CV önerisini gizle.</p></div></div>
      <div className="flex items-center gap-2"><span className="hidden items-center gap-3 text-[11px] text-[#667085] sm:flex"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#2E9387]" />Kayıtlı</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#D49159]" />CV keşfi</span></span><div className="flex items-center gap-0.5 rounded-xl border border-[#E3E7ED] bg-[#F9FBFC] p-1"><button type="button" onClick={() => setZoom((value) => Math.min(1.7, value + 0.2))} className="rounded-lg p-2 text-[#31527F] hover:bg-[#EAF0F6]" aria-label="Yakınlaştır"><ZoomIn size={17} /></button><button type="button" onClick={() => setZoom((value) => Math.max(0.6, value - 0.2))} className="rounded-lg p-2 text-[#31527F] hover:bg-[#EAF0F6]" aria-label="Uzaklaştır"><ZoomOut size={17} /></button><button type="button" onClick={reset} className="rounded-lg p-2 text-[#31527F] hover:bg-[#EAF0F6]" aria-label="Görünümü sıfırla"><RotateCcw size={17} /></button></div></div>
    </div>
    <div className="overflow-x-auto"><svg role="group" aria-label="Beceri alanlarından dallanan etkileşimli beceri ağacı" viewBox={`0 0 ${layout.width} ${layout.height}`} className="block w-full min-w-[820px] cursor-grab touch-none active:cursor-grabbing" onPointerDown={beginPan} onPointerMove={movePan} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <defs><pattern id="tree-grid" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#CFDCE8" opacity=".55" /></pattern><linearGradient id="tree-root" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#274A75" /><stop offset="1" stopColor="#172F53" /></linearGradient></defs>
      <rect width={layout.width} height={layout.height} fill="#F9FBFD" /><rect width={layout.width} height={layout.height} fill="url(#tree-grid)" />
      <g transform={`translate(${layout.width / 2 + pan.x} ${layout.height / 2 + pan.y}) scale(${zoom}) translate(${-layout.width / 2} ${-layout.height / 2})`}>
        {layout.branches.length > 1 && <line x1="235" y1={layout.branches[0].y} x2="235" y2={layout.branches[layout.branches.length - 1].y} stroke="#AFC3D6" strokeWidth="3" />}
        <line x1="204" y1={layout.root.y} x2="235" y2={layout.root.y} stroke="#AFC3D6" strokeWidth="3" />
        {layout.branches.map((branch) => <g key={`lane-${branch.id}`}><rect x="288" y={branch.top} width="794" height={branch.height} rx="24" fill={branch.color.soft} fillOpacity=".6" /><path d={`M 235 ${branch.y} L 310 ${branch.y}`} fill="none" stroke={branch.color.line} strokeOpacity=".75" strokeWidth="3" /><circle cx="235" cy={branch.y} r="6" fill={branch.color.line} /><rect x="310" y={branch.y - 37} width="206" height="74" rx="18" fill="white" stroke={branch.color.line} strokeWidth="2" /><circle cx="339" cy={branch.y} r="15" fill={branch.color.soft} /><text x="339" y={branch.y + 5} textAnchor="middle" fill={branch.color.strong} fontSize="15" fontWeight="700">✦</text><text x="365" y={branch.y - 3} fill="#243B64" fontSize="14" fontWeight="700">{branch.name.length > 19 ? `${branch.name.slice(0, 18)}…` : branch.name}</text><text x="365" y={branch.y + 17} fill="#8491A1" fontSize="11">{branch.skills.length} beceri</text></g>)}
        {layout.nodes.map((node) => {
          const branch = layout.branches.find((item) => item.id === node.branchId);
          const route = node.x > 800
            ? `M 516 ${branch.y} H 552 V ${node.y - 48} H ${node.x} V ${node.y - 34}`
            : `M 516 ${branch.y} H 552 V ${node.y} H ${node.x - 114}`;
          return <path key={`edge-${node.id}`} d={route} fill="none" stroke={node.color.line} strokeOpacity=".55" strokeWidth="2" strokeLinejoin="round" />;
        })}
        {layout.nodes.map((node) => {
          const title = node.name.length > 16 ? `${node.name.slice(0, 15)}…` : node.name;
          const pending = Boolean(busyId);
          return <g key={node.id}>
            <title>{node.name} · {node.selected ? 'Kaydedildi' : 'CV önerisi'}</title>
            <rect x={node.x - 114} y={node.y - 34} width="228" height="68" rx="16" fill="white" stroke={node.selected ? '#2E9387' : '#D49159'} strokeWidth="2" strokeDasharray={node.selected ? undefined : '6 5'} />
            <circle cx={node.x - 87} cy={node.y - 4} r="13" fill={node.selected ? '#E6F5F0' : '#FFF3E8'} />
            <text x={node.x - 87} y={node.y + 1} textAnchor="middle" fill={node.selected ? '#278B7E' : '#B9762E'} fontSize="14" fontWeight="700" pointerEvents="none">{node.selected ? '✓' : '✦'}</text>
            <text x={node.x - 67} y={node.y - 7} fill="#243B64" fontSize="13" fontWeight="700" pointerEvents="none">{title}</text>
            <text x={node.x - 67} y={node.y + 15} fill={node.selected ? '#278B7E' : '#B9762E'} fontSize="10" fontWeight="700" pointerEvents="none">{node.selected ? 'KAYDEDİLDİ' : 'CV ÖNERİSİ'}</text>
            {!node.selected && <g role="button" tabIndex={pending ? -1 : 0} aria-label={`${node.name} becerisini ekle`} aria-disabled={pending} onClick={(event) => { event.stopPropagation(); if (!pending) onAdd(node); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!pending) onAdd(node); } }} className="cursor-pointer"><title>Becerilerime ekle</title><rect x={node.x + 46} y={node.y - 15} width="29" height="30" rx="8" fill="#E9F6F2" /><path d={`M ${node.x + 54} ${node.y} h 13 M ${node.x + 60.5} ${node.y - 6.5} v 13`} stroke="#287D70" strokeWidth="2" strokeLinecap="round" /></g>}
            <g role="button" tabIndex={pending ? -1 : 0} aria-label={`${node.name} ${node.selected ? 'becerisini kaldır' : 'CV önerisini gizle'}`} aria-disabled={pending} onClick={(event) => { event.stopPropagation(); if (!pending) (node.selected ? onRemove : onDismiss)(node); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!pending) (node.selected ? onRemove : onDismiss)(node); } }} className="cursor-pointer"><title>{node.selected ? 'Becerilerimden kaldır' : 'CV önerisini gizle'}</title><rect x={node.x + 80} y={node.y - 15} width="29" height="30" rx="8" fill="#FFF0EE" /><path d={`M ${node.x + 87} ${node.y - 6} h 15 M ${node.x + 92} ${node.y - 9} h 5 M ${node.x + 90} ${node.y - 3} l 1 12 h 8 l 1 -12 M ${node.x + 94} ${node.y} v 6 M ${node.x + 97} ${node.y} v 6`} fill="none" stroke="#BF4F47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g>
          </g>;
        })}
        <circle cx={layout.root.x} cy={layout.root.y} r="74" fill="#DDE9F4" /><circle cx={layout.root.x} cy={layout.root.y} r="67" fill="url(#tree-root)" /><circle cx={layout.root.x} cy={layout.root.y - 22} r="17" fill="#FFFFFF" fillOpacity=".13" /><text x={layout.root.x} y={layout.root.y - 16} textAnchor="middle" fill="white" fontSize="19">✦</text><text x={layout.root.x} y={layout.root.y + 12} textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Benim</text><text x={layout.root.x} y={layout.root.y + 33} textAnchor="middle" fill="white" fontSize="15" fontWeight="700">becerilerim</text>
      </g>
    </svg></div>
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E8EDF3] bg-white px-5 py-3 text-xs text-[#8A97A9] sm:px-6"><span>Dallar becerilerin ait olduğu alanları gösterir; düzey veya puan anlamına gelmez.</span><span>Haritayı sürükle · yakınlaştır · keşfet</span></div>
  </div>;
}
