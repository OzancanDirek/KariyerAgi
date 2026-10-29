import { request } from '../../../shared/api/request.js';

export const careerProfileApi = {
  getCareerProfile(token) {
    return request('career-profile', 'me', { token });
  },
  updateCareerProfile(token, details) {
    return request('career-profile', 'me', { method: 'PUT', token, body: details });
  },
};
