import { useState } from 'react';
import { request } from '../../../shared/api/request.js';

export function AccountClosureDialog({ runAuthenticated, onClosed, onClose }) {
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function closeAccount(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await runAuthenticated((token) => request('account', 'closure', {
        method: 'POST', token, body: { confirmation },
      }));
      await onClosed();
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }

  return <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-[#182842]/65 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="close-account-title" className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-xl">
      <h2 id="close-account-title" className="text-2xl font-bold text-[#243B64]">Hesabımı kapat</h2>
      <p className="mt-4 text-sm leading-6 text-[#52627A]">Hesabın hemen kullanıma kapanır. Başvuruların işveren ekranından kaldırılır. Kişisel verilerin ve dosyaların iki ay sonra kalıcı olarak silinir. Şirket sahibiysen önce şirket sahipliğini devretmen gerekir.</p>
      <form onSubmit={closeAccount} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-[#243B64]" htmlFor="close-account-confirmation">Onaylamak için HESABIMI KAPAT yaz</label>
        <input id="close-account-confirmation" autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full rounded-lg border border-[#D5DDE8] px-4 py-3" />
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-[#D5DDE8] px-4 py-2">Vazgeç</button><button type="submit" disabled={busy || confirmation !== 'HESABIMI KAPAT'} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? 'Kapatılıyor...' : 'Hesabımı kapat'}</button></div>
      </form>
    </section>
  </div>;
}
