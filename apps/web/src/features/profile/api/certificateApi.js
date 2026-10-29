import { request } from '../../../shared/api/request.js';
import { createCandidateRecordApi } from './candidateRecordApi.js';

export const certificateApi = {
  ...createCandidateRecordApi('certificates'),
  uploadDocument(token, id, file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('certificates', `${id}/document`, { method: 'POST', token, formData });
  },
  downloadDocument(token, id) {
    return request('certificates', `${id}/document`, { token, responseType: 'blob' });
  },
  removeDocument(token, id) {
    return request('certificates', `${id}/document`, { method: 'DELETE', token });
  },
};
