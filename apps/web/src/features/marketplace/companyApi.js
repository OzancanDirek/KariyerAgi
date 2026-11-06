import { request } from '../../shared/api/request.js';

export const companyApi = {
  mine(token) {
    return request('companies', 'mine', { token });
  },
  create(token, details) {
    return request('companies', '', { method: 'POST', token, body: details });
  },
  update(token, id, details) {
    return request('companies', id, { method: 'PUT', token, body: details });
  },
  pending(token) {
    return request('companies', 'pending', { token });
  },
  review(token, id, approved) {
    return request('companies', `${id}/review`, { method: 'PATCH', token, body: { approved } });
  },
};
