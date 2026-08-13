export const strandPoint = (index, strand = 0, total = 300) => {
  const x = (index / total - 0.5) * 11.5;
  const angle = x * 2.38 + strand * Math.PI;
  return [x, Math.cos(angle) * 0.92, Math.sin(angle) * 0.92];
};

export const particlePosition = (index, total = 6000) => {
  const strand = Math.floor(index / total * 2);
  const [x, y, z] = strandPoint(index % 300, strand);
  const seed = ((index * 16807) % 2147483647) / 2147483647;
  const angle = seed * Math.PI * 2;
  const radius = 0.03 + ((index * 37) % 100) / 100 * 0.16;
  return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, z + Math.cos(angle * 1.7) * radius];
};
