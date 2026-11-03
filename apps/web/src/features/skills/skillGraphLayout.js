export const TREE_WIDTH = 1120;

const COLORS = [
  { line: '#418BC1', soft: '#E9F5FC', strong: '#246A9E' },
  { line: '#8F77C8', soft: '#F2EDFB', strong: '#7055AD' },
  { line: '#D49159', soft: '#FFF3E8', strong: '#AA6B37' },
  { line: '#42A895', soft: '#EAF8F3', strong: '#287D70' },
  { line: '#C6799D', soft: '#FCEEF5', strong: '#A7557D' },
  { line: '#738DCA', soft: '#EDF2FC', strong: '#5874B0' },
];

export function layoutSkillGraph(skills, categories = []) {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const groups = new Map();
  skills.forEach((skill) => {
    const key = skill.unmatched ? 'cv-discoveries' : skill.categoryId || 'other';
    if (!groups.has(key)) {
      groups.set(key, { id: key, name: key === 'cv-discoveries' ? 'CV keşifleri' : categoryMap.get(key)?.name || 'Diğer beceriler', skills: [] });
    }
    groups.get(key).skills.push(skill);
  });
  const ordered = [...groups.values()].sort((a, b) => {
    if (a.id === 'cv-discoveries') return 1;
    if (b.id === 'cv-discoveries') return -1;
    return (categoryMap.get(a.id)?.sortOrder ?? 999) - (categoryMap.get(b.id)?.sortOrder ?? 999) || a.name.localeCompare(b.name, 'tr');
  });
  let cursor = 38;
  const branches = ordered.map((group, index) => {
    const rows = Math.ceil(group.skills.length / 2);
    const height = Math.max(150, 72 + rows * 88);
    const branch = { ...group, y: cursor + height / 2, top: cursor, height, color: COLORS[index % COLORS.length] };
    cursor += height + 24;
    return branch;
  });
  const nodes = branches.flatMap((branch) => branch.skills.map((skill, index) => ({
    ...skill,
    x: index % 2 === 0 ? 690 : 932,
    y: branch.top + 76 + Math.floor(index / 2) * 88,
    color: branch.color,
    branchId: branch.id,
  })));
  const height = Math.max(650, cursor + 14);
  return { width: TREE_WIDTH, height, root: { x: 136, y: branches[0]?.y ?? height / 2 }, branches, nodes };
}
