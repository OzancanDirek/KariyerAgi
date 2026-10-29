import { request } from '../../../shared/api/request.js';

export const profileApi = {
  getProfile(token) {
    return request('profile', 'me', { token });
  },
  updateProfile(token, details) {
    return request('profile', 'me', { method: 'PUT', token, body: details });
  },
};
