import test from 'node:test';
import assert from 'node:assert/strict';
import { explainJob } from './jobRecommendation.js';

test('explains only profile facts that occur in the job', () => {
  const job = { title: 'Pazarlama Uzmanı', description: 'SEO ve kampanya analizi', workModel: 'hibrit', location: 'İstanbul' };
  const profile = { targetTitle: 'Pazarlama Uzmanı', workModels: ['hibrit'], preferredLocations: ['İstanbul'] };
  const reasons = explainJob(job, profile, ['SEO', 'Java']);
  assert.equal(reasons.length, 4);
  assert.match(reasons.join(' '), /SEO/);
  assert.doesNotMatch(reasons.join(' '), /Java/);
});

test('does not match a skill hidden inside a longer word', () => {
  assert.deepEqual(explainJob({ title: 'Analist', description: 'JavaScript', workModel: 'ofis', location: '' }, { targetTitle: 'Restoratör', workModels: [], preferredLocations: [] }, ['Java']), []);
});
