import { request } from '../../../shared/api/request.js';

export function createCandidateRecordApi(resource) {
  return {
    list(token) {
      return request(resource, '', { token });
    },
    create(token, details) {
      return request(resource, '', { method: 'POST', token, body: details });
    },
    update(token, id, details) {
      return request(resource, id, { method: 'PUT', token, body: details });
    },
    remove(token, id) {
      return request(resource, id, { method: 'DELETE', token });
    },
  };
}
