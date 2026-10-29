import { request } from '../../../shared/api/request.js';

export const sessionApi = {
  refresh(refreshToken) {
    return request('session', 'refresh', { method: 'POST', body: { refreshToken } });
  },
  currentUser(token) {
    return request('session', 'me', { token });
  },
};
