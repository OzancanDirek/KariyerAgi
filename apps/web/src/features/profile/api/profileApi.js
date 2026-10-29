import { request } from '../../../shared/api/request.js';

export const profileApi = {
  getMine(token) {
    return request('profile', 'me', { token });
  },
  updateMine(token, details) {
    return request('profile', 'me', { method: 'PUT', token, body: details });
  },
};
