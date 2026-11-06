import { request } from '../../shared/api/request.js';
export const customCareerApi = {
  latest(token) { return request('custom-careers', 'latest', { token }); },
  createDraft(token, title) { return request('custom-careers', 'draft', { method: 'POST', body: { title }, token }); },
  confirm(token, id, selectedIndexes) { return request('custom-careers', `${id}/confirm`, { method: 'PUT', body: { selectedIndexes }, token }); },
};
