export const strandPoint = (index, strand = 0, total = 300) => {
  const t = index / total;
  const x = (t - 0.5) * 12.5;
  const angle = x * 2.1 + strand * Math.PI;
  const drift = Math.sin(t * Math.PI * 2.6 + strand * 2.5) * 0.22;
  const y = Math.cos(angle) * 1.15 + drift;
  const z = Math.sin(angle) * 1.1;
  return [x, y, z];
};

export const particlePosition = (index, total = 6000) => {
  const strand = Math.floor(index / total * 2);
  const [x, y, z] = strandPoint(index % 300, strand);
  const seed = ((index * 16807) % 2147483647) / 2147483647;
  const angle = seed * Math.PI * 2;
  const radius = 0.03 + ((index * 37) % 100) / 100 * 0.2;
  return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, z + Math.cos(angle * 1.7) * radius];
};
