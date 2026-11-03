import { request } from '../../shared/api/request.js';

export const skillsApi = {
  getMap(token) {
    return request('skills', '', { token });
  },
  add(token, skillId) {
    return request('skills', '', { method: 'POST', token, body: { skillId } });
  },
  addCustom(token, name) {
    return request('skills', 'custom', { method: 'POST', token, body: { name } });
  },
  dismiss(token, skill) {
    return request('skills', 'dismiss', { method: 'POST', token, body: skill });
  },
  remove(token, selectionId) {
    return request('skills', selectionId, { method: 'DELETE', token });
  },
};
