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
  applicantDetail(token, id) {
    return request('applications', id, { token });
  },
  applicantCv(token, id) {
    return request('applications', `${id}/cv`, { token, responseType: 'blob' });
  },
  updateApplicationStatus(token, id, status) {
    return request('applications', `${id}/status`, { method: 'PATCH', token, body: { status } });
  },
  matchCriteria(token, jobId) {
    return request('jobs', `${jobId}/match-criteria`, { token });
  },
  draftMatchCriteria(token, jobId) {
    return request('jobs', `${jobId}/match-criteria/draft`, { method: 'POST', token });
  },
  saveMatchCriteria(token, jobId, criteria) {
    return request('jobs', `${jobId}/match-criteria`, { method: 'PUT', token, body: { criteria } });
  },
  applicationMatch(token, id) {
    return request('applications', `${id}/match`, { token });
  },
  jobMatches(token, jobId) {
    return request('jobs', `${jobId}/matches`, { token });
  },
  evaluateApplication(token, id) {
    return request('applications', `${id}/match`, { method: 'POST', token });
  },
};
