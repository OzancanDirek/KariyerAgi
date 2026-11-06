import { request } from '../../shared/api/request.js';

export const jobApi = {
  published(token) {
    return request('jobs', '', { token });
  },
  get(token, id) {
    return request('jobs', id, { token });
  },
  apply(token, id, details) {
    return request('jobs', `${id}/applications`, { method: 'POST', token, body: details });
  },
  myApplications(token) {
    return request('applications', 'mine', { token });
  },
  withdraw(token, id) {
    return request('applications', `${id}/withdraw`, { method: 'PATCH', token });
  },
  mine(token) {
    return request('jobs', 'mine', { token });
  },
  create(token, details) {
    return request('jobs', '', { method: 'POST', token, body: details });
  },
  update(token, id, details) {
    return request('jobs', id, { method: 'PUT', token, body: details });
  },
  archive(token, id) {
    return request('jobs', id, { method: 'DELETE', token });
  },
  applications(token, id) {
    return request('jobs', `${id}/applications`, { token });
  },
};
