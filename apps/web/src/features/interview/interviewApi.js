import { request } from '../../shared/api/request.js';

export const interviewApi = {
  questions(token, jobText, language) {
    return request('interview', 'questions', { method: 'POST', token, body: { jobText, language } });
  },
  review(token, jobText, answers, language) {
    return request('interview', 'review', { method: 'POST', token, body: { jobText, answers, language } });
  },
};
