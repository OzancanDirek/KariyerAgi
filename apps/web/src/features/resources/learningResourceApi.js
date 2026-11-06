import { request } from '../../shared/api/request.js';
export const learningResourceApi = { list(token) { return request('learning-resources', '', { token }); } };
