import { useRef, useState } from 'react';
import { CheckCircle2, FileImage, FileText, FileUp, X } from 'lucide-react';

const accept = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';
const maxBytes = 10 * 1024 * 1024;

export function CertificateDropzone({ file, existingFileName, onChange, disabled }) {
  const inputRef = useRef(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  function choose(selected) {
    if (!selected || disabled) {
      return;
    }
    if (!/\.(pdf|jpe?g|png)$/i.test(selected.name) || selected.size > maxBytes || selected.size === 0) {
      setError('PDF, JPG veya PNG biçiminde, en fazla 10 MB boyutunda bir dosya seçin.');
      return;
    }
    setError('');
    onChange(selected);
  }

  function drop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    choose(event.dataTransfer.files?.[0]);
  }

  const selectedName = file?.name || existingFileName;
  const isImage = /\.(jpe?g|png)$/i.test(selectedName || '');

  return <div className="space-y-3">
    <div>
      <p className="text-sm font-semibold text-[#243B64]">Sertifika belgesi <span className="font-normal text-[#98A2B3]">(isteğe bağlı)</span></p>
      <p className="mt-1 text-xs text-[#667085]">Belgeni ekleyerek sertifikanı profilinde tamamlayabilirsin.</p>
    </div>
    <input ref={inputRef} type="file" accept={accept} className="sr-only" aria-label="Sertifika belgesi seç" disabled={disabled} onChange={(event) => { choose(event.target.files?.[0]); event.target.value = ''; }} />
    <div
      onDragEnter={(event) => { event.preventDefault(); dragDepth.current += 1; setDragging(true); }}
      onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; }}
      onDragLeave={(event) => { event.preventDefault(); dragDepth.current -= 1; if (dragDepth.current <= 0) { setDragging(false); dragDepth.current = 0; } }}
      onDrop={drop}
      className={`rounded-2xl border-2 border-dashed px-5 py-7 text-center transition ${dragging ? 'border-[#5276A7] bg-[#EDF4FC]' : 'border-[#CAD7E4] bg-[#F8FAFD] hover:border-[#8BA5C5]'}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#31527F] shadow-sm"><FileUp size={23} /></div>
      <p className="mt-3 text-sm font-semibold text-[#243B64]">Dosyanı buraya sürükleyip bırak</p>
      <p className="mt-1 text-xs text-[#77849A]">veya bilgisayarından seç</p>
      <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()} className="mt-4 rounded-xl border border-[#B9CBE0] bg-white px-4 py-2 text-sm font-semibold text-[#243B64] shadow-sm transition hover:border-[#5276A7] hover:bg-[#F1F6FC] disabled:opacity-50">Dosya seç</button>
      <p className="mt-3 text-xs text-[#98A2B3]">PDF, JPG veya PNG · En fazla 10 MB</p>
    </div>
    {selectedName && <div className="flex items-center gap-3 rounded-xl border border-[#C8D8E9] bg-[#EFF6FD] px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#31527F]">{isImage ? <FileImage size={20} /> : <FileText size={20} />}</div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#243B64]" title={selectedName}>{selectedName}</p><p className="text-xs text-[#5276A7]">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Kaydet dediğinde yüklenecek` : 'Yüklü belge'}</p></div>
      {file ? <button type="button" onClick={() => onChange(null)} aria-label="Seçilen dosyayı kaldır" className="rounded-lg p-1.5 text-[#667085] hover:bg-white"><X size={18} /></button> : <CheckCircle2 size={19} className="shrink-0 text-[#2B806F]" />}
    </div>}
    {error && <p role="alert" className="text-xs text-[#B42318]">{error}</p>}
    <p className="text-xs text-[#98A2B3]">Belgene yalnızca kendi hesabından erişebilirsin.</p>
  </div>;
}
