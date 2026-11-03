import { request } from '../../shared/api/request.js';

export const roadmapApi = {
  get(token, roleId) {
    const path = roleId ? `?roleId=${encodeURIComponent(roleId)}` : '';
    return request('roadmap', path, { token });
  },
};

export const roadmapTaskApi = {
  list(token, roleId) { return request('roadmap', `${roleId}/tasks`, { token }); },
  createPlan(token, roleId, settings) { return request('roadmap', `${roleId}/tasks/plan`, { method: 'POST', body: settings, token }); },
  setCompleted(token, roleId, taskId, completed) { return request('roadmap', `${roleId}/tasks/${taskId}/completion`, { method: 'PATCH', body: { completed }, token }); },
  delete(token, roleId, taskId) { return request('roadmap', `${roleId}/tasks/${taskId}`, { method: 'DELETE', token }); },
};
