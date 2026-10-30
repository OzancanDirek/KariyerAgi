import { request } from '../../../shared/api/request.js';

export const profileApi = {
  getProfile(token) {
    return request('profile', 'me', { token });
  },
  updateProfile(token, details) {
    return request('profile', 'me', { method: 'PUT', token, body: details });
  },
  uploadPhoto(token, file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('profile', 'me/photo', { method: 'POST', token, formData });
  },
  downloadPhoto(token) {
    return request('profile', 'me/photo', { token, responseType: 'blob' });
  },
  deletePhoto(token) {
    return request('profile', 'me/photo', { method: 'DELETE', token });
  },
};
