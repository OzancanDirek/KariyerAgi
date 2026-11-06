import { request } from '../../shared/api/request.js';

export const companyMemberApi = {
  mine(token) {
    return request('company-members', 'mine', { token });
  },
  forCompany(token, companyId) {
    return request('company-members', `company/${companyId}`, { token });
  },
  invite(token, companyId, email) {
    return request('company-members', `company/${companyId}/invite`, { method: 'POST', token, body: { email } });
  },
  accept(token, membershipId) {
    return request('company-members', `${membershipId}/accept`, { method: 'POST', token });
  },
  decline(token, membershipId) {
    return request('company-members', `${membershipId}/decline`, { method: 'POST', token });
  },
  remove(token, companyId, membershipId) {
    return request('company-members', `company/${companyId}/${membershipId}`, { method: 'DELETE', token });
  },
};
