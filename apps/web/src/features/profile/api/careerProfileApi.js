import { request } from '../../../shared/api/request.js';

export const careerProfileApi = {
  getMine(token) {
    return request('career-profile', 'me', { token });
  },
  updateMine(token, details) {
    return request('career-profile', 'me', { method: 'PUT', token, body: details });
  },
};
