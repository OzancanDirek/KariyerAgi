import { request } from '../../../shared/api/request.js';

export const authenticationApi = {
  login(credentials) {
    return request('auth', 'login', { method: 'POST', body: credentials });
  },
  register(details) {
    return request('auth', 'register', { method: 'POST', body: details });
  },
  logout(token) {
    return request('auth', 'logout', { method: 'POST', token });
  },
};
