import { useEffect, useState } from 'react';

export function useCandidateRecords(api, runAuthenticated, emptyForm, toPayload, afterSave = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    let active = true;
    runAuthenticated(api.list).then((result) => {
      if (active) {
        setItems(result);
      }
    }).catch((failure) => {
      if (active) {
        setError(failure.message);
      }
    }).finally(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  function open(item = null) {
    setError('');
    setEditing(item || 'new');
    setForm(item ? { ...emptyForm, ...item, endDate: item.endDate || '' } : { ...emptyForm });
  }

  function close() {
    if (!saving) {
      setEditing(null);
      setError('');
    }
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    let savedRecord = null;
    try {
      const payload = toPayload(form);
      if (editing === 'new') {
        savedRecord = await runAuthenticated((token) => api.create(token, payload));
        setItems((current) => [savedRecord, ...current]);
      } else {
        savedRecord = await runAuthenticated((token) => api.update(token, editing.id, payload));
        setItems((current) => current.map((item) => item.id === savedRecord.id ? savedRecord : item));
      }
      if (afterSave) {
        const completeRecord = await afterSave(savedRecord, form);
        setItems((current) => current.map((item) => item.id === completeRecord.id ? completeRecord : item));
      }
      setEditing(null);
    } catch (failure) {
      if (savedRecord) {
        setEditing(savedRecord);
        setError(`Bilgiler kaydedildi, belge yüklenemedi: ${failure.message} Yeniden kaydetmeyi deneyin.`);
      } else {
        setError(failure.message);
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    setDeleting(id);
    setError('');
    try {
      await runAuthenticated((token) => api.remove(token, id));
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setDeleting(null);
    }
  }

  function replaceItem(updated) {
    setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
  }

  return { items, loading, error, editing, form, setForm, saving, deleting, open, close, save, remove, replaceItem };
}
