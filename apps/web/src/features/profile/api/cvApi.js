import { request } from '../../../shared/api/request.js';

export const cvApi = {
  list(token) {
    return request('cv', '', { token });
  },
  consent(token) {
    return request('cv', 'consent', { token });
  },
  grantConsent(token, textId) {
    return request('cv', `consent/${textId}`, { method: 'POST', token });
  },
  upload(token, file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('cv', '', { method: 'POST', token, formData });
  },
  download(token, id) {
    return request('cv', `${id}/document`, { token, responseType: 'blob' });
  },
  setPrimary(token, id) {
    return request('cv', `${id}/primary`, { method: 'PUT', token });
  },
  remove(token, id) {
    return request('cv', id, { method: 'DELETE', token });
  },
};
