function normalize(value) {
  return (value ?? '').toLocaleLowerCase('tr-TR').normalize('NFKC').replace(/\s+/g, ' ').trim();
}

function mentions(text, phrase) {
  const term = normalize(phrase);
  if (term.length < 3) { return false; }
  const source = normalize(text);
  let index = source.indexOf(term);
  while (index !== -1) {
    const before = index === 0 ? '' : source[index - 1];
    const after = source[index + term.length] ?? '';
    if (!/[\p{L}\p{N}]/u.test(before) && !/[\p{L}\p{N}]/u.test(after)) { return true; }
    index = source.indexOf(term, index + 1);
  }
  return false;
}

export function explainJob(job, profile, selectedSkills) {
  if (!profile) { return []; }
  const reasons = [];
  if (mentions(job.title, profile.targetTitle)) {
    reasons.push(`Hedeflediğin “${profile.targetTitle}” rolü ilan başlığında geçiyor.`);
  }
  const matchedSkills = selectedSkills.filter((skill) => mentions(`${job.title} ${job.description}`, skill)).slice(0, 4);
  if (matchedSkills.length) {
    reasons.push(`Kaydettiğin beceriler ilanda geçiyor: ${matchedSkills.join(', ')}.`);
  }
  if (profile.workModels?.includes(job.workModel)) {
    reasons.push('İlanın çalışma modeli tercihlerinden biriyle aynı.');
  }
  if (profile.preferredLocations?.some((location) => mentions(job.location, location))) {
    reasons.push('İlanın konumu tercih ettiğin yerlerden biriyle aynı.');
  }
  return reasons;
}
